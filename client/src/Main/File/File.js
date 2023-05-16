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
    return(<div className="file-block">
        <div>
            <div className="file-name">{props.name}</div>
            <div className="dropdown">
                <button className="dropbtn" onClick={handle} >Dropdown</button>
                <div onMouseLeave={handleMouseOver} className={"dropdown-content "+(isShowed?"show":"")}>
                    <a onClick={showFile}>Show/Download</a>
                    <a href="#about">Delete</a>
                    <a href="#contact">Rename</a>
                    <a href="#contact">Share</a>
                </div>
            </div>
        </div>
        <img className={ext}></img>
    </div>)
}