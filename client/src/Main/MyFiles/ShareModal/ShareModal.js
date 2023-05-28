import {useState,useEffect} from "react"
import axiosApi from "../../../api_provider/axios-api";
export default function ShareModal(props){
    const setModalActive=props.setModalActive;
    const fileId=props.fileId;
    const [fileShares,setFileShares]=useState([]);
    const [choosedShare,setChoosedShare]=useState();
    const [fileShareName,setFileShareName]=useState("");
    useEffect(()=>{
       axiosApi.get("http://localhost:5000/cloud/getFileShares").then((res)=>{
        setFileShares(res.data);
        setChoosedShare(res.data[0].id);
       }) 
    },[])
    function Add(){
        axiosApi.post("http://localhost:5000/cloud/fileShare/addUsersFile",{id:fileId,fileShareId:choosedShare}).then((res)=>{
            setModalActive(false);
        })
        
    }
    function createFileShare(){
        axiosApi.post("http://localhost:5000/cloud/addFileShare",{name:fileShareName}).then((res)=>{
            const newFileShare=res.data.at(-1);
            axiosApi.post("http://localhost:5000/cloud/fileShare/addUsersFile",{id:fileId,fileShareId:newFileShare.id}).then((res)=>{
                setModalActive(false);
            })
        });
    } 
    return(<div>
        <p>Add to existing fileShare</p>
        <select
            value={choosedShare}
            onChange={e => setChoosedShare(e.target.value)}   
        >
            {
                fileShares.map((value)=>(<option key={value.id}value={value.id}>{value.name}</option>))
            }
        </select>
        <button onClick={Add}>Add</button>
        <p>Or</p>
        <p>FS name: <input value={fileShareName} onChange={e=>setFileShareName(e.target.value)}></input></p>
        <button onClick={createFileShare}>Create new fileShare</button>
    </div>)
}