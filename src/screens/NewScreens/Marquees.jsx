import React, { useState, useEffect } from "react";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import EditButton from "../../components/buttons/EditButton";
import { useDataFetcher } from "../../hooks/useDataFetcherArray";
import DeleteData from "../../components/DeleteDataArray";
import LinearProgress from "@mui/material/LinearProgress";
import axios from "axios";

const Marquees = ({ refreshKey }) => {
  const apiURL = import.meta.env.VITE_API_URL ;
  console.log("API URL for requests:", apiURL);
  const { data, loading, error, setData, fetchData } = useDataFetcher(
    `${apiURL}/marquees`
  );
  const [expandedMarqueeId, setExpandedMarqueeId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateForm, setUpdateForm] = useState(null);
  const [formError, setFormError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleting, setDeleting] = useState(false);

  const handleToggleDetails = (id) => {
    setExpandedMarqueeId(expandedMarqueeId === id ? null : id);
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }
      console.log("Token:", token);
      console.log(`Sending DELETEEEEEE request to: ${apiURL}/marquees/${id}`);
      const response = await axios.delete(`${apiURL}/marquees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("DELETE response:", response.data);
      if (response.status === 200) {
        setData((prevData) => prevData.filter((marquee) => marquee._id !== id));
      } else {
        setFormError("Failed to delete marquee: Unexpected response");
      }
    } catch (err) {
      console.error("Delete error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers,
      });
      setFormError(
        err.response?.data?.message || `Failed to delete marquee: ${err.message}`
      );
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey, fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => {
      if (["capacity"].includes(name)) {
        return { ...prev, [name]: value ? parseInt(value) : 1 };
      }
      if (["perHour", "perDay"].includes(name)) {
        return { ...prev, [name]: value ? parseFloat(value) : 0 };
      }
      return { ...prev, [name]: value };
    });
  };

  const validateForm = (form) => {
    if (!form.name || form.name.trim() === "") return "Name is required";
    if (!form.description || form.description.trim() === "")
      return "Description is required";
    if (!form.address || form.address.trim() === "") return "Address is required";
    if (!form.city || form.city.trim() === "") return "City is required";
    if (!form.state || form.state.trim() === "") return "State is required";
    if (!form.country || form.country.trim() === "") return "Country is required";
    if (
      form.capacity === undefined ||
      isNaN(form.capacity) ||
      form.capacity < 1
    )
      return "Capacity must be a positive number";
    if (form.perHour === undefined || isNaN(form.perHour) || form.perHour < 0)
      return "Price per hour must be non-negative";
    if (form.perDay === undefined || isNaN(form.perDay) || form.perDay < 0)
      return "Price per day must be non-negative";
    return "";
  };

  const handleEditMarquee = (marquee) => {
    setUpdateForm({
      _id: marquee._id || "",
      name: marquee.name || "",
      description: marquee.description || "",
      address: marquee.location?.address || "",
      city: marquee.location?.city || "",
      state: marquee.location?.state || "",
      country: marquee.location?.country || "",
      capacity: marquee.capacity || 1,
      perHour: marquee.pricing?.perHour || 0,
      perDay: marquee.pricing?.perDay || 0,
      bookingStatus: marquee.bookingStatus || marquee.status || "pending",
    });
    setShowUpdateModal(true);
  };

  const handleUpdateMarquee = async (e) => {
  e.preventDefault();
  setFormError("");

  const validationError = validateForm(updateForm);
  if (validationError) {
    setFormError(validationError);
    return;
  }

  try {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }
    console.log("Token:", token); // Log the token for debugging

    const updatePayload = {
      name: updateForm.name,
      description: updateForm.description,
      location: {
        address: updateForm.address,
        city: updateForm.city,
        state: updateForm.state,
        country: updateForm.country,
      },
      capacity: Number(updateForm.capacity) || 1,
      pricing: {
        perHour: Number(updateForm.perHour) || 0,
        perDay: Number(updateForm.perDay) || 0,
        additionalFees: [],
      },
      bookingStatus: updateForm.bookingStatus,
    };
    console.log(`Sending PUT request to: ${apiURL}/marquees/${updateForm._id}`, updatePayload);
    const response = await axios.put(
      `${apiURL}/marquees/${updateForm._id}`,
      updatePayload,
      {
        withCredentials: true, // Ensure cookies are sent
      }
    );
    console.log("UPDATE response:", response.data);
    setData((prevData) =>
      prevData.map((marquee) =>
        marquee._id === updateForm._id ? response.data.data : marquee
      )
    );
    setShowUpdateModal(false);
    setUpdateForm(null);
  } catch (err) {
    console.error("Update error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      headers: err.response?.headers,
    });
    setFormError(
      err.response?.status === 400
        ? "Invalid update data"
        : err.response?.status === 401
        ? "Unauthorized: Please log in again"
        : err.response?.status === 403
        ? "Unauthorized: You can only update your own marquees"
        : err.response?.status === 404
        ? "Marquee not found"
        : err.response?.data?.message || `Failed to update marquee: ${err.message}`
    );
  }
};
const handleStatusChange = async (id, newStatus) => {
  try {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }
    console.log("Token:", token); // Log the token for debugging

    console.log(`Sending PUT request to update status: ${apiURL}/marquees/${id}`);
    const response = await axios.put(
      `${apiURL}/marquees/${id}`,
      {
        bookingStatus: newStatus,
      },
      {
        withCredentials: true, // Keep this for cookie compatibility
      }
    );
    console.log("Status change response:", response.data);
    setData((prevData) =>
      prevData.map((marquee) =>
        marquee._id === id ? response.data.data : marquee
      )
    );
  } catch (err) {
    console.error("Status change error:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
      headers: err.response?.headers,
    });
    setFormError(
      err.response?.data?.message ||
        `Failed to ${newStatus === "active" ? "approve" : "reject"} marquee`
    );
  }
};

  const filteredData = data
    ? filterStatus === "all"
      ? data
      : data.filter(
          (marquee) => (marquee.bookingStatus || marquee.status) === filterStatus
        )
    : [];

  return (
    <div className="container mt-4">
      {formError && (
        <div className="alert alert-danger" role="alert">
          {formError}
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Marquee Management</h2>
        <div className="btn-group">
          {[
            "all",
            "pending",
            "booked",
            "active",
            "completed",
            "rejected",
            "inactive",
          ].map((status) => (
            <button
              key={status}
              className={`btn btn-outline-primary ${
                filterStatus === status ? "active" : ""
              }`}
              onClick={() => setFilterStatus(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading && <LinearProgress />}
      {error && (
        <div className="alert alert-danger" role="alert">
          Error fetching data: {error.message || "An unexpected error occurred"}
        </div>
      )}
      {!loading && !error && !data && (
        <div className="alert alert-warning" role="alert">
          No data received from the server. Please check the API or network.
        </div>
      )}

      {data && filteredData.length > 0 ? (
        <div className="row">
          {filteredData.map((marquee) => (
            <div key={marquee._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">{marquee.name}</h5>
                    <div>
                      <EditButton
                        onClick={() => handleEditMarquee(marquee)}
                        className="btn btn-sm btn-outline-secondary me-2"
                      />
                      <DeleteData
                        route="marquees"
                        Id={marquee._id}
                        onDelete={handleDelete}
                        disabled={deleting}
                      />
                      <button
                        className="btn btn-sm btn-outline-primary ms-2"
                        onClick={() => handleToggleDetails(marquee._id)}
                      >
                        {expandedMarqueeId === marquee._id ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </button>
                    </div>
                  </div>
                  <span
                    style={{
                      color:
                        marquee.bookingStatus === "pending"
                          ? "goldenrod"
                          : marquee.bookingStatus === "booked"
                          ? "blue"
                          : marquee.bookingStatus === "active"
                          ? "green"
                          : marquee.bookingStatus === "completed"
                          ? "gray"
                          : marquee.bookingStatus === "rejected"
                          ? "red"
                          : marquee.bookingStatus === "inactive"
                          ? "red"
                          : "#555",
                      fontSize: "0.9rem",
                    }}
                  >
                    Booking Status:{" "}
                    {marquee.bookingStatus
                      ? marquee.bookingStatus.charAt(0).toUpperCase() +
                        marquee.bookingStatus.slice(1)
                      : marquee.status
                      ? marquee.status.charAt(0).toUpperCase() +
                        marquee.status.slice(1)
                      : "Unknown"}
                  </span>
                  <br />
                  <span
                    style={{
                      color:
                        marquee.availabilityStatus === "active"
                          ? "green"
                          : "red",
                      fontSize: "0.9rem",
                    }}
                  >
                    Availability Status:{" "}
                    {marquee.availabilityStatus
                      ? marquee.availabilityStatus.charAt(0).toUpperCase() +
                        marquee.availabilityStatus.slice(1)
                      : marquee.status
                      ? marquee.status.charAt(0).toUpperCase() +
                        marquee.status.slice(1)
                      : "Unknown"}
                  </span>
                  {(marquee.bookingStatus === "pending" ||
                    marquee.status === "pending") && (
                    <div className="mt-2">
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleStatusChange(marquee._id, "active")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          handleStatusChange(marquee._id, "rejected")
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  <hr />
                  <p className="card-text">{marquee.description}</p>
                  {expandedMarqueeId === marquee._id && (
                    <div className="mt-3">
                      <p>
                        <strong>Location:</strong>{" "}
                        {`${marquee.location.address}, ${marquee.location.city}, ${marquee.location.state}, ${marquee.location.country}`}
                      </p>
                      <p>
                        <strong>Capacity:</strong> {marquee.capacity} guests
                      </p>
                      <p>
                        <strong>Pricing:</strong> ${marquee.pricing.perHour}
                        /hour, ${marquee.pricing.perDay}/day
                      </p>
                      {marquee.pricing.additionalFees.length > 0 && (
                        <p>
                          <strong>Additional Fees:</strong>{" "}
                          {marquee.pricing.additionalFees
                            .map((fee) => `${fee.name}: $${fee.amount}`)
                            .join(", ")}
                        </p>
                      )}
                      <p>
                        <strong>Amenities:</strong>{" "}
                        {marquee.amenities.length > 0
                          ? marquee.amenities.join(", ")
                          : "None"}
                      </p>
                      {marquee.deals.length > 0 && (
                        <p>
                          <strong>Deals:</strong>{" "}
                          {marquee.deals
                            .map((deal) =>
                              deal.discountPrice
                                ? `${deal.title} ($${deal.discountPrice})`
                                : `${deal.title} (N/A)`
                            )
                            .join(", ")}
                        </p>
                      )}
                      <p>
                        <strong>Provider:</strong>{" "}
                        {marquee.provider?.name || "Unknown"}
                      </p>
                      <p>
                        <strong>ID:</strong> {marquee._id}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error &&
        data && (
          <div className="alert alert-info" role="alert">
            No marquees to display for the selected filter: {filterStatus}.
          </div>
        )
      )}

      {showUpdateModal && updateForm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Marquee</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowUpdateModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleUpdateMarquee}>
                <div className="modal-body">
                  {formError && (
                    <div className="alert alert-danger" role="alert">
                      {formError}
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={updateForm.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="capacity" className="form-label">
                        Capacity
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="capacity"
                        name="capacity"
                        value={updateForm.capacity}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={updateForm.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="address" className="form-label">
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        value={updateForm.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="city" className="form-label">
                        City
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={updateForm.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="state" className="form-label">
                        State
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="state"
                        name="state"
                        value={updateForm.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="country" className="form-label">
                        Country
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="country"
                        name="country"
                        value={updateForm.country}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="perHour" className="form-label">
                        Price per Hour
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="perHour"
                        name="perHour"
                        value={updateForm.perHour}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="perDay" className="form-label">
                        Price per Day
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="perDay"
                        name="perDay"
                        value={updateForm.perDay}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="bookingStatus" className="form-label">
                      Booking Status
                    </label>
                    <select
                      className="form-select"
                      id="bookingStatus"
                      name="bookingStatus"
                      value={updateForm.bookingStatus}
                      onChange={handleInputChange}
                    >
                      <option value="pending">Pending</option>
                      <option value="booked">Booked</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Marquee
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marquees;