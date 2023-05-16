import { useState } from "react";
import axios from "react";
import { useCookies } from "react-cookie";
import { Navigate,Link,Route,Routes ,useSearchParams} from "react-router-dom";
import axiosApi from "../api_provider/axios-api";
import "./Main.css"
import MyFiles from "./MyFiles/MyFiles";


export default function Main(){
    const hiddenFileInput=useRef(null);
    const [searchParams,setSearchParams]=useSearchParams();
    const id=searchParams.get('id');
    const isLogged=window.localStorage.getItem("accessToken");
    if(!isLogged)return <Navigate to="/login"/>

    function logout(){
        axiosApi.post("http://localhost:5000/api/logout").then(()=>{
            window.localStorage.removeItem("accessToken");
        });
    }
    function handleDownloadClick(){
        if (!file) {
            return;
        }
    }
    function handleFileChange(e){
    }
    //input для костыля
    return(
        <div id="wrapper">
            <nav >
                <Link to="/">Main</Link>
                <Link to="." onClick={handleDownloadClick}>Download</Link>
                <input onChange={handleFileChange} id="file-input" type="file" name="name" style="display: none;" ref={hiddenFileInput} />
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

