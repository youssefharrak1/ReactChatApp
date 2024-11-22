import { useState } from "react";
import { loginUser } from "./loginApi";
import { Session } from "../model/common";
import { CustomError } from "../model/CustomError";
import { Link, useNavigate } from "react-router-dom";

export function Login() {

    const [error, setError] = useState({} as CustomError);
    const [session, setSession] = useState({} as Session);
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        loginUser({ user_id: -1, username: data.get('login') as string, password: data.get('password') as string },
            (result: Session) => {
                console.log(result);
                setSession(result);
                if (result?.token) {
                    navigate('/lists'); // Redirect to the dashboard or desired page
                }
                form.reset();
                setError(new CustomError(""));
            }, (loginError: CustomError) => {
                console.log(loginError);
                setError(loginError);
                setSession({} as Session);
            });
    };

    return (
         <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <input
                    name="login"
                    placeholder="Enter your login"
                    className="input-field"
                /><br />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="input-field"
                /><br />
                <button type="submit" className="submit-button">Connexion</button>
            </form>

            {error?.message && (
                <span className="error-message">{error.message}</span>
            )}

            <div className="register-link-container">
                <p>Don’t have an account?</p>
                <Link to="/register" className="register-link">Register here</Link>
            </div>
        </div>
    
    );
}