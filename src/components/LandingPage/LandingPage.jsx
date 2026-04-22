// import LoginAndRegister from "../LoginAndRegister/LoginAndRegister";
import './LandingPage.css';
import logo from '../../assets/images/logo.png';
import LoginAndRegister from "./../LoginAndRegister/LoginAndRegister";

export default function LandingPage () {
      return (
        <>
          <main className="landing-page-wrapper">
            <div className="landing-page">
              <div className="landing-page-group">
                <div className="landing-page-logo-group">
                  <img className="landing-page-logo" src={logo} alt="logo"/><h1>The Shack</h1>
                </div>
                <div className="landing-page-login bg-white-box">
                  <LoginAndRegister />
                </div>
              </div>
            </div>
          </main>
        </>
      )
}