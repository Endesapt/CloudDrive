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
        <div class="wrapper">
        <section class="login-content">
           <div class="container h-100">
              <div class="row justify-content-center align-items-center height-self-center">
                 <div class="col-md-5 col-sm-12 col-12 align-self-center">
                    <div class="sign-user_card">
                       <h3 class="mb-3">Sign Up</h3>
                       <p>Create your  account.</p>
                       <form onSubmit={submitForm}>
                          <div class="row">
                             <div class="col-lg-12">
                                <div class="floating-label form-group">
                                   <input class="floating-input form-control" type="email" placeholder=" " onChange={(e)=>{setLogin(e.target.value)}} value={login}/>
                                   <label>Email</label>
                                </div>
                             </div>
                             <div class="col-lg-6">
                                <div class="floating-label form-group">
                                   <input class="floating-input form-control" type="password" placeholder=" " onChange={(e)=>{setPassword(e.target.value)}} value={password}/>
                                   <label>Password</label>
                                </div>
                             </div>
                          </div>
                          <button type="submit" class="btn btn-primary">Sign Up</button>
                          <p class="mt-3">
                             Already have an Account <Link to="/login" class="text-primary">Sign In</Link>
                          </p>
                          {error&&(
                            <div class="alert alert-danger" role="alert">
                                <div class="iq-alert-text">{error}</div>
                            </div>
                            )
                            }
                          
                       </form>
                    </div>
                 </div>
              </div>
           </div>
        </section>
        </div>
    )
}
{/* <div>
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
        
    </div> */}

