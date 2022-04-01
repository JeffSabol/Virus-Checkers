import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './App.css';
// Axios


const SignUp = () => {
  

  return (

   
    <body>
	<div class="container">
		<div class="top">
			<h1 id="title" class="hidden"><span id="logo">Virus <span>Checkers</span></span></h1>
		</div>
		<div class="login-box animated fadeInUp">
			<div class="box-header">
				<h2>Create An Account</h2>
			</div>
			
            <label for="name">Name</label>
			<br/>
			<input type="text" id="name" />
			<br/>



            <label for="email">E-mail</label>
			<br/>
			<input type="text" id="Email" />
			<br/>



            <label for="username">Username</label>
			<br/>
			<input type="text" id="name" />
			<br/>



            <label for="password">Password</label>
			<br/>
			<input type="password" id="password" />
			<br/>



			<label for="password">Confirm Password</label>
			<br/>
			<input  type="password" id="password" />
			<br/>
			<button type="submit">Sign Up</button>
			<br/>
			<span style={{ color: "#a29494", textAlign: "center", display: "inline-block", width: "100%" }}>
            Already have an account? <Link to="/">Sign In</Link>
          </span>
		</div>
	</div>
   
</body>
    
  );
};


export default SignUp;
