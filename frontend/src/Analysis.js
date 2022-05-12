import './App.css';
import axios from "axios"

import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:5000";

const Analysis = () => {

  const regexExpSHA256 = /^[a-f0-9]{64}$/gi;
  const regexExpMD5 = /^[a-f0-9]{32}$/gi;

  const [Hash, setHash] = useState("");
  const [isEmpty, setIsEmpty] = useState("");
  const [isValidHash, setIsValidHash] = useState("");
  const [virusReply, setVirusReply] = useState(0);
  const [curdsList, setcurdsList] = useState([0]);
  const [loggedUser, setLoggedUser] = useState([0]);
  const [isLoading, setIsLoading] = useState(1);
  const navigate = useNavigate();

  const handleChangeHash = e => {

    setHash(e.target.value);
    console.log(Hash)
  }

  useEffect(() => {
    componentDidMount();
    getUserData();


  }, []);

  const getUserData = async () => {

    let token = window.localStorage.getItem("token");
    try {
      const data = await axios.post(`${baseUrl}/users`, {
        token: token

      });
      setLoggedUser(data.data);
      console.log("Logged in User: " + data.data.Username + " , " + data.data.FullName + " , " + data.data.Email);

      /** Update dataset list entries**/
      /** Reset entries**/


    } catch (err) {
      console.log(err.message);
    }

  }

  const componentDidMount = () => {
    if (!window.localStorage.getItem("token")) {
      //redirect to Login
      console.log("redirect to login");
      navigate("/");
    }
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(1);
    setIsValidHash("");
    setIsEmpty("");

    console.log("called here")

    /*Normal Update */

    if((regexExpSHA256.test(Hash.trim()) || regexExpMD5.test(Hash.trim())) && !(Hash.trim() === "")){
     
      try {
        const data = await axios.post(`${baseUrl}/hashes`, {
          Hash: Hash

        });

        
        setcurdsList([data.data]);
        /** Update dataset list entries**/
        /** Reset entries**/
        setHash("");
        setVirusReply(1);

      } catch (err) {
        console.log(err.message);
      }

    }
    else{
      console.log("Not a 256 hash");



      if(!(Hash === "")){

        setIsValidHash("not a valid hash (must be SHA256 or MD5)");
      }
      else
        setIsEmpty("You have to enter something, man.");
    }
  }


  return (


    <div className="App-header">


      <nav id="topnav">


        <a id="logo" class="nav-link" >

          <img class="imgLogo" src="https://i.imgur.com/IyLfb58.png"></img>
        </a>



        <div class="dropdown" >
          <span> <a id="logo" class="nav-link" >

            <img class="imgLogo" src="https://i.imgur.com/B4U7Uij.png"></img>
          </a></span>





          <div class="dropdown-content">
            <p>{loggedUser.Username}</p>
            <p>{loggedUser.FullName}</p>
            <p> {loggedUser.Email}</p>


          </div>
        </div>


        <a class="nav-link" href='./About'>About</a>
        <button1 id="logoutBtn"
          onClick={e => {
            window.localStorage.removeItem("token");
            setLoggedUser([0]);
            navigate("/");

          }}
        >
          Logout
        </button1>





      </nav>

      <p class="inputVal">{isValidHash}</p>
            <p class="inputVal">{isEmpty}</p>
          


      {curdsList.map(curd => {

        if (virusReply === 0) {



          return (



            <td>




              <section>



                <div id="VirusCheckers">
                  <img id="VirusLogo" src="https://i.imgur.com/IyLfb58.png"></img>
                  <h1 id="title" class="hidden"><span id="logo">Virus <span>Checkers</span></span></h1>
                </div>



              </section>

              <div class="container">
                <form onSubmit={handleSubmit} >
                  <input onChange={handleChangeHash} class="search" type="text" id="search" />
                  <input class="submit" type="submit" value="Check Hash " />
                </form>


              </div></td>)

        }
        else {

          console.log({ curd });

          // run for 2.5 sec

          if (!(curd.inLocalDb)) {
            while (isLoading) {
              console.log("doing this");

              {
                setTimeout(() => {
                  console.log("delayed doing this");
                  setIsLoading(0);
                }, 2500)
              }
              return (

                <div className="spinner-container">

                  <div className="loading-spinner"></div>
                </div>

              )
            }

          }

          try {
            if ((curd.error.message === "Resource not found.") || (curd.error.code === "NotFoundError")) {
              return (
                <section>



                  <h1>
                    This doesn't appear to be a virus.
                  </h1>

                  <button2
                    onClick={e => {
                      navigate("/analysis");

                      setIsLoading(1);
                      setVirusReply(0);


                    }}
                  >
                    Check another Hash
                  </button2>
                </section>




              )
            }

          }
          catch (error) {

            if (!(curd.inLocalDb)) {
              while (isLoading) {
                console.log("doing this");

                {
                  setTimeout(() => {
                    console.log("delayed doing this");
                    setIsLoading(0);
                  }, 2500)
                }
                return (

                  <div className="spinner-container">

                    <div className="loading-spinner"></div>
                  </div>

                )
              }

            }
            return (



              <section>

                <h1>{curd["data.attributes.last_analysis_stats.malicious"]} out of {curd["data.attributes.last_analysis_stats.malicious"] + curd["data.attributes.last_analysis_stats.undetected"]} engines find this to be malicious </h1>
                <tr>Popular Name: {curd["data.attributes.meaningful_name"]}</tr>
                <tr> File type: {curd["data.attributes.type_description"]}</tr>
                <tr> File size: {curd["data.attributes.size"]} KB</tr>
                <tr>Threat classification: {curd["data.attributes.popular_threat_classification.suggested_threat_label"]}</tr>
                <tr>MD5 representation: {curd["data.attributes.md5"]}</tr>
                <tr>SHA256 representation: {curd["data.attributes.sha256"]}</tr>
                <tr>Number of times submitted: {curd["data.attributes.times_submitted"]}</tr>
                <tr>First Submission Date: {new Date(curd["data.attributes.first_submission_date"] * 1000).toLocaleString("en-US")}</tr>
                <tr>Last Submission Date: {new Date(curd["data.attributes.last_submission_date"] * 1000).toLocaleString()}</tr>


                <button2 onClick={e => {
                  navigate("/analysis");
                  setIsLoading(1);
                  setVirusReply(0);

                }}
                >
                  Check another Hash
                </button2>

              </section>


            )




          }

        }


      })}

    </div>

  );
}

export default Analysis;





/**
 cd frontend
 npm install
 npm start




 cd backend
 npminstall
 cd node_modules/node-virustotal/ 
 emacs v3.js
 *edit the default API key and  change default delay*
 cd ....
 node index.js








 */