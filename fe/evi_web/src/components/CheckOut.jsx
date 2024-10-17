import QRCode from 'qrcode.react';
import { useCallback, useEffect, useState } from 'react';
import { FaBus, FaCalendarAlt, FaClock, FaEnvelope, FaInfoCircle, FaMapMarkerAlt, FaMobileAlt, FaMoneyBillAlt, FaPhone, FaUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/style.css';
import { checkStatus, deleteTemporaryBooking } from '../services/BookingService';
import { bookings } from '../services/CheckOutService';

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
        <InfoItem icon={FaUser} text={`Số lượng ghế: ${seatCount}`} />
        {selectedSeats.length > 0 && (
          <InfoItem icon={FaInfoCircle} text={`Bạn đã chọn các ghế: ${selectedSeats.join(', ')}`} />
        )}
        <h4 className="mt-3">Chi tiết giá</h4>
        <div className="d-flex justify-content-between">
          <span>Giá vé lượt đi: {price.toLocaleString('vi-VN')} đ</span>
          <span>Phí thanh toán: 0 đ</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Tổng tiền: {totalPrice.toLocaleString('vi-VN')} đ</span>
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

const PaymentMethod = ({ selectedPaymentMethod, onPaymentMethodChange, onPayNow }) => {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">
          <FaMoneyBillAlt className="mr-2" />
          Chọn phương thức thanh toán
        </h5>
      </div>
      <div className="card-body">
        {['momo', 'vnpay', 'paypal', 'Thanh toán Khi lên xe'].map(method => (
          <div className="form-check" key={method}>
            <input
              type="radio"
              className="form-check-input"
              id={method}
              name="paymentMethod"
              value={method}
              checked={selectedPaymentMethod === method}
              onChange={onPaymentMethodChange}
            />
            <label className="form-check-label" htmlFor={method}>{method.charAt(0).toUpperCase() + method.slice(1)}</label>
          </div>
        ))}
        <button className="btn btn-primary mt-3" onClick={onPayNow}>
          Thanh toán ngay
        </button>
      </div>
    </div>
  );
};

