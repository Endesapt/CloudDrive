import { useState } from "react";
import axiosApi from "../../../api_provider/axios-api";
export default function FileShareFile(props){
    const [isShowed,setShowed]=useState(false);
    const id=props.id;
    const [name,ext]=props.name.split(".");
    const fileShareId=props.fileShareId;
    function handle(){
        setShowed((isShowed)=>(!isShowed));
    }
    function handleMouseOver(){
        if(isShowed)setShowed(false);
    }
    function showFile(){
        axiosApi({
            url: "http://localhost:5000/cloud/fileShare/getFileById", //your url
            method: 'GET',
            responseType: 'blob', // important
            params:{id:id,fileShareId:fileShareId}
        }).then(res=>{
            const dataURL =URL.createObjectURL(res.data);
            window.location.href=dataURL;
            
        });
    }
    function downloadFile(){
        axiosApi({
            url: "http://localhost:5000/cloud/fileShare/getFileById", //your url
            method: 'GET',
            responseType: 'blob', // important
            params:{id:id,fileShareId:fileShareId}
        }).then(res=>{
            const data = URL.createObjectURL(res.data);
            const link = document.createElement('a');
            
            link.setAttribute('href', data);
            link.setAttribute('download',name);
            link.style.display = 'none';
            
            document.body.appendChild(link);
            
            link.click();
            
            document.body.removeChild(link);
        });
    }
    function deleteFile(){
        axiosApi.delete("http://localhost:5000/cloud/fileShare/deleteFileById",{params:{id:id,fileShareId:fileShareId}}).then(res=>{
            props.setFiles(res.data);
        });
    }
    function renameFile(){
        const setModalActive=props.setModalActive;
        const setModalText=props.setModalText;
        setModalActive(true);
        setModalText(<div>
            <p>NEW NAME: <input id="newName"></input></p>
            <button onClick={()=>{
                const newName=document.getElementById("newName").value;
                axiosApi.put("http://localhost:5000/cloud/fileShare/updateFileById",{id:id,newName:newName,fileShareId:fileShareId}).then(res=>{
                    props.setFiles(res.data);
                });
                setModalActive(false);
                document.getElementById("newName").value="";
                }}>Change</button>
            </div>);
    }
    return(<div className="file-block">
        <div>
            <div className="file-name">{props.name}</div>
            <div className="dropdown">
                <button className="dropbtn" onClick={handle} >Options</button>
                <div id="drop-nav" onMouseLeave={handleMouseOver} className={"dropdown-content "+(isShowed?"show":"")}>
                    <a onClick={showFile}>Show</a>
                    <a onClick={downloadFile}>Download</a>
                    <a onClick={deleteFile}>Delete</a>
                    <a onClick={renameFile}>Rename</a>
                    <a href="#contact">Share</a>
                </div>
            </div>
        </div>
    </div>)
}