from pydantic import BaseModel, Field
from typing import List, Optional

class NetworkMetrics(BaseModel):
    live_topology_devices: int = Field(..., description="Number of connected devices, matching the dashboard's '214' value")
    active_connections: int = Field(..., description="Current session count, e.g. 91200 for '91.2K'")
    active_connections_pretty: str = Field(..., description="Formatted string for UI, e.g., '91.2K'")
    latency_ms: int = Field(..., description="Median network latency in ms, matching '19ms'")
    network_health_percent: float = Field(..., description="Percentage indicating stable and resilient health, matching '99.1%'")
    health_status: str = Field(..., description="Health summary message, e.g., 'Stable and resilient'")

class TopologyNode(BaseModel):
    id: str
    label: str
    type: str  # router, switch, server, workstation, firewall
    status: str  # online, warning, offline
    ip: str
    segment: str

class TopologyEdge(BaseModel):
    source: str
    target: str
    bandwidth_mbps: float
    latency_ms: float
    packet_loss_percent: float
    status: str  # active, saturated, down

class TopologyGraph(BaseModel):
    nodes: List[TopologyNode]
    edges: List[TopologyEdge]

class NetworkEvent(BaseModel):
    id: str
    timestamp: str
    source_ip: str
    source_port: int
    dest_ip: str
    dest_port: int
    protocol: str
    bytes_transferred: int
    country: str
    segment: str
    action: str  # allow, block, alert
    message: str

class ThreatEvent(BaseModel):
    id: str
    timestamp: str
    source_ip: str
    source_country: str
    source_lat: float
    source_lon: float
    dest_ip: str
    dest_country: str
    dest_lat: float
    dest_lon: float
    threat_type: str
    severity: str  # low, medium, high, critical
    status: str  # active, mitigated, investigating

class OpsTeamMember(BaseModel):
    id: str
    name: str
    role: str
    status: str  # active, on_call, offline
    shift: str