const TotalPayment = ({ selectedPaymentMethod, paymentUrl, timeRemaining, formatTime }) => {
  return (
    <div className="card mt-4">
      <div className="card-header">
        <h5 className="mb-0">
          <FaClock className="mr-2" />
          Thời gian thanh toán
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <p>
            <FaClock className="mr-2" />
            Thời gian giữ chỗ còn lại: {formatTime(timeRemaining)}
          </p>
        </div>
        {selectedPaymentMethod === 'momo' && paymentUrl && (
          <div className="row justify-content-center">
            <div className="card-body text-center">
              <div style={{ position: 'relative' }}>
                <QRCode value={paymentUrl} size={200} />
                <img
                  src="/img/icon/momo.png"
                  alt="Logo"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '30px',
                    height: '30px',
                  }}
                />
              </div>
              <h3 className="mt-4">
                <FaMobileAlt className="mr-2" />
                Hướng dẫn thanh toán bằng Momo
              </h3>
              <ol className="text-left">
                <li>Mở ứng dụng Momo trên điện thoại</li>
                <li>Dùng biểu tượng &#128247; để quét mã QR</li>
                <li>Quét mã ở trang này và thanh toán</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


const CustomerInfoForm = ({ customerInfo }) => {
  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="mb-0">
          <FaInfoCircle className="mr-2" />
          Thông tin khách hàng
        </h5>
      </div>
      <div className="card-body">
        <div className="form-group d-flex align-items-center mb-3">
          <FaUser className="mr-2" />
          <span>{customerInfo.name}</span>
        </div>
        <div className="form-group d-flex align-items-center mb-3">
          <FaPhone className="mr-2" />
          <span>{customerInfo.phone}</span>
        </div>
        <div className="form-group d-flex align-items-center mb-3">
          <FaEnvelope className="mr-2" />
          <span>{customerInfo.email}</span>
        </div>
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

const useBeforeUnload = (callback) => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
      callback();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [callback]);
};

const CheckOut = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentUrl, setPaymentUrl] = useState('');
  const { bookingData } = location.state || {};
  const [isLeaving, setIsLeaving] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('momo');
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600);

  const deleteTemporaryBookingCallback = useCallback(async () => {
    if (bookingData && bookingData.bookingId && isLeaving && !paymentSuccessful) {
      try {
        await deleteTemporaryBooking(bookingData.bookingId);
        console.log('Temporary booking deleted successfully');
      } catch (error) {
        console.error('Error deleting temporary booking:', error);
      }
    }
  }, [bookingData, isLeaving, paymentSuccessful]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000); // Cập nhật mỗi giây

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  useEffect(() => {
    return () => {
      setIsLeaving(true);
      deleteTemporaryBookingCallback();
    };
  }, [deleteTemporaryBookingCallback]);

  useBeforeUnload(() => {
    setIsLeaving(true);
    deleteTemporaryBookingCallback();
  });

  useEffect(() => {
    return () => {
      setIsLeaving(true);
      deleteTemporaryBookingCallback();
    };
  }, [location, deleteTemporaryBookingCallback]);

  if (!bookingData) {
    return <div className="alert alert-danger">No booking data available. Please go back and book again.</div>;
  }

  const { pickupStation, dropoffStation, passengerName, passengerEmail, passengerPhone, schedule, bookingDetails } = bookingData;
  const { route, departureTime, price } = schedule;

  let intervalId;

  const kiemTraTrangThaiThanhToan = async (bookingId) => {
    try {
      const response = await checkStatus(bookingId);
      if (response.data.status === 'PENDING') {
        setPaymentSuccessful(true);
        setIsLeaving(true);
        navigate('/payment-success');
        clearInterval(intervalId);
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái thanh toán:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handlePayNow = async () => {
    if (selectedPaymentMethod) {
      try {
        const response = await bookings(bookingData.bookingId, selectedPaymentMethod);
        const paymentCode = response.data.code;
        if (paymentCode === 'COD') {
          setPaymentSuccessful(true);
          setIsLeaving(true);
          navigate('/payment-success');
        } else if (selectedPaymentMethod === 'vnpay') {
          window.open(paymentCode, '_blank');
          intervalId = setInterval(() => kiemTraTrangThaiThanhToan(bookingData.bookingId), 5000);
        } else if (selectedPaymentMethod === 'paypal') {
          window.open(paymentCode, '_blank');
          intervalId = setInterval(() => kiemTraTrangThaiThanhToan(bookingData.bookingId), 5000);
        } else if (selectedPaymentMethod === 'momo') {
          setPaymentUrl(paymentCode);
          intervalId = setInterval(() => kiemTraTrangThaiThanhToan(bookingData.bookingId), 5000);
        }
      } catch (error) {
        console.error('Error creating booking and getting payment URL:', error);
      }
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <TripInfo
            route={route}
            departureTime={departureTime}
            seatCount={bookingDetails.length}
            price={price}
            selectedSeats={bookingDetails.map(detail => detail.seat.seatNumber)}
            pickUpPoint={pickupStation.stationName}
            dropOffPoint={dropoffStation.stationName}
          />
          <CustomerInfoForm
            customerInfo={{
              name: passengerName,
              phone: passengerPhone,
              email: passengerEmail
            }}
          />
        </div>
        <div className="col-md-6">
          <PaymentMethod
            selectedPaymentMethod={selectedPaymentMethod}
            onPaymentMethodChange={handlePaymentMethodChange}
            onPayNow={handlePayNow}
          />
          <TotalPayment
            selectedPaymentMethod={selectedPaymentMethod}
            paymentUrl={paymentUrl}
            timeRemaining={timeRemaining}
            formatTime={formatTime}
          />
          <div style={{ marginTop: '20px' }}> 
            <ImportantNotes />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;