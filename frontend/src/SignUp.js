import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './App.css';
import axios from "axios"
// Axios
const baseUrl = "http://localhost:5000";

const SignUp = () => {

	const navigate = useNavigate();
	const [Name, setName] = useState("");
	const [Email, setEmail] = useState("");
	const [Username, setUsername] = useState("");
	const [Password, setPassword] = useState("");
	const [Conf, setConf] = useState("");
	const [usernameConf, setUsernameConf] = useState("");
	const [emailConf, setEmailConf] = useState("");
	const [credsList, setCredsList] = useState([0]);
	const [passConfStatus, setpassConfStatus] = useState("");
	const [usernameStatus, setUsernameStatus] = useState("");
	const [emailStatus, setEmailStatus] = useState("");
	const [nameStatus, setNameStatus] = useState("");
	const [passStatus, setPassStatus] = useState("");
	const [accountCreated, setAccountCreated] = useState("");
	const regexEmail = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/gi;

	useEffect(() => {
		componentDidMount();
	}, []);

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

	const componentDidMount = () => {
		if (window.localStorage.getItem("token")) {
			//redirect to Login
			console.log("redirect to login");
			navigate("/analysis");
		}
	}

	//signup
	const handleSignup = async (e) => {
		setEmailConf("");
		setUsernameConf("");
		e.preventDefault();
		console.log("Signing up")

		if (Name.trim === "") { setNameStatus(" Name can't be empty"); return; }
		else { setNameStatus(""); }

		if (Email.trim === "") { setEmailStatus("Email can't be empty"); return; }
		else {
			if (!regexEmail.test(Email)) {

				setEmailStatus(" This isn't a valid Email.");
				return;
			}
			setEmailStatus("");
		}

		if (Username.trim === "") { setUsernameStatus("Username can't be empty"); return; }
		else { setUsernameStatus(""); }

		if (Password.trim === "") { setPassStatus("Password can't be empty"); return; }
		else { setPassStatus(""); }
		if (Password !== Conf) { setpassConfStatus("Passwords Don't Match: Confirm Password\n"); return; }
		else { setpassConfStatus(""); }

		try {
			const data = await axios.post(`${baseUrl}/signup`, {
				FullName: Name,
				Email: Email,
				Username: Username,
				PasswordHash: Password
			});

			if (data.data.hiddenU === "Username") {
				setUsernameConf("Username- invalid username; already used.\n");
			}


			if (data.data.hiddenE === "Email") {
				setEmailConf("Email- invalid Email; already used.\n");
			}

			if (data.data.status === "success") {
				setAccountCreated("Created");
				navigate("/");
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
				{credsList.map(creds => {
					if (accountCreated === "Created") {
						return (
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
						<br />
						{usernameConf}
						<br />
						{passConfStatus}
						<br />
						{passStatus}
						<br />
						{usernameStatus}
						<br />
						{emailStatus}
						<br />
						{nameStatus}
						<br />
					</div>

					<label for="name"> Full Name</label>
					<br />
					<input onChange={handleChangeName} type="text" id="name" />
					<br />

					<label for="email">E-mail</label>
					<br />
					<input onChange={handleChangeEmail} type="text" id="Email" />
					<br />

					<label for="username">Username</label>
					<br />
					<input onChange={handleChangeUsername} type="text" id="name" />
					<br />

					<label for="password">Password</label>
					<br />
					<input onChange={handleChangePassword} type="password" id="password" />
					<br />

					<label for="password">Confirm Password</label>
					<br />
					<input onChange={handleChangeConf} type="password" id="password" />
					<br />
					<form onSubmit={handleSignup} >   <button type="submit">Sign Up</button></form>

					<br />
					<span style={{ color: "#a29494", textAlign: "center", display: "inline-block", width: "100%" }}>
						Already have an account? <Link to="/">Sign In</Link>
					</span>
				</div>
			</div>

		</body>

	);
};


export default SignUp;



