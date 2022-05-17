import "./App.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const baseUrl = "http://localhost:5000";

const About = () => {
  const [loggedUser, setLoggedUser] = useState([0]);

  const navigate = useNavigate();

  useEffect(() => {
    //    componentDidMount();
    getUserData();
  }, []);

  const getUserData = async () => {
    let token = window.localStorage.getItem("token");
    try {
      const data = await axios.post(`${baseUrl}/users`, {
        token: token,
      });
      setLoggedUser(data.data);
      console.log(
        "Logged in User: " +
          data.data.Username +
          " , " +
          data.data.FullName +
          " , " +
          data.data.Email
      );

      /** Update dataset list entries**/
      /** Reset entries**/
    } catch (err) {
      console.log(err.message);
    }
  };

  const componentDidMount = () => {
    if (!window.localStorage.getItem("token")) {
      //redirect to Login
      console.log("redirect to login");
      navigate("/");
    }
  };

  return (
    <>
      <nav id="topnav">
        <a id="logo" class="nav-link" href="./Analysis">
          <img
            class="imgLogo"
            title="Go back home"
            src="https://i.imgur.com/IyLfb58.png"
          ></img>
        </a>

        <div class="dropdown">
          <span>
            {" "}
            <a id="logo" class="nav-link">
              <img class="imgLogo" src="https://i.imgur.com/B4U7Uij.png"></img>
            </a>
          </span>

          <div class="dropdown-content">
            <p id="user_text">Name: {loggedUser.FullName}</p>
            <p id="user_text">Username: {loggedUser.Username}</p>
            <p id="user_text"> Email: {loggedUser.Email}</p>
          </div>
        </div>

        <a id="logo" class="nav-link" title="About page" href="./About">
          <img class="imgLogo" src="https://i.imgur.com/drUApfz.png"></img>
        </a>

        <button1
          id="logoutBtn"
          onClick={(e) => {
            window.localStorage.removeItem("token");
            setLoggedUser([0]);
            navigate("/");
          }}
        >
          Logout
        </button1>
      </nav>
      <h1>About</h1>
      <p id="about_text">
        Virus Checkers is a website to check virus file hashes. Enter a MD5 or
        SHA256 hash inside the search bar and hit check hash. We will check our
        database and VirusTotal's database.
      </p>
    </>
  );
};

export default About;
