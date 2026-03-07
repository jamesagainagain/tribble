from tribble.ingest.acled import acled_event_to_crisis_report
from tribble.ingest.seed import generate_dummy_reports
from tribble.pipeline.graph import build_pipeline
from tribble.pipeline.state import PipelineState, PipelineStatus


def _to_state(report) -> PipelineState:
    return {
        "report_id": report.id or "t",
        "raw_narrative": report.narrative,
        "source_type": str(report.source_type),
        "latitude": report.latitude,
        "longitude": report.longitude,
        "language": report.language,
        "timestamp": report.event_timestamp.isoformat(),
        "status": PipelineStatus.INGESTED,
        "node_trace": [],
        "error": None,
        "normalized": None,
        "translation": None,
        "classification": None,
        "geocoded_location": None,
        "duplicates_found": [],
        "corroboration_hits": [],
        "weather_data": None,
        "satellite_data": None,
        "confidence_breakdown": None,
        "confidence_scores": None,
        "cluster_id": None,
    }


def test_dummy_report_e2e():
    result = build_pipeline().invoke(_to_state(generate_dummy_reports(1)[0]))
    assert result["status"] == PipelineStatus.PUBLISHED
    assert len(result["node_trace"]) == 11


def test_acled_event_e2e():
    event = {
        "event_id_cnty": "SDN12345",
        "event_date": "2023-04-15",
        "event_type": "Battles",
        "sub_event_type": "Armed clash",
        "actor1": "SAF",
        "actor2": "RSF",
        "admin1": "Khartoum",
        "location": "Khartoum",
        "latitude": "15.5",
        "longitude": "32.56",
        "fatalities": "5",
        "notes": "Clashes near airport",
        "country": "Sudan",
        "iso3": "SDN",
    }
    result = build_pipeline().invoke(_to_state(acled_event_to_crisis_report(event)))
    assert result["status"] == PipelineStatus.PUBLISHED


def test_batch_20():
    reports = generate_dummy_reports(20)
    results = [build_pipeline().invoke(_to_state(r)) for r in reports]
    assert all(r["status"] in (PipelineStatus.PUBLISHED, PipelineStatus.REJECTED) for r in results)
    assert sum(1 for r in results if r["status"] == PipelineStatus.PUBLISHED) > 0
