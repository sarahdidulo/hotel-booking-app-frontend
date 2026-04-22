
import closeButton from "./../../assets/images/close-button.png";

export default function CloseButton (props) {
    let modalId = props.modalId;

    function removeModalDisplay () {
        let modal = document.getElementById(modalId);
        let modalBackground = document.getElementById('room-list-background');
        modal.style.display = "none";
        modalBackground.style.display = "none";
    }

    return(
        <>
            <div className="close-button" onClick={removeModalDisplay}>
                <img src={closeButton} alt="close-button"/>
            </div>
        </>
    );
}