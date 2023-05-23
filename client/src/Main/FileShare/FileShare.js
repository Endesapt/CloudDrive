import { useEffect, useState } from "react";
import axiosApi from "../../api_provider/axios-api";
import FileShareFile from "./FileShareFIle/FileShareFile";
import { useParams } from "react-router-dom";


export default function FileShare(props){
    const {files,setFiles}=props;
    const params=useParams();
    const fileShareId=params.id;
    useEffect(()=>{
        setFiles([]);
        axiosApi.get("http://localhost:5000/cloud/fileShare/getAllFiles",{params:{fileShareId:fileShareId}}).then((res)=>{
            setFiles(res.data);
        })
    },[]);
    function addUser(){
        const setModalActive=props.setModalActive;
        const setModalText=props.setModalText;
        setModalActive(true);
        setModalText(<div>
            <p>User mail: <input id="newName"></input></p>
            <button onClick={()=>{
                const userMail=document.getElementById("newName").value;
                axiosApi.put("http://localhost:5000/cloud/fileShare/addAllowedUser",{userMail:userMail,fileShareId:fileShareId}).then(res=>{
                    setModalActive(false);
                    document.getElementById("newName").value="";
                    alert("SUCCESS")
                });
                
                }}>Submit</button>
            </div>);
    }
    return (<>
        <div className="addfileShare-button" onClick={addUser}>Add user to fileShare</div>
        {files.map((value)=>(<FileShareFile fileShareId={fileShareId}key={value.id} id={value.id} name={value.name}  setFiles={setFiles} setModalText={props.setModalText} setModalActive={props.setModalActive}/>))}
    </>)
}