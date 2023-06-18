import { useState } from "react";

import axiosApi from "../../../api_provider/axios-api";
import ShareModal from "../ShareModal/ShareModal";
export default function File(props){
    const id=props.id;

    function showFile(){
        axiosApi({
            url: "http://localhost:5000/cloud/getFileById", //your url
            method: 'GET',
            responseType: 'blob', // important
            params:{id:id}
        }).then(res=>{
            const data =URL.createObjectURL(res.data);
            const link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute('target', "_blank");
            link.style.display = 'none';
            document.body.appendChild(link);
            
            link.click();
            
            document.body.removeChild(link);

        });
    }
    function downloadFile(){
        axiosApi({
            url: "http://localhost:5000/cloud/getFileById", //your url
            method: 'GET',
            responseType: 'blob', // important
            params:{id:id}
        }).then(res=>{
            const data = URL.createObjectURL(res.data);
            const link = document.createElement('a');
            
            link.setAttribute('href', data);
            link.setAttribute('download',props.name);
            link.style.display = 'none';
            
            document.body.appendChild(link);
            
            link.click();
            
            document.body.removeChild(link);
        });
    }
    function deleteFile(){
        axiosApi.delete("http://localhost:5000/cloud/deleteFileById",{params:{id:id}}).then(res=>{
            props.setFiles(res.data);
        });
    }
    function renameFile(){
        const setModalActive=props.setModalActive;
        const setModalText=props.setModalText;
        setModalActive(true);
        setModalText(<div>
            <p>NEW NAME: <input id="newName"></input></p>
            <button onClick={()=>{
                const newName=document.getElementById("newName").value;
                axiosApi.put("http://localhost:5000/cloud/updateFileById",{id:id,newName:newName}).then(res=>{
                    props.setFiles(res.data);
                });
                setModalActive(false);
                document.getElementById("newName").value="";
                }}>Change</button>
            </div>);
    }
    function shareFile(){
        const setModalActive=props.setModalActive;
        const setModalText=props.setModalText;
        setModalActive(true);
        setModalText(<ShareModal setModalActive={setModalActive} fileId={id}/>);
    }
    return(
        <tr>
        <td>
          <div className="d-flex align-items-center">
            <div className="icon-small bg-danger rounded mr-3">
              <i className="ri-file-excel-line" />
            </div>
            <div
              onClick={showFile}
              style={{ cursor: "pointer" }}
            >
              {props.name}
            </div>
          </div>
        </td>
        <td>02 MB</td>
        <td>
          <div className="dropdown">
            <span
              className="dropdown-toggle"
              id="dropdownMenuButton6"
              data-toggle="dropdown"
            >
              <i className="ri-more-fill" />
            </span>
            <div
              className="dropdown-menu dropdown-menu-right"
              aria-labelledby="dropdownMenuButton6"
            >
              <a className="dropdown-item" onClick={showFile}>
                <i className="ri-eye-fill mr-2" />
                View
              </a>
              <a className="dropdown-item" onClick={deleteFile}>
                <i className="ri-delete-bin-6-fill mr-2" />
                Delete
              </a>
              <a className="dropdown-item" onClick={renameFile}>
                <i className="ri-pencil-fill mr-2" />
                Edit
              </a>
              <a className="dropdown-item" onClick={shareFile}>
                <i className="ri-printer-fill mr-2" />
                Share
              </a>
              <a className="dropdown-item" onClick={downloadFile}>
                <i className="ri-file-download-fill mr-2" />
                Download
              </a>
            </div>
          </div>
        </td>
      </tr>
   )
}
