import requests
import ephem
from datetime import datetime, date
import math


# MOON PHASE

def get_moon_phase():
    moon = ephem.Moon(datetime.utcnow())
    phase = moon.phase

    if phase < 6.25:      name = "New Moon"
    elif phase < 31.25:   name = "Waxing Crescent"
    elif phase < 43.75:   name = "First Quarter"
    elif phase < 56.25:   name = "Waxing Gibbous"
    elif phase < 56.25:   name = "Waxing Gibbous"
    elif phase < 68.75:   name = "Full Moon"
    elif phase < 81.25:   name = "Waning Gibbous"
    elif phase < 93.75:   name = "Last Quarter"
    else:                 name = "Waning Crescent"

    notes = {
        "New Moon":        "Excellent — low light drives surface feeding",
        "Waxing Crescent": "Good — fish becoming more active",
        "First Quarter":   "Good — strong tidal swings increase bait movement",
        "Waxing Gibbous":  "Very good — feeding intensity building",
        "Full Moon":       "Excellent — peak feeding, especially nocturnal species",
        "Waning Gibbous":  "Very good — sustained feeding activity",
        "Last Quarter":    "Good — tidal movement still strong",
        "Waning Crescent": "Moderate — activity beginning to taper"
    }

    return {
        "phase_name": name,
        "illumination_pct": round(phase, 1),
        "fishing_note": notes.get(name, "Moderate activity expected")
    }


# NOAA TIDES

NOAA_STATIONS = {
    "cape_hatteras":  (35.2, -75.7,  "8654467", "Cape Hatteras, NC"),
    "wilmington_nc":  (34.2, -77.9,  "8658120", "Wilmington, NC"),
    "charleston_sc":  (32.8, -79.9,  "8665530", "Charleston, SC"),
    "miami":          (25.8, -80.1,  "8723170", "Miami, FL"),
    "key_west":       (24.6, -81.8,  "8724580", "Key West, FL"),
    "galveston":      (29.3, -94.8,  "8771450", "Galveston, TX"),
    "san_francisco":  (37.8, -122.5, "9414290", "San Francisco, CA"),
    "seattle":        (47.6, -122.3, "9447130", "Seattle, WA"),
    "boston":         (42.4, -71.1,  "8443970", "Boston, MA"),
    "new_york":       (40.7, -74.0,  "8518750", "New York, NY"),
    "norfolk":        (36.9, -76.3,  "8638610", "Norfolk, VA"),
    "portland_me":    (43.7, -70.2,  "8418150", "Portland, ME"),
}

def nearest_station(lat, lon):
    best, best_dist = None, float('inf')
    for key, (slat, slon, sid, sname) in NOAA_STATIONS.items():
        dist = math.sqrt((lat - slat)**2 + (lon - slon)**2)
        if dist < best_dist:
            best_dist = dist
            best = (sid, sname)
    return best

def get_tides(lat, lon):
    station_id, station_name = nearest_station(lat, lon)
    today = date.today().strftime("%Y%m%d")
    url = (
        f"https://api.tidesandcurrents.noaa.gov/api/prod/datagetter"
        f"?begin_date={today}&end_date={today}"
        f"&station={station_id}&product=predictions&datum=MLLW"
        f"&time_zone=lst_ldt&interval=hilo&units=english"
        f"&application=oceai&format=json"
    )
    try:
        r = requests.get(url, timeout=8)
        data = r.json()
        predictions = data.get("predictions", [])
        tides = []
        for p in predictions:
            tides.append({
                "time": p["t"],
                "type": "HIGH" if p["type"] == "H" else "LOW",
                "height_ft": round(float(p["v"]), 2)
            })
        return {"station": station_name, "tides_today": tides}
    except Exception as e:
        return {"error": str(e), "station": station_name}


# OPEN-METEO WEATHER

def get_weather(lat, lon):
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        f"&current=temperature_2m,wind_speed_10m,wind_direction_10m,"
        f"precipitation,weather_code,wave_height"
        f"&wind_speed_unit=mph&temperature_unit=fahrenheit&forecast_days=1"
    )
    try:
        r = requests.get(url, timeout=8)
        data = r.json()
        current = data.get("current", {})
        code = current.get("weather_code", 0)

        descriptions = {
            0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
            45: "Foggy", 51: "Light drizzle", 61: "Slight rain", 63: "Moderate rain",
            65: "Heavy rain", 80: "Showers", 95: "Thunderstorm"
        }
        wind = current.get("wind_speed_10m", 0)
        waves = current.get("wave_height", 0)

        if code in [95, 96, 99]:
            safety = "UNSAFE — thunderstorm, stay ashore"
        elif wind and wind > 25:
            safety = "CAUTION — high winds"
        elif waves and waves > 2.0:
            safety = "CAUTION — rough seas"
        else:
            safety = "GOOD — safe conditions"

        dirs = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
        wind_dir = dirs[round((current.get("wind_direction_10m", 0)) / 22.5) % 16]

        return {
            "temperature_f": current.get("temperature_2m"),
            "wind_speed_mph": wind,
            "wind_direction": wind_dir,
            "precipitation_mm": current.get("precipitation", 0),
            "wave_height_m": waves,
            "conditions": descriptions.get(code, "Unknown"),
            "fishing_safety": safety
        }
    except Exception as e:
        return {"error": str(e)}


