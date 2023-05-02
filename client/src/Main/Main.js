import { useState } from "react";
import axios from "react";
import { useCookies } from "react-cookie";
import { Navigate,Link,Route,Routes } from "react-router-dom";
import axiosApi from "../api_provider/axios-api";
import "./Main.css"


export default function Main(){
    const [files,setFiles]=useState([]);


    const isLogged=window.localStorage.getItem("accessToken");
    if(!isLogged)return <Navigate to="/login"/>


    return(
        <div id="wrapper">
            <nav >
                <Link to="/">Main</Link>
                <Link to="/">Download</Link>
                <Link to="/">Logout</Link>
            </nav>
            <div id="div--main">
                <Routes>
                    <Route index element={<>ZIEG HEIL</>}/>
                    <Route path="/fileshare/:id" element={<>FileshareId:</>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </div>
        </div>
    )

    
}

