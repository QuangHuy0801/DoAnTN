import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import HeaderComponent from './components/HeaderComponent';
import Home from './components/Home';
import FooterComponent from './components/FooterComponent';
import Schedules from './components/Schedules';
import PaymentSuccess from './components/PaymentSuccess';
import TicketLookup from './components/TicketLookup.jsx';
import AboutUs from './components/AboutUs';
import SearchRoutes from './components/SearchRoutes';
import CheckOut from './components/CheckOut.jsx';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import MyProfile from './components/MyProfile';
import MyProfileAdmin from './components/MyProfileAdmin.jsx';
import History from './components/History';
import Invoice from './components/Invoice';
import SignInAdmin from './components/SignInAdmin.jsx';
import AdminDashBoard from './components/AdminDashBoard.jsx';
import NavAdmin from './components/NavAdmin.jsx';
import Vehical from './components/Vehical.jsx';
import MngSchedules from './components/MngSchedules.jsx';
import MngRoute from './components/MngRoute.jsx';
import MngUser from './components/MngUser.jsx';
import PaymentResult from './components/PaymentResult.jsx';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const isInvoicePage = location.pathname.startsWith('/invoice/');
  const isSignInPage = location.pathname === '/signin' || location.pathname === '/signup' || isInvoicePage;
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {!isSignInPage && !isAdminPage && <HeaderComponent currentPage="home" />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/schedule" element={<SearchRoutes />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/vnPayPayment" element={<PaymentResult />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/myhistory" element={<History />} />
        <Route path="/ticketLookup" element={<TicketLookup />} />
        <Route path="/invoice/:index" element={<Invoice />} />
        <Route path="/admin" element={<SignInAdmin />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
      {!isSignInPage && !isAdminPage && <FooterComponent />}
    </>
  );
}

function AdminLayout() {
  return (
    <div className="app-container">
      <NavAdmin />
      <main className="main-content">
        <Routes>
          <Route path="dashboard" element={<AdminDashBoard />} />
          <Route path="vehical" element={<Vehical/>} />
          <Route path="management-schedules" element={<MngSchedules/>} />
          <Route path="management-route" element={<MngRoute/>} />
          <Route path="management-user" element={<MngUser/>} />
          <Route path="myprofile" element={<MyProfileAdmin />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
