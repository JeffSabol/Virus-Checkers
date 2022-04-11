import './App.css';
import SignUp from "./SignUp.js";
import Login from "./Login.js";
import axios from "axios"

import {useEffect,useState} from 'react';

const baseUrl = "http://localhost:5000";
const Analysis = () =>
  {
    const [Hash, setHash] = useState(""); 
    const [virusReply, setVirusReply] = useState(0); 
    const [curdsList, setcurdsList] = useState([0]);
    const [isLoading, setIsLoading] = useState([0]);


    const handleChangeHash = e => {
      
      setHash(e.target.value);
      console.log(Hash)
  }
  useEffect(() => {
    
  }, []);
  
 
  
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    setVirusReply(1);
    console.log("called here")
    
    /*Normal Update */
    
        try {
            const data = await axios.post(`${baseUrl}/hashes`, {
                Hash: Hash
              
            });
            
            setcurdsList([data.data]);
            /** Update dataset list entries**/
            /** Reset entries**/
            setHash("");
            
        } catch (err) {
            console.log(err.message);
        }
    
}

  
  
  return (
    
   
         <div className="App-header">

{ curdsList.map(curd=> {if(virusReply === 0) {
 return(<td>          <section>
            
  <h1 id="title" class="hidden"><span id="logo">Virus <span>Checkers</span></span></h1>

  </section>
  
<div class="container">
<form  onSubmit={handleSubmit} >
<input  onChange = {handleChangeHash} class="search" type="text" id="search" />
<input  class="submit" type="submit" value="Check Hash " />
</form>

</div></td>)

}
else
{
  
  console.log({curd});
  try {
    if(curd.error.code)
  {
    return(   
      <h1>   
       This doesn't appear to be a virus.
      </h1>
      )
  }
    
  } 
  catch (error) {
    while(isLoading)
    {
      console.log("doing this");
      
      {setTimeout(() => {
        console.log("delayed doing this");
        setIsLoading();
      }, 16000)
    }
      return(

        <div className="spinner-container">
      
        <div className="loading-spinner"></div>
      </div>

      )


    }
    

      console.log(error);
      return(   
  
        
        <section> 
  
  
 
  
        <h1>{curd["data.attributes.last_analysis_stats.malicious"]} engines find this to be malicious </h1>
        <tr>Name: {curd["data.attributes.meaningful_name"]}</tr>  
         <tr> File type: {curd["data.attributes.type_description"]}</tr> 
          <tr>Threat classification: {curd["data.attributes.popular_threat_classification.suggested_threat_label"]}</tr>  

            </section>
        
        )

    
   
    
  }

}


})}

      </div>
   
  );
}


export default Analysis;

