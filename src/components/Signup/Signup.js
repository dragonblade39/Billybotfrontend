import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import { BACKEND_URL } from "../../Constant";
import ErrorModal from "../../Dialog";

const Signup = () => {
  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const goToLogin = () => {
    navigate("/");
  };

  const clickHandler = (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(data);

    const url = `${BACKEND_URL}/Signup-Login/create`;

    if (data.name === "") {
      setError("Signup Error!!");
      setErrorMessage("Enter Name correctly!!");
      setModalShow(true);
      setLoading(false);
    } else if (data.username === "") {
      setError("Signup Error!!");
      setErrorMessage("Enter Username correctly!!");
      setModalShow(true);
      setLoading(false);
    } else if (data.email === "") {
      setError("Signup Error!!");
      setErrorMessage("Enter Email correctly!!");
      setModalShow(true);
      setLoading(false);
    } else if (data.password === "" || data.password.length < 8) {
      setError("Signup Error!!");
      setErrorMessage(
        "Enter Password correctly with a minimum of 8 characters!!"
      );
      setModalShow(true);
      setLoading(false);
    } else {
      axios
        .post(url, data)
        .then((res) => {
          if (res.status === 200) {
            setError("Registered Successfully!!");
            setErrorMessage("Created Account Successfully..!");
            setModalShow(true);
            navigate("/");
            setData({
              name: "",
              username: "",
              email: "",
              password: "",
            });
          }
        })
        .catch((err) => {
          if (err.response && err.response.status === 400) {
            setError("Signup Error!!");
            setErrorMessage(err.response.data);
            setModalShow(true);
          } else {
            setError("Signup Error!!");
            setErrorMessage(err.message);
            setModalShow(true);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <form onSubmit={clickHandler} className="auth-form">
          <h2>Signup</h2>
          <p>Create your account and join us today.</p>
          <input
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={data.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Enter Your Username"
            value={data.username}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={data.email}
            onChange={handleInputChange}
            required
          />
          <div className="password-container">
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              value={data.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="password-container">
            <input
              type="number"
              name="phone"
              placeholder="Enter Your Phone Number"
              value={data.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Signing Up..." : "Signup"}
          </button>
          <p>
            Already have an account?{" "}
            <a href="#" className="login-link" onClick={goToLogin}>
              Login
            </a>
          </p>
        </form>
        <ErrorModal
          // style={{ marginLeft: "-800px", marginRight: "500px" }}
          show={modalShow}
          onHide={() => setModalShow(false)}
          errorMessage={errorMessage}
          error={error}
          Error={Error}
        />
      </div>
    </div>
  );
};

export default Signup;
