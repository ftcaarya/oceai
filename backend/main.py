from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import anthropic
import os
import json
from dotenv import load_dotenv
from first_mate import fetch_all_conditions

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are First Mate, an expert AI fishing advisor for small-scale fishermen. You will receive a block of real-time conditions including live tidal data, current weather, moon phase, and active species info — all fetched for the fisherman's exact location right now.

Synthesize this real data into clear, confident, actionable advice. Structure every response like this:

🎣 CONDITIONS SUMMARY — one sentence on overall conditions
🌊 BEST FISHING WINDOWS — specific times based on the tide data given
🐟 TARGET SPECIES — which species to go for and exactly why given today's data
📍 WHERE TO FISH — specific habitat and positioning advice
🪝 BAIT & TACTICS — what to use and how to fish it
⚠️ WATCH OUT — any safety or weather warnings

Be direct and specific. You have their real data — use it. Talk like an experienced mate who knows these waters cold."""

class FirstMateRequest(BaseModel):
    message: str
    lat: float
    lon: float
    water_temp_f: Optional[float] = None
    history: list = []

@app.post("/firstmate")
async def first_mate(req: FirstMateRequest):
    # Fetch live conditions
    conditions = fetch_all_conditions(req.lat, req.lon, req.water_temp_f)

    # Inject real data into the prompt
    enriched = f"""LIVE CONDITIONS (fetched right now for lat={req.lat}, lon={req.lon}):
{json.dumps(conditions, indent=2)}

FISHERMAN SAYS: {req.message}

Use the live data above to give your best advice."""

    # Build message history
    messages = []
    for msg in req.history:
        messages.append({"role": msg["role"], "content": msg["content"]})
    messages.append({"role": "user", "content": enriched})

    # Call Claude
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=messages
    )

    return {
        "response": response.content[0].text,
        "conditions": conditions
    }

@app.get("/health")
def health():
    return {"status": "ok"}