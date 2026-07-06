from fastapi import APIRouter
from app.schemas import TopologyGraph
from app.generator import generator

router = APIRouter(prefix="/topology", tags=["Topology"])

@router.get("", response_model=TopologyGraph)
async def get_network_topology():
    """
    Returns the network nodes (routers, firewalls, servers, workstations) and links 
    including bandwidth, current latency, packet loss, and status.
    """
    return {
        "nodes": generator.nodes,
        "edges": generator.edges
    }

@router.post("/refresh")
async def trigger_topology_refresh():
    """
    Triggers a manual topology rebuild, simulating network device rescans.
    """
    return generator.refresh_topology()
