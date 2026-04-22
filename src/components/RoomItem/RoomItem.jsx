import { useState, useContext } from "react";
import { NavLink } from "react-router";
import defaultRoom from '../../assets/images/room.png';
import './RoomItem.css';
import CloseButton from "../CloseButton/CloseButton";
import { CurrentUserContext } from '../CurrentUserContext';
import { BannerContext } from "../Banner/BannerContext";
import SuccessBanner from "../Banner/SuccessBanner";
import InvalidBanner from "../Banner/InvalidBanner";

export default function RoomItem (props) {
    const prod_url = import.meta.env.VITE_PROD_URL;
    let roomId = props._id;
    let index = props.index;
    let name = props.name;
    let description = props.description;
    let price = props.price;
    let numberOfPersons = props.numberOfPersons;
    let imageLink = (props.imageLink != null) ? props.imageLink : defaultRoom;
    const { currentUser, rooms, getRooms, reLogUserDetails } = useContext(CurrentUserContext);
    const { successMessage, showSuccessMessage, clearSuccessMessage} = useContext(BannerContext);
    const [nameUpdate, setNameUpdate] = useState(name);
    const [descUpdate, setDescUpdate] = useState(description);
    const [priceUpdate, setPriceUpdate] = useState(price);
    const [numberOfPersonsUpdate, setNumberOfPersonsUpdate] = useState(numberOfPersons);
    const [imageLinkUpdate, setImageLinkUpdate] = useState(imageLink);

    function openViewModal () {
        let modal = document.getElementById("room-item-view-" + index);
        let modalBackground = document.getElementById('room-list-background');
        modal.style.display = "flex";
        modalBackground.style.display = "block";
    }

    async function updateRoom(e) {
        e.preventDefault();
           const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameUpdate,
                description: descUpdate,
                price: priceUpdate,
                numberOfPersons: numberOfPersonsUpdate,
                imageLink: imageLinkUpdate
            })
        } 
        try {
            const response = await fetch(`${prod_url}/be-hotel-booking/room/update-room/${roomId}`, requestOptions);
            const data = await response.json();
            if(data.success === true) {
                console.log(data)
                let modal = document.getElementById(`room-item-view-${index}`);
                let modalBackground = document.getElementById('room-list-background');
                modal.style.display = "none";
                modalBackground.style.display = "none";
                getRooms();   
                showSuccessMessage(true);
            } else {
                showSuccessMessage(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function openConfirmModal (e) {
        e.preventDefault();
        let modal = document.getElementById('confirm-modal');
        let modalBackground = document.getElementById('room-list-background');
        modalBackground.style.display = "block";
        modal.style.display = "flex";
    }
    async function deleteRoom (e) {
        e.preventDefault();
            try {
            const requestOptions = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const response = await fetch(`${prod_url}/be-hotel-booking/room/delete-room/${roomId}`, requestOptions);
            const data = await response.json();
            if(data.success === true) {
                console.log("data", data)
                let confirmModal = document.getElementById('confirm-modal');
                let modal = document.getElementsByClassName("room-item-view");
                let modalBackground = document.getElementById('room-list-background');
                confirmModal.style.display = "none";
                modal[0].style.display = "none";
                modalBackground.style.display = "none";
                getRooms();   
                showSuccessMessage(true);
            } else {
                showSuccessMessage(false);
            }
            } catch (error) {
                console.log(error);
            }
        return;
    }

    function closeConfirmModal (e) {
        e.preventDefault();
        let modal = document.getElementById('confirm-modal');
        let modalBackground = document.getElementById('room-list-background');
        modalBackground.style.display = "none";
        modal.style.display = "none";
    }

    return (
        <>
        <SuccessBanner />
        <InvalidBanner />
        <div id="confirm-modal" className="bg-white-box">
            <CloseButton modalId="confirm-modal" />
            <p>Are you sure you would like to delete this room?</p>
            <div className="confirm-modal-button-group">
                 <button className="button-style confirm-button" onClick={deleteRoom}>Yes</button>
                 <button className="button-style cancel-button" onClick={closeConfirmModal}>No</button>
            </div>
        </div>
        <li className="room-item" key={index}>
            <div className="room-item-img">
                <img src={imageLink} alt="Hotel room"/>
            </div>
            <p className="room-item-name">{name}</p>
            <p className="room-item-desc">{description}</p>
            <p className="room-item-number"> - Good for {numberOfPersons} person(s)</p>
            <p className="room-item-price">Php {price}</p>
            <button className="room-item-button button-style" onClick={(e) => openViewModal()}>
                {!currentUser.isAdmin ? 'View' : 'Update'}</button>
        </li>
        <div id={"room-item-view-" + index} className="room-item-view bg-white-box">
            <CloseButton modalId={"room-item-view-" + index} />
            <div className="room-item-view-img-outer">
                <img className="room-item-view-img" src={imageLink} alt="Room Image"/>
            </div>
            <div className="room-item-view-content">
            {
            !currentUser.isAdmin ? (
                <div>
                    <p className="room-item-view-name">{name}</p>
                    <p className="room-item-view-desc">{description}</p>
                    <p className="room-item-number"> - Good for {numberOfPersons} person(s)</p>
                    <p className="room-item-price">Php {price}</p>

                    <a href={"/booking/" + roomId} className="room-item-view-button button-style">Book this Room ➔</a>
                </div>
            ) : (  
                <form className="room-item-update-form">
                    <label>
                        Name:
                        <br />
                        <input type="text" 
                        onChange={(e)=>setNameUpdate(e.target.value)}
                        placeholder={nameUpdate ?? ''} />
                    </label>
                    <label>
                        Description:
                        <br />
                        <textarea type="text" 
                        onChange={(e)=>setDescUpdate(e.target.value)} 
                        placeholder={descUpdate ?? ''} />
                    </label>
                    <label>
                        Price:
                        <br />
                        <input type="number" 
                        onChange={(e)=>setPriceUpdate(e.target.value)} 
                        placeholder={priceUpdate ?? ''} />
                    </label>
                    <label>
                        Number of Persons:
                        {/* <br />
                        <input type="number" 
                        onChange={(e)=>setNumberOfPersonsUpdate(e.target.value)} 
                        placeholder={numberOfPersonsUpdate ?? ''}/> */}
                        <select name={numberOfPersonsUpdate} onChange={e => setNumberOfPersonsUpdate(e.target.value)} className="select-styles">
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
                        onChange={(e)=>setImageLinkUpdate(e.target.value)}
                        placeholder={imageLinkUpdate ?? ''} />
                    </label>
                    <button className="room-item-update-button button-style" onClick={updateRoom}>Update Room</button> 
                    <button className="room-item-delete-button button-style" onClick={openConfirmModal}>Delete Room</button>       
                </form>
                )
                }     
            </div>
        </div>
        </>   
    )
}