import axios from 'axios';

const BASE_URL = "http://localhost:8080";
const BOOKINGS = "/bookings";

export const bookings = (bookingId,paymentMethod) => {
    const params = new URLSearchParams();
    params.append('bookingId', bookingId);
    params.append('paymentMethod',paymentMethod);
    return axios.post(`${BASE_URL}${BOOKINGS}`, params);
};
