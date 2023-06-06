import { Navigate, useParams } from "react-router-dom";
import axiosApi from "../api_provider/axios-api";

export default function FileShareLink(){
    const {id}=useParams();
    axiosApi.get(`http://localhost:5000/cloud/addFileShareLink/${id}`).then((res)=>{})    
    return <Navigate to="../"></Navigate>
}