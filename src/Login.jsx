import { useForm } from "react-hook-form";
import './Login.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login({ setIsAuthenticated }){
    const {register, handleSubmit, formState : {errors}, reset, resetField} = useForm();
    //const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const onSignUp = async (data)=>{
        try {
            console.log(data);
            const res = await axios.post("http://localhost:3000/api/auth/login",data); 
            if (res =="notFound"){
                setErrorMessage("Incorrect username. User not registered.");
                reset();
                //setTimeout(() => navigate("/signup"), 2000);
            }
            else if(res == "incorrectPassword"){
                setErrorMessage("Incorrect Password");
                resetField("password");
            }
            else{
                console.log(res);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Signup error:", error);
        }
    };
    return (
        <div className="container nunito-sans-light">
            <div className="login">
                <h2>Login</h2>
                {errorMessage && <p className="error" style={{textAlign: "center", marginBottom: "10px"}}>{errorMessage}</p>}
                <form onSubmit={handleSubmit(onSignUp)}>
                    <input id="username" placeholder="username" type="text"
                        {...register("username",{
                            required:"Username is required",
                            pattern:{
                                value:/^[a-zA-Z0-9_]+$/,
                                message: "Username can only contain lowercase,uppercase,digits and underscore"
                            }
                        })}
                    />
                    {errors.loginUsername && <span className="error">{errors.loginUsername.message}</span>}
                    <input id="password" placeholder="password" type="password"
                        {...register("password",{
                            required:"Password is required",
                            pattern:{
                                value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                message: 'Password must containe a lowercase, a uppercase, a symbol and a digit'
                            }
                        })}
                    />
                    {errors.loginPassword && <span className="error">{errors.loginPassword.message}</span>}
                    <button type="submit nunito-sans-light">Submit</button>
                </form>
            </div>
            <div className="signup-link">
                <p>Don't have an account? <Link to="/signup" style={{color: "rgb(250, 128, 114)"}}>Sign Up</Link></p>
            </div>
        </div>
    );
}