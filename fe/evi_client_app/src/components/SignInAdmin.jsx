import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/style.css";
import {
  forgotNewPassAdmin,
  forgotPasswordAdmin,
  signInAdmin,
} from "../services/UserService";

function SignInAdmin() {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [resultcode, setResultCode] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorLogin, setErrorLogin] = useState("");
  const [errorForgot, setErrorForgot] = useState("");
  const [stage, setStage] = useState("signIn");
  const [errorCode, setErrorCode] = useState("");
  const [errorNewPass, setErrorNewPass] = useState("");

  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await signInAdmin(loginName, password);
      if (response.data) {
        sessionStorage.setItem("admin", JSON.stringify(response.data));
        navigate("/admin/dashboard");
      } else {
        setErrorLogin("Tên đăng nhập hoặc mật khẩu không chính xác");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorLogin(error.response.data.message);
      } else {
        setErrorLogin("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPasswordAdmin(loginName);
      console.log(response.data);
      const parsedData = response.data;
      setResultCode(parsedData);
      setStage("sendCode");
    } catch (error) {
      setErrorForgot(
        error.response
          ? error.response.data.message
          : "Failed to retrieve password"
      );
    }
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (code === resultcode) {
      setStage("changePass");
    } else {
      setErrorCode("Invalid code");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setErrorNewPass("Passwords do not match");
      return;
    }
    try {
      const response = await forgotNewPassAdmin(loginName, code, newPassword);
      if (response.data) {
        setStage("signIn");
      } else {
        setErrorNewPass("Failed to change password");
      }
    } catch (error) {
      setErrorNewPass(
        error.response
          ? error.response.data.message
          : "Failed to change password"
      );
    }
  };
  return (
    <section className="ftco-section">
      <div className="container">
        {stage === "signIn" && (
          <div className="row justify-content-center">
            <div className="col-md-12 col-lg-10">
              <div className="wrap d-md-flex">
                <div
                  className="img"
                  style={{
                    backgroundImage: "url(/img/signin/signin_dashboard.png)",
                  }}
                ></div>
                <div className="login-wrap p-4 p-md-5">
                  <div className="d-flex">
                    <div
                      className="w-100"
                      style={{ display: "flex", transform: "translateY(10px)" }}
                    >
                      <h3 className="mb-4">Sign In</h3>
                    </div>
                    <div className="w-100 flex-icon">
                      <a
                        href="#"
                        className="social-icon d-flex align-items-center justify-content-center"
                      >
                        <span className="fa fa-facebook"></span>
                      </a>
                      <a
                        href="https://accounts.google.com/o/oauth2/auth?scope=email%20profile%20openid&redirect_uri=http://localhost:8080/signin-google&response_type=code&client_id=540833837549-eof6l5jn50qm1r4j72i1cnorecik8rt0.apps.googleusercontent.com&approval_prompt=force"
                        className="social-icon d-flex align-items-center justify-content-center"
                      >
                        <span className="fa fa-google"></span>
                      </a>
                    </div>
                  </div>
                  <form onSubmit={handleSignIn} className="signin-form">
                    <div className="form-group mb-3">
                      <label className="label" htmlFor="name">
                        Username
                      </label>
                      <input
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        name="login-name"
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="label" htmlFor="password">
                        Password
                      </label>
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        name="password"
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        required
                      />
                    </div>
                    {errorLogin && (
                      <div className="alert alert-danger" role="alert">
                        {errorLogin}
                      </div>
                    )}
                    <div className="form-group">
                      <button
                        type="submit"
                        className="form-control btn btn-primary rounded submit px-3"
                      >
                        Sign In
                      </button>
                    </div>
                    <div className="form-group d-md-flex">
                      <div className="w-50 text-left">
                        <label className="checkbox-wrap checkbox-primary mb-0">
                          Remember Me
                          <input
                            name="remember"
                            type="checkbox"
                            defaultChecked
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                      <div className="w-50 text-md-right">
                        <a href="#" onClick={() => setStage("forgotPassword")}>
                          Forgot Password
                        </a>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === "forgotPassword" && (
          <div className="row justify-content-center">
            <div className="col-md-12 col-lg-10">
              <div className="wrap d-md-flex">
                <div
                  className="img"
                  style={{
                    backgroundImage: "url(/img/signin/signin_dashboard.png)",
                  }}
                ></div>
                <div className="login-wrap p-4 p-md-5">
                  <div className="d-flex">
                    <div
                      className="w-100"
                      style={{ display: "flex", transform: "translateY(10px)" }}
                    >
                      <h4 className="mb-4">Forgot Password</h4>
                    </div>
                  </div>
                  <form onSubmit={handleForgotPassword} className="signin-form">
                    <div className="form-group mb-3">
                      <label className="label" htmlFor="name">
                        Username
                      </label>
                      <input
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        name="login-name"
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        required
                      />
                    </div>
                    {errorForgot && (
                      <p style={{ color: "red" }}>{errorForgot}</p>
                    )}
                    <div className="form-group">
                      <button
                        type="submit"
                        className="form-control btn btn-primary rounded submit px-3"
                      >
                        Check Username
                      </button>
                    </div>
                  </form>
                  <p className="text-center">
                    Or &nbsp;{" "}
                    <a href="#" onClick={() => setStage("signIn")}>
                      Sign In
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === "sendCode" && (
          <div className="row justify-content-center">
            <div className="col-md-12 col-lg-10">
              <div className="wrap d-md-flex">
                <div
                  className="img"
                  style={{
                    backgroundImage: "url(/img/signin/signin_dashboard.png)",
                  }}
                ></div>
                <div className="login-wrap p-4 p-md-5">
                  <div className="d-flex">
                    <div
                      className="w-100"
                      style={{ display: "flex", transform: "translateY(10px)" }}
                    >
                      <h4 className="mb-4">Enter Code</h4>
                    </div>
                  </div>
                  <form onSubmit={handleSendCode} className="signin-form">
                    <div className="form-group mb-3">
                      <label className="label" htmlFor="name">
                        Code
                      </label>
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        name="code_input"
                        type="text"
                        className="form-control"
                        placeholder="Please check your email and enter your code"
                        required
                      />
                    </div>
                    {errorCode && <p style={{ color: "red" }}>{errorCode}</p>}
                    <div className="form-group">
                      <button
                        type="submit"
                        className="form-control btn btn-primary rounded submit px-3"
                      >
                        Send Code
                      </button>
                    </div>
                  </form>
                  <p className="text-center">
                    Or &nbsp;{" "}
                    <a href="#" onClick={() => setStage("signIn")}>
                      Sign In
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === "changePass" && (
          <div className="row justify-content-center">
            <div className="col-md-12 col-lg-10">
              <div className="wrap d-md-flex">
                <div
                  className="img"
                  style={{
                    backgroundImage: "url(/img/signin/signin_dashboard.png)",
                  }}
                ></div>
                <div className="login-wrap p-4 p-md-5">
                  <div className="d-flex">
                    <div
                      className="w-100"
                      style={{ display: "flex", transform: "translateY(10px)" }}
                    >
                      <h4 className="mb-4">Change Password</h4>
                    </div>
                  </div>
                  <form onSubmit={handleChangePassword} className="signin-form">
                    <div className="form-group mb-3">
                      <label className="label" htmlFor="name">
                        NEW PASSWORD
                      </label>
                      <input
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        name="new_pass"
                        type="password"
                        className="form-control"
                        placeholder="New Password"
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label className="label" htmlFor="name">
                        CONFIRM NEW PASSWORD
                      </label>
                      <input
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        name="confirm_new_pass"
                        type="password"
                        className="form-control"
                        placeholder="Confirm New Password"
                        required
                      />
                    </div>
                    {errorNewPass && (
                      <p style={{ color: "red" }}>{errorNewPass}</p>
                    )}
                    <div className="form-group">
                      <button
                        type="submit"
                        className="form-control btn btn-primary rounded submit px-3"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                  <p className="text-center">
                    Or &nbsp;{" "}
                    <a href="#" onClick={() => setStage("signIn")}>
                      Sign In
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SignInAdmin;
