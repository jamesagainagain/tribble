import random
from datetime import datetime, timedelta, timezone

from tribble.models.report import AnonymityLevel, CrisisReport, ReportMode, SourceType

SCENARIOS = [
    {
        "template": "Heavy gunfire near {loc}, families sheltering",
        "categories": ["violence_active_threat"],
        "lat": (15.48, 15.62),
        "lng": (32.50, 32.60),
    },
    {
        "template": "Hospital in {loc} overwhelmed, no supplies",
        "categories": ["medical_need", "infrastructure_damage"],
        "lat": (15.50, 15.58),
        "lng": (32.52, 32.58),
    },
    {
        "template": "Families displaced from {loc}, moving south on foot",
        "categories": ["displacement", "shelter_need"],
        "lat": (15.45, 15.55),
        "lng": (32.48, 32.56),
    },
    {
        "template": "Water cut off in {loc} for 3 days",
        "categories": ["water_access"],
        "lat": (15.52, 15.60),
        "lng": (32.54, 32.62),
    },
    {
        "template": "Bridge near {loc} destroyed, aid trucks blocked",
        "categories": ["route_blockage", "infrastructure_damage"],
        "lat": (15.49, 15.56),
        "lng": (32.51, 32.58),
    },
    {
        "template": "Food distribution in {loc} looted",
        "categories": ["food_insecurity"],
        "lat": (15.50, 15.57),
        "lng": (32.52, 32.60),
    },
]

LOCATIONS = [
    "Omdurman",
    "Bahri",
    "central Khartoum",
    "Al-Kalakla",
    "Soba",
    "the airport area",
    "the market district",
]

SOURCES = [
    (SourceType.WEB_IDENTIFIED, AnonymityLevel.IDENTIFIED),
    (SourceType.WEB_ANONYMOUS, AnonymityLevel.ANONYMOUS),
    (SourceType.WHATSAPP_IDENTIFIED, AnonymityLevel.IDENTIFIED),
    (SourceType.WHATSAPP_ANONYMOUS, AnonymityLevel.ANONYMOUS),
]


def generate_dummy_reports(count: int = 50, **_) -> list[CrisisReport]:
    base = datetime(2023, 4, 15, 6, 0, tzinfo=timezone.utc)
    reports = []
    for _ in range(count):
        scenario = random.choice(SCENARIOS)
        source_type, anonymity = random.choice(SOURCES)
        reports.append(
            CrisisReport(
                source_type=source_type,
                mode=ReportMode.INCIDENT_CREATION,
                anonymity=anonymity,
                event_timestamp=base + timedelta(hours=random.uniform(0, 168)),
                latitude=round(random.uniform(*scenario["lat"]), 6),
                longitude=round(random.uniform(*scenario["lng"]), 6),
                narrative=scenario["template"].format(loc=random.choice(LOCATIONS)),
                language=random.choice(["en", "ar", "ar", "ar"]),
                crisis_categories=scenario["categories"],
            )
        )
    return reports
