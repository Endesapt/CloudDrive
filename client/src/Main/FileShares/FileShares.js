import { useEffect, useState } from "react";
import axiosApi from "../../api_provider/axios-api";
import { Link } from "react-router-dom";

export default function FileShares(props){
    const [fileShares,setFileShares]=useState([]);
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
        
        <div className="col-lg-12 ">
            <div className="card card-block card-stretch card-height files-table">
                <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                        <h4 className="card-title">FileShares <button type="button" class="btn btn-primary btn-sm mr-2"onClick={addNewFileShare}>Add new fileShare</button></h4>
                        
                    </div>
                </div>
                <div className="card-body pt-0">
                    <div className="table-responsive">
                        <table className="table mb-0 table-borderless tbl-server-info">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col" />
                                </tr>
                            </thead>
                            <tbody>
                                {fileShares.map((val) => (<tr>

                                    <Link  key={val.id} to={"/fileshare/"+val.id}> <td className="fileshare-name d"><b>{val.name}</b></td></Link>

                                </tr>))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </>)

}
