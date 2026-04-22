import checkMark from '/src/assets/images/check-mark.png';
import './SuccessBanner.css';
import { useEffect } from 'react';

export default function SuccessBanner() {

    // useEffect(() => {
    //     document.getElementById("success-banner-wrapper").classList.add("opacity-set");
    //     setTimeout(() => {
    //     document.getElementById("success-banner-wrapper").classList.remove("opacity-set");          
    //     }, 2000);
    // }, [])

    return (
        <>
            <div id="success-banner-wrapper" className="success-banner-wrapper">
                <div id="success-banner">
                    <img src={checkMark} alt=""/> <p>Success!</p>
                </div>
            </div>
        </>
    );
}