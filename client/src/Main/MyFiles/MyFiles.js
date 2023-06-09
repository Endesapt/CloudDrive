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
        <div className="col-lg-12 ">
            <div className="card card-block card-stretch card-height files-table">
                <div className="card-header d-flex justify-content-between">
                    <div className="header-title">
                        <h4 className="card-title">Files</h4>
                    </div>
                </div>
                <div className="card-body pt-0">
                    <div className="table-responsive">
                        <table className="table mb-0 table-borderless tbl-server-info">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Size</th>
                                    <th scope="col" />
                                </tr>
                            </thead>
                            <tbody>
                                {files.map((value) => (<File key={value.id} id={value.id} name={value.name} setFiles={setFiles} setModalText={props.setModalText} setModalActive={props.setModalActive} />))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </>)
}


