import { useForm } from "react-hook-form";
import './SignUp.css';
import axios from "axios";
import { Link } from "react-router-dom";

export default function SignUp({ setIsAuthenticated, setUsername }){
    const {register, handleSubmit, formState : {errors}} = useForm();
    const onSignUp = async (data)=>{
        try {
            console.log(data);
            const res = await axios.post("http://localhost:3000/signup",data);
            console.log(res);
            setIsAuthenticated(true);
            setUsername(data.username);
        } catch (error) {
            console.error("Signup error:", error);
        }
    };
    return (
        <div className="container nunito-sans-light">
            <div className="signup">
                <h2>Create an Account</h2>
                <form onSubmit={handleSubmit(onSignUp)}>
                    <input id="name" placeholder="Name" type="text"
                        {...register("name",{
                            required:"Name is required",
                            pattern:{
                                value:/[a-zA-Z]+/,
                                message:"Name is required"
                            },
                        })}
                    />
                    {errors.name && <span className="error">{errors.name.message}</span>}
                    <input id="username" placeholder="username" type="text"
                        {...register("username",{
                            required:"Username is required",
                            pattern:{
                                value:/^[a-zA-Z0-9_]+$/,
                                message: "Username can only contain lowercase,uppercase,digits and underscore "
                            }
                        })}
                    />
                    {errors.username && <span className="error">{errors.username.message}</span>}
                    <input id="password" placeholder="password" type="password"
                        {...register("password",{
                            required:"Password is required",
                            pattern:{
                                value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                message: 'Password must containe a lowercase, a uppercase, a symbol and a digit and a minimum length of 8 character'
                            }
                        })}
                    />
                    {errors.password && <span className="error">{errors.password.message}</span>}
                    <button type="submit nunito-sans-light">Submit</button>
                </form>
            </div>
            <div className="login">
                <p>Already an user? <Link to="/login" style={{color: "rgb(250, 128, 114)"}}>Login</Link></p>
            </div>
        </div>
    );
}