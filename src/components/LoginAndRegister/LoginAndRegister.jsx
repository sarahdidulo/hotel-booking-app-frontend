import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
// import { CurrentUserContext } from '../CurrentUserContext';
import './LoginAndRegister.css';
import SuccessBanner from '../Banner/SuccessBanner';
import InvalidBanner from '../Banner/InvalidBanner';
import { BannerContext } from "../Banner/BannerContext";
import { CurrentUserContext } from "../CurrentUserContext";

export default function LoginAndRegister() {
    
    //state current form is login or sign up form
    const prod_url = import.meta.env.VITE_PROD_URL;
    const [currentForm, setCurrentForm] = useState('login form');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validatePassword, setValidatePassword] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const { currentUser, logUserDetails } = useContext(CurrentUserContext);
    const { successMessage, showSuccessMessage, clearSuccessMessage} = useContext(BannerContext);
    

    const navigate = useNavigate();

    
    async function login(e) {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            withCredentials: true, 
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password
            })
        } 
        try {
            const response = await fetch(`${prod_url}/be-hotel-booking/auth/login`, requestOptions);
            const data = await response.json();
            console.log(data);
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user_id", data.user._id);
            sessionStorage.setItem("username", data.user.username);
            sessionStorage.setItem("isAdmin", data.user.isAdmin);
            logUserDetails(data.user._id, data.user.username, data.user.email, data.token, data.user.isAdmin);
            navigate('/room-list');
        } catch (err) {
            console.log(err);
        }
    }

    function loginForm () {
        return (
            <>
            <div className="login-form-wrapper">
                <h2>Login</h2>
                <form className="login-form" onSubmit={login}>
                    <label>
                        Email:
                        <br />
                        <input type="text" 
                        value={email} 
                        onChange={(e)=>setEmail(e.target.value)} 
                        placeholder="Enter your email" />
                    </label>
                    <label>
                        Password:
                         <br />
                        <input type="password" 
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)} 
                        placeholder="Enter your password" />
                    </label>
                    <div className="log-reg-link-group">
                        <button className="login-button button-style">Login</button>  
                        <a className="log-reg-form-link" href="#" onClick={()=> {setCurrentForm('sign up form')}}>Create an account</a>      
                    </div>       
                </form>
            </div>
            </>
        );    
    }

    async function signup (e) {
        e.preventDefault();
        if(confirmPassword !== password) {
            setValidatePassword(false);
        } else if(confirmPassword === password) {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true, 
                credentials: "include",
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    isAdmin: isAdmin
                })
            } 
            try {
                if(successMessage) {
                    clearSuccessMessage();
                } 
                const response = await fetch(`${prod_url}/be-hotel-booking/auth/register`, requestOptions);
                const data = await response.json();
                setValidatePassword(null);
                showSuccessMessage(true);
            } catch (err) {
                showSuccessMessage(false);
                console.log(err);
            }
        }
    }

    function signUpForm () {
        return (
            <div className="sign-up-form-wrapper">
                <h2>Create an Account</h2>
                <form className="sign-up-form" onSubmit={signup}>
                    <label>
                        Username:
                        <br />
                        <input type="text" 
                        value={username} 
                        onChange={(e)=>setUsername(e.target.value)} 
                        placeholder="Enter a username" />
                    </label>
                    <label>
                        Email:
                         <br />
                        <input type="text" 
                        value={email} 
                        onChange={(e)=>setEmail(e.target.value)} 
                        placeholder="Enter your email" />
                    </label>
                    <label>
                        Password
                         <br />
                        <input type="password" 
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)} 
                        placeholder="Enter your password" />
                    </label>
                    <label>
                        Confirm Password:
                         <br />
                        <input type="password" 
                        value={confirmPassword} 
                        onChange={(e)=>setConfirmPassword(e.target.value)} 
                        placeholder="Confirm your password" />
                    </label> 
                    <label>
                        I am an Admin <br />
                        <span className="sign-up-form-test">(for testing purposes)</span>
                         <br />
                        <input type="checkbox" 
                        className="sign-up-form-checkbox"
                        checked={isAdmin}
                        onChange={(e)=>setIsAdmin(e.target.checked)} />
                    </label> 
                    { validatePassword === false && <p style="color: red;">Passwords do not match.</p> }
                    <div className="log-reg-link-group">
                        <button className="sign-up-submit-button button-style">Submit</button>   
                        <a className="log-reg-form-link" href="#" onClick={()=> {setCurrentForm('login form')}}>Login your account</a>      
                    </div>      
                </form>
            </div>
        );
    }

    // useEffect(()=>{
    //     setSuccessMessage('');
    // })
    return (
        <>  
            <SuccessBanner />
            <InvalidBanner />
            <div className="log-reg-form-wrapper">
            {currentForm === 'login form' ? loginForm() : signUpForm() }
            </div>
        </>     
    );
}