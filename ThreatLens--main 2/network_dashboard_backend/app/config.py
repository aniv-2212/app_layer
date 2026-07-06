import os

class Settings:
    PROJECT_NAME: str = "CyberAI SOC Command Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Simulation settings
    SIMULATION_INTERVAL_SEC: float = 2.0
    NOISE_LEVEL: float = 0.05  # fluctuation percentage for live metrics
    
    # Network configurations
    SEGMENTS: list[str] = ["Segment A", "Segment B", "Segment C", "DMZ", "Corporate WAN"]
    
    COUNTRIES: list[str] = [
        "United States", "Germany", "Japan", "United Kingdom", "Canada",
        "Australia", "India", "Brazil", "Netherlands", "Singapore"
    ]

settings = Settings()
