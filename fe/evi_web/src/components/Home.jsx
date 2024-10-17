import { useState, useEffect } from 'react';
import { listProvince } from '../services/ProvinceService';
import { ToastContainer, toast } from 'react-toastify';
import { FaExchangeAlt } from 'react-icons/fa';
import Select from 'react-select';
// import { searchSchedules } from '../services/SchedulesService';
// import SearchRoutes from './SearchRoutes';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [provinces, setProvices] = useState(null);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [origin, setOrigin] = useState(null);
    const [destination, setDestination] = useState(null);
    const timezoneOffset = 7;
    const today = new Date(new Date().getTime() + timezoneOffset * 60 * 60 * 1000);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`;

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await listProvince();
                const data = response.data;
                setProvices( data.map(province => ({
                    value: province.provinceId,
                    label: province.provinceName
                })));
            } catch (error) {
                console.error('Error fetching provinces:', error);
                setError(error.message);
            }
        };
    
        fetchProvinces();
    }, []);

    useEffect(() => {
        const endTime = new Date();
        endTime.setDate(endTime.getDate() + 3);
        endTime.setHours(endTime.getHours() + 1);
        endTime.setMinutes(endTime.getMinutes() + 50);
        endTime.setSeconds(endTime.getSeconds() + 18);

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setCountdown({ days, hours, minutes, seconds });

            if (distance < 0) {
                clearInterval(interval);
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    // useEffect(() => {
    //     if (addToCartError) {
    //         setAddToCartError(null);
    //     }
    // }, [addToCartError]);

    // const handleAddToCart = async (itemId) => {
    //     try {
    //         await addToCart(user.id, itemId, 1);
    //         toast.success(`Đã thêm sản phẩm vào giỏ hàng`, {
    //             position: "top-right",
    //             autoClose: 3000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //         });
    //     } catch (error) {
    //         console.error('Error add to cart item:', error);
    //         toast.error(`Lỗi khi thêm sản phẩm vào giỏ hàng`, {
    //             position: "top-right",
    //             autoClose: 3000,
    //             hideProgressBar: false,
    //             closeOnClick: true,
    //             pauseOnHover: true,
    //             draggable: true,
    //             progress: undefined,
    //         });
    //     }
    // };

    const navigate = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault();
      const originValue = origin.value;
      const destinationValue = destination.value;
      const travelDateValue = e.target.elements.travelDate.value;
      navigate(`/schedule?origin=${originValue}&destination=${destinationValue}&travelDate=${travelDateValue}`);
    };
  

    const swapFields = () => {
        const temp = origin;
        setOrigin(destination);
        setDestination(temp);
    };

    return (
        <div>
            <ToastContainer />
            <section>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="breadcrumb-blog set-bg" style={{ backgroundImage: `url(img/home/backgroud_top.png)` }}>
                        </div>
                    </div>
                </div>
            </section>

            <section className="form spad">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-body">
                                    <div className="trip-type-toggle mb-3 d-flex align-items-center">

                                        <a href="#" className="card-title ml-auto">Hướng dẫn mua vé</a>
                                    </div>
                                    <form onSubmit={handleSubmit}>
                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <label htmlFor="origin">Điểm đi</label>
                                                    <Select
                                                        id="origin"
                                                        options={provinces}
                                                        value={origin}
                                                        onChange={setOrigin}
                                                        placeholder="Chọn điểm đi"
                                                        isClearable
                                                    />
                                                </div>
                                                <div className="col-md-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <FaExchangeAlt className="icon" onClick={swapFields} />
                                                </div>
                                                <div className="col-md-5">
                                                    <label htmlFor="destination">Điểm đến</label>
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
                                                    <label htmlFor="travelDate">Ngày đi</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        id="travelDate"
                                                        min={currentDate}
                                                        defaultValue={currentDate}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="form-group">
                                            <div className="col-md-6">
                                                <label htmlFor="passengers">Số vé</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    id="passengers"
                                                    min="1"
                                                    max="5"
                                                    defaultValue="1"
                                                    required
                                                />
                                            </div>
                                        </div> */}
                                        <button type="submit" className="btn btn-primary btn-block">
                                            Tìm chuyến xe
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="categories spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="categories__text">
                                <h2>
                                    Tận tâm <br /> <span>An toàn</span> <br />
                                    Chăm sóc
                                </h2>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="categories__hot__deal">
                                <img src="img/home/body.jpg" alt="" />
                                <div className="hot__deal__sticker">
                                    <span>Sale Of</span>
                                    <h5>10%</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 offset-lg-1">
                            <div className="categories__deal__countdown">
                                <span>Deal Of The Week</span>
                                <h2>Các tuyến xe trên 400km được giảm ngay 10%</h2>
                                <div className="categories__deal__countdown__timer" id="countdown">
                                    <div className="cd-item">
                                        <span>{countdown.days}</span>
                                        <p>Days</p>
                                    </div>
                                    <div className="cd-item">
                                        <span>{countdown.hours}</span>
                                        <p>Hours</p>
                                    </div>
                                    <div className="cd-item">
                                        <span>{countdown.minutes}</span>
                                        <p>Minutes</p>
                                    </div>
                                    <div className="cd-item">
                                        <span>{countdown.seconds}</span>
                                        <p>Seconds</p>
                                    </div>
                                </div>
                                <a href="#" className="primary-btn">Đặt chuyến ngay</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="instagram spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="instagram__pic">
                                <div className="instagram__pic__item set-bg" style={{ backgroundImage: 'url(img/home/1.jpg)' }}></div>
                                <div className="instagram__pic__item set-bg" style={{ backgroundImage: 'url(img/home/2.jpg)' }}></div>
                                <div className="instagram__pic__item set-bg" style={{ backgroundImage: 'url(img/home/3.jpg)' }}></div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="instagram__text">
                                <h3>EVI BUS </h3>
                                <h3> CHẤT LƯỢNG LÀ DANH DỰ</h3>
                                <h5>Được khách hàng tin tưởng và lựa chọn</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="latest spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title">
                                <span>Latest News</span>
                                <h2>KHUYẾN MÃI NỔI BẬT</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="blog__item">
                                <div className="blog__item__pic set-bg" style={{ backgroundImage: 'url(img/home/momo.png)' }}></div>
                                <div className="blog__item__text">
                                    <span><img src="img/icon/calendar.png" alt="" /> 9/6/2024 </span>
                                    <h5>Đặt vé xe siêu tiện</h5>
                                    <a href="#">Xem thêm</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="blog__item">
                                <div className="blog__item__pic set-bg" style={{ backgroundImage: 'url(img/home/zalopay.png)' }}></div>
                                <div className="blog__item__text">
                                    <span><img src="img/icon/calendar.png" alt="" /> 5/6/2024</span>
                                    <h5>Nhập mã liền ngay - nhanh tay kẻo hết</h5>
                                    <a href="#">Xem thêm</a>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="blog__item">
                                <div className="blog__item__pic set-bg" style={{ backgroundImage: 'url(img/home/vnpay.png)' }}></div>
                                <div className="blog__item__text">
                                    <span><img src="img/icon/calendar.png" alt="" /> 2/6/2024</span>
                                    <h5>Tiện lợi nhanh chóng - quét QR code và lên xe</h5>
                                    <a href="#">Xem thêm</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
