import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getAllSchedule,
  addSchedule,
  updateSchedule,
  deleteSchedule,
} from "../services/SchedulesService";
import { getAllRoute } from "../services/RouteService";
import { getAllVehical } from "../services/VehicalService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MngSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [formData, setFormData] = useState({
    routeId: "",
    departureTime: new Date(),
    arrivalTime: new Date(),
    price: "",
    vehicleId: "",
  });

  useEffect(() => {
    fetchSchedules();
    fetchRoutes();
    fetchVehicles();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await getAllSchedule();
      setSchedules(response);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      toast.error("Failed to fetch schedules.", { autoClose: 2000 });
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await getAllRoute();
      setRoutes(response.data);
    } catch (error) {
      console.error("Error fetching routes:", error);
      toast.error("Failed to fetch routes.", { autoClose: 2000 });
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await getAllVehical();
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to fetch vehicles.", { autoClose: 2000 });
    }
  };

  const handleShowModal = (schedule = null) => {
    if (schedule) {
      setFormData({
        routeId: schedule.route.routeId,
        departureTime: new Date(schedule.departureTime),
        arrivalTime: new Date(schedule.arrivalTime),
        price: schedule.price,
        vehicleId: schedule.vehicle.vehicleId,
      });
      setSelectedSchedule(schedule);
    } else {
      setFormData({
        routeId: "",
        departureTime: new Date(),
        arrivalTime: new Date(),
        price: "",
        vehicleId: "",
      });
      setSelectedSchedule(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSchedule(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date, name) => {
    setFormData({ ...formData, [name]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const scheduleData = {
      ...formData,
      departureTime: formData.departureTime.toISOString(),
      arrivalTime: formData.arrivalTime.toISOString(),
    };

    try {
      if (selectedSchedule) {
        await updateSchedule(selectedSchedule.scheduleId, scheduleData);
        toast.success("Schedule updated successfully!", { autoClose: 2000 });
      } else {
        await addSchedule(scheduleData);
        toast.success("Schedule added successfully!", { autoClose: 2000 });
      }
      fetchSchedules();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Failed to save schedule.", { autoClose: 2000 });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await deleteSchedule(id);
        toast.success("Schedule deleted successfully!", { autoClose: 2000 });
        fetchSchedules();
      } catch (error) {
        console.error("Error deleting schedule:", error);
        toast.error("Failed to delete schedule.", { autoClose: 2000 });
      }
    }
  };

  return (
    <div>
      <h2>Schedule Management</h2>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => handleShowModal()}
      >
        <FontAwesomeIcon icon={faPlus} /> Add New Schedule
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Route</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Price (VND)</th>
            <th>Vehicle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.scheduleId}>
              <td>{schedule.scheduleId}</td>
              <td>
                {schedule.route.startLocation} - {schedule.route.endLocation}
              </td>
              <td>{new Date(schedule.departureTime).toLocaleString()}</td>
              <td>{new Date(schedule.arrivalTime).toLocaleString()}</td>
              <td>{schedule.price}</td>
              <td>{schedule.vehicle.vehicleNumber}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(schedule)}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(schedule.scheduleId)}
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedSchedule ? "Edit Schedule" : "Add New Schedule"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Route
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  as="select"
                  name="routeId"
                  value={formData.routeId}
                  onChange={handleInputChange}
                >
                  <option value="">Select a route</option>
                  {routes.map((route) => (
                    <option key={route.routeId} value={route.routeId}>
                      {route.startLocation} - {route.endLocation}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Departure Time
              </Form.Label>
              <Col sm={9}>
                <DatePicker
                  selected={formData.departureTime}
                  onChange={(date) => handleDateChange(date, "departureTime")}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Arrival Time
              </Form.Label>
              <Col sm={9}>
                <DatePicker
                  selected={formData.arrivalTime}
                  onChange={(date) => handleDateChange(date, "arrivalTime")}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Price
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={3}>
                Vehicle
              </Form.Label>
              <Col sm={9}>
                <Form.Control
                  as="select"
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleInputChange}
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                      {vehicle.vehicleNumber}
                    </option>
                  ))}
                </Form.Control>
              </Col>
            </Form.Group>

            <Button variant="primary" type="submit">
              {selectedSchedule ? "Update" : "Add"} Schedule
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default MngSchedules;
