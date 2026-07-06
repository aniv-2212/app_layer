import uvicorn
import os

if __name__ == "__main__":
    # Ensure port and host are configurable via env vars, defaulting to local development settings
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    print(f"Starting CyberAI SOC Command Backend at http://{host}:{port}")
    print(f"API Docs available at http://{host}:{port}/docs")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
