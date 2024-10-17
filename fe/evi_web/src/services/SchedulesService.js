import axios from "axios";
const BASE_URL = "http://localhost:8080";
const SEARCH_SCHEDULES_ENDPOINT = "/searchschedules";
export const searchSchedules = async (fromProvinceId, toProvinceId, departureDate) => {
    try {
      const response = await axios.get(`${BASE_URL}${SEARCH_SCHEDULES_ENDPOINT}`, {
        params: {
          fromProvinceId: fromProvinceId,
          toProvinceId: toProvinceId,
          departureDate: departureDate
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error searching schedules:", error);
      return [];
    }
  };
  const GET_ALL = "/getallschedules";
  export const getAllSchedule = async () => {
    try {
      const response = await axios.get(`${BASE_URL}${GET_ALL}`);
      return response.data;
    } catch (error) {
      console.error("Error searching schedules:", error);
      return [];
    }
  };

  const GETSCHEDULEBYID = "/getschedulesbyid";
  export const getScheduleById = (id) => axios.get(`${BASE_URL}${GETSCHEDULEBYID}/${id}`);
  


  export const createTemporaryBooking = (bookingData) => {
    const params = new URLSearchParams();
    params.append('userId', bookingData.userId || '');
    params.append('pickupStationId', bookingData.pickupStationId);
    params.append('dropoffStationId', bookingData.dropoffStationId);
    params.append('passengerName', bookingData.passengerName);
    params.append('passengerEmail', bookingData.passengerEmail);
    params.append('passengerPhone', bookingData.passengerPhone);
    params.append('scheduleId', bookingData.scheduleId);
    params.append('selectedSeats', JSON.stringify(bookingData.selectedSeats));
    
    return axios.post(`${BASE_URL}/temporary`, params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};






export const getAllSchedules = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response;
  } catch (error) {
    console.error('Error fetching schedules', error);
    throw error;
  }
};

const ADDSCHEDULE = "/addSchedule";
export const addSchedule = (scheduleData) => {
  const params = new URLSearchParams();
  params.append('routeId', scheduleData.routeId);
  params.append('price', scheduleData.price);
  params.append('departureTime', scheduleData.departureTime);
  params.append('arrivalTime', scheduleData.arrivalTime);
  params.append('vehicleId', scheduleData.vehicleId);
console.log(scheduleData);
    return axios.post(`${BASE_URL}${ADDSCHEDULE}`, params);
};

const UPDATESCHEDULE = "/updateSchedule";
export const updateSchedule = (scheduleId,scheduleData) => {
  const params = new URLSearchParams();
  params.append('scheduleId', scheduleId);
  params.append('routeId', scheduleData.routeId);
  params.append('price', scheduleData.price);
  params.append('departureTime', scheduleData.departureTime);
  params.append('arrivalTime', scheduleData.arrivalTime);
  params.append('vehicleId', scheduleData.vehicleId);
console.log(scheduleData);
    return axios.put(`${BASE_URL}${UPDATESCHEDULE}`, params);
};

export const deleteSchedule = (scheduleId) => {
  return axios.delete(`${BASE_URL}/deleteSchedule/${scheduleId}`);
};
