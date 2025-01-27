import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Chart from "react-apexcharts";
import { Modal, Button, Form, Dropdown } from "react-bootstrap";
import AlertMessage from "../../reusableComponents/AlertMessage";

const PaymentPage = () => {
  const [stats, setStats] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;
  var BASE_URL = import.meta.env.VITE_BASE_URL;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  // Handle Change of Payment Status
  const handleStatusChange = async (paymentId, status) => {
    setStatus("");
    setMessage("");
    setShowAlert(false);
    try {
      setLoading(true);
      const response = await axios.put(
        `${BASE_URL}/payments/update-payment-status/${paymentId}`,
        { status }
      );

      if (response && response.status === 200) {
        setLoading(false);
        setStatus("success");
        setMessage("Updated Data successfully!");
        setShowAlert(true); // Show success alert
      } else {
        setLoading(false);
        setStatus("error");
        setMessage("Failed to Update Data!");
        setShowAlert(true); // Show error alert
      }
      // You can also refresh data here by calling a fetchData function if needed
    } catch (error) {
      setLoading(false);
      setStatus("error", error);
      setMessage("Something went wrong!");
      setShowAlert(true); // Show error alert
      console.error("Error updating status", error);
    }
  };

  // Handle Delete Payment
  const handleDelete = async () => {
    setStatus("");
    setMessage("");
    setShowAlert(false);
    try {
      setLoading(true);
      const response = await axios.delete(
        `${BASE_URL}/payments/delete-payment/${selectedPayment._id}`
      );
      if (response && response.status === 201) {
        setLoading(false);
        setStatus("success");
        setMessage("Deleted Data successfully!");
        setShowAlert(true); // Show success alert
      } else {
        setLoading(false);
        setStatus("error");
        setMessage("Failed to Delete Data!");
        setShowAlert(true); // Show error alert
      }
      setShowDeleteModal(false);
      setLoading(false);
      // Refresh data after deletion if needed
    } catch (error) {
      setLoading(false);
      setStatus("error", error);
      setMessage("Something went wrong!");
      setShowAlert(true); // Show error alert
      console.error("Error deleting payment", error);
    }
  };

  // Handle View Details
  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };
  useEffect(() => {
    fetchData();
  }, [filter, page]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/payments/get-all-payments?page=${page}&limit=${limit}&filter=${filter}`
      );
      setStats(response.data.stats);
      setPayments(response.data.payments);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          marginLeft: "5px",
          padding: "8px",
          backgroundColor: "#ef156c",
          color: "white",
          fontSize: "15px",
          fontWeight: "bold",
        }}
      >
        Loading...
      </div>
    );
  }
  return (
    <div className="container mt-5">
      {showAlert && (
        <AlertMessage type={status} message={message} show={showAlert} />
      )}
      <div className="mt-3 mb-3">
        <h4 style={{ color: "#ef156c" }}>Payment Dashboard</h4>
      </div>
      {/* Top Row Stats */}
      <div className="row mb-4">
        {stats.map((stat, index) => (
          <div className="col-md-3 mb-3" key={index}>
            <div className="card text-center p-3 shadow">
              <h5 className="mb-2">{stat.title}</h5>
              <h2 className=" mb-3" style={{ color: "#ef156c" }}>
                {stat.count}
              </h2>
              {/* <div>
                <Chart
                  options={{
                    chart: {
                      toolbar: { show: false },
                    },
                    xaxis: {
                      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                    },
                  }}
                  series={[{ name: stat.title, data: [10, 20, 15, 30, 25, 40, 35] }]} // Example data
                  type="bar"
                  height={150}
                />
              </div> */}
            </div>
          </div>
        ))}
      </div>
      <hr />
      <div className="mt-3 mb-3">
        <h4 style={{ color: "#ef156c" }}>Payment Details</h4>
      </div>
      {/* Filter and Table */}
      <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap">
        <div>
          <button
            className={`btn ${filter === "today" && "btn-primary"} me-2`}
            onClick={() => setFilter("today")}
          >
            Today
          </button>
          <button
            className={`btn ${filter === "lastWeek" && "btn-primary"} me-2`}
            onClick={() => setFilter("lastWeek")}
          >
            Last Week
          </button>
          <button
            className={`btn ${filter === "month" && "btn-primary"} me-2`}
            onClick={() => setFilter("month")}
          >
            This Month
          </button>
          <button
            className={`btn ${filter === "all" && "btn-primary"} me-2`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
        </div>
      </div>

      {/* Payment Table */}
    <div className="table table-responsive">
    <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Order ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Payment Method</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment, index) => (
            <tr key={payment._id}>
              <td>{(page - 1) * limit + index + 1}</td>
              <td>{payment.bookingId?.orderId || "N/A"}</td>
              <td>{payment.userId?.username || "N/A"}</td>
              <td>₹{payment.price}</td>
              <td>{payment.status}</td>
              <td>{payment.paymentMethod}</td>
              <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="d-flex">
                  {/* Status Dropdown */}
                  <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {payment.status}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() =>
                          handleStatusChange(payment._id, "Confirmed")
                        }
                      >
                        Confirmed
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handleStatusChange(payment._id, "Failed")
                        }
                      >
                        Failed
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() =>
                          handleStatusChange(payment._id, "Pending")
                        }
                      >
                        Pending
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* Delete Button */}
                  <Button
                    variant="danger"
                    className="ms-2"
                    onClick={() => {
                      setSelectedPayment(payment);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </Button>

                  {/* View Button */}
                  <Button
                    variant="info"
                    className="ms-2"
                    onClick={() => handleViewDetails(payment)}
                  >
                    View
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this payment?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Payment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <>
              <p>
                <strong>User:</strong> {selectedPayment.userId?.username}
              </p>
              <p>
                <strong>Order ID:</strong> {selectedPayment.bookingId?.orderId}
              </p>
              <p>
                <strong>Amount:</strong> ₹{selectedPayment.price}
              </p>
              <p>
                <strong>Status:</strong> {selectedPayment.status}
              </p>
              <p>
                <strong>Payment Method:</strong> {selectedPayment.paymentMethod}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedPayment.createdAt).toLocaleDateString()}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <div>Total Records: {pagination.totalPages * limit}</div>
        <nav>
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                page === pagination.totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default PaymentPage;
