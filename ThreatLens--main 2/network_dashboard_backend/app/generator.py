import random
import time
import uuid
from datetime import datetime
from typing import Dict, List, Tuple
from app.config import settings

# Geolocation data for mock countries (Lat, Lon)
COUNTRY_COORDS: Dict[str, Tuple[float, float]] = {
    "United States": (37.0902, -95.7129),
    "Germany": (51.1657, 10.4515),
    "Japan": (36.2048, 138.2529),
    "United Kingdom": (55.3781, -3.4360),
    "Canada": (56.1304, -106.3468),
    "Australia": (-25.2744, 133.7751),
    "India": (20.5937, 78.9629),
    "Brazil": (-14.2350, -51.9253),
    "Netherlands": (52.1326, 5.2913),
    "Singapore": (1.3521, 103.8198),
}

class NetworkDataGenerator:
    def __init__(self):
        # Base values matching the UI mockup
        self.base_devices = 214
        self.base_connections = 91200
        self.base_latency = 19
        self.base_health = 99.1
        
        # State
        self.nodes = []
        self.edges = []
        self.events_history = []
        self.active_threats = []
        self.ops_team = []
        
        self.initialize_ops_team()
        self.generate_topology()
        self.generate_initial_events(50)
        self.generate_initial_threats(5)

    def initialize_ops_team(self):
        self.ops_team = [
            {"id": "ops-1", "name": "Sarah Jenkins", "role": "Lead Security Analyst", "status": "active", "shift": "Day Shift"},
            {"id": "ops-2", "name": "Alex Mercer", "role": "Network Engineer", "status": "active", "shift": "Day Shift"},
            {"id": "ops-3", "name": "Elena Rostova", "role": "Incident Responder", "status": "on_call", "shift": "Night Shift"},
            {"id": "ops-4", "name": "Chen Wei", "role": "AI Threat Specialist", "status": "offline", "shift": "Off Duty"},
        ]

    def get_metrics(self) -> dict:
        # Inject small random fluctuations (noise) to look dynamic
        devices = self.base_devices + random.randint(-2, 2)
        
        conn_fluctuation = random.randint(-500, 500)
        connections = self.base_connections + conn_fluctuation
        pretty_connections = f"{connections / 1000:.1f}K"
        
        latency = max(5, self.base_latency + random.randint(-3, 3))
        
        health_fluctuation = round(random.uniform(-0.4, 0.4), 2)
        health = min(100.0, max(85.0, self.base_health + health_fluctuation))
        
        status = "Stable and resilient"
        if health < 95.0:
            status = "Performance Degradation Detected"
        elif health < 90.0:
            status = "Critical Threat Alert"

        return {
            "live_topology_devices": devices,
            "active_connections": connections,
            "active_connections_pretty": pretty_connections,
            "latency_ms": latency,
            "network_health_percent": round(health, 2),
            "health_status": status
        }

    def generate_topology(self):
        self.nodes = []
        self.edges = []
        
        # We need a representative graph. Generating exactly 214 nodes might clutter
        # simple UI canvases, but we can generate around 30 major visible components
        # and reference the full count of 214 in the metrics.
        # Let's generate a core infrastructure topology.
        core_switch_id = "core-switch-1"
        self.nodes.append({
            "id": core_switch_id,
            "label": "Core Switch",
            "type": "switch",
            "status": "online",
            "ip": "10.0.0.1",
            "segment": "Segment A"
        })
        
        # Firewalls
        fw_id = "fw-main"
        self.nodes.append({
            "id": fw_id,
            "label": "Edge Firewall",
            "type": "firewall",
            "status": "online",
            "ip": "10.0.0.254",
            "segment": "DMZ"
        })
        self.edges.append({
            "source": fw_id,
            "target": core_switch_id,
            "bandwidth_mbps": 10000.0,
            "latency_ms": 0.5,
            "packet_loss_percent": 0.0,
            "status": "active"
        })

        # Generate some routers and switches per segment
        for segment in settings.SEGMENTS:
            if segment == "DMZ":
                # Add DMZ servers directly to firewall
                for i in range(1, 4):
                    srv_id = f"dmz-srv-{i}"
                    self.nodes.append({
                        "id": srv_id,
                        "label": f"DMZ Web Server {i}",
                        "type": "server",
                        "status": "online" if i != 3 else "warning",
                        "ip": f"192.168.10.{10+i}",
                        "segment": "DMZ"
                    })
                    self.edges.append({
                        "source": fw_id,
                        "target": srv_id,
                        "bandwidth_mbps": 1000.0,
                        "latency_ms": 1.2,
                        "packet_loss_percent": 0.0 if i != 3 else 0.5,
                        "status": "active" if i != 3 else "saturated"
                    })
                continue
                
            # Add a segment switch
            seg_slug = segment.lower().replace(" ", "-")
            sw_id = f"switch-{seg_slug}"
            self.nodes.append({
                "id": sw_id,
                "label": f"{segment} Switch",
                "type": "switch",
                "status": "online",
                "ip": f"10.1.{random.randint(1,254)}.1",
                "segment": segment
            })
            
            # Connect segment switch to core switch
            self.edges.append({
                "source": core_switch_id,
                "target": sw_id,
                "bandwidth_mbps": 5000.0,
                "latency_ms": 1.0,
                "packet_loss_percent": 0.0,
                "status": "active"
            })
            
            # Add a few servers and workstations to this switch
            for i in range(1, 4):
                node_type = "server" if i == 1 else "workstation"
                status = "online"
                if random.random() < 0.05:
                    status = "warning"
                elif random.random() < 0.02:
                    status = "offline"
                    
                node_id = f"node-{seg_slug}-{i}"
                self.nodes.append({
                    "id": node_id,
                    "label": f"{segment} {node_type.capitalize()} {i}",
                    "type": node_type,
                    "status": status,
                    "ip": f"10.1.{random.randint(2, 254)}.{10+i}",
                    "segment": segment
                })
                self.edges.append({
                    "source": sw_id,
                    "target": node_id,
                    "bandwidth_mbps": 1000.0,
                    "latency_ms": random.uniform(1.0, 5.0),
                    "packet_loss_percent": 0.0 if status == "online" else (0.0 if status == "offline" else 2.5),
                    "status": "active" if status == "online" else ("down" if status == "offline" else "saturated")
                })
                
    def refresh_topology(self):
        # Slightly scramble/randomize connectivity or add warning statuses
        self.generate_topology()
        # Add 1-2 random warnings or modify latency
        for node in self.nodes:
            if node["type"] in ["server", "workstation"] and random.random() < 0.15:
                node["status"] = "warning" if random.random() > 0.3 else "offline"
        return {"status": "success", "message": "Topology refreshed", "devices_scanned": self.base_devices}

    def generate_random_event(self) -> dict:
        protocols = ["TCP", "UDP", "HTTPS", "HTTP", "DNS", "SSH", "TLS", "SMB"]
        actions = ["allow", "allow", "allow", "block", "alert"]  # Weighted towards allow
        countries = settings.COUNTRIES
        segments = settings.SEGMENTS
        
        src_ip = f"10.1.{random.randint(1, 254)}.{random.randint(1, 254)}"
        dest_ip = f"192.168.10.{random.randint(10, 50)}"
        
        # Sometimes generate external threat IPs
        action = random.choice(actions)
        if action in ["block", "alert"]:
            src_ip = f"{random.randint(5, 220)}.{random.randint(1, 254)}.{random.randint(1, 254)}.{random.randint(1, 254)}"
            
        protocol = random.choice(protocols)
        port_map = {"HTTP": 80, "HTTPS": 443, "DNS": 53, "SSH": 22, "TLS": 443, "SMB": 445}
        dest_port = port_map.get(protocol, random.randint(1024, 65535))
        
        messages = {
            "allow": [
                f"Session established: {protocol} flow connected",
                f"Data transfer complete: outbound packet transmission",
                f"DNS query resolved: domain mapping successful",
                f"HTTPS handshake completed successfully"
            ],
            "block": [
                f"Firewall Block: Unauthorized access attempt on port {dest_port}",
                f"IP Blacklisted: Source detected in bad reputation feed",
                f"Policy Violation: Blocked traffic from non-workstation segment",
                f"IDS Trigger: Repetitive failed handshake blocked"
            ],
            "alert": [
                f"Anomalous Traffic: High bandwidth usage detected",
                f"Port Scan: Sequential port probing detected from source IP",
                f"Signature Match: Potential exploit attempt detected",
                f"Brute Force: Multiple SSH authentication failures"
            ]
        }
        
        country = random.choice(countries)
        segment = random.choice(segments)
        
        event = {
            "id": str(uuid.uuid4())[:8],
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "source_ip": src_ip,
            "source_port": random.randint(3000, 65535),
            "dest_ip": dest_ip,
            "dest_port": dest_port,
            "protocol": protocol,
            "bytes_transferred": random.randint(64, 10485760),
            "country": country,
            "segment": segment,
            "action": action,
            "message": random.choice(messages[action])
        }
        return event

    def generate_initial_events(self, count: int):
        self.events_history = [self.generate_random_event() for _ in range(count)]
        # Sort by timestamp descending
        self.events_history.sort(key=lambda x: x["timestamp"], reverse=True)

    def get_events(self, query: str = None, country: str = None, segment: str = None, limit: int = 50) -> List[dict]:
        filtered = self.events_history
        if country and country != "All Countries":
            filtered = [e for e in filtered if e["country"].lower() == country.lower()]
        if segment and segment != "All":
            filtered = [e for e in filtered if e["segment"].lower() == segment.lower()]
        if query:
            q = query.lower()
            filtered = [
                e for e in filtered 
                if q in e["source_ip"].lower() 
                or q in e["dest_ip"].lower() 
                or q in e["message"].lower()
                or q in e["protocol"].lower()
            ]
        return filtered[:limit]

    def add_event(self, event: dict):
        self.events_history.insert(0, event)
        if len(self.events_history) > 1000:
            self.events_history.pop()

    def generate_random_threat(self) -> dict:
        threat_types = ["DDoS Attack", "SSH Brute Force", "SQL Injection", "Ransomware Callout", "Port Scan"]
        severities = ["low", "medium", "high", "critical"]
        statuses = ["active", "investigating", "mitigated"]
        
        src_country = random.choice(list(COUNTRY_COORDS.keys()))
        dest_country = "United States" # Dashboard is typically US-centric
        
        src_lat, src_lon = COUNTRY_COORDS[src_country]
        dest_lat, dest_lon = COUNTRY_COORDS[dest_country]
        
        # Add a tiny bit of random displacement to lat/lon so pins don't overlap perfectly
        src_lat += random.uniform(-1.0, 1.0)
        src_lon += random.uniform(-1.0, 1.0)
        dest_lat += random.uniform(-1.0, 1.0)
        dest_lon += random.uniform(-1.0, 1.0)

        threat = {
            "id": f"threat-{str(uuid.uuid4())[:6]}",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "source_ip": f"{random.randint(5, 220)}.{random.randint(1, 254)}.{random.randint(1, 254)}.{random.randint(1, 254)}",
            "source_country": src_country,
            "source_lat": round(src_lat, 4),
            "source_lon": round(src_lon, 4),
            "dest_ip": f"10.1.{random.randint(1, 254)}.{random.randint(1, 254)}",
            "dest_country": dest_country,
            "dest_lat": round(dest_lat, 4),
            "dest_lon": round(dest_lon, 4),
            "threat_type": random.choice(threat_types),
            "severity": random.choice(severities),
            "status": random.choice(statuses)
        }
        return threat

    def generate_initial_threats(self, count: int):
        self.active_threats = [self.generate_random_threat() for _ in range(count)]

    def get_threats(self, severity: str = None) -> List[dict]:
        # Randomly rotate out old mitigated threats and add new ones to simulate real-time map
        if random.random() < 0.2:
            self.active_threats.pop(random.randint(0, len(self.active_threats) - 1))
            self.active_threats.append(self.generate_random_threat())
            
        if severity:
            return [t for t in self.active_threats if t["severity"] == severity]
        return self.active_threats

# Singleton instance
generator = NetworkDataGenerator()
