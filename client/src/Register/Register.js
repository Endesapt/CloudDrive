import { useState } from "react";
import { Navigate, redirect,Link } from "react-router-dom";
import axios from 'axios';


export default function Login(props){
    const [logged,setLogged]=useState(false);
    const [login,setLogin]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");
    function submitForm(e){
        e.preventDefault();
        axios.post("http://localhost:5000/api/registration",{
            email:login,
            password:password,
        }).then((res)=>{
            const {accessToken}=res.data;
            window.localStorage.setItem("accessToken",accessToken);
            setLogged(true);
        }).catch((e)=>{
            console.log(e);
            setError(e.response?.data?.message?e.response?.data?.message:e.message);
            
        });
    }
    if(logged){return <Navigate to="/"/>}
    return(
    
    <div>
        <h1>Registration</h1>
        <form onSubmit={submitForm}>
            <input placeholder="login" onChange={(e)=>{setLogin(e.target.value)}} value={login} ></input>
            <input placeholder="password" onChange={(e)=>{setPassword(e.target.value)}} value={password}></input>
            <input type="submit" value="Register"></input>
        </form>
        {error&&(
            <div>Error: {error}</div>
        )
        }
        <h2>Your are already registered?</h2>
        <Link to="/login"><p>Login</p></Link>
        
    </div>)
}

