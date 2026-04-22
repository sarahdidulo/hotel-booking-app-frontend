import './RoomList.css';
import { useState, useContext, useEffect } from 'react';
import { CurrentUserContext } from '../CurrentUserContext';
import RoomItem from '../RoomItem/RoomItem';
import CloseButton from '../CloseButton/CloseButton';
import { BannerContext } from "../Banner/BannerContext";
import Navbar from '../Navbar/Navbar';
import SuccessBanner from '../Banner/SuccessBanner';
import InvalidBanner from '../Banner/InvalidBanner';
// import FileUploader from '../FileUploader/FileUploader';
// import { PickerOverlay } from 'filestack-react';


export default function RoomList() {
    const image_api_key = import.meta.env.VITE_IMAGE_API_KEY;
    const prod_url = import.meta.env.VITE_PROD_URL;
    const { currentUser, rooms, getRooms, reLogUserDetails } = useContext(CurrentUserContext);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [numberOfPersons, setNumberOfPersons] = useState('');
    const [imageLink, setImageLink] = useState('');
    const [type, setType] = useState('-');
    const [capacity, setCapacity] = useState('-');
    const { successMessage, showSuccessMessage, clearSuccessMessage} = useContext(BannerContext);
    const [ filteredRooms, setFilteredRooms ] = useState([]);

    async function createRoom (e) {
        e.preventDefault();
           const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                description: description,
                price: price,
                numberOfPersons: numberOfPersons,
                imageLink: imageLink
            })
        } 
        try {
            const response = await fetch(`${prod_url}/be-hotel-booking/room/create-room`, requestOptions);
            const data = await response.json();
            if(data.success === true) {
                let modal = document.getElementById("room-list-modal");
                let modalBackground = document.getElementById('room-list-background');
                modalBackground.style.display = "none";
                modal.style.display = "none";
                showSuccessMessage(true);
                setName('');
                setDescription('');
                setPrice('');
                setNumberOfPersons('');
                setImageLink('');
                getRooms();
                
            } else {
                showSuccessMessage(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function openCreateRoomModal () {
        let modalBackground = document.getElementById('room-list-background');
        let modal = document.getElementById("room-list-modal");
        modal.style.display = "flex";
        modalBackground.style.display = "block";
    }

    function applyFilter () {
        const list = rooms.filter(room => {
            if(type != "-" && capacity == "-"){
                return  room.name.includes(type);
            } else if (type == "-" && capacity != "-"){
                return room.numberOfPersons === parseInt(capacity);
            } else if(type != "-" && capacity != "-") {
                return room.name.includes(type) && room.numberOfPersons === parseInt(capacity);
            }
        })
        setFilteredRooms(list);
    }

    useEffect(() => {    
         if(currentUser.id === undefined) {
            let user_id = sessionStorage.getItem('user_id');
            let token = sessionStorage.getItem('token');
            reLogUserDetails(user_id, token);
        }
        getRooms();
    },[filteredRooms])

    return (
        <>
            <SuccessBanner />
            <InvalidBanner />
            {/* {console.log("rooms", rooms)}
            {console.log("filtered", filteredRooms)} */}
            <main className="room-list-wrapper">
                <Navbar />
                <div id="room-list-background"></div>
                <h2>Rooms</h2>
                { (currentUser.isAdmin === true) && 
                    <button className="room-list-button button-style" onClick={openCreateRoomModal}>Create a Room</button>                
                }
                <div className="room-list-filter">
                    <div>
                        <p className="room-list-type-filter-text">Filter by Room Type:</p>
                        <select name={type} onChange={e => setType(e.target.value)}  
                        className="room-list-type-filter select-styles">
                            <option value="-">---</option>
                            <option value="Suite">Suite</option>
                            <option value="Standard">Standard</option>
                            <option value="Deluxe">Deluxe</option>
                            <option value="Business">Business</option>
                        </select>
                    </div>
                    <div>   
                        <p className="room-list-type-filter-text">Filter by Number of Capacity:</p>
                        <select name={capacity} onChange={e => setCapacity(e.target.value)} className="room-list-capacity-filter select-styles">
                            <option value="-">---</option>
                            <option value="2">Good for 2 persons</option>
                            <option value="3">Good for 3 persons</option>
                            <option value="4">Good for 4 persons</option>
                            <option value="10">Good for 10 persons</option>
                        </select>
                    </div>
                    <div className="room-list-filter-button-wrapper">
                        <button className="room-list-filter-button button-style" onClick={applyFilter}>Apply Filters</button>
                    </div>       
                </div>
            
                <div className="room-list">
                    { filteredRooms.length == 0 ? 
                        (rooms.map((room, index) => {
                            return(
                                <RoomItem 
                                    {...room}
                                    index={index}/>
                            );      
                        }) )
                     :
                    (
                        (filteredRooms.map((room, index) => {
                            return(
                                <RoomItem 
                                    {...room}
                                    index={index}/>
                            );      
                        }) )
                    )
                    }
                </div>
                <div id="room-list-modal" className="room-list-modal bg-white-box">
                    <CloseButton modalId="room-list-modal"/>
                    <form className="room-list-modal-form" onSubmit={createRoom}>
                        <label>
                            Name:
                            <br />
                            <input type="text" 
                            value={name} 
                            onChange={(e)=>setName(e.target.value)} 
                            placeholder="Enter a room name" />
                        </label>
                        <label>
                            Description:
                            <br />
                            <textarea type="text" 
                            value={description} 
                            onChange={(e)=>setDescription(e.target.value)} 
                            placeholder="Enter a description" />
                        </label>
                        <label>
                            Price:
                            <br />
                            <input type="number" 
                            value={price} 
                            onChange={(e)=>setPrice(e.target.value)} 
                            placeholder="Enter the price" />
                        </label>
                        <label>
                            Number of Persons:
                            <br />
                            {/* <input type="number" 
                            value={numberOfPersons} 
                            onChange={(e)=>setNumberOfPersons(e.target.value)} 
                            placeholder="Enter the Number of Persons" /> */}
                            <select className="select-styles" name={numberOfPersons} onChange={e => setNumberOfPersons(e.target.value)}>
                                <option value="-">---</option>
                                <option value="2">Good for 2 persons</option>
                                <option value="3">Good for 3 persons</option>
                                <option value="4">Good for 4 persons</option>
                                <option value="10">Good for 10 persons</option>
                            </select>
                        </label>
                        <label>
                            Choose an image:
                            <br />
                            <input type="text" 
                            value={imageLink} 
                            onChange={(e)=>setImageLink(e.target.value)}
                            placeholder="Add an Image Link" />
                        </label>
                        <button className="room-list-modal-button button-style">Create Room</button>          
                    </form>
                </div>
            </main>
        </>
    );
}