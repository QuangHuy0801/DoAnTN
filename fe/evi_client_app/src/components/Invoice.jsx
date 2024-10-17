import QRCode from "qrcode.react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookingById } from "../services/BookingService";

const Invoice = () => {
  const { index } = useParams();
  console.log(index);
  const [user] = useState(JSON.parse(sessionStorage.getItem("user")));
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await getBookingById(index);
        setBooking(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };

    fetchBooking();
  }, [index]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!booking) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ marginBottom: "50px", marginTop: "80px" }}>
      <div className="container" id="invoice">
        <div style={{ display: "flex" }}>
          <a
            href="/home"
            className="btn btn-primary"
            style={{ marginRight: "30px" }}
          >
            Back to Home
          </a>
          <button onClick={() => window.print()} className="btn btn-primary">
            Print this invoice
          </button>
        </div>

        {/* Header */}
        <div className="row">
          <div className="col-md-3">
            <p id="details"></p>
          </div>
          <div className="col-md-3">
            <div id="logo">
              <a href="/home">
                <img src="/img/logo.png" alt="" />
              </a>
            </div>
          </div>
          <div className="col-md-3">
            <p id="details">
              <strong>Booking ID: </strong>
              {booking.bookingId}
              <br />
              <strong>Issued: </strong>
              {new Date(booking.bookingDate).toLocaleDateString()}
              <br />
            </p>
          </div>
        </div>

        {/* Client & Supplier */}
        <div className="row">
          <div className="col-md-12">
            <h2>Booking Invoice</h2>
          </div>
          <div className="col-md-6">
            <strong className="margin-bottom-5">Service Provider</strong>
            <p>
              EVI App
              <br />
              97 Man Thiện, P. Tăng Nhơn Phú A<br />
              Quận 9 , TP. HCM
              <br />
            </p>
          </div>
          <div className="col-md-6">
            <strong className="margin-bottom-5">Customer</strong>
            <p>
              {booking.passengerName} <br />
              Phone: {booking.passengerPhone} <br />
              Email: {booking.passengerEmail} <br />
            </p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="row">
          <div className="col-md-12">
            <table className="table margin-top-20">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Pickup Station</td>
                  <td>{booking.pickupStation.stationName}</td>
                </tr>
                <tr>
                  <td>Dropoff Station</td>
                  <td>{booking.dropoffStation.stationName}</td>
                </tr>
                <tr>
                  <td>Schedule</td>
                  <td>
                    {new Date(booking.schedule.departureTime).toLocaleString()}{" "}
                    - {new Date(booking.schedule.arrivalTime).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td>Vehicle</td>
                  <td>
                    {booking.schedule.vehicle.vehicleNumber} (
                    {booking.schedule.vehicle.vehicleType})
                  </td>
                </tr>
                <tr>
                  <td>Distance</td>
                  <td>{booking.schedule.route.distance} km</td>
                </tr>
                <tr>
                  <td>Seats Booked</td>
                  <td>
                    {booking.bookingDetails
                      .map((detail) => detail.seat.seatNumber)
                      .join(", ")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="col-md-4 col-md-offset-8">
          <table className="table" id="totals">
            <tbody>
              <tr>
                <th>Price per Seat</th>
                <td>{booking.schedule.price.toLocaleString("en-US")} VNĐ</td>
              </tr>
              <tr>
                <th>Number of Seats</th>
                <td>{booking.bookingDetails.length}</td>
              </tr>
              <tr>
                <th>Total Due</th>
                <td>
                  {(
                    booking.schedule.price * booking.bookingDetails.length
                  ).toLocaleString("en-US")}{" "}
                  VNĐ
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* QR Code */}
        <div className="row">
          <div className="col-md-12">
            <h4>Booking QR Code</h4>
            {booking.qrCode && (
              <QRCode
                value={booking.qrCode}
                size={256}
                level={"H"}
                includeMargin={true}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="row">
          <div className="col-md-12">
            <ul id="footer">
              <li>
                <span>www.eviapp.com</span>
              </li>
              <li>info@eviapp.com</li>
              <li>1234567890</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
