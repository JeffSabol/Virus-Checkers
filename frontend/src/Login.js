import "./App.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const baseUrl = "http://localhost:5000";

const Login = () => {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const navigate = useNavigate();
  const [credsList, setCredsList] = useState([0]);
  const [loginConf, setLoginConf] = useState("");

  useEffect(() => {
	//check if a user is already logged in
    componentDidMount();
  }, []);

  const componentDidMount = () => {
	//check local db for a token
    if (window.localStorage.getItem("token")) {
      //redirect to Login
      console.log("redirect to home");
      navigate("/analysis");
    }
  };

  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
	//reset error display
    setLoginConf("");
    e.preventDefault();
    console.log("logining in");

    //verify login attempt
    try {
      const data = await axios.post(`${baseUrl}/login`, {
        Username: Username,
        PasswordHash: Password,
      });

      console.log(data.data.login);

      setCredsList([data.data]);

      if (data.data.login === "success") {
		//reset entries
        setUsername("");
        setPassword("");
        window.localStorage.setItem("token", data.data.token);
        navigate("/analysis");
      }

      if (data.data.login === "failure") {
        setLoginConf("Invalid Login");
      }

    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <body>
      <div class="container">
        <div class="top">
          <h1 id="title" class="hidden">
            <span id="logo">
              Virus <span>Checkers</span>
            </span>
          </h1>
        </div>

        <div class="login-box animated fadeInUp">
          <div class="box-header">
            <h2>Log In</h2>
          </div>

          <div class="inputVal">{loginConf}</div>

          <label for="username">Username</label>

          <br />
          <input onChange={handleChangeUsername} type="text" id="username" />
          <br />
          <label for="password">Password</label>
          <br />
          <input
            onChange={handleChangePassword}
            type="password"
            id="password"
          />
          <br />
          <form onSubmit={handleLogin}>
            <button type="submit">Sign In</button>
          </form>

          <br />
          <span
            style={{
              color: "#a29494",
              textAlign: "center",
              display: "inline-block",
              width: "100%",
            }}
          >
            Don't have a account? <Link to="/signup">Create account</Link>
          </span>
        </div>
      </div>
    </body>
  );
};

export default Login;
