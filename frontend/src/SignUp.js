import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Route,Routes } from 'react-router-dom';
import './App.css';
import axios from "axios"
import Login from "./Login.js";
import Analysis from "./Analysis";
// Axios
const baseUrl = "http://localhost:5000";

const SignUp = () => {
  

	const [Name, setName] = useState(""); 
	const [Email, setEmail] = useState(""); 
	const [Username, setUsername] = useState(""); 
	const [Password, setPassword] = useState(""); 
	const [Conf, setConf] = useState(""); 
	const [usernameConf, setUsernameConf] = useState(""); 
	const [emailConf, setEmailConf] = useState(""); 
	const [credsList, setCredsList] = useState([0]);
    const [signup, setSignUp] = useState([0]);
	const [passConfStatus, setpassConfStatus] = useState(""); 
	const [accountCreated, setAccountCreated] = useState("");



	const handleChangeConf = e => {
      
		setConf(e.target.value);
		
	}
	const handleChangeName = e => {
      
		setName(e.target.value);
		
	}
	const handleChangeEmail = e => {
      
		setEmail(e.target.value);
		
	}

	const handleChangeUsername = e => {
      
		setUsername(e.target.value);
		
	}
	const handleChangePassword = e => {
      
		setPassword(e.target.value);
		
	}


	const handleSignup =  async (e) => {
		setEmailConf("");
		setUsernameConf("");
    
		e.preventDefault();
		console.log("Signing up")
		

		if (Password !== Conf){


			setpassConfStatus("Passwords Don't Match: Confirm Password\n"); 

			return;
		}
		else{
			setpassConfStatus("");

		}
		/*Normal Update */
		
			try {
				const data =  await axios.post(`${baseUrl}/signup`, {
					FullName: Name,
					Email:Email,
					Username: Username,
					PasswordHash:Password
				  
				});
				
			
					
						


						if (data.data.hiddenU === "Username"){
						
							setUsernameConf("Username- invalid username; already used.\n");
						

					}
				

					if (data.data.hiddenE === "Email"){

						setEmailConf("Email- invalid Email; already used.\n");

					}

					if (data.data.status === "success"){

						setAccountCreated("Created");

					}

					
					
					
		
				
				setCredsList([data.data]);
				/** Update dataset list entries**/
				/** Reset entries**/
			
				
			} catch (err) {
				console.log(err.message);
			}
		
	}
    


  return (

   
    <body>
	<div class="container">
		{credsList.map(creds=> {if(accountCreated === "Created"){


return(
"/analysis")



		}	
		})}
		<div class="top">
			<h1 id="title" class="hidden"><span id="logo">Virus <span>Checkers</span></span></h1>
		</div>
		<div class="login-box animated fadeInUp">
			<div class="box-header">
				<h2>Create An Account</h2>
			</div>
			
			<div class="inputVal">

			{emailConf}
			<br/>
			{usernameConf}
			<br/>
			{passConfStatus}
				
				
				
			</div>

            <label for="name"> Full Name</label>
			<br/>
			<input onChange = {handleChangeName}type="text" id="name" />
			<br/>



            <label for="email">E-mail</label>
			<br/>
			<input onChange = {handleChangeEmail} type="text" id="Email" />
			<br/>



            <label for="username">Username</label>
			<br/>
			<input onChange = {handleChangeUsername}type="text" id="name" />
			<br/>



            <label for="password">Password</label>
			<br/>
			<input onChange = {handleChangePassword} type="password" id="password" />
			<br/>



			<label for="password">Confirm Password</label>
			<br/>
			<input  onChange = {handleChangeConf} type="password" id="password" />
			<br/>
			<form  onSubmit={handleSignup} >   <button type="submit">Sign Up</button></form>
			
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



