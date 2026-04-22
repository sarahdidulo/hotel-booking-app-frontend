import { useNavigate, useParams } from "react-router";
import { useEffect, useState, useContext } from "react";
import './Booking.css';
import { Calendar } from 'primereact/calendar';
import loading  from "./../../assets/images/rotate.gif";
import { CurrentUserContext } from "../CurrentUserContext";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import Navbar from "../Navbar/Navbar";

export default function Booking () {
    let params = useParams();
    let roomId = params.roomId;
    const prod_url = import.meta.env.VITE_PROD_URL;
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [numberOfPersons, setNumberOfPersons] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [days, setDays] = useState(0);
    const [total, setTotal] = useState('');
    const [bookings, setBookings] = useState([]);
    const { currentUser, reLogUserDetails } = useContext(CurrentUserContext);
    const navigate = useNavigate();

    async function searchRoom() {
        try {
            const response = await fetch(`${prod_url}/be-hotel-booking/room/search-room/${roomId}`);
            const data = await response.json();
            if(data.success === true) {
                setName(data.data.name);
                setDescription(data.data.description);
                setPrice(data.data.price);
                setNumberOfPersons(data.data.numberOfPersons);
                setImageLink(data.data.imageLink);
            } else {
                console.log("error: ", data.success)
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function findBookings () {
        // search bookings of the room
        try {
            const response = await fetch(`${prod_url}/be-hotel-booking/booking/find-bookings/${roomId}`);
            const data = await response.json();
            console.log("data", data.data)
            if(data.success === true) {
                // console.log("fetched")
                // data.data.map((booking)=>{
                //     setBookings([...bookings, {
                //         booking_id: booking._id,
                //         startDate: booking.startDate,
                //         endDate: booking.endDate
                //     }])
                // })
                setBookings(data.data);
            } else {
                console.log("error: ", data.success)   
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    async function createBooking() {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, 
            body: JSON.stringify({
                userId: currentUser.id,
                roomId: roomId,
                roomImageLink: imageLink,
                roomName: name,
                startDate: startDate,
                endDate: endDate,
                totalDays: days,
                totalAmount: total
            })
        } 
        try {
            const response = await fetch(`${prod_url}/be-hotel-booking/booking/create-booking`, requestOptions);
            const data = await response.json();
            if(data.success === true){
                return true;
            } else {
                return false;
            }
            
        } catch (err) {
            console.log(err)
        }
    }
    //check if booking dates does not overlap on current bookings
    async function checkBooking () {
        // const navigate = useNavigate();
        let start_date = new Date(startDate);
        let end_date = new Date(endDate);
        let start_date_booking;
        let end_date_booking;

        let checker = 0;
        //map all bookings of the room
        findBookings();
        console.log("booking check", bookings)
        if(bookings.length != 0) {
             bookings.map((booking) => {

                start_date_booking = new Date(booking.startDate);
                end_date_booking = new Date(booking.endDate);
                console.log("start_date", start_date)
                console.log("end_date", end_date);
                console.log("booking start date", start_date_booking)
                console.log("booking end date", end_date_booking);
                //check if booking dates are not yet booked
                // (end_date >=  start_date_booking && end_date <= end_date_booking)
                // start_date <= end_date_booking
                // start_date >= start_date_booking
                if((start_date >= start_date_booking && start_date <= end_date_booking) || (end_date >=  start_date_booking && end_date <= end_date_booking)){
                    console.log("booking is false 1")
                    checker++;
                }
            })
        } else {
            console.log("new booking");
        }
        console.log("checker val", checker)
        // check if booking has been taken already. checker is more than 1.
        if(checker === 0) {
            const success = createBooking();
            if(success) {
                document.getElementById("booking-payment-modal").classList.add("opacity-set"); 
                document.getElementById("booking-payment-loading").style.display = "flex"; 
                setTimeout(() => {
                    document.getElementById("booking-payment-modal").classList.remove("opacity-set");  
                    document.getElementById("booking-payment-successful").style.display = "none"; 
                    navigate('/bookings');
                }, 5000);
                setTimeout(() => {
                    document.getElementById("booking-payment-loading").style.display = "none";
                    document.getElementById("booking-payment-successful").style.display = "block";
                }, 3000);
            } else {
                console.log("Booking failed. Please retry.")
            }
        } else {
            console.log("Booking already filled");
            document.getElementById("booking-filled-date").classList.add("opacity-set"); 
            setTimeout(() => {
                document.getElementById("booking-filled-date").classList.remove("opacity-set");   
            }, 3000);
        }
    }

    function getTotal() {
        let start = new Date(startDate);
        let end = new Date(endDate);
        let timeDifference = end - start;
        let daysDifference = timeDifference / (1000 * 3600 * 24);
        setDays(daysDifference);
        setTotal(daysDifference * price);
    }

    useEffect(() => {
        let user_id = sessionStorage.getItem('user_id');
        let token = sessionStorage.getItem('token');
        reLogUserDetails(user_id, token);
        searchRoom();
        if(bookings.length == 0) {
            findBookings();
        }
        getTotal();
    }, [(startDate && endDate),(total != 0)])

    return (
        <>
            <main id="booking-wrapper">
                <Navbar />
                <div className="booking">
                    <h2>{name}</h2>
                    <div className="booking-content">
                        <div className="booking-content-img">
                            <div className="booking-img">
                                <img src={imageLink} alt="hotel room"/>
                            </div>
                        </div>
                        <div className="booking-content-text">
                            <p className="booking-desc">{description}</p>
                            <p className="booking-number">Good for {numberOfPersons} person(s)</p>
                            <div className="booking-datepicker">
                                <p>From:</p>
                                    <Calendar placeholder="Start Date" value={startDate} onChange={(e) => setStartDate(e.value)} />
                                <p>to</p>
                                    <Calendar placeholder="End Date" value={endDate} onChange={(e) => setEndDate(e.value)} />                       
                            </div>
                            <p className="booking-price">Php {price} per day</p>
                            <p className="booking-days">Number of Days selected: {days}</p>
                            <p className="booking-total">Total Amount: Php {total}</p>
                            <div id="booking-filled-date">Booking dates have already been taken. Please choose a different date.</div>
                            <div id="booking-invalid-date">Please select a valid date.</div>
                            <p className="booking-check"> ▶ Please check the booking details before proceeding to payment.</p>
                            <button className="booking-button button-style" onClick={checkBooking}>Proceed to Payment ➔</button>
                        </div>
                    </div>   
                    <div id="booking-payment-modal" className="bg-white-box">
                        <div id="booking-payment-loading">
                            <img src={loading} alt="loading"/>
                            <p className="booking-payment-loading-text">Processing payment...</p>
                        </div>
                        <p id="booking-payment-successful">
                            Payment Success! Redirecting to your bookings...
                        </p>
                    </div>      
                </div>
            </main>    
        </>
    );
}