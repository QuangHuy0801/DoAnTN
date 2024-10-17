
import axios from 'axios';

const BASE_URL = "http://localhost:8080";


const GETBOOKINGBYID = "/getBookingById";
export const getBookingById = (id) => {
    return axios.get(`${BASE_URL}${GETBOOKINGBYID}/${id}`);
};

const CHECKSTATUS = "/checkstatus";
export const checkStatus = (bookingId) => {
    return axios.get(`${BASE_URL}${CHECKSTATUS}`,{
            params: { bookingId: bookingId }
    });
};

const LISTBOOKING = "/getBookingByUserId";
export const listBooking = (user_id) => {
    return axios.get(`${BASE_URL}${LISTBOOKING}`, {
        params: { user_id: user_id }
    });
};


const UPDATESTATUSBOOKING = "/getBookingsById";
export const updateStatus = (user_id) => {
    return axios.get(`${BASE_URL}${UPDATESTATUSBOOKING}`, {
        params: { user_id: user_id }
    });
};

const GETALLBOOKING = "/getAllBooking";
export const getAllBooking = () => {
    return axios.get(`${BASE_URL}${GETALLBOOKING}`);
};

const DELETETEMPORARY = "/deleteTemporary"
  export const deleteTemporaryBooking = (bookingId) => {
    return axios.delete(`${BASE_URL}${DELETETEMPORARY}/${bookingId}`);
};