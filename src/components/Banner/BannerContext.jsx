import { createContext, useState } from "react";
import SuccessBanner from "./SuccessBanner";
import InvalidBanner from "./InvalidBanner";

export const BannerContext = createContext();

export const BannerProvider = ({children}) => {

    const [ successMessage, setSuccessMessage ] = useState('');

    const showSuccessMessage = (success) => {
        // const tempdata = successMessage.toLowerCase();
        if (success === true) {
            setSuccessMessage(true);
            document.getElementById("success-banner-wrapper").classList.add("opacity-set");
            setTimeout(() => {
            document.getElementById("success-banner-wrapper").classList.remove("opacity-set");          
            }, 2000);
        } else if(success === false){
            setSuccessMessage(false);
            document.getElementById("invalid-banner-wrapper").classList.add("opacity-set");
            setTimeout(() => {
            document.getElementById("invalid-banner-wrapper").classList.remove("opacity-set");          
            }, 2000);
        }
    }

    const clearSuccessMessage = () => {
        setSuccessMessage('');
    }

    return (
        <>
            <BannerContext.Provider value={{successMessage, showSuccessMessage, clearSuccessMessage}}>
                {children}
            </BannerContext.Provider>
        </>
    );
}

