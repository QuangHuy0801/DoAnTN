import React from "react";
import { FaCheckCircle, FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../assets/style.css"; // Nếu cần thiết

const PaymentSuccess = () => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mt-4">
            <div className="card-header">
              <h5 className="mb-0">
                <FaCheckCircle className="mr-2" />
                Thanh toán thành công
              </h5>
            </div>
            <div className="card-body text-center">
              <h3 className="mb-4">
                <FaCheckCircle className="mr-2" style={{ color: "green" }} />
                Chúc mừng! Thanh toán của bạn đã được thực hiện thành công.
              </h3>
              <p>
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Đơn hàng của bạn đã
                được xác nhận và chúng tôi sẽ gửi thông tin chi tiết đến email
                của bạn.
              </p>
              <Link to="/" className="btn btn-primary mt-4">
                <FaHome className="mr-2" />
                Quay lại trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
