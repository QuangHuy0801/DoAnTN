import { useState, useEffect } from 'react';
import { Button, Form, Table, Modal } from 'react-bootstrap';
import { getAllRoute, addRoute, updateRoute, deleteRoute, getAllStations } from '../services/RouteService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [formData, setFormData] = useState({
    startLocation: '',
    endLocation: '',
    distance: '',
  });
  const [stations, setStations] = useState([]);
  const [allStations, setAllStations] = useState([]);

  useEffect(() => {
    fetchRoutes();
    fetchAllStations();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await getAllRoute();
      setRoutes(response.data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const fetchAllStations = async () => {
    try {
      const response = await getAllStations();
      setAllStations(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error);
    }
  };

  const handleAddRoute = async () => {
    try {
      await addRoute(formData);
      fetchRoutes();
      handleCloseModal();
      toast.success('Route added successfully!', { autoClose: 2000 });
    } catch (error) {
      console.error('Error adding route:', error);
      toast.error('Failed to add route.', { autoClose: 2000 });
    }
  };

  const handleEditRoute = async () => {
    try {
      const formattedStations = stations.map(station => ({
        id: station.id || 0,
        station: {
          stationId: station.stationId || 0,
          stationName: station.stationName,
          stationAddress: station.stationAddress
        },
        stopOrder: station.stopOrder
      }));

      const updatedRouteData = {
        ...formData,
        routeStations: formattedStations
      };
      await updateRoute(selectedRoute.routeId, updatedRouteData);
      fetchRoutes();
      handleCloseModal();
      toast.success('Route updated successfully!', { autoClose: 2000 });
    } catch (error) {
      console.error('Error editing route:', error);
      toast.error('Failed to update route.', { autoClose: 2000 });
    }
  };

  const handleDeleteRoute = async (id) => {
    try {
      await deleteRoute(id);
      fetchRoutes();
      toast.success('Route deleted successfully!', { autoClose: 2000 });
    } catch (error) {
      console.error('Error deleting route:', error);
      toast.error('Failed to delete route.', { autoClose: 2000 });
    }
  };

  const handleShowModal = (route = null) => {
    setSelectedRoute(route);
    setFormData(route ? {
      startLocation: route.startLocation,
      endLocation: route.endLocation,
      distance: route.distance
    } : {
      startLocation: '',
      endLocation: '',
      distance: ''
    });
    setStations(route ? route.routeStations.map(rs => ({
      id: rs.id,
      stationId: rs.station.stationId,
      stationName: rs.station.stationName,
      stationAddress: rs.station.stationAddress,
      stopOrder: rs.stopOrder
    })) : []);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoute(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddStation = () => {
    setStations([...stations, {
      id: '',
      stationId: '',
      stationName: '',
      stationAddress: '',
      stopOrder: stations.length + 1
    }]);
  };

  const handleDeleteStation = (index) => {
    const updatedStations = stations.filter((_, i) => i !== index);
    updatedStations.forEach((station, i) => {
      station.stopOrder = i + 1;
    });
    setStations(updatedStations);
  };

  const handleStationChange = (index, e) => {
    const updatedStations = [...stations];
    const selectedStation = allStations.find(station => station.stationId === Number(e.target.value));
    if (selectedStation) {
      updatedStations[index] = {
        ...updatedStations[index],
        stationId: selectedStation.stationId,
        stationName: selectedStation.stationName,
        stationAddress: selectedStation.stationAddress
      };
    }
    setStations(updatedStations);
  };

  const handleMoveStationUp = (index) => {
    if (index > 0) {
      const updatedStations = [...stations];
      [updatedStations[index - 1], updatedStations[index]] = [updatedStations[index], updatedStations[index - 1]];
      updatedStations.forEach((station, i) => {
        station.stopOrder = i + 1;
      });
      setStations(updatedStations);
    }
  };

  const handleMoveStationDown = (index) => {
    if (index < stations.length - 1) {
      const updatedStations = [...stations];
      [updatedStations[index], updatedStations[index + 1]] = [updatedStations[index + 1], updatedStations[index]];
      updatedStations.forEach((station, i) => {
        station.stopOrder = i + 1;
      });
      setStations(updatedStations);
    }
  };

  return (
    <div>
      <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>
        <FontAwesomeIcon icon={faPlus} /> Add Route
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Start Location</th>
            <th>End Location</th>
            <th>Distance (km)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.routeId}>
              <td>{route.routeId}</td>
              <td>{route.startLocation}</td>
              <td>{route.endLocation}</td>
              <td>{route.distance}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowModal(route)}>
                  <FontAwesomeIcon icon={faEdit} /> Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteRoute(route.routeId)}>
                  <FontAwesomeIcon icon={faTrash} /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedRoute ? 'Edit Route' : 'Add Route'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formStartLocation">
              <Form.Label>Start Location</Form.Label>
              <Form.Control
                type="text"
                name="startLocation"
                value={formData.startLocation}
                onChange={handleChange}
                placeholder="Enter start location"
              />
            </Form.Group>
            <Form.Group controlId="formEndLocation">
              <Form.Label>End Location</Form.Label>
              <Form.Control
                type="text"
                name="endLocation"
                value={formData.endLocation}
                onChange={handleChange}
                placeholder="Enter end location"
              />
            </Form.Group>
            <Form.Group controlId="formDistance">
              <Form.Label>Distance</Form.Label>
              <Form.Control
                type="number"
                name="distance"
                value={formData.distance}
                onChange={handleChange}
                placeholder="Enter distance"
              />
            </Form.Group>

            {selectedRoute && (
              <>
                <hr />
                <h5>Stations</h5>
                {stations.map((station, index) => (
                  <div key={index} className="mb-3 p-3 border rounded position-relative">
                    <Form.Group controlId={`formStation${index}`} className="mb-2">
                      <Form.Label>Select Station</Form.Label>
                      <Form.Select
                        name="stationId"
                        value={station.stationId}
                        onChange={(e) => handleStationChange(index, e)}
                      >
                        <option value="">Select a station</option>
                        {allStations.map((s) => (
                          <option key={s.stationId} value={s.stationId}>
                            {s.stationName} - {s.stationAddress}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <div className="mt-2 d-flex justify-content-end">
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={() => handleMoveStationUp(index)} 
                        disabled={index === 0}
                        className="me-2"
                      >
                        <FontAwesomeIcon icon={faArrowUp} /> Move Up
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        onClick={() => handleMoveStationDown(index)} 
                        disabled={index === stations.length - 1}
                        className="me-2"
                      >
                        <FontAwesomeIcon icon={faArrowDown} /> Move Down
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        onClick={() => handleDeleteStation(index)}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="primary" onClick={handleAddStation}>
                  <FontAwesomeIcon icon={faPlus} /> Add Station
                </Button>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button
            variant="primary"
            onClick={selectedRoute ? handleEditRoute : handleAddRoute}
          >
            {selectedRoute ? 'Save Changes' : 'Add Route'}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default RouteManagement;
