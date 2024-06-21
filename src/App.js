import './App.css';
import Register from "./pages/Register";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import CarDetails from "./pages/CarDetails";
import InsurancePage from "./pages/InsurancePage";
import MyCars from "./pages/MyCars";
import MyRentals from "./pages/MyRentals";
import MyReviews from "./pages/MyReviews";
import Profile from "./pages/Profile";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register"
                       element={<Register/>}/>
                <Route path="/"
                       element={<Home/>}/>

                <Route path="/sign-in"
                       element={<SignIn/>}/>

                <Route path="/cars/:carId"
                       element={<CarDetails/>}/>

                <Route path="/insurance"
                       element={<InsurancePage/>}/>

                <Route path="/my-cars"
                       element={<MyCars/>}/>

                <Route path="/my-rentals"
                       element={<MyRentals/>}/>

                <Route path="/profile"
                       element={<Profile/>}/>

                <Route path="/profile/reviews"
                       element={<MyReviews/>}/>

            </Routes>
        </BrowserRouter>
    );
}

export default App;
