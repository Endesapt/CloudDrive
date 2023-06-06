import {CookiesProvider} from 'react-cookie';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './Login/Login';
import { useState } from 'react';
import Register from './Register/Register';
import Main from './Main/Main';
import Modal from './Modal/Modal';
import FileShareLink from './FileShareLink/FileShareLink';


function App() {
  const [modalActive,setModalActive]=useState(false);
  const [modalText,setModalText]=useState();
return (
    <CookiesProvider> 
      <BrowserRouter>
        <Routes>
          <Route path="/addFileShareLink/:id" element={<FileShareLink/>}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/*" element={<Main setModalText={setModalText} setModalActive={setModalActive}/>} />
        </Routes>
        <Modal active={modalActive} setActive={setModalActive}>{modalText}</Modal>
      </BrowserRouter>
    </CookiesProvider> 
  );
}

export default App;
