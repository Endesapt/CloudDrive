import { useEffect, useState } from "react";
import axiosApi from "../../api_provider/axios-api";
import FileShareFile from "./FileShareFIle/FileShareFile";
import { useParams } from "react-router-dom";


export default function FileShare(props){
    const {files,setFiles}=props;
    const params=useParams();
    const [isShowed,setShowed]=useState(false);
    const fileShareId=params.id;
    const [userLink,setUserLink]=useState("");
    useEffect(()=>{
        setFiles([]);
        axiosApi.get("http://localhost:5000/cloud/fileShare/getAllFiles",{params:{fileShareId:fileShareId}}).then((res)=>{
            setFiles(res.data);
        })
        axiosApi.post("http://localhost:5000/cloud/fileShare/getFileShareLink",{fileShareId:fileShareId}).then((res)=>{
            setUserLink(res.data);
        })

    },[]);
    function handle(){
        setShowed((isShowed)=>(!isShowed));
    }
    function handleMouseOver(){
        if(isShowed)setShowed(false);
    }
    function deleteFileShare(){
        axiosApi.post("http://localhost:5000/cloud/fileShare/deleteFileShare",{fileShareId:fileShareId}).then((res)=>{
            window.location.href="../";
        })
    }
    function leaveFileShare(){
        axiosApi.post("http://localhost:5000/cloud/fileShare/leaveFileShare",{fileShareId:fileShareId}).then((res)=>{
            window.location.href="../";
        })
    }
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
                });
                
                }}>Submit</button><br/>
                Or give user link to this FileShare<br/>
            <span style={{color:"blue"}}>{userLink}</span>
            </div>);
    }
    return (<>
        <div className="dropdown">
            <button className="dropbtn" onClick={handle} >Options</button>
            <div id="drop-nav" onMouseLeave={handleMouseOver} className={"dropdown-content "+(isShowed?"show":"")}>
                <a onClick={leaveFileShare}>Leave FileShare</a>
                <a onClick={deleteFileShare}>Delete FileShare</a>
            </div>
        </div>
        <div className="addfileShare-button" onClick={addUser}>Add user to fileShare</div>
        {files.map((value)=>(<FileShareFile fileShareId={fileShareId}key={value.id} id={value.id} name={value.name}  setFiles={setFiles} setModalText={props.setModalText} setModalActive={props.setModalActive}/>))}
    </>)
}