import { useEffect, useState } from "react";
import axiosApi from "../../api_provider/axios-api";
import File from "../File/File";


export default function MyFiles(){
    const [files,setFiles]=useState([]);
    const [update,setUpdate]=useState(true);
    useEffect(()=>{
        axiosApi.get("http://localhost:5000/cloud/getAllFiles").then((res)=>{
            setFiles(res.data);
        })
    },[update]);

    return (<>
        {files.map((value)=>(<File key={value.id} id={value.id} name={value.name} setUpdate={setUpdate} update={update} />))}
    </>)
}