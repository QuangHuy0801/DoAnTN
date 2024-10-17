import React from 'react';

const AboutUs = () => {
    return (
        <div>
            {/* Phần Breadcrumb Bắt Đầu */}
            <section className="breadcrumb-option">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="breadcrumb__text">
                                <h4>Về Chúng Tôi</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Phần Breadcrumb Kết Thúc */}

            {/* Phần Giới Thiệu Bắt Đầu */}
            <section className="about spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="about__pic">
                                <img src="img/about/about-us-evibus.jpg" alt="Về Chúng Tôi" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="about__item">
                                <h4>Chúng Tôi Là Ai</h4>
                                <p>Evibus cam kết cung cấp các giải pháp vận chuyển hiệu quả và thân thiện với môi trường. Chúng tôi tập trung vào việc cung cấp dịch vụ chất lượng cao với cam kết bảo vệ môi trường.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="about__item">
                                <h4>Chúng Tôi Làm Gì</h4>
                                <p>Chúng tôi cung cấp một loạt các dịch vụ vận chuyển bao gồm đặt xe buýt, theo dõi thời gian thực và hỗ trợ khách hàng để đảm bảo trải nghiệm đi lại suôn sẻ và đáng tin cậy.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="about__item">
                                <h4>Tại Sao Chọn Chúng Tôi</h4>
                                <p>Với sự chú trọng đến sự an toàn, đúng giờ và sự hài lòng của khách hàng, Evibus nổi bật với dịch vụ chất lượng và giải pháp sáng tạo trong ngành vận tải.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Phần Giới Thiệu Kết Thúc */}

            {/* Phần Đánh Giá Bắt Đầu */}
            <section className="testimonial">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-6 p-0">
                            <div className="testimonial__text">
                                <span className="icon_quotations"></span>
                                <p>“Evibus đã làm thay đổi hành trình hàng ngày của tôi với dịch vụ đáng tin cậy và thoải mái. Rất đáng để thử!”</p>
                                <div className="testimonial__author">
                                    <div className="testimonial__author__pic">
                                        <img src="img/about/quanghuy.jpg" alt="Tác Giả" />
                                    </div>
                                    <div className="testimonial__author__text">
                                        <h5>Quang Huy</h5>
                                        <p>Người Đi Lại Thường Xuyên</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 p-0">
                            <div className="testimonial__pic set-bg"
                                data-setbg="img/about/testimonial-pic-evibus.jpg"></div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Phần Đánh Giá Kết Thúc */}

            {/* Phần Thống Kê Bắt Đầu */}
            <section className="counter spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="counter__item">
                                <div className="counter__item__number">
                                    <h2 className="cn_num">200+</h2>
                                </div>
                                <span>Khách <br />Hàng Hạnh Phúc
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="counter__item">
                                <div className="counter__item__number">
                                    <h2 className="cn_num">50</h2>
                                </div>
                                <span>Tổng <br />Lộ Trình
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="counter__item">
                                <div className="counter__item__number">
                                    <h2 className="cn_num">10</h2>
                                </div>
                                <span>Các <br />Thành Phố Đang Hoạt Động
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="counter__item">
                                <div className="counter__item__number">
                                    <h2 className="cn_num">95</h2>
                                    <strong>%</strong>
                                </div>
                                <span>Khách <br />Hàng Hài Lòng
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Phần Thống Kê Kết Thúc */}

            {/* Phần Đội Ngũ Bắt Đầu */}
            <section className="team spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title">
                                <span>Đội Ngũ Của Chúng Tôi</span>
                                <h2>Gặp Gỡ Đội Ngũ Phía Sau Evibus</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="team__item">
                                {/* <img src="img/about/team-evibus-1.jpg" alt="Thành Viên Đội Ngũ" /> */}
                                <h4>Emily Brown</h4>
                                <span>Quản Lý Vận Hành</span>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="team__item">
                                {/* <img src="img/about/team-evibus-2.jpg" alt="Thành Viên Đội Ngũ" /> */}
                                <h4>Michael Johnson</h4>
                                <span>Trưởng Nhóm Kỹ Thuật</span>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="team__item">
                                {/* <img src="img/about/team-evibus-3.jpg" alt="Thành Viên Đội Ngũ" /> */}
                                <h4>Sarah Lee</h4>
                                <span>Chăm Sóc Khách Hàng</span>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="team__item">
                                {/* <img src="img/about/team-evibus-4.jpg" alt="Thành Viên Đội Ngũ" /> */}
                                <h4>David Wilson</h4>
                                <span>Chuyên Gia Marketing</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Phần Đội Ngũ Kết Thúc */}

            {/* Phần Khách Hàng Bắt Đầu */}
            <section className="clients spad">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="section-title">
                                <span>Đối tác</span>
                                <h2>Khách Hàng Hài Lòng</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default AboutUs;
