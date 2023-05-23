import { useEffect, useState } from "react";
import axiosApi from "../../api_provider/axios-api";
import { Link } from "react-router-dom";
import "./FileShares.css"

export default function FileShares(props){
    const [fileShares,setFileShares]=useState([])
    useEffect(function(){
        axiosApi.get("http://localhost:5000/cloud/getFileShares").then((res)=>{
            setFileShares(res.data);
        })
    },[]);
    function addNewFileShare(){
        const setModalActive=props.setModalActive;
        const setModalText=props.setModalText;
        setModalActive(true);
        setModalText(<div>
            <p>FileShareName: <input id="newName"></input></p>
            <button onClick={()=>{
                const newName=document.getElementById("newName").value;
                axiosApi.post("http://localhost:5000/cloud/addFileShare",{name:newName}).then(res=>{
                    setFileShares(res.data);
                    setModalActive(false);
                    document.getElementById("newName").value="";
                });
                
                }}>Submit</button>
            </div>);
    }
    return(<>
        <div className="addfileShare-button" onClick={addNewFileShare}>Add new fileShare</div>
        {fileShares.map((val)=>(<Link key={val.id} to={"/fileshare/"+val.id} className="fileshare-block">
        <div className="fileshare-name">FileShare Name:{val.name}</div>
    </Link>))}
    </>)

}