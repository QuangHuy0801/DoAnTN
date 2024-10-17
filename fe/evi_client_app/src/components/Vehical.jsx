import { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faChair,
} from "@fortawesome/free-solid-svg-icons";
import {
  getAllVehical,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  getSeatsByVehicleId,
  updateSeatAvailability,
} from "../services/VehicalService";
import "react-toastify/dist/ReactToastify.css";
import "../assets/button.css";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [vehicleData, setVehicleData] = useState({
    vehicleId: null,
    vehicleNumber: "",
    vehicleType: "Giường",
  });

  const [showSeatModal, setShowSeatModal] = useState(false);
  const [seats, setSeats] = useState([]);
  const [currentVehicleId, setCurrentVehicleId] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await getAllVehical();
      setVehicles(response.data);
    } catch (error) {
      toast.error(
        `Error fetching vehicles: ${
          error.response?.data?.message || error.message
        }`,
        { autoClose: 2000 }
      );
    }
  };

  const fetchSeats = async (vehicleId) => {
    try {
      const response = await getSeatsByVehicleId(vehicleId);
      setSeats(response.data);
    } catch (error) {
      toast.error(
        `Error fetching seats: ${
          error.response?.data?.message || error.message
        }`,
        { autoClose: 2000 }
      );
    }
  };

  const handleShow = (vehicle = null) => {
    if (vehicle) {
      setEditMode(true);
      setVehicleData(vehicle);
    } else {
      setEditMode(false);
      setVehicleData({
        vehicleId: null,
        vehicleNumber: "",
        vehicleType: "Giường",
      });
    }
    setShow(true);
  };

  const handleShowSeatModal = (vehicleId) => {
    setCurrentVehicleId(vehicleId);
    fetchSeats(vehicleId);
    setShowSeatModal(true);
  };

  const handleClose = () => {
    setShow(false);
    setShowSeatModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData({ ...vehicleData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editMode) {
        await updateVehicle({ ...vehicleData, totalSeats: 20 });
        setVehicles(
          vehicles.map((v) =>
            v.vehicleId === vehicleData.vehicleId
              ? { ...vehicleData, totalSeats: 20 }
              : v
          )
        );
        toast.success("Vehicle updated successfully!", { autoClose: 2000 });
      } else {
        const response = await addVehicle({ ...vehicleData, totalSeats: 20 });
        setVehicles([...vehicles, response.data]);
        toast.success("Vehicle added successfully!", { autoClose: 2000 });
      }
      handleClose();
    } catch (error) {
      toast.error("Error saving vehicle: " + error.message, {
        autoClose: 2000,
      });
    }
  };

  const handleDelete = async (vehicleId) => {
    try {
      await deleteVehicle(vehicleId);
      setVehicles(vehicles.filter((v) => v.vehicleId !== vehicleId));
      toast.success("Vehicle deleted successfully!", { autoClose: 2000 });
    } catch (error) {
      toast.error("Error deleting vehicle: " + error.message, {
        autoClose: 2000,
      });
    }
  };

  const toggleSeatAvailability = async (seatId, currentAvailability) => {
    try {
      await updateSeatAvailability(seatId, !currentAvailability);
      setSeats(
        seats.map((seat) =>
          seat.seatId === seatId
            ? { ...seat, available: !seat.available }
            : seat
        )
      );
      toast.success("Seat availability updated successfully!", {
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Error updating seat availability: " + error.message, {
        autoClose: 2000,
      });
    }
  };

  const classifySeats = (seats) => {
    const lowerDeck = seats.filter((seat) => seat.seatNumber.startsWith("a"));
    const upperDeck = seats.filter((seat) => seat.seatNumber.startsWith("b"));

    const sortedLowerDeck = lowerDeck.sort((a, b) =>
      a.seatNumber.localeCompare(b.seatNumber)
    );
    const sortedUpperDeck = upperDeck.sort((a, b) =>
      a.seatNumber.localeCompare(b.seatNumber)
    );

    const divideDeckIntoRows = (deck) => {
      const leftRow = deck.filter((_, index) => index % 2 === 0);
      const rightRow = deck.filter((_, index) => index % 2 !== 0);
      return { leftRow, rightRow };
    };

    return {
      lowerDeck: divideDeckIntoRows(sortedLowerDeck),
      upperDeck: divideDeckIntoRows(sortedUpperDeck),
    };
  };

  const { lowerDeck, upperDeck } = classifySeats(seats);

  return (
    <div>
      <ToastContainer />
      <h2>Vehicles</h2>
      <Button
        className="button-spacing"
        variant="primary"
        onClick={() => handleShow()}
      >
        <FontAwesomeIcon icon={faPlus} /> Add Vehicle
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Vehicle Number</th>
            <th>Vehicle Type</th>
            <th>Total Seats</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.vehicleId}>
              <td>{vehicle.vehicleId}</td>
              <td>{vehicle.vehicleNumber}</td>
              <td>{vehicle.vehicleType}</td>
              <td>{vehicle.totalSeats}</td>
              <td>
                <Button
                  className="button-spacing"
                  variant="warning"
                  onClick={() => handleShow(vehicle)}
                >
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </Button>
                <Button
                  className="button-spacing"
                  variant="danger"
                  onClick={() => handleDelete(vehicle.vehicleId)}
                >
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </Button>
                <Button
                  className="button-spacing"
                  variant="info"
                  onClick={() => handleShowSeatModal(vehicle.vehicleId)}
                >
                  <FontAwesomeIcon icon={faChair} /> Manage Seats
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Vehicle" : "Add Vehicle"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="vehicleNumber">
              <Form.Label>Vehicle Number</Form.Label>
              <Form.Control
                type="text"
                name="vehicleNumber"
                value={vehicleData.vehicleNumber}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="vehicleType">
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Control
                as="select"
                name="vehicleType"
                value={vehicleData.vehicleType}
                onChange={handleChange}
              >
                <option value="Giường">Giường</option>
                <option value="Ghế">Ghế</option>
              </Form.Control>
            </Form.Group>
            {/* Remove Total Seats field */}
            <Form.Group controlId="totalSeats">
              <Form.Label>Total Seats</Form.Label>
              <Form.Control type="text" value="20" readOnly />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editMode ? "Update" : "Add"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSeatModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Seats</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Lower Deck</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Left</th>
                <th>Right</th>
              </tr>
            </thead>
            <tbody>
              {lowerDeck.leftRow.map((seat, index) => (
                <tr key={seat.seatId}>
                  <td>
                    {seat.seatNumber} -
                    <Button
                      className="button-spacing"
                      variant={seat.available ? "success" : "danger"}
                      size="sm"
                      onClick={() =>
                        toggleSeatAvailability(seat.seatId, seat.available)
                      }
                    >
                      {seat.available ? "Available" : "Unavailable"}
                    </Button>
                  </td>
                  <td>
                    {lowerDeck.rightRow[index] && (
                      <>
                        {lowerDeck.rightRow[index].seatNumber} -
                        <Button
                          className="button-spacing"
                          variant={
                            lowerDeck.rightRow[index].available
                              ? "success"
                              : "danger"
                          }
                          size="sm"
                          onClick={() =>
                            toggleSeatAvailability(
                              lowerDeck.rightRow[index].seatId,
                              lowerDeck.rightRow[index].available
                            )
                          }
                        >
                          {lowerDeck.rightRow[index].available
                            ? "Available"
                            : "Unavailable"}
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h5>Upper Deck</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Left</th>
                <th>Right</th>
              </tr>
            </thead>
            <tbody>
              {upperDeck.leftRow.map((seat, index) => (
                <tr key={seat.seatId}>
                  <td>
                    {seat.seatNumber} -
                    <Button
                      className="button-spacing"
                      variant={seat.available ? "success" : "danger"}
                      size="sm"
                      onClick={() =>
                        toggleSeatAvailability(seat.seatId, seat.available)
                      }
                    >
                      {seat.available ? "Available" : "Unavailable"}
                    </Button>
                  </td>
                  <td>
                    {upperDeck.rightRow[index] && (
                      <>
                        {upperDeck.rightRow[index].seatNumber} -
                        <Button
                          className="button-spacing"
                          variant={
                            upperDeck.rightRow[index].available
                              ? "success"
                              : "danger"
                          }
                          size="sm"
                          onClick={() =>
                            toggleSeatAvailability(
                              upperDeck.rightRow[index].seatId,
                              upperDeck.rightRow[index].available
                            )
                          }
                        >
                          {upperDeck.rightRow[index].available
                            ? "Available"
                            : "Unavailable"}
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Vehicles;
