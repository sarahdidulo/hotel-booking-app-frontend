import warning from '/src/assets/images/warning.png';
import './InvalidBanner.css';
import { useEffect } from 'react';

export default function InvalidBanner() {

    // useEffect(() => {
    //     document.getElementById("invalid-banner-wrapper").classList.add("opacity-set");
    //     setTimeout(() => {
    //     document.getElementById("invalid-banner-wrapper").classList.remove("opacity-set");          
    //     }, 2000);
    // }, [])

    return (
        <>
            <div id="invalid-banner-wrapper" className="invalid-banner-wrapper">
                <div id="invalid-banner">
                    <img src={warning} alt="" /> <p>Invalid</p>
                </div>
            </div>
        </>
    );
}