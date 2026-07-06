import urllib.request
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def run_test(path, expected_keys=None):
    url = f"{BASE_URL}{path}"
    print(f"Testing GET {url}... ", end="")
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status != 200:
                print(f"FAIL (Status Code: {response.status})")
                return False
            
            # Read content-type to see if it's CSV or JSON
            content_type = response.info().get_content_type()
            
            if "text/csv" in content_type:
                data_len = len(response.read())
                print(f"SUCCESS (CSV Received, size: {data_len} bytes)")
                return True
                
            data = json.loads(response.read().decode("utf-8"))
            
            if expected_keys:
                # Handle dictionary check
                if isinstance(data, dict):
                    for key in expected_keys:
                        if key not in data:
                            print(f"FAIL (Missing key: {key})")
                            return False
                # Handle list check (first element)
                elif isinstance(data, list):
                    if len(data) > 0 and isinstance(data[0], dict):
                        for key in expected_keys:
                            if key not in data[0]:
                                print(f"FAIL (Missing key: {key} in list item)")
                                return False
                                
            print("SUCCESS")
            return True
    except Exception as e:
        print(f"ERROR ({str(e)})")
        return False

def main():
    print("==================================================")
    print("CyberAI Dashboard Backend - Integration Verification")
    print("==================================================")
    
    # Check general root endpoint
    if not run_test("/", ["status_code" if False else "docs_url"]):
        print("Could not connect to backend server. Make sure it is running!")
        sys.exit(1)
        
    # Check metrics
    run_test("/api/v1/metrics/summary", [
        "live_topology_devices", 
        "active_connections", 
        "active_connections_pretty", 
        "latency_ms", 
        "network_health_percent", 
        "health_status"
    ])
    
    # Check topology
    run_test("/api/v1/topology", ["nodes", "edges"])
    
    # Check events
    run_test("/api/v1/events", ["id", "source_ip", "dest_ip", "protocol", "action"])
    
    # Check threats
    run_test("/api/v1/threats/active", ["id", "source_ip", "source_country", "severity"])
    
    # Check ops team
    run_test("/api/v1/ops/team", ["name", "role", "status"])
    
    # Check CSV export
    run_test("/api/v1/export/csv")
    
    print("==================================================")
    print("Tests completed. If all reported 'SUCCESS', the API is fully conforming.")

if __name__ == "__main__":
    main()
