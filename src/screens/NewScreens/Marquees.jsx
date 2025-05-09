import React, { useState, useEffect } from "react";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import EditButton from "../../components/buttons/EditButton";
import { useDataFetcher } from "../../hooks/useDataFetcher";
import DeleteData from "../../components/DeleteData";
import LinearProgress from "@mui/material/LinearProgress";


const Marquees = ({ refreshKey }) => {
  const apiURL = import.meta.env.VITE_API_URL;
  const { data, loading, error, setData, fetchData } = useDataFetcher(
    `${apiURL}/marquees`
  );
  const [expandedMarqueeId, setExpandedMarqueeId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    capacity: "",
    perHour: "",
    perDay: "",
    status: "active",
  });
  const [updateForm, setUpdateForm] = useState(null);
  const [formError, setFormError] = useState("");

  // Toggle details for a specific marquee
  const handleToggleDetails = (id) => {
    setExpandedMarqueeId(expandedMarqueeId === id ? null : id);
  };

  // Handle marquee deletion
  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((marquee) => marquee._id !== id));
  };

  // Fetch data when refreshKey changes
  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  // Handle form input changes (create and update forms)
  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === "create") {
      setCreateForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setUpdateForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Open update modal with pre-filled data
  const handleEditMarquee = (marquee) => {
    setUpdateForm({
      _id: marquee._id,
      name: marquee.name,
      description: marquee.description,
      address: marquee.location.address,
      city: marquee.location.city,
      state: marquee.location.state,
      country: marquee.location.country,
      capacity: marquee.capacity,
      perHour: marquee.pricing.perHour,
      perDay: marquee.pricing.perDay,
      status: marquee.status,
    });
    setShowUpdateModal(true);
  };

  // Handle create marquee submission
  const handleCreateMarquee = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      const response = await axios.post(`${apiURL}/marquees`, {
        name: createForm.name,
        description: createForm.description,
        location: {
          address: createForm.address,
          city: createForm.city,
          state: createForm.state,
          country: createForm.country,
        },
        capacity: parseInt(createForm.capacity),
        pricing: {
          perHour: parseFloat(createForm.perHour),
          perDay: parseFloat(createForm.perDay),
          additionalFees: [], // Simplified
        },
        status: createForm.status,
        // Provider assumed to be set on backend
      });
      setData((prevData) => [...prevData, response.data]);
      setShowCreateModal(false);
      setCreateForm({
        name: "",
        description: "",
        address: "",
        city: "",
        state: "",
        country: "",
        capacity: "",
        perHour: "",
        perDay: "",
        status: "active",
      });
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create marquee");
    }
  };

  // Handle update marquee submission
  const handleUpdateMarquee = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      const response = await axios.put(`${apiURL}/marquees/${updateForm._id}`, {
        name: updateForm.name,
        description: updateForm.description,
        location: {
          address: updateForm.address,
          city: updateForm.city,
          state: updateForm.state,
          country: updateForm.country,
        },
        capacity: parseInt(updateForm.capacity),
        pricing: {
          perHour: parseFloat(updateForm.perHour),
          perDay: parseFloat(updateForm.perDay),
          additionalFees: [], // Simplified
        },
        status: updateForm.status,
      });
      setData((prevData) =>
        prevData.map((marquee) =>
          marquee._id === updateForm._id ? response.data : marquee
        )
      );
      setShowUpdateModal(false);
      setUpdateForm(null);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update marquee");
    }
  };

  return (
    <div className="container mt-4">
      {/* Header and Create Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Marquee Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          Create Marquee
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && <LinearProgress />}
      {error && (
        <div className="alert alert-danger" role="alert">
          Error fetching data: {error}
        </div>
      )}

      {/* Marquee List */}
      {data && data.length > 0 ? (
        <div className="row">
          {data.map((marquee) => (
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
                      color: marquee.status === "active" ? "green" : "red",
                      fontSize: "0.9rem",
                    }}
                  >
                    Status: {marquee.status.charAt(0).toUpperCase() + marquee.status.slice(1)}
                  </span>
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
                        <strong>Pricing:</strong> ${marquee.pricing.perHour}/hour, $
                        {marquee.pricing.perDay}/day
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
                            .map(
                              (deal) =>
                                `${deal.title} (${
                                  deal.discountPrice ? `$${deal.discountPrice}` : "N/A"
                                })`
                            )
                            .join(", ")}
                        </p>
                      )}
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
        <div className="alert alert-info" role="alert">
          No marquees to display at this time.
        </div>
      )}

      {/* Create Marquee Modal */}
      <div
        className={`modal fade ${showCreateModal ? "show d-block" : ""}`}
        tabIndex="-1"
        style={{ backgroundColor: showCreateModal ? "rgba(0,0,0,0.5)" : "transparent" }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New Marquee</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowCreateModal(false)}
              ></button>
            </div>
            <form onSubmit={handleCreateMarquee}>
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
                      value={createForm.name}
                      onChange={(e) => handleInputChange(e, "create")}
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
                      value={createForm.capacity}
                      onChange={(e) => handleInputChange(e, "create")}
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
                    value={createForm.description}
                    onChange={(e) => handleInputChange(e, "create")}
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
                      value={createForm.address}
                      onChange={(e) => handleInputChange(e, "create")}
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
                      value={createForm.city}
                      onChange={(e) => handleInputChange(e, "create")}
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
                      value={createForm.state}
                      onChange={(e) => handleInputChange(e, "create")}
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
                      value={createForm.country}
                      onChange={(e) => handleInputChange(e, "create")}
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
                      value={createForm.perHour}
                      onChange={(e) => handleInputChange(e, "create")}
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
                      value={createForm.perDay}
                      onChange={(e) => handleInputChange(e, "create")}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    className="form-select"
                    id="status"
                    name="status"
                    value={createForm.status}
                    onChange={(e) => handleInputChange(e, "create")}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Marquee
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Update Marquee Modal */}
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
                        onChange={(e) => handleInputChange(e, "update")}
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
                        onChange={(e) => handleInputChange(e, "update")}
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
                      onChange={(e) => handleInputChange(e, "update")}
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
                        onChange={(e) => handleInputChange(e, "update")}
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
                        onChange={(e) => handleInputChange(e, "update")}
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
                        onChange={(e) => handleInputChange(e, "update")}
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
                        onChange={(e) => handleInputChange(e, "update")}
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
                        onChange={(e) => handleInputChange(e, "update")}
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
                        onChange={(e) => handleInputChange(e, "update")}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={updateForm.status}
                      onChange={(e) => handleInputChange(e, "update")}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
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