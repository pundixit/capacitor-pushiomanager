import logo from './logo.svg';
import './App.css';
import React, { Component,useState } from 'react';
import { PushIOManager,LogLevel, EngagementType} from '@oracle/capacitor-pushiomanager';
import { Capacitor } from '@capacitor/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import Messagecenter  from './Messagecenter/Messagecenter.js' ;
import Home  from './Home.js' ;
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import AppHeader from './AppHeader';
//import history from './history';
import MessageCenterDetails  from './Messagecenter/MessageCenterDetails.js' ;

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";


function App() {

return(
    <div>
      <AppHeader />
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/Home/Messagecenter" element={<Messagecenter/>} />
      <Route path="/Messagecenter" element={<Messagecenter/>} />
      <Route path="/MessageCenterDetails" element={<MessageCenterDetails/>} />
      </Routes>
      
    </div>
  );
}

export default App;

