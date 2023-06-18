import { useState ,useRef} from "react";
import axios from "react";
import { useCookies } from "react-cookie";
import { Navigate,Link,Route,Routes ,useSearchParams, useParams} from "react-router-dom";
import axiosApi from "../api_provider/axios-api";
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
            <div className="iq-sidebar  sidebar-default ">
                <div className="iq-sidebar-logo d-flex align-items-center justify-content-between">
                    <a href="index.html" className="header-logo">
                        <h2>Cloud Drive</h2>
                    </a>
                    <div className="iq-menu-bt-sidebar">
                        <i className="las la-bars wrapper-menu" />
                    </div>
                </div>
                <div className="data-scrollbar" data-scroll={1}>
                    <div className="new-create select-dropdown input-prepend input-append">
                        <div className="btn-group">
                            <div data-toggle="dropdown">
                                <div className="search-query selet-caption">
                                    <i className="las la-plus pr-2" />
                                    Create New
                                </div>
                                <span className="search-replace" />
                                <span className="caret">{/*icon*/}</span>
                            </div>
                            <ul className="dropdown-menu">
                                <li >
                                    <div className="item" onClick={handleDownloadClick}>
                                        <i className="ri-file-upload-line pr-3" />
                                        Upload File
                                        <Routes>
                                        <Route index element={<input onChange={handleFileChange} id="file-input" type="file" name="name" style={{display:"none"}}ref={hiddenFileInput} />}/>
                                        <Route path="fileshare/*" element={<input onChange={handleFileShareFileChange} id="file-input" type="file" name="name" style={{display:"none"}}ref={hiddenFileInput} atrr="ПРРР"/>}/>
                                        </Routes>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <nav className="iq-sidebar-menu">
                        <ul id="iq-sidebar-toggle" className="iq-menu">
                            <li className="active">
                                <Link to="/" className="">
                                    <i className="las la-home iq-arrow-left" />
                                    <span>Dashboard</span>
                                </Link>
                                <ul
                                    id="dashboard"
                                    className="iq-submenu collapse"
                                    data-parent="#iq-sidebar-toggle"
                                ></ul>
                            </li>

                            <li className=" ">
                                <Link to="/fileshares" className="">
                                    <i class="las la-share-alt"></i>
                                    <span>FileShares</span>
                                </Link>
                                <ul
                                    id="page-files"
                                    className="iq-submenu collapse"
                                    data-parent="#iq-sidebar-toggle"
                                ></ul>
                            </li>
                            
                        </ul>
                    </nav>
                    <div className="sidebar-bottom">
                        <Link to="/login"onClick={logout} class="btn btn-outline-primary view-more mt-4">Logout</Link>
                    </div>
                    <div className="p-3" />
                </div>
            </div>{" "}
            <div className="iq-top-navbar">
                <div className="iq-navbar-custom">
                    <nav className="navbar navbar-expand-lg navbar-light p-0">
                        <div className="iq-navbar-logo d-flex align-items-center justify-content-between">
                            <i className="ri-menu-line wrapper-menu" />
                           
                        </div>
                        
                        
                    </nav>
                </div>
            </div>
            <div class="content-page">
                <div class="container-fluid">
                    <Routes>
                        <Route index element={<MyFiles files={files} setFiles={setFiles} setModalActive={setModalActive} setModalText={setModalText} />}/>
                        <Route path="fileshare/:id" element={<FileShare files={files} setFiles={setFiles} setModalActive={setModalActive} setModalText={setModalText}/>}/>
                        <Route path="fileshares" element={<FileShares setModalActive={setModalActive} setModalText={setModalText}/>}/>
                        <Route path="*" element={<Navigate to="/"/>}/>
                    </Routes>
                </div>
                
            </div>
            
        </div>
  
    )

    
}
{/* <nav>
                <Link to="/">Main</Link>
                <Link onClick={handleDownloadClick}>Download</Link>
                <Routes>
                <Route index element={<input onChange={handleFileChange} id="file-input" type="file" name="name" style={{display:"none"}}ref={hiddenFileInput} />}/>
                <Route path="fileshare/*" element={<input onChange={handleFileShareFileChange} id="file-input" type="file" name="name" style={{display:"none"}}ref={hiddenFileInput} atrr="ПРРР"/>}/>
                </Routes>
                <Link to="/login" onClick={logout}>Logout</Link>
                <Link to="/fileshares" >FileShares</Link>
            </nav> */}

