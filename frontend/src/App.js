import './App.css';
import Login from "./Login.js";
import SignUp from "./SignUp.js";
import Analysis from "./Analysis.js";
import About from "./About.js";

import { Route,Routes } from 'react-router-dom';
import {useEffect,useState} from 'react';

function App() {
  
  return (

    <Routes>
      <Route path='/' element={<Login />} />
       <Route path='/signup' element={<SignUp />} />
       <Route path='/analysis' element={<Analysis />} />
       <Route path='/about' element={<About />} />
    </Routes>

  );
}

export default App;