# SPECIES DATA

SPECIES = {
    "flounder":     {"peak": [3,4,5,9,10,11], "habitat": "sandy/muddy flats, estuaries",      "depth": "5-60ft",    "temp": (55,72), "tide": "incoming near structure", "bait": "mud minnows, finger mullet, shrimp"},
    "redfish":      {"peak": [3,4,5,9,10,11], "habitat": "marshes, oyster bars, grass flats", "depth": "1-15ft",    "temp": (60,85), "tide": "high tide over marsh",    "bait": "live shrimp, crab, gold spoons"},
    "striped bass": {"peak": [3,4,5,10,11,12],"habitat": "river mouths, rocky structure",     "depth": "0-40ft",    "temp": (45,65), "tide": "outgoing at river mouths","bait": "bunker, eels, swimming plugs"},
    "mahi":         {"peak": [4,5,6,7,8,9],   "habitat": "offshore weed lines, color changes","depth": "100ft+",    "temp": (72,82), "tide": "follow current edges",    "bait": "ballyhoo, flying fish, squid"},
    "snook":        {"peak": [4,5,6,7,8,9,10],"habitat": "mangroves, bridges, passes",        "depth": "0-20ft",    "temp": (68,88), "tide": "outgoing at passes",      "bait": "live pilchards, D.O.A. shrimp"},
    "tuna":         {"peak": [4,5,6,7,8,9,10],"habitat": "offshore temp breaks, canyons",     "depth": "200ft+",    "temp": (62,72), "tide": "follow bait schools",     "bait": "cedar plugs, ballyhoo, butterfish"},
    "trout":        {"peak": [1,2,3,4,9,10,11,12],"habitat":"grass flats, oyster bars",       "depth": "2-12ft",    "temp": (55,75), "tide": "moving tide over flats",  "bait": "MirrOlure, live shrimp"},
    "grouper":      {"peak": [1,2,3,4,5,9,10,11,12],"habitat":"ledges, wrecks, hard bottom",  "depth": "40-300ft",  "temp": (62,78), "tide": "any tide near structure", "bait": "live pinfish, cut squid"},
}

def get_species(lat, lon, water_temp_f=None):
    month = datetime.now().month

    if lat > 44:        regional = ["striped bass", "tuna"]
    elif lat > 37:      regional = ["striped bass", "flounder", "tuna"]
    elif lat > 30:      regional = ["flounder", "redfish", "trout", "grouper"]
    elif lat > 25:      regional = ["snook", "redfish", "mahi", "grouper", "tuna"]
    elif lon < -85:     regional = ["redfish", "trout", "snook", "grouper", "mahi"]
    else:               regional = list(SPECIES.keys())

    results = []
    for name in regional:
        s = SPECIES[name]
        in_season = month in s["peak"]
        temp_ok = True
        if water_temp_f:
            lo, hi = s["temp"]
            temp_ok = lo <= water_temp_f <= hi
        results.append({
            "species": name.title(),
            "in_season": in_season,
            "temp_suitable": temp_ok,
            "habitat": s["habitat"],
            "depth": s["depth"],
            "tide_preference": s["tide"],
            "best_bait": s["bait"]
        })

    results.sort(key=lambda x: (x["in_season"] and x["temp_suitable"]), reverse=True)
    return {"month": datetime.now().strftime("%B"), "species": results}


# MASTER FETCH

def fetch_all_conditions(lat, lon, water_temp_f=None):
    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor() as ex:
        f_tides   = ex.submit(get_tides, lat, lon)
        f_weather = ex.submit(get_weather, lat, lon)
        f_moon    = ex.submit(get_moon_phase)
        f_species = ex.submit(get_species, lat, lon, water_temp_f)
    return {
        "location": {"lat": lat, "lon": lon},
        "tides":    f_tides.result(),
        "weather":  f_weather.result(),
        "moon":     f_moon.result(),
        "species":  f_species.result(),
    }