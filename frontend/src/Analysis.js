import './App.css';
import SignUp from "./SignUp.js";
import Login from "./Login.js";
import axios from "axios"

import {useEffect,useState} from 'react';

const baseUrl = "http://localhost:5000";
const Analysis = () =>
  {
    const [Hash, setHash] = useState(""); 


    const handleChangeHash = e => {
      setHash(e.target.value);
      console.log(Hash)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("called here")
    
    /*Normal Update */
    
        try {
            const data = await axios.post(`${baseUrl}/hashes`, {
                Hash: Hash
         
            });
            /** Update dataset list entries**/
            /** Reset entries**/
            setHash('');
            
        } catch (err) {
            console.log(err.message);
        }
    
}

  
  
  return (

    
   
         <div className="App-header">
          <section>
          <h1 id="title" class="hidden"><span id="logo">Virus <span>Checkers</span></span></h1>

          </section>
          
	<div class="container">
    <form  onSubmit={handleSubmit} >




    <input  onChange = {handleChangeHash} class="search" type="text" id="search" />
		<input  class="submit" type="submit" value="Check Hash " />
    </form>
		
	</div>
         
        

      </div>
   
  );
}


export default Analysis;

