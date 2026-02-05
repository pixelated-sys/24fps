import { useForm } from "react-hook-form";
import './Login.css';
import axios from "axios";
import { Link } from "react-router-dom";

export default function Login({ setIsAuthenticated }){
    const {register, handleSubmit, formState : {errors}} = useForm();
    const onSignUp = async (data)=>{
        try {
            console.log(data);
            const res = await axios.post("http://localhost:3000/signup",data);
            console.log(res);
            localStorage.setItem('isAuthenticated', 'true');
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Signup error:", error);
        }
    };
    return (
        <div className="container nunito-sans-light">
            <div className="login">
                <h2>Login</h2>
                <form onSubmit={handleSubmit(onSignUp)}>
                    <input id="login-username" placeholder="username" type="text"
                        {...register("loginUsername",{
                            required:"Username is required",
                            pattern:{
                                value:/^[a-zA-Z0-9_]+$/,
                                message: "Username can only contain lowercase,uppercase,digits and underscore "
                            }
                        })}
                    />
                    {errors.loginUsername && <span className="error">{errors.loginUsername.message}</span>}
                    <input id="login-password" placeholder="password" type="password"
                        {...register("loginPassword",{
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