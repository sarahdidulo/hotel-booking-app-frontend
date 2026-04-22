
import { BrowserRouter as Router, Routes, Route } from "react-router";
import "./assets/styles/main.css";
import RoomList from "./components/RoomList/RoomList";
import LandingPage from "./components/LandingPage/LandingPage";
import Booking from "./components/Booking/Booking";
import BookingList from "./components/BookingList/BookingList";
import Profile from "./components/Profile/Profile";

export default function App() {

  return (
    <>
      <Router>
        <Routes>
            <Route index element={
              <LandingPage /> }/>
            <Route path="room-list" element={
              <RoomList/>}/>
            <Route path="booking/:roomId" element={
              <Booking/>}/>
            <Route path="bookings" element={
              <BookingList/>}/>
             <Route path="profile" element={
              <Profile/>}/> 
            {/* <Route path="dashboard/overview" element={
              <DashboardTemplate>
                  <Overview />
              </DashboardTemplate> }/> */}
            
        </Routes>
        </Router>   
    </>
  )
}

