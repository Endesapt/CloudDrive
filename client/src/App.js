import {CookiesProvider} from 'react-cookie';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './Login/Login';
import { useState } from 'react';
import Register from './Register/Register';
import Main from './Main/Main';


function App() {

return (
    <CookiesProvider> 
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/*" element={<Main/>} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider> 
  );
}

export default App;
