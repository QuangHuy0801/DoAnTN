import axios from 'axios';
const BASE_URL = "http://localhost:8080";

const GETALLROUTE = "/getAllRoutes";
export const getAllRoute = () => {
    return axios.get(`${BASE_URL}${GETALLROUTE}`);
};
const ADDROUTE = "/addRoutes";
export const addRoute = (formData) => {
    const params = new URLSearchParams();
    params.append('startLocation', formData.startLocation);
    params.append('endLocation',formData.endLocation);
    params.append('distance',formData.distance);
    return axios.post(`${BASE_URL}${ADDROUTE}`, params);
};

const UPDATEROUTE = "/updateRoutes";

export const updateRoute = (routeId, formData) => {
  const params = new URLSearchParams();
  params.append('routeId', routeId);
  params.append('startLocation', formData.startLocation);
  params.append('endLocation', formData.endLocation);
  params.append('distance', formData.distance);
  params.append('stations', JSON.stringify(formData.routeStations)); 
  return axios.put(`${BASE_URL}${UPDATEROUTE}`, params);
};


export const deleteRoute = (routeId) => {
    return axios.delete(`${BASE_URL}/deleteRoute/${routeId}`);
};


const GETALLSTATION = "/getAllStations";
export const getAllStations = () => {
    return axios.get(`${BASE_URL}${GETALLSTATION}`);
};



// export const getStationsByRoute = async (routeId) => {
//     return await axios.get(`/api/routes/${routeId}/stations`);
//   };
  
//   export const addStation = async (routeId, stationData) => {
//     return await axios.post(`/api/routes/${routeId}/stations`, stationData);
//   };
  
//   export const updateStation = async (routeId, stationId, stationData) => {
//     return await axios.put(`/api/routes/${routeId}/stations/${stationId}`, stationData);
//   };
  
//   export const deleteStation = async (routeId, stationId) => {
//     return await axios.delete(`/api/routes/${routeId}/stations/${stationId}`);
//   };
