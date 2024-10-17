import axios from 'axios';
const BASE_URL = "http://localhost:8080";

const GETALLVEHICAL = "/getAllVehical";
export const getAllVehical = () => {
    return axios.get(`${BASE_URL}${GETALLVEHICAL}`);
};


const ADDVEHICLE = "/addVehicle";
export const addVehicle = (vehicleData) => {
    const params = new URLSearchParams();
    params.append('vehicleNumber', vehicleData.vehicleNumber);
    params.append('vehicleType',vehicleData.vehicleType);
    params.append('totalSeats',vehicleData.totalSeats);
    return axios.post(`${BASE_URL}${ADDVEHICLE}`, params);
};
const UPDATEVEHICLE = "/updateVehicle";
export const updateVehicle = (vehicleData) => {
    const params = new URLSearchParams();
    params.append('vehicleId', vehicleData.vehicleId);
    params.append('vehicleNumber', vehicleData.vehicleNumber);
    params.append('vehicleType',vehicleData.vehicleType);
    params.append('totalSeats',vehicleData.totalSeats);
    return axios.put(`${BASE_URL}${UPDATEVEHICLE}`, params);
};

export const deleteVehicle = (vehicleId) => {
    return axios.delete(`${BASE_URL}/deleteVehicle/${vehicleId}`);
};


const GETSEATS = "/getSeatsByVehicleId";
export const getSeatsByVehicleId = (vehicleId) => {
    return axios.get(`${BASE_URL}${GETSEATS}/${vehicleId}`);
};


const UPDATEAVAILABILITY = "/availability";
export const updateSeatAvailability = (seatId, isAvailable) => {
    const params = new URLSearchParams();
    params.append('seatId', seatId);
    params.append('isAvailable', isAvailable);
    return axios.put(`${BASE_URL}${UPDATEAVAILABILITY}`, params);
};
