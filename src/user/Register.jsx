import React, { useState } from 'react'
import {registerUser} from './RegisterApi'
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [error, setError] = useState({});
    const [session, setSession] = useState({});
    const navigate = useNavigate()
    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        registerUser({user_id: -1, username:  data.get('username'),email: data.get('email') ,password: data.get('password')},
            (result) => {
                console.log(result);
                setSession(result);
                if (result?.token) {
                    navigate('/lists'); // Redirect to the dashboard or desired page
                }
                form.reset();
                setError({});
            }, (loginError) => {
                console.log(loginError);
                setError(loginError);
                setSession({});
            });
    }
    return (
        <div className="register-container">
        <form onSubmit={handleSubmit} className="register-form">
            <h2>Sign Up</h2>
            <input
                name="username"
                placeholder="Username"
                className="input-field"
            /><br />
            <input
                type="email"
                name="email"
                placeholder="Email"
                className="input-field"
            /><br />
            <input
                type="password"
                name="password"
                placeholder="Password"
                className="input-field"
            /><br />
            <button type="submit" className="submit-button">Sign Up</button>
        </form>
    </div>
    )
}

export default Register
