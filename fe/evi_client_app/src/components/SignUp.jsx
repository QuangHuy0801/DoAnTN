import { useState } from "react";
import "../assets/styleSignUp.css";
import { signUp } from "../services/UserService";

function SignUp() {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorSignUp, setErrorSignUp] = useState(null);
  const [successSignUp, setSuccessSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!username || !fullname || !email || !password || !confirmPassword) {
      setErrorSignUp("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorSignUp("Passwords do not match.");
      return;
    }

    try {
      const response = await signUp(username, fullname, email, password);
      console.log("Sign-up successful:", response.data);

      setSuccessSignUp(true);
      setTimeout(() => {
        // Redirect to "/signin" after 3 seconds
        window.location.href = "/signin";
      }, 3000);
    } catch (error) {
      console.error("Sign-up failed:", error);
      setErrorSignUp(`Sign-up failed: ${error.message}`);
    }
  };

  return (
    <div className="page-content">
      <div className="form-v7-content">
        <div className="form-left">
          <div className="d-flex justify-content-center align-items-center vh-100">
            <img src="/img/signin/signup.jpg" alt="form" />
          </div>
          <p className="text-1 text-black">Sign Up</p>
          <p className="text-2 text-black">Privacy policy & Terms of service</p>
        </div>
        <form onSubmit={handleSubmit} className="form-detail" id="myform">
          <div className="form-row">
            <label htmlFor="username">USERNAME</label>
            <input
              type="text"
              name="username"
              id="username"
              className="input-text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="fullname">FULLNAME</label>
            <input
              type="text"
              name="fullname"
              id="fullname"
              className="input-text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className="form-row">
            <label htmlFor="your_email">E-MAIL</label>
            <input
              type="text"
              name="your_email"
              id="your_email"
              className="input-text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}"
            />
          </div>
          <div className="form-row">
            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              name="password"
              id="password"
              className="input-text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="confirm_password">CONFIRM PASSWORD</label>
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              className="input-text"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {errorSignUp && (
            <div>
              <p style={{ color: "red" }}>{errorSignUp}</p>
            </div>
          )}
          {successSignUp && (
            <div>
              <p style={{ color: "green" }}>
                Account created successfully! Redirecting to sign-in page...
              </p>
            </div>
          )}
          <div className="form-row-last">
            <input
              type="submit"
              name="register"
              className="register"
              value="Register"
            />
            <p>
              Or <a href="/signin">Sign in</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
