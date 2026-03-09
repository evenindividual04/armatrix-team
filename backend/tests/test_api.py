import pytest
from fastapi.testclient import TestClient

SAMPLE_MEMBER = {
    "name": "Test Engineer",
    "role": "Software Engineer",
    "department": "Engineering",
    "bio": "A test bio for unit testing purposes.",
    "photo_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
    "card_size": "standard",
    "order": 99,
}


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def create_sample_member(client: TestClient) -> dict:
    """POST a SAMPLE_MEMBER and return the response JSON."""
    resp = client.post("/api/team", json=SAMPLE_MEMBER)
    assert resp.status_code == 201, resp.text
    return resp.json()


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

class TestHealth:
    def test_health_returns_ok(self, client: TestClient):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert "status" in data
        assert "db_connected" in data
        assert data["db_connected"] is True

    def test_health_has_member_count(self, client: TestClient):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        data = resp.json()
        assert "member_count" in data
        assert isinstance(data["member_count"], int)


# ---------------------------------------------------------------------------
# GET /api/team
# ---------------------------------------------------------------------------

class TestListMembers:
    def test_list_returns_list(self, client: TestClient):
        resp = client.get("/api/team")
        assert resp.status_code == 200
        assert isinstance(resp.json(), list)

    def test_created_member_appears_in_list(self, client: TestClient):
        member = create_sample_member(client)
        resp = client.get("/api/team")
        assert resp.status_code == 200
        ids = [m["id"] for m in resp.json()]
        assert member["id"] in ids

    def test_department_filter(self, client: TestClient):
        create_sample_member(client)
        resp = client.get("/api/team", params={"department": "Engineering"})
        assert resp.status_code == 200
        data = resp.json()
        assert all(m["department"] == "Engineering" for m in data)

    def test_department_filter_unknown_returns_empty(self, client: TestClient):
        resp = client.get("/api/team", params={"department": "Nonexistent"})
        assert resp.status_code == 200
        assert resp.json() == []

    def test_search_filter_by_name(self, client: TestClient):
        member = create_sample_member(client)
        resp = client.get("/api/team", params={"search": "Test Engineer"})
        assert resp.status_code == 200
        data = resp.json()
        assert any(m["id"] == member["id"] for m in data)

    def test_search_filter_partial_match(self, client: TestClient):
        create_sample_member(client)
        resp = client.get("/api/team", params={"search": "Test"})
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) >= 1

    def test_search_filter_no_match(self, client: TestClient):
        resp = client.get("/api/team", params={"search": "ZZZNobodyHasThisName999"})
        assert resp.status_code == 200
        assert resp.json() == []

    def test_list_ordered_by_order_field(self, client: TestClient):
        resp = client.get("/api/team")
        assert resp.status_code == 200
        data = resp.json()
        orders = [m["order"] for m in data]
        assert orders == sorted(orders)


# ---------------------------------------------------------------------------
# GET /api/team/stats
# ---------------------------------------------------------------------------

class TestStats:
    def test_stats_has_required_keys(self, client: TestClient):
        resp = client.get("/api/team/stats")
        assert resp.status_code == 200
        data = resp.json()
        assert "total" in data
        assert "by_department" in data

    def test_stats_total_is_int(self, client: TestClient):
        resp = client.get("/api/team/stats")
        assert resp.status_code == 200
        assert isinstance(resp.json()["total"], int)

    def test_stats_by_department_is_list(self, client: TestClient):
        resp = client.get("/api/team/stats")
        assert resp.status_code == 200
        assert isinstance(resp.json()["by_department"], list)

    def test_stats_by_department_structure(self, client: TestClient):
        create_sample_member(client)
        resp = client.get("/api/team/stats")
        assert resp.status_code == 200
        for entry in resp.json()["by_department"]:
            assert "department" in entry
            assert "count" in entry
            assert isinstance(entry["count"], int)

    def test_stats_total_matches_list_count(self, client: TestClient):
        list_resp = client.get("/api/team")
        stats_resp = client.get("/api/team/stats")
        assert list_resp.status_code == 200
        assert stats_resp.status_code == 200
        assert stats_resp.json()["total"] == len(list_resp.json())

    def test_stats_route_not_treated_as_id(self, client: TestClient):
        """Ensure /api/team/stats is NOT routed to the {member_id} handler."""
        resp = client.get("/api/team/stats")
        # If stats were treated as an ID, we'd get 422 (invalid int) or 404
        assert resp.status_code == 200


