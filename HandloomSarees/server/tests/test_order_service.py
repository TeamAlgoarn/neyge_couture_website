import pytest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException
from app.services.order_service import OrderService
from app.schemas.order import OrderStatusUpdateRequest, OrderStatusEnum

@pytest.fixture
def mock_order_repository():
    with patch("app.services.order_service.OrderRepository") as mock_repo:
        yield mock_repo


def test_update_order_status_valid_transition(mock_order_repository):
    mock_order_repository.get_by_id.return_value = {"id": "1", "order_status": "confirmed", "status_history": []}
    mock_order_repository.update_by_id.return_value = {"id": "1", "order_status": "processing"}

    payload = OrderStatusUpdateRequest(order_status=OrderStatusEnum.processing)
    result = OrderService.update_order_status("1", payload)

    assert result["order_status"] == "processing"
    mock_order_repository.update_by_id.assert_called_once()
    args, kwargs = mock_order_repository.update_by_id.call_args
    update_dict = args[1]
    assert update_dict["order_status"] == "processing"
    assert len(update_dict["status_history"]) == 1
    assert update_dict["status_history"][0]["status"] == "processing"


def test_update_order_status_invalid_transition(mock_order_repository):
    mock_order_repository.get_by_id.return_value = {"id": "1", "order_status": "confirmed"}

    # confirmed -> delivered is invalid
    payload = OrderStatusUpdateRequest(order_status=OrderStatusEnum.delivered)
    with pytest.raises(HTTPException) as exc:
        OrderService.update_order_status("1", payload)

    assert exc.value.status_code == 400
    assert "Invalid status transition" in exc.value.detail


def test_update_order_status_terminal_state_delivered(mock_order_repository):
    mock_order_repository.get_by_id.return_value = {"id": "1", "order_status": "delivered"}

    # delivered cannot transition anywhere
    payload = OrderStatusUpdateRequest(order_status=OrderStatusEnum.cancelled)
    with pytest.raises(HTTPException) as exc:
        OrderService.update_order_status("1", payload)

    assert exc.value.status_code == 400


def test_update_order_status_terminal_state_cancelled(mock_order_repository):
    mock_order_repository.get_by_id.return_value = {"id": "1", "order_status": "cancelled"}

    # cancelled cannot transition anywhere
    payload = OrderStatusUpdateRequest(order_status=OrderStatusEnum.processing)
    with pytest.raises(HTTPException) as exc:
        OrderService.update_order_status("1", payload)

    assert exc.value.status_code == 400


def test_update_order_status_missing_order(mock_order_repository):
    mock_order_repository.get_by_id.return_value = None

    payload = OrderStatusUpdateRequest(order_status=OrderStatusEnum.processing)
    with pytest.raises(HTTPException) as exc:
        OrderService.update_order_status("invalid_id", payload)

    assert exc.value.status_code == 404
    assert exc.value.detail == "Order not found"


def test_update_order_status_update_failure(mock_order_repository):
    mock_order_repository.get_by_id.return_value = {"id": "1", "order_status": "confirmed"}
    mock_order_repository.update_by_id.return_value = None  # Simulating failure to update row

    payload = OrderStatusUpdateRequest(order_status=OrderStatusEnum.processing)
    with pytest.raises(HTTPException) as exc:
        OrderService.update_order_status("1", payload)

    assert exc.value.status_code == 500
    assert exc.value.detail == "Failed to update order"


def test_update_order_status_tracking_details(mock_order_repository):
    mock_order_repository.get_by_id.return_value = {"id": "1", "order_status": "processing"}
    mock_order_repository.update_by_id.return_value = {"id": "1", "order_status": "shipped"}

    payload = OrderStatusUpdateRequest(
        order_status=OrderStatusEnum.shipped,
        courier_name="FedEx",
        tracking_number="123456",
        tracking_url="https://track.fedex.com/123456"
    )
    result = OrderService.update_order_status("1", payload)

    args, kwargs = mock_order_repository.update_by_id.call_args
    update_dict = args[1]

    assert update_dict["courier_name"] == "FedEx"
    assert update_dict["tracking_number"] == "123456"
    assert update_dict["tracking_url"] == "https://track.fedex.com/123456"
    assert update_dict["status_history"][0]["courier_name"] == "FedEx"
    assert update_dict["status_history"][0]["tracking_url"] == "https://track.fedex.com/123456"
