import React, { useState } from "react";
import QRCode from "qrcode.react"; // Import QRCode from qrcode.react
import { getBookingById } from "../services/BookingService";

const TicketLookup = () => {
  const [bookingId, setBookingId] = useState("");
  const [passengerEmail, setPassengerEmail] = useState("");
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBooking(null);

    try {
      const response = await getBookingById(bookingId);
      const fetchedBooking = response.data;

      if (
        fetchedBooking.passengerEmail.toLowerCase() ===
        passengerEmail.toLowerCase()
      ) {
        setBooking(fetchedBooking);
      } else {
        setError(
          "No matching booking found. Please check your details and try again."
        );
      }
    } catch (error) {
      setError(
        "An error occurred while looking up your booking. Please try again."
      );
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="container mt-5">
      <h2>Ticket Lookup</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bookingId">Booking ID</label>
          <input
            type="text"
            className="form-control"
            id="bookingId"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="passengerEmail">Passenger Email</label>
          <input
            type="email"
            className="form-control"
            id="passengerEmail"
            value={passengerEmail}
            onChange={(e) => setPassengerEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Look up Ticket
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {booking && (
        <div className="mt-4">
          <h3>Booking Details</h3>
          <table className="table">
            <tbody>
              <tr>
                <th>Booking ID</th>
                <td>{booking.bookingId}</td>
              </tr>
              <tr>
                <th>Passenger Name</th>
                <td>{booking.passengerName}</td>
              </tr>
              <tr>
                <th>Pickup Station</th>
                <td>{booking.pickupStation.stationName}</td>
              </tr>
              <tr>
                <th>Dropoff Station</th>
                <td>{booking.dropoffStation.stationName}</td>
              </tr>
              <tr>
                <th>Departure Time</th>
                <td>{formatDate(booking.schedule.departureTime)}</td>
              </tr>
              <tr>
                <th>Arrival Time</th>
                <td>{formatDate(booking.schedule.arrivalTime)}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>{booking.status}</td>
              </tr>
              <tr>
                <th>QR Code</th>
                <td>
                  {booking.qrCode && (
                    <QRCode value={booking.qrCode} size={150} />
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TicketLookup;