# ---------------------------------------------------------------------------
# POST /api/team
# ---------------------------------------------------------------------------

class TestCreateMember:
    def test_create_valid_member_returns_201(self, client: TestClient):
        resp = client.post("/api/team", json=SAMPLE_MEMBER)
        assert resp.status_code == 201

    def test_create_returns_member_with_id(self, client: TestClient):
        resp = client.post("/api/team", json=SAMPLE_MEMBER)
        assert resp.status_code == 201
        data = resp.json()
        assert "id" in data
        assert isinstance(data["id"], int)

    def test_create_stores_correct_fields(self, client: TestClient):
        resp = client.post("/api/team", json=SAMPLE_MEMBER)
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == SAMPLE_MEMBER["name"]
        assert data["role"] == SAMPLE_MEMBER["role"]
        assert data["department"] == SAMPLE_MEMBER["department"]
        assert data["bio"] == SAMPLE_MEMBER["bio"]
        assert data["card_size"] == SAMPLE_MEMBER["card_size"]
        assert data["order"] == SAMPLE_MEMBER["order"]

    def test_create_has_timestamps(self, client: TestClient):
        resp = client.post("/api/team", json=SAMPLE_MEMBER)
        assert resp.status_code == 201
        data = resp.json()
        assert "created_at" in data
        assert "updated_at" in data

    def test_create_invalid_department_returns_422(self, client: TestClient):
        bad = {**SAMPLE_MEMBER, "department": "Marketing"}
        resp = client.post("/api/team", json=bad)
        assert resp.status_code == 422

    def test_create_invalid_card_size_returns_422(self, client: TestClient):
        bad = {**SAMPLE_MEMBER, "card_size": "jumbo"}
        resp = client.post("/api/team", json=bad)
        assert resp.status_code == 422

    def test_create_missing_required_field_returns_422(self, client: TestClient):
        incomplete = {k: v for k, v in SAMPLE_MEMBER.items() if k != "name"}
        resp = client.post("/api/team", json=incomplete)
        assert resp.status_code == 422

    def test_create_negative_order_returns_422(self, client: TestClient):
        bad = {**SAMPLE_MEMBER, "order": -1}
        resp = client.post("/api/team", json=bad)
        assert resp.status_code == 422

    def test_create_bio_too_long_returns_422(self, client: TestClient):
        bad = {**SAMPLE_MEMBER, "bio": "x" * 501}
        resp = client.post("/api/team", json=bad)
        assert resp.status_code == 422

    def test_create_with_optional_fields(self, client: TestClient):
        full = {
            **SAMPLE_MEMBER,
            "linkedin_url": "https://linkedin.com/in/test",
            "twitter_url": "https://twitter.com/test",
            "email": "test@example.com",
        }
        resp = client.post("/api/team", json=full)
        assert resp.status_code == 201
        data = resp.json()
        assert data["linkedin_url"] == full["linkedin_url"]
        assert data["twitter_url"] == full["twitter_url"]
        assert data["email"] == full["email"]

    def test_create_all_valid_departments(self, client: TestClient):
        for dept in ["Leadership", "Engineering", "Design", "Operations"]:
            member = {**SAMPLE_MEMBER, "department": dept}
            resp = client.post("/api/team", json=member)
            assert resp.status_code == 201, f"Failed for department: {dept}"

    def test_create_all_valid_card_sizes(self, client: TestClient):
        for size in ["featured", "wide", "standard"]:
            member = {**SAMPLE_MEMBER, "card_size": size}
            resp = client.post("/api/team", json=member)
            assert resp.status_code == 201, f"Failed for card_size: {size}"


# ---------------------------------------------------------------------------
# GET /api/team/{id}
# ---------------------------------------------------------------------------

