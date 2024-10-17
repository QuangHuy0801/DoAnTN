import { useEffect, useState } from 'react';
import { Container, Table, Form, Row, Col, Card } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import { getAllBooking } from '../services/BookingService';
import '../assets/statistic.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AdminDashBoard = () => {
  const [bookings, setBookings] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Doanh thu',
      data: [],
      backgroundColor: 'rgba(75,192,192,0.6)',
      borderColor: 'rgba(75,192,192,1)',
      borderWidth: 1,
    }]
  });
  const [revenueByMonthChartData, setRevenueByMonthChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
    }]
  });
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTrips, setTotalTrips] = useState(0);
  const [averageRevenuePerTrip, setAverageRevenuePerTrip] = useState(0);
  const [totalTicketsCompleted, setTotalTicketsCompleted] = useState(0);
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getAllBooking();
        setBookings(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu đặt vé:', error);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      processChartData(bookings);
    }
    if (selectedYear) {
      processRevenueByMonthChartData(bookings);
    }
  }, [bookings, selectedMonth, selectedYear]);

  const processChartData = (data) => {
    const revenueData = {};
    let total = 0;
    let trips = 0;
    let totalTicketsComplete = 0;
    let totalTickets = 0;

    const filteredData = data.filter(booking => {
      const bookingDate = new Date(booking.schedule.departureTime);
      return bookingDate.getMonth() + 1 === parseInt(selectedMonth) && 
             bookingDate.getFullYear() === parseInt(selectedYear) &&
             booking.status === 'CONFIRMED'&&
             booking.paid===true;
    });
    const filteredDataTotal = data.filter(booking => {
      const bookingDate = new Date(booking.schedule.departureTime);
      return bookingDate.getMonth() + 1 === parseInt(selectedMonth) && 
             bookingDate.getFullYear() === parseInt(selectedYear);
    });

    console.log(bookings)
    const uniqueScheduleIds = new Set(filteredDataTotal.map(booking => booking.schedule.scheduleId));
    setTotalTrips(uniqueScheduleIds.size);
    trips = uniqueScheduleIds.size;

    filteredData.forEach(booking => {
      const date = new Date(booking.schedule.departureTime).toLocaleDateString('vi-VN');
      if (!revenueData[date]) {
        revenueData[date] = 0;
      }
      revenueData[date] += booking.schedule.price;
      total += booking.schedule.price;
      totalTicketsComplete += booking.bookingDetails.length;
    });


    filteredDataTotal.forEach(booking => {
      totalTickets += booking.bookingDetails.length;
    });

    const labels = Object.keys(revenueData);
    const values = Object.values(revenueData);

    setChartData({
      labels,
      datasets: [
        {
          label: 'Doanh thu',
          data: values,
          backgroundColor: 'rgba(75,192,192,0.6)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        }
      ]
    });
    setTotalRevenue(total);
    setTotalTrips(trips);
    setAverageRevenuePerTrip(trips > 0 ? total / trips : 0);
    setTotalTicketsSold(totalTickets);
    setTotalTicketsCompleted(totalTicketsComplete);
  };

  const processRevenueByMonthChartData = (data) => {
    const revenueByMonth = Array(12).fill(0);
    data.forEach(booking => {
      const bookingDate = new Date(booking.schedule.departureTime);
      if (bookingDate.getFullYear() === parseInt(selectedYear)&& booking.status === 'CONFIRMED'&&   booking.paid===true) {
        revenueByMonth[bookingDate.getMonth()] += booking.schedule.price;
      }
    });

    const totalRevenue = revenueByMonth.reduce((a, b) => a + b, 0);
    const percentages = revenueByMonth.map(revenue => ((revenue / totalRevenue) * 100).toFixed(2));

    setRevenueByMonthChartData({
      labels: months.map(month => month.label),
      datasets: [{
        data: percentages,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
        ],
      }]
    });
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Doanh thu theo ngày',
      },
    },
  };

  const revenuePieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
          font: {
            size: 10
          }
        }
      },
      title: {
        display: true,
        text: `Phần trăm doanh thu theo tháng (${selectedYear})`,
        font: {
          size: 14
        }
      },
    },
  };

  const months = [
    { value: '1', label: 'Tháng 1' },
    { value: '2', label: 'Tháng 2' },
    { value: '3', label: 'Tháng 3' },
    { value: '4', label: 'Tháng 4' },
    { value: '5', label: 'Tháng 5' },
    { value: '6', label: 'Tháng 6' },
    { value: '7', label: 'Tháng 7' },
    { value: '8', label: 'Tháng 8' },
    { value: '9', label: 'Tháng 9' },
    { value: '10', label: 'Tháng 10' },
    { value: '11', label: 'Tháng 11' },
    { value: '12', label: 'Tháng 12' },
  ];

  const years = ['2024', '2025', '2026'];

  return (
    <Container>
      <h2 className="text-center my-4">Thống kê Doanh thu</h2>
      <Row className="mb-4">
        <Col>
          <Form.Group controlId="monthSelect">
            <Form.Label>Chọn Tháng</Form.Label>
            <Form.Control as="select" value={selectedMonth} onChange={handleMonthChange}>
              <option value="">Chọn tháng</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="yearSelect">
            <Form.Label>Chọn Năm</Form.Label>
            <Form.Control as="select" value={selectedYear} onChange={handleYearChange}>
              <option value="">Chọn năm</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Doanh thu theo ngày</Card.Header>
            <Card.Body>
              <Bar data={chartData} options={options} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Phần trăm doanh thu theo tháng</Card.Header>
            <Card.Body>
              <div style={{ height: '400px' }}>
                <Pie data={revenueByMonthChartData} options={revenuePieOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
  <Col md={12}>
    <Card className="mb-4">
      <Card.Header>Thông tin chi tiết</Card.Header>
      <Card.Body>
        <Row>
          <Col md={4}>
            <h5>Tổng số chuyến đã thực hiện:</h5>
            <p>{totalTrips}</p>
          </Col>
          <Col md={4}>
            <h5>Doanh thu trung bình trên mỗi chuyến:</h5>
            <p>{averageRevenuePerTrip.toLocaleString()} VND</p>
          </Col>
          <Col md={4}>
            <h5>Tổng số vé đã bán:</h5>
            <p>{totalTicketsSold}</p>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <h5>Tổng số vé đã hoàn thành:</h5>
            <p>{totalTicketsCompleted}</p>
          </Col>
          <Col md={4}>
            <h5>Tổng doanh thu:</h5>
            <p>{totalRevenue.toLocaleString()} VND</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </Col>
</Row>
    </Container>
  );
};

export default AdminDashBoard;