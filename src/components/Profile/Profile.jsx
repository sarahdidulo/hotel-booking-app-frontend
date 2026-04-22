import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../Navbar/Navbar";
import './Profile.css';
import { CurrentUserContext } from "../CurrentUserContext";
import { BannerContext } from "../Banner/BannerContext";
import SuccessBanner from "../Banner/SuccessBanner";
import InvalidBanner from "../Banner/InvalidBanner";


export default function Profile () {
    const prod_url = import.meta.env.VITE_PROD_URL;
    const { currentUser, reLogUserDetails, clearLoggedUser } = useContext(CurrentUserContext);
    const { successMessage, showSuccessMessage, clearSuccessMessage} = useContext(BannerContext);
    const [ username, setUserName ] = useState('');
    const [ firstname, setFirstName ] = useState(null);
    const [ middlename, setMiddleName ] = useState(null);
    const [ lastname, setLastName] = useState(null);
    const [ email, setEmail ] = useState('');
    const [ avatar, setAvatar ] = useState(null);
    const navigate = useNavigate();

    async function getUserDetails () {
        console.log("current user", currentUser.id)
        if(currentUser.id != undefined) {
            const response = await fetch(`${prod_url}/be-hotel-booking/user/user-details/${currentUser.id}`);
            const data = await response.json();
            console.log("data", data)
            if(data) {
                console.log("here", data.data[0].avatar)
                setAvatar(data.data[0].avatar);
                setEmail(data.data[0].email);
                setUserName(data.data[0].username);
                setFirstName(data.data[0].firstname ?? null);
                setMiddleName(data.data[0].middlename ?? null);
                setLastName(data.data[0].lastname ?? null);
            }
        }    
    }

    async function updateProfile (e) {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstname: firstname,
                middlename: middlename,
                lastname: lastname,
                avatar: avatar
            })
        } 
        try {
            const response = await fetch(`${prod_url}/be-hotel-booking/user/update-profile/${currentUser.id}`, requestOptions);
            const data = await response.json();
            if(data.success === true) {
                showSuccessMessage(true);

                setAvatar(data.user_data.avatar);
                setEmail(email);
                setUserName(username);
                setFirstName(data.user_data.firstname ?? null);
                setMiddleName(data.user_data.middlename ?? null);
                setLastName(data.user_data.lastname ?? null);
            } else {
                showSuccessMessage(false);
            }
        } catch (error) {
            console.log(error);
        }
        
    }

    function logout () {   
        sessionStorage.clear(); 
        clearLoggedUser();
        navigate('/');
    }

    useEffect(() => {
        let user_id = sessionStorage.getItem('user_id');
        let token = sessionStorage.getItem('token');
        reLogUserDetails(user_id, token);
        getUserDetails();
    }, [])

    return (
        <main className="profile-wrapper">
            <SuccessBanner />
            <InvalidBanner />
            <Navbar />
            {console.log("current user profile", currentUser)}
            {console.log("avatar", avatar)}
            <div className="profile-group">
                 <h2>Profile</h2>  
                <button className="button-style profile-log-out-button" onClick={logout}>Log Out</button>
            </div> 
                <form className="profile-form" onSubmit={updateProfile}>
                    <img className="profile-img" src={avatar ?? null} alt="profile"/>
                    <label>
                        Change your Avatar (add link):
                        <br />
                        <input type="text" 
                        onChange={(e)=>setAvatar(e.target.value)}
                        placeholder={avatar ?? ''} />
                    </label>
                    <label>
                        First Name:
                        <br />
                        <input type="text" 
                        onChange={(e)=>setFirstName(e.target.value)}
                        placeholder={firstname ?? 'Enter your first name'} />
                    </label>
                    <label>
                        Middle Name:
                        <br />
                        <input type="text" 
                        onChange={(e)=>setMiddleName(e.target.value)}
                        placeholder={middlename ?? 'Enter your middle name'} />
                    </label>
                    <label>
                        Last Name:
                        <br />
                        <input type="text" 
                        onChange={(e)=>setLastName(e.target.value)}
                        placeholder={lastname ?? 'Enter your last name'} />
                    </label>
                    <label>
                        Email:
                        <br />
                        <input type="text" 
                        placeholder={email ?? ''}
                        disabled />
                    </label>
                    <label>
                        Username: 
                        <br />
                        <input type="text" 
                        placeholder={username ?? ''}
                        disabled />
                    </label>
                    <button className="button-style profile-form-button">Update Profile Details</button>
                </form>
                  
        </main>
    );
}