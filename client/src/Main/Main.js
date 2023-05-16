import { useState } from "react";
import axios from "react";
import { useCookies } from "react-cookie";
import { Navigate,Link,Route,Routes } from "react-router-dom";
import axiosApi from "../api_provider/axios-api";
import "./Main.css"
import MyFiles from "./MyFiles/MyFiles";


export default function Main(){
    

    const isLogged=window.localStorage.getItem("accessToken");
    if(!isLogged)return <Navigate to="/login"/>

    function logout(){
        axiosApi.post("http://localhost:5000/api/logout").then(()=>{
            window.localStorage.removeItem("accessToken");
        });
    }
    return(
        <div id="wrapper">
            <nav >
                <Link to="/">Main</Link>
                <Link to="/">Download</Link>
                <Link to="/login" onClick={logout}>Logout</Link>
            </nav>
            <div id="div--main">
                <Routes>
                    <Route index element={<MyFiles/>}/>
                    <Route path="/fileshare/:id" element={<>FileshareId:</>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </div>
        </div>
    )

    
}

