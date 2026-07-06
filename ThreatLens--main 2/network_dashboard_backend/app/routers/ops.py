import csv
import io
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from typing import List
from app.schemas import OpsTeamMember
from app.generator import generator

router = APIRouter(tags=["Operations"])

@router.get("/ops/team", response_model=List[OpsTeamMember])
async def get_ops_team():
    """
    Returns the current shift operations team details.
    """
    return generator.ops_team

@router.get("/export/csv")
async def export_network_logs_csv():
    """
    Exports the current in-memory network flow event log history as a downloadable CSV.
    """
    # Create an in-memory text stream
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        "Event ID", "Timestamp", "Source IP", "Source Port", 
        "Destination IP", "Destination Port", "Protocol", 
        "Bytes Transferred", "Country", "Segment", "Action", "Message"
    ])
    
    # Write events
    events = generator.get_events(limit=500)
    for event in events:
        writer.writerow([
            event["id"],
            event["timestamp"],
            event["source_ip"],
            event["source_port"],
            event["dest_ip"],
            event["dest_port"],
            event["protocol"],
            event["bytes_transferred"],
            event["country"],
            event["segment"],
            event["action"],
            event["message"]
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=cyberai_network_logs.csv"}
    )
