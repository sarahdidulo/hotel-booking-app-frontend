import { NavLink } from "react-router";
import "./Navbar.css";
import logo from "./../../assets/images/logo.png"
import { useEffect, useContext, useState } from "react";
import { CurrentUserContext } from "../CurrentUserContext";
import menu from "./../../assets/images/menu.png";

export default function Navbar () {

    const prod_url = import.meta.env.VITE_PROD_URL;
    const { currentUser, reLogUserDetails } = useContext(CurrentUserContext);
    const [ avatarImg, setAvatarImg ] = useState(currentUser.avatar ?? '');

    // async function getAvatarImage () {
    //     console.log("here")
    //     if(currentUser.id != undefined) {
    //         console.log("here 2")
    //         console.log("current user id", currentUser.id)
    //         const response = await fetch(`${prod_url}/be-hotel-booking/user/user-details/${currentUser.id}`);
    //         const data = await response.json();
    //         console.log("ret data", data)
    //         if(data) {
    //             console.log("data here", data)
    //             setAvatarImg(data.avatar);
    //         }
    //     }
    // }

    function openNav (e) {
        e.preventDefault();
        let nav = document.getElementById("nav-list-mobile");
        let items = document.querySelectorAll(".nav-list-item");

        let nav_classList = nav.classList;
        let items_classList = items.classList;

        nav_classList.toggle("open-menu");
        items.forEach(item => {
            if(!(item.classList.contains("show"))) {
                setTimeout(() => {
                    item.classList.toggle("show") 
                }, 400)   
            } else {
                item.classList.toggle("show") 
            }
              
        })
        // items_classList.toggle("show");
        // if(nav.style.maxHeight == 0) {
        //     // nav.style.transition = "height 0.5s";
        //     items.forEach(item => {
        //         setTimeout(() => {
        //             item.style.display = "block";
        //         }, 1000)       
        //     })
        //     nav.style.transition = "all 1s";
        //     nav.style.maxHeight = "800px";
        // } else {
        //     items.forEach(item => {
        //         setTimeout(() => {
        //             item.style.display = "none";
        //         }, 500)
        //     })
        //     nav.style.maxHeight = 0;
        // }
        
    }

    useEffect(() => {
        let user_id = sessionStorage.getItem('user_id');
        let token = sessionStorage.getItem('token');
        reLogUserDetails(user_id, token);
    }, [])

    return (
        <nav className="nav-wrapper">
            {/* {console.log("current user...", currentUser)} */}
            <div className="nav">
                <div className="nav-logo">
                    <img src={logo} alt="hotel-logo" />
                    <h1>The Shack</h1>
                </div>
                <div className="nav-menu-button" onClick={openNav}>
                    <img className="nav-menu-button-img" src={menu} alt="menu-button" />
                </div>
                <ul className="nav-list">
                    <li>
                        <NavLink to="/room-list" id="bookings">
                            Rooms
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/bookings" id="bookings">
                            Bookings
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" id="profile" >
                            Profile
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" >
                            <img className="nav-list-avatar" src={currentUser.avatar ?? null} alt="user-avatar"/>
                        </NavLink>
                    </li>
                </ul>
            </div>
            
            <ul id="nav-list-mobile" className="nav-list-mobile">
                <li className="nav-list-item">
                    <NavLink to="/room-list" id="bookings">
                        Rooms
                    </NavLink>
                </li>
                <li className="nav-list-item">
                    <NavLink to="/bookings" id="bookings">
                        Bookings
                    </NavLink>
                </li>
                <li className="nav-list-item">
                    <NavLink to="/profile" id="profile" >
                        Profile
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}