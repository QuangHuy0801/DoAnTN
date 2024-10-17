import { useState, useEffect } from "react";
import { getAllSchedule, searchSchedules } from "../services/SchedulesService";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { FaExchangeAlt } from "react-icons/fa";
import { RiArrowRightDoubleLine } from "react-icons/ri";
import Select from "react-select";
import { listProvince } from "../services/ProvinceService";
import { Modal, Button } from "react-bootstrap";

const formatTime = (timeString) => {
  return moment(timeString).format("HH:mm");
};

const timeRanges = [
  { label: "Sáng sớm (00:00 - 06:00)", value: "00:00-06:00" },
  { label: "Buổi sáng (06:00 - 12:00)", value: "06:00-12:00" },
  { label: "Buổi chiều (12:00 - 18:00)", value: "12:00-18:00" },
  { label: "Buổi tối (18:00 - 24:00)", value: "18:00-24:00" },
];

const vehicleTypes = [
  { label: "Ghế", value: "Ghế" },
  { label: "Giường", value: "Giường" },
  { label: "Limousine", value: "limousine" },
];

const sortOptions = [
  { label: "Giá tăng dần", value: "asc" },
  { label: "Giá giảm dần", value: "desc" },
];

const SearchRoutes = () => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [travelDate, setTravelDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [provinces, setProvinces] = useState(null);
  const timezoneOffset = 7;
  const today = new Date(
    new Date().getTime() + timezoneOffset * 60 * 60 * 1000
  );
  const currentDate = today.toISOString().split("T")[0];
  const [filters, setFilters] = useState({
    timeRange: "",
    vehicleType: "",
    sortBy: "",
  });
  const [schedules, setSchedules] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const origin = searchParams.get("origin");
        const destination = searchParams.get("destination");
        const travelDate = searchParams.get("travelDate");
        setOrigin(origin);
        setDestination(destination);
        setTravelDate(travelDate);

        let data;
        if (origin && destination && travelDate) {
          data = await searchSchedules(origin, destination, travelDate);
        } else {
          data = await getAllSchedule();
        }
        // Áp dụng bộ lọc cho các lịch trình từ ngày hiện tại trở đi
        const filteredData = filterCurrentAndFutureSchedules(data);
        setSchedules(filteredData);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setError("Không thể tải lịch trình. Vui lòng thử lại sau.");
      }
    };

    fetchSchedules();
  }, [location.search]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await listProvince();
        const data = response.data;
        setProvinces(
          data.map((province) => ({
            value: province.provinceId,
            label: province.provinceName,
          }))
        );
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setError("Không thể tải danh sách tỉnh thành. Vui lòng thử lại sau.");
      }
    };

    fetchProvinces();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filterCurrentAndFutureSchedules = (schedules) => {
    const currentDate = moment().startOf("day");
    return schedules.filter((schedule) =>
      moment(schedule.departureTime).isSameOrAfter(currentDate)
    );
  };

  const swapFields = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) {
      return "Thời gian không hợp lệ";
    }

    const start = moment(startTime);
    const end = moment(endTime);

    if (!start.isValid() || !end.isValid()) {
      return "Thời gian không hợp lệ";
    }

    let durationInMinutes = end.diff(start, "minutes");

    if (end.isBefore(start)) {
      durationInMinutes += 24 * 60;
    }

    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return `${hours}h${minutes}m`;
  };

  const isInTimeRange = (departureTime, timeRange) => {
    const [start, end] = timeRange.split("-");
    const departureMoment = moment(departureTime);
    const startMoment = moment(departureTime).set({
      hour: start.split(":")[0],
      minute: start.split(":")[1],
      second: 0,
    });
    const endMoment = moment(departureTime).set({
      hour: end.split(":")[0],
      minute: end.split(":")[1],
      second: 0,
    });

    // Xử lý trường hợp khoảng thời gian qua nửa đêm
    if (endMoment.isBefore(startMoment)) {
      endMoment.add(1, "day");
    }

    return departureMoment.isBetween(startMoment, endMoment, null, "[]");
  };

  const filteredSchedules = schedules
    .filter((schedule) => {
      const searchValue =
        `${schedule.route.startLocation} ${schedule.route.endLocation} ${schedule.vehicle.vehicleNumber} ${schedule.vehicle.vehicleType}`.toLowerCase();
      const matchesSearch = searchValue.includes(searchTerm.toLowerCase());

      const matchesTimeRange =
        !filters.timeRange ||
        isInTimeRange(schedule.departureTime, filters.timeRange);
      const matchesVehicleType =
        !filters.vehicleType ||
        schedule.vehicle.vehicleType === filters.vehicleType;

      return matchesSearch && matchesTimeRange && matchesVehicleType;
    })
    .sort((a, b) => {
      if (filters.sortBy === "asc") {
        return a.price - b.price;
      } else if (filters.sortBy === "desc") {
        return b.price - a.price;
      }
      return 0;
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!origin || !destination || !travelDate) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      const data = await searchSchedules(
        origin.value,
        destination.value,
        travelDate
      );
      const filteredData = filterCurrentAndFutureSchedules(data);
      setSchedules(filteredData);
      setSuccessMessage("Tìm kiếm lịch trình thành công.");
      setError(null);
    } catch (error) {
      console.error("Error searching schedules:", error);
      setError("Không thể tìm kiếm lịch trình. Vui lòng thử lại sau.");
      setSuccessMessage(null);
    }
  };

  const handleBookNow = (scheduleId) => {
    navigate(`/schedules?id=${scheduleId}`);
  };

  return (
    <div className="container">
      <section className="form spad">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <div className="trip-type-toggle mb-3 d-flex align-items-center">
                    <Button
                      variant="link"
                      className="card-title ml-auto"
                      onClick={() => setShowModal(true)}
                    >
                      Hướng dẫn mua vé
                    </Button>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-5">
                          <label htmlFor="origin">
                            Điểm đi <span className="text-danger">*</span>
                          </label>
                          <Select
                            id="origin"
                            options={provinces}
                            value={origin}
                            onChange={setOrigin}
                            placeholder="Chọn điểm đi"
                            isClearable
                          />
                        </div>
                        <div
                          className="col-md-1"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FaExchangeAlt
                            className="icon"
                            onClick={swapFields}
                          />
                        </div>
                        <div className="col-md-5">
                          <label htmlFor="destination">
                            Điểm đến <span className="text-danger">*</span>
                          </label>
                          <Select
                            id="destination"
                            options={provinces}
                            value={destination}
                            onChange={setDestination}
                            placeholder="Chọn điểm đến"
                            isClearable
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="travelDate">
                            Ngày đi <span className="text-danger">*</span>
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="travelDate"
                            min={currentDate}
                            value={travelDate || currentDate}
                            onChange={(e) => setTravelDate(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
                      Tìm chuyến xe
                    </button>
                  </form>
                  {error && (
                    <div className="alert alert-danger mt-3">{error}</div>
                  )}
                  {successMessage && (
                    <div className="alert alert-success mt-3">
                      {successMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Hướng dẫn mua vé</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>1. Chọn điểm đi và điểm đến từ các lựa chọn có sẵn.</p>
          <p>2. Chọn ngày đi phù hợp với kế hoạch của bạn.</p>
          <p>
            3. Sử dụng các bộ lọc để tìm kiếm chuyến xe theo thời gian, loại xe,
            và giá vé.
          </p>
          <p>4. Nhấn nút "Tìm chuyến xe" để hiển thị các lựa chọn phù hợp.</p>
          <p>5. Nhấn nút "Đặt vé" để tiến hành đặt vé cho chuyến xe đã chọn.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">Bộ Lọc Tìm Kiếm</div>
            <div className="card-body">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="form-group">
                <label htmlFor="timeRange">Khoảng thời gian</label>
                <Select
                  id="timeRange"
                  options={timeRanges}
                  value={timeRanges.find(
                    (range) => range.value === filters.timeRange
                  )}
                  onChange={(selectedOption) =>
                    setFilters({
                      ...filters,
                      timeRange: selectedOption?.value || "",
                    })
                  }
                  isClearable
                />
              </div>
              <div className="form-group">
                <label htmlFor="vehicleType">Loại xe</label>
                <Select
                  id="vehicleType"
                  options={vehicleTypes}
                  value={vehicleTypes.find(
                    (type) => type.value === filters.vehicleType
                  )}
                  onChange={(selectedOption) =>
                    setFilters({
                      ...filters,
                      vehicleType: selectedOption?.value || "",
                    })
                  }
                  isClearable
                />
              </div>
              <div className="form-group">
                <label htmlFor="sortBy">Sắp xếp</label>
                <Select
                  id="sortBy"
                  options={sortOptions}
                  value={sortOptions.find(
                    (option) => option.value === filters.sortBy
                  )}
                  onChange={(selectedOption) =>
                    setFilters({
                      ...filters,
                      sortBy: selectedOption?.value || "",
                    })
                  }
                  isClearable
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="card">
            <div className="card-header">Danh Sách Chuyến Xe</div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>Điểm đi - Điểm đến</th>
                    <th>Ngày đi</th>
                    <th>Biển số xe</th>
                    <th>Loại xe</th>
                    <th>Thời gian</th>
                    <th>Giá vé</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules.map((schedule) => (
                    <tr key={schedule.scheduleId}>
                      <td>
                        {schedule.route.startLocation} -{" "}
                        {schedule.route.endLocation}
                      </td>
                      <td>
                        {moment(schedule.departureTime).format("DD/MM/YYYY")}
                      </td>
                      <td>{schedule.vehicle.vehicleNumber}</td>
                      <td>{schedule.vehicle.vehicleType}</td>
                      <td>
                        {formatTime(schedule.departureTime)}{" "}
                        <RiArrowRightDoubleLine />{" "}
                        {formatTime(schedule.arrivalTime)}: (
                        {calculateDuration(
                          schedule.departureTime,
                          schedule.arrivalTime
                        )}
                        )
                      </td>
                      <td>{schedule.price.toLocaleString()} đ</td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => handleBookNow(schedule.scheduleId)}
                        >
                          Đặt vé
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {error && <div className="alert alert-danger">Lỗi: {error}</div>}
              {filteredSchedules.length === 0 && !error && (
                <div className="alert alert-info">
                  Không có chuyến xe nào phù hợp.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchRoutes;
