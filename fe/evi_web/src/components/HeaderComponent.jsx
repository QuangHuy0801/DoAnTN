import {  useLocation, useNavigate } from 'react-router-dom';

const HeaderComponent = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const user = JSON.parse(sessionStorage.getItem('user'));
  const userName = user ? user.user_Name : null;
  const isActiveLink = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  const handleSignOut = () => {
    sessionStorage.removeItem('user');
    navigate('/signin'); 
  };


  return  (
    <header className="header">
      <div className="header__top">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-7">
              <div className="header__top__left">
                <p>Cùng bạn trên mọi nẻo đường.</p>
              </div>
            </div>
            <div className="col-lg-6 col-md-5">
              <div className="header__top__right">
              <div className="header__top__links">
            {user ? (
              <>
                <a href="/myprofile">{userName}</a>
                <a href="#" onClick={handleSignOut}>Sign out</a>
              </>
            ) : (
              <>
              <a href="/signin">Sign in</a>
              <a href="/signup">Sign up</a>
              </>
            )}
          </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-3">
            <div className="header__logo">
              <a href="/home"><img src="/img/logo.png" alt="" /></a>
            </div>
          </div>
          <div className="col-lg-6 col-md-6">
            <nav className="header__menu mobile-menu">
              <ul>
              <li className={isActiveLink('/home')}><a href="/home">Trang chủ</a></li>
              <li className={isActiveLink('/schedule')}><a href="/schedule">Lịch trình</a></li>
                <li className={isActiveLink('/ticketLookup')}><a href="/ticketLookup">Tra cứu vé</a></li>
                <li className={isActiveLink('/myhistory')}><a href="/myhistory">Lịch sử</a></li>
                <li className={isActiveLink('/about')}><a href="/about">Về chúng tôi</a></li>
              </ul>
            </nav>
          </div>
          {/*<div className="col-lg-3 col-md-3">
            <div className="header__nav__option">
              <a href="#" className="search-switch"><img src="/img/icon/search.png" alt="" /></a>
              <a href="#"><img src="/img/icon/heart.png" alt="" /></a>
              <a href="/cart"><img src="/img/icon/cart.png" alt="" /> <span>
              </span></a>
            </div>
          </div>*/}
        </div>
        <div className="canvas__open">
          <i className="fa fa-bars"></i>
        </div>
      </div>
    </header>
  );
}


export default HeaderComponent;
