import { useEffect, useState, useContext } from "react";
import { CurrentUserContext } from "../CurrentUserContext";
import "./BookingList.css";
import Navbar from "./../Navbar/Navbar";

export default function BookingList () {

    const prod_url = import.meta.env.VITE_PROD_URL;
    const [bookings, setBookings] = useState([]);
    const { currentUser, reLogUserDetails } = useContext(CurrentUserContext);

    async function getRoomImageLink (roomId) {
        const response = await fetch(`${prod_url}/be-hotel-booking/room/search-room/${roomId}`);
        const room = await response.json();
        return room.data.imageLink;
    }

    async function getBookings () {    
        try {
            if(currentUser.id !== undefined){
                const response = await fetch(`${prod_url}/be-hotel-booking/booking/booking-list/${currentUser.id}`);
                const data = await response.json();
                if(data.success === true) {
                    setBookings(data.data);       
                } else {
                    console.log(data.success);
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    function convertDate (date) {
        const converted_date = new Date(date);
        let month = converted_date.getMonth() + 1;
        let day = converted_date.getDate();
        if(month.toString().length === 1) {
            month = `0` + month.toString();
        }
        if(day.toString().length === 1) {
            day = `0` + day.toString();
        }
        return `${month}` + `-${day}` + `-${converted_date.getFullYear()}` ;
    }

    useEffect(() => {
        if(currentUser.id === undefined) {
            let user_id = sessionStorage.getItem('user_id');
            let token = sessionStorage.getItem('token');
            reLogUserDetails(user_id, token);
        }
        getBookings();
    }, [])

    return (
        <main className="booking-list">
            <Navbar />
            <h2>Bookings</h2>
            { bookings.length == 0 && <p className="booking-check">No bookings yet. Check our list of <a href="/room-list">rooms</a>.</p> }
            <div className="booking-list-group">
                {
                    bookings.map((booking, index) => {
                        return (
                            <li className="booking-item" key={index}>
                                <div className="booking-item-image">
                                    <img src={booking.roomImageLink} alt="hotel room" />    
                                </div>
                                <div className="booking-item-text">
                                    <p className="booking-item-room-name">{booking.roomName}</p>
                                    <p className="booking-item-startDate">Check-in:  {convertDate(booking.startDate)}</p>
                                    <p className="booking-item-endDate">Check-out:  {convertDate(booking.endDate)}</p>
                                    <p className="booking-item-totalDays">Number of days:  {booking.totalDays}</p>
                                    <p className="booking-item-totalAmount">Total Amount:  Php {booking.totalAmount}</p>  
                                </div>
                            </li>
                            )
                    }) 
                }
            </div>
        </main>
    );
}