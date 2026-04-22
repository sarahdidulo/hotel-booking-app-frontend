import { createContext, useState } from "react";

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({children}) => {
    const prod_url = import.meta.env.VITE_PROD_URL;
    const [currentUser, setCurrentUser] = useState("");
    const [rooms, setRooms] = useState([]);

    async function logUserDetails (id, username, email, token, isAdmin) {
        setCurrentUser({
            id: id,
            username: username,
            email: email,
            token: token,
            isAdmin: isAdmin
        });
    }

    const clearLoggedUser = () => {
        setCurrentUser({
            id: '',
            email: '',
            username: '',
            token: '',
            isAdmin: ''
        })
    }

    async function reLogUserDetails (id, token) {  
        const response = await fetch(`${prod_url}/be-hotel-booking/user/user-details/${id}`);
        const data = await response.json();
        // console.log("id", data.data[0]._id);
        setCurrentUser({
            id: data.data[0]._id,
            token: token,
            username: data.data[0].username,
            email: data.data[0].email,
            isAdmin: data.data[0].isAdmin,
            avatar: data.data[0].avatar
        })
        console.log("relog", currentUser.id)
        // return currentsUser;
    }
    
    async function getRooms () {
        try {
            const response = await fetch(`${prod_url}/be-hotel-booking/room/all-rooms`);
            const data = await response.json();
            setRooms(data);
            return rooms;
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <CurrentUserContext.Provider value={{currentUser, logUserDetails, clearLoggedUser, 
                reLogUserDetails, rooms, getRooms}}>
                {children}
            </CurrentUserContext.Provider>
        </>
       
    );
}