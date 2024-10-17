import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { FaBus, FaCalendarAlt, FaInfoCircle, FaMapMarkerAlt, FaMoneyBillAlt } from 'react-icons/fa';
import { PiSeatLight } from 'react-icons/pi';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../assets/style.css';
import { createTemporaryBooking, getScheduleById } from '../services/SchedulesService';

const Schedules = () => {
  const user = useRef(JSON.parse(sessionStorage.getItem('user')));
  const location = useLocation();
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [pickupStation, setPickupStation] = useState(null);
  const [dropoffStation, setDropoffStation] = useState(null);

  useEffect(() => {
    if (user.current !== null) {
      setCustomerInfo({
        name: user.current.user_Name || '',
        phone: user.current.phone_Number || '',
        email: user.current.email || ''
      });
    }
  }, []);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const idParams = new URLSearchParams(location.search);
        const id = idParams.get('id');
        const response = await getScheduleById(id);
        setSchedule(response.data);
      } catch (error) {
        setError('Failed to fetch schedule. Please try again later.');
      }
    };

    fetchSchedule();
  }, [location.search]);

  const handleCustomerInfoChange = (e) => {
    const { id, value } = e.target;
    setCustomerInfo(prevState => ({ ...prevState, [id]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.email || !pickupStation || !dropoffStation || selectedSeats.length === 0) {
      toast.error('Vui lòng điền đầy đủ thông tin và chọn ít nhất một ghế.');
      return;
    }

    try {
      const temporaryBookingData = {
        userId: user.current ? user.current.id : null,
        status: 'TEMPORARY',
        pickupStationId: pickupStation.value,
        dropoffStationId: dropoffStation.value,
        passengerName: customerInfo.name,
        passengerEmail: customerInfo.email,
        passengerPhone: customerInfo.phone,
        scheduleId: schedule.scheduleId,
        bookingDate: new Date(),
        selectedSeats: selectedSeats
      };
      const response = await createTemporaryBooking(temporaryBookingData);
      const bookingData = response.data;
      navigate('/checkout', { state: { bookingData } });
    } catch (error) {
      toast.error('Không thể tạo đặt vé tạm thời. Vui lòng thử lại.');
    }
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!schedule) return <div className="loader">Loading...</div>;

  const { route, departureTime, price, vehicle, bookings } = schedule;
  const bookedSeats = bookings.flatMap(booking => booking.bookingDetails.map(detail => detail.seat.seatNumber));

  const handleSeatSelect = (seats) => {
    setSelectedSeats(seats);
  };

  const stationOptions = route.routeStations.map(station => ({
    value: station.station.stationId,
    label: station.station.stationName,
    station: station.station,
    stopOrder: station.stopOrder
  }));

  const sortedStationOptions = route.routeStations
    .sort((a, b) => a.stopOrder - b.stopOrder)
    .map(station => ({
      value: station.station.stationId,
      label: station.station.stationName,
      station: station.station,
      stopOrder: station.stopOrder
    }));

  return (
    <div className="container">
      <ToastContainer />
      <div className="row justify-content-center">
        <div className="col-md-6">
          <TripInfo
            route={route}
            departureTime={departureTime}
            seatCount={vehicle.seats.length}
            price={price}
            selectedSeats={selectedSeats}
            pickUpPoint={pickupStation ? pickupStation.label : ''}
            dropOffPoint={dropoffStation ? dropoffStation.label : ''}
          />
          <CustomerInfoForm
            customerInfo={customerInfo}
            onCustomerInfoChange={handleCustomerInfoChange}
            onFormSubmit={handleFormSubmit}
            stationOptions={sortedStationOptions}
            pickupStation={pickupStation}
            setPickupStation={setPickupStation}
            dropoffStation={dropoffStation}
            setDropoffStation={setDropoffStation}
          />
        </div>
        <div className="col-md-6 d-flex flex-column">
          <div className="mb-4">
            <SeatSelection
              onSeatSelect={handleSeatSelect}
              price={price}
              bookedSeats={bookedSeats}
            />
          </div>
          <ImportantNotes />
        </div>
      </div>
    </div>
  );
};

const TripInfo = ({ route, departureTime, seatCount, price, selectedSeats, pickUpPoint, dropOffPoint }) => {
  const totalPrice = selectedSeats.length * price;
  const departureDate = new Date(departureTime).toLocaleDateString('vi-VN');
  const departureHour = new Date(departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">
          <FaBus className="mr-2" />
          Thông tin lượt đi
        </h5>
      </div>
      <div className="card-body">
        <InfoItem icon={FaMapMarkerAlt} text={`Tuyến xe: ${route.startLocation} → ${route.endLocation}`} />
        <InfoItem icon={FaCalendarAlt} text={`Ngày đi: ${departureDate}`} />
        <InfoItem icon={FaCalendarAlt} text={`Giờ đi: ${departureHour}`} />
        <InfoItem icon={FaMapMarkerAlt} text={`Điểm đón: ${pickUpPoint}`} />
        <InfoItem icon={FaMapMarkerAlt} text={`Điểm trả: ${dropOffPoint}`} />
        <InfoItem icon={FaMoneyBillAlt} text={`Số lượng ghế: ${seatCount}`} />
        {selectedSeats.length > 0 && (
          <InfoItem icon={FaInfoCircle} text={`Bạn đã chọn các ghế: ${selectedSeats.join(', ')}`} />
        )}
        <h4 type="text" className=" mb-3">Chi tiết giá</h4>
        <div className="d-flex justify-content-between">
          <span>Giá vé lượt đi: {(price).toLocaleString()} đ</span>
          <span>Phí thanh toán: 0đ</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Tổng tiền: {(totalPrice).toLocaleString()} đ</span>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, text }) => (
  <div className="d-flex align-items-center mb-3">
    <Icon className="mr-2" />
    <span>{text}</span>
  </div>
);

const SeatSelection = ({ onSeatSelect, price, bookedSeats }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  const handleSeatClick = (seat) => {
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats(prevSelectedSeats => {
      const isSelected = prevSelectedSeats.includes(seat);
      const updatedSeats = isSelected
        ? prevSelectedSeats.filter(s => s !== seat)
        : [...prevSelectedSeats, seat];
      onSeatSelect(updatedSeats);
      return updatedSeats;
    });
  };

  const generateSeatLayout = () => {
    const lowerDeckSeats = [
      ['a01', 'a02'], ['a03', 'a04'], ['a05', 'a06'], ['a07', 'a08'],
      ['a09', 'a10']
    ];

    const upperDeckSeats = [
      ['b01', 'b02'], ['b03', 'b04'], ['b05', 'b06'], ['b07', 'b08'],
      ['b09', 'b10']
    ];

    return { lowerDeckSeats, upperDeckSeats };
  };

  const { lowerDeckSeats, upperDeckSeats } = generateSeatLayout();

  const SeatRow = ({ seats }) => (
    <tr>
      {seats.map((seat, index) => (
        <td
          key={index}
          className={`seat-cell ${selectedSeats.includes(seat) ? 'selected' : ''} ${bookedSeats.includes(seat) ? 'booked' : ''}`}
          onClick={() => handleSeatClick(seat)}
        >
          <PiSeatLight className={selectedSeats.includes(seat) ? 'text-primary' : ''} />
          <div className="seat ml-2">{seat}</div>
        </td>
      ))}
    </tr>
  );

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <FaBus className="mr-2" />
          Chọn ghế
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-6">
            <h6>Tầng dưới</h6>
            <table className="table table-bordered">
              <tbody>
                {lowerDeckSeats.map((seats, index) => <SeatRow key={index} seats={seats} />)}
              </tbody>
            </table>
          </div>
          <div className="col-6">
            <h6>Tầng trên</h6>
            <table className="table table-bordered">
              <tbody>
                {upperDeckSeats.map((seats, index) => <SeatRow key={index} seats={seats} />)}
              </tbody>
            </table>
          </div>
        </div>
        {selectedSeats.length > 0 && (
          <div className="mt-3 alert alert-info">
            Bạn đã chọn các ghế: {selectedSeats.join(', ')} <br />
            Tổng tiền: {(selectedSeats.length * price).toLocaleString()} đ
          </div>
        )}
      </div>
    </div>
  );
};

