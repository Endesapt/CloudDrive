import { useEffect, useState } from "react";
import axiosApi from "../../api_provider/axios-api";
import File from "./File/File";


export default function MyFiles(props){
    const {files,setFiles}=props;
    useEffect(()=>{
        setFiles([]);
        axiosApi.get("http://localhost:5000/cloud/getAllFiles").then((res)=>{
            setFiles(res.data);
        })
    },[]);

    return (<>
        {files.map((value)=>(<File key={value.id} id={value.id} name={value.name}  setFiles={setFiles} setModalText={props.setModalText} setModalActive={props.setModalActive}/>))}
    </>)
}