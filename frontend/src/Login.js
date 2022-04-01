import './App.css';
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom';
import Analysis from "./Analysis.js";


const Login = () => {

    const handleLogin = () => {

    }
    
    
  

  

  return (

    
    <body>
	<div class="container">
		<div class="top">
			<h1 id="title" class="hidden"><span id="logo">Virus <span>Checkers</span></span></h1>
		</div>
		<div class="login-box animated fadeInUp">
			<div class="box-header">
				<h2>Log In</h2>
			</div>
			<label for="username">Username</label>
			<br/>
			<input type="text" id="username" />
			<br/>
			<label for="password">Password</label>
			<br/>
			<input type="password" id="password" />
			<br/>
			<button type="submit">Sign In</button>
			<br/>
			<span style={{ color: "#a29494", textAlign: "center", display: "inline-block", width: "100%" }}>
            Don't have a account? <Link to="/signup">Create account</Link>
          </span>
		</div>
	</div>
</body>


   
  );
};

export default Login;
