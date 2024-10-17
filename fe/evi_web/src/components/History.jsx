import React, { useEffect, useState } from 'react';
import { listBooking, updateStatus } from '../services/BookingService';
import { ToastContainer, toast } from 'react-toastify';

const History = () => {
  const [user] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      if (user) {
        const response = await listBooking(user.id);
        setBookings(response.data);
        console.log(response.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) {
      return;
    }
    try {
      await updateStatus(bookingId, "Canceled");
      await fetchBookings();
      toast.success(`Booking cancellation successful`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error(`Booking cancellation failed`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error('Error cancelling booking:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container-fluid mt-5 mb-5" style={{ padding: '0 200px 100px 200px' }}>
      <ToastContainer />
      <div className="row">
        <div className="col-md-12">
          <h2>My Booking History</h2>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="/home">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page">My Profile</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="dashboard-list-box bookings with-icons mt-4 mx-auto">
            <h4>Bookings</h4>
            <ul className="list-group">
              {bookings.map((booking) => (
                <li key={booking.bookingId} className="list-group-item">
                  <i className="list-box-icon sl sl-icon-doc"></i>
                  <strong>Booking #{booking.bookingId}</strong>
                  <ul className="list-group">
                    <li>Passenger: {booking.passengerName}</li>
                    <li>Departure: {booking.pickupStation.stationName}</li>
                    <li>Destination: {booking.dropoffStation.stationName}</li>
                    <li className={booking.paymentMethod === 'Pay on Delivery' ? 'text-success' : 'text-primary'}>
                      Payment Method: {booking.paymentMethod}
                    </li>
                    <li>Date: {new Date(booking.bookingDate).toLocaleDateString()}</li>
                    <li>
                      <span className="text-dark">Status:</span>&nbsp;
                      <span className={
                        booking.status === 'Completed' ? 'text-success' :
                        booking.status === 'Pending' ? 'text-warning' :
                        booking.status === 'Delivering' ? 'text-info' :
                        booking.status === 'Canceled' ? 'text-danger' : ''
                      }>
                        {booking.status}
                      </span>
                    </li>
                  </ul>
                  <div className="float-right">
                    {(booking.status === 'Pending' || booking.status === 'Delivering') && (
                      <button 
                        className="btn btn-danger ml-3" 
                        onClick={() => handleCancelBooking(booking.bookingId)}>
                        Cancel Booking
                      </button>
                    )}
                    <a href={`/invoice/${booking.bookingId}`} className="btn btn-secondary ml-2">View Details</a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