class TestGetMember:
    def test_get_existing_member(self, client: TestClient):
        member = create_sample_member(client)
        resp = client.get(f"/api/team/{member['id']}")
        assert resp.status_code == 200
        assert resp.json()["id"] == member["id"]

    def test_get_returns_correct_data(self, client: TestClient):
        member = create_sample_member(client)
        resp = client.get(f"/api/team/{member['id']}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["name"] == SAMPLE_MEMBER["name"]
        assert data["department"] == SAMPLE_MEMBER["department"]

    def test_get_nonexistent_member_returns_404(self, client: TestClient):
        resp = client.get("/api/team/999999")
        assert resp.status_code == 404

    def test_get_404_has_detail_key(self, client: TestClient):
        resp = client.get("/api/team/999999")
        assert resp.status_code == 404
        assert "detail" in resp.json()


# ---------------------------------------------------------------------------
# PUT /api/team/{id}
# ---------------------------------------------------------------------------

class TestUpdateMember:
    def test_update_single_field(self, client: TestClient):
        member = create_sample_member(client)
        resp = client.put(f"/api/team/{member['id']}", json={"role": "Senior Engineer"})
        assert resp.status_code == 200
        assert resp.json()["role"] == "Senior Engineer"

    def test_update_preserves_other_fields(self, client: TestClient):
        member = create_sample_member(client)
        resp = client.put(f"/api/team/{member['id']}", json={"role": "Principal Engineer"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["name"] == SAMPLE_MEMBER["name"]
        assert data["department"] == SAMPLE_MEMBER["department"]

    def test_update_multiple_fields(self, client: TestClient):
        member = create_sample_member(client)
        updates = {"name": "Updated Name", "bio": "Updated bio.", "order": 50}
        resp = client.put(f"/api/team/{member['id']}", json=updates)
        assert resp.status_code == 200
        data = resp.json()
        assert data["name"] == "Updated Name"
        assert data["bio"] == "Updated bio."
        assert data["order"] == 50

    def test_update_department_to_valid_value(self, client: TestClient):
        member = create_sample_member(client)
        resp = client.put(f"/api/team/{member['id']}", json={"department": "Design"})
        assert resp.status_code == 200
        assert resp.json()["department"] == "Design"

    def test_update_invalid_department_returns_422(self, client: TestClient):
        member = create_sample_member(client)
        resp = client.put(f"/api/team/{member['id']}", json={"department": "Finance"})
        assert resp.status_code == 422

    def test_update_nonexistent_member_returns_404(self, client: TestClient):
        resp = client.put("/api/team/999999", json={"role": "Ghost"})
        assert resp.status_code == 404

    def test_update_card_size(self, client: TestClient):
        member = create_sample_member(client)
        resp = client.put(f"/api/team/{member['id']}", json={"card_size": "wide"})
        assert resp.status_code == 200
        assert resp.json()["card_size"] == "wide"

    def test_update_invalid_card_size_returns_422(self, client: TestClient):
        member = create_sample_member(client)
        resp = client.put(f"/api/team/{member['id']}", json={"card_size": "huge"})
        assert resp.status_code == 422

    def test_empty_update_body_is_allowed(self, client: TestClient):
        member = create_sample_member(client)
        resp = client.put(f"/api/team/{member['id']}", json={})
        assert resp.status_code == 200


# ---------------------------------------------------------------------------
# DELETE /api/team/{id}
# ---------------------------------------------------------------------------

class TestDeleteMember:
    def test_delete_existing_member_returns_200(self, client: TestClient):
        member = create_sample_member(client)
        resp = client.delete(f"/api/team/{member['id']}")
        assert resp.status_code == 200

    def test_delete_returns_deleted_member(self, client: TestClient):
        member = create_sample_member(client)
        resp = client.delete(f"/api/team/{member['id']}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == member["id"]
        assert data["name"] == member["name"]

    def test_deleted_member_not_in_list(self, client: TestClient):
        member = create_sample_member(client)
        client.delete(f"/api/team/{member['id']}")
        resp = client.get("/api/team")
        ids = [m["id"] for m in resp.json()]
        assert member["id"] not in ids

    def test_delete_nonexistent_member_returns_404(self, client: TestClient):
        resp = client.delete("/api/team/999999")
        assert resp.status_code == 404

    def test_delete_same_member_twice_returns_404(self, client: TestClient):
        member = create_sample_member(client)
        client.delete(f"/api/team/{member['id']}")
        resp = client.delete(f"/api/team/{member['id']}")
        assert resp.status_code == 404

    def test_get_after_delete_returns_404(self, client: TestClient):
        member = create_sample_member(client)
        client.delete(f"/api/team/{member['id']}")
        resp = client.get(f"/api/team/{member['id']}")
        assert resp.status_code == 404
