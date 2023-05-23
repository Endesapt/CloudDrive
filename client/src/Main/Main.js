import { useState ,useRef} from "react";
import axios from "react";
import { useCookies } from "react-cookie";
import { Navigate,Link,Route,Routes ,useSearchParams, useParams} from "react-router-dom";
import axiosApi from "../api_provider/axios-api";
import "./Main.css"
import MyFiles from "./MyFiles/MyFiles";
import FileShare from "./FileShare/FileShare";
import FileShares from "./FileShares/FileShares";


export default function Main({setModalActive,setModalText}){
    const hiddenFileInput=useRef(null);
    const params=useParams()
    const[files,setFiles]=useState([]);
    const isLogged=window.localStorage.getItem("accessToken");
    if(!isLogged)return <Navigate to="/login"/>

    function logout(){
        axiosApi.post("http://localhost:5000/api/logout").then(()=>{
            window.localStorage.removeItem("accessToken");
        });
    }
    function handleDownloadClick(){
        hiddenFileInput.current.click();
    }
    function handleFileChange(e){
        const file=e.target.files[0];
        let formData = new FormData();
        formData.append("file", file);
        axiosApi.post('http://localhost:5000/cloud/addFile', formData,{
            headers: {
              "Content-Type": "multipart/form-data",
            }
          }).then((res)=>{setFiles(res.data)});

    }
    function handleFileShareFileChange(e){
        const file=e.target.files[0];
        let formData = new FormData();
        const pathnames=window.location.pathname.split('/');
        const fileShareId=pathnames.at(-1);
        formData.append("file", file);
        formData.append("fileShareId", fileShareId);
        axiosApi.post('http://localhost:5000/cloud/fileShare/addFile',formData,{
            headers: {
              "Content-Type": "multipart/form-data",
            }
          }).then((res)=>{setFiles(res.data)});

    }
    //input для костыля
    return(
        <div id="wrapper">
            <nav >
                <Link to="/">Main</Link>
                <Link onClick={handleDownloadClick}>Download</Link>
                <Routes>
                <Route index element={<input onChange={handleFileChange} id="file-input" type="file" name="name" style={{display:"none"}}ref={hiddenFileInput} />}/>
                <Route path="fileshare/*" element={<input onChange={handleFileShareFileChange} id="file-input" type="file" name="name" style={{display:"none"}}ref={hiddenFileInput} atrr="ПРРР"/>}/>
                </Routes>
                <Link to="/login" onClick={logout}>Logout</Link>
                <Link to="/fileshares" >FileShares</Link>
            </nav>
            <div id="div--main">
                <Routes>
                    <Route index element={<MyFiles files={files} setFiles={setFiles} setModalActive={setModalActive} setModalText={setModalText} />}/>
                    <Route path="fileshare/:id" element={<FileShare files={files} setFiles={setFiles} setModalActive={setModalActive} setModalText={setModalText}/>}/>
                    <Route path="fileshares" element={<FileShares setModalActive={setModalActive} setModalText={setModalText}/>}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </Routes>
            </div>
        </div>
    )

    
}