const CustomerInfoForm = ({
  customerInfo,
  onCustomerInfoChange,
  onFormSubmit,
  stationOptions,
  pickupStation,
  setPickupStation,
  dropoffStation,
  setDropoffStation
}) => {
  const handlePickupStationChange = (option) => {
    setPickupStation(option);
    if (dropoffStation && dropoffStation.stopOrder <= option.stopOrder) {
      setDropoffStation(null);
    }
  };

  const filteredDropoffStations = stationOptions.filter(option => 
    !pickupStation || option.stopOrder > pickupStation.stopOrder
  );

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">
          <FaInfoCircle className="mr-2" />
          Thông tin khách hàng
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={onFormSubmit}>
          <div className="form-group">
            <label htmlFor="pickupStation">Điểm đón:</label>
            <Select
              id="pickupStation"
              options={stationOptions}
              value={pickupStation}
              onChange={handlePickupStationChange}
              placeholder="Chọn điểm đón"
              isClearable
            />
          </div>
          <div className="form-group">
            <label htmlFor="dropoffStation">Điểm trả:</label>
            <Select
              id="dropoffStation"
              options={filteredDropoffStations}
              value={dropoffStation}
              onChange={option => setDropoffStation(option)}
              placeholder="Chọn điểm trả"
              isClearable
              isDisabled={!pickupStation}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Họ và tên:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={customerInfo.name}
              onChange={onCustomerInfoChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại:</label>
            <input
              type="text"
              className="form-control"
              id="phone"
              value={customerInfo.phone}
              onChange={onCustomerInfoChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={customerInfo.email}
              onChange={onCustomerInfoChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Đặt vé</button>
        </form>
      </div>
    </div>
  );
};

const ImportantNotes = () => (
  <div className="card">
    <div className="card-header">
      <h5 className="mb-0">
        <FaInfoCircle className="mr-2" />
        Lưu ý quan trọng
      </h5>
    </div>
    <div className="card-body">
      <p>1. Quý khách vui lòng có mặt tại điểm đón trước giờ khởi hành ít nhất 15 phút.</p>
      <p>2. Vé đã mua không thể hoàn trả sau 24h trước giờ khởi hành.</p>
      <p>3. Hành lý xách tay không quá 7kg và không chứa vật phẩm nguy hiểm.</p>
    </div>
  </div>
);

export default Schedules;
