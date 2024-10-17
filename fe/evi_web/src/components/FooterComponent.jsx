
const FooterComponent = () => {
    return (
        <footer className="footer mt-3">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="footer__about">
                            <div className="footer__logo">
                                <a href="#"><img src="img/logo.png" alt="" /></a>
                            </div>
                            <p>Địa chỉ: 97 Đ. Man Thiện, Hiệp Phú, Thủ Đức, Thành phố Hồ Chí Minh</p>
                            <a href="#"><img src="img/payment.png" alt="" /></a>
                        </div>
                    </div>
                    <div className="col-lg-2 offset-lg-1 col-md-3 col-sm-6">
                        <div className="footer__widget">
                            <h6>EVI BUS</h6>
                            <ul>
                                <li><a href="#">Về chúng tôi</a></li>
                                <li><a href="#">Lịch trình</a></li>
                                <li><a href="#">Sự kiện</a></li>
                                <li><a href="#">Chi nhánh</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-6">
                        <div className="footer__widget">
                            <h6>Hỗ trợ</h6>
                            <ul>
                                <li><a href="#">Tra cứu đặt vé</a></li>
                                <li><a href="#">Điều khoản sử dụng</a></li>
                                <li><a href="#">Hướng dẫn đặt vé</a></li>
                                <li><a href="#">Hướng dẫn cài đặt trên app</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 offset-lg-1 col-md-6 col-sm-6">
                        <div className="footer__widget">
                            <h6>NewLetter</h6>
                            <div className="footer__newslatter">
                                <p>Hãy để lại mail để được cập nhập những thông tin cũng như khuyến mãi mới nhất</p>
                                <form action="#">
                                    <input type="text" placeholder="Your email" />
                                    <button type="submit">
                                        <span className="icon_mail_alt"></span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default FooterComponent