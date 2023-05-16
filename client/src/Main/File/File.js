import { useState } from "react";
import "./File.css"
import axiosApi from "../../api_provider/axios-api";
export default function File(props){
    const [isShowed,setShowed]=useState(false);
    const id=props.id;
    const [name,ext]=props.name.split(".");
    function handle(){
        setShowed((isShowed)=>(!isShowed));
    }
    function handleMouseOver(){
        if(isShowed)setShowed(false);
    }
    function showFile(){
        axiosApi.get("http://localhost:5000/cloud/getFileById",{params:{id:id}}).then(res=>{
            const iframe = "<iframe width='100%' height='100%' src='" + res.data + "'></iframe>"
            const x = window.open();
            x.document.open();
            x.document.write(iframe);
            x.document.close();
        }).catch(()=>{window.location.reload()});
    }
    function downloadFile(){
        axiosApi.get("http://localhost:5000/cloud/getFileById",{params:{id:id}}).then(res=>{
            const data = res.data;
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
        axiosApi.delete("http://localhost:5000/cloud/deleteFileById",{params:{id:id}}).then(res=>{
            props.setUpdate(!props.update);
        });
    }
    return(<div className="file-block">
        <div>
            <div className="file-name">{props.name}</div>
            <div className="dropdown">
                <button className="dropbtn" onClick={handle} >Dropdown</button>
                <div onMouseLeave={handleMouseOver} className={"dropdown-content "+(isShowed?"show":"")}>
                    <a onClick={showFile}>Show</a>
                    <a onClick={downloadFile}>Download</a>
                    <a onClick={deleteFile}>Delete</a>
                    <a href="#contact">Rename</a>
                    <a href="#contact">Share</a>
                </div>
            </div>
        </div>
        <img className={ext}></img>
    </div>)
}