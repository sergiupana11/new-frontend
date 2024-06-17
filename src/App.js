import './App.css';
import {Button, Input} from "@material-tailwind/react";
import axios from "axios";
import {useState} from "react";
import * as sweetalert2 from "sweetalert2";
import Swal2 from "sweetalert2";
import CarCardList from "./components/CarCardList";
import Register from "./pages/Register";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import CarDetails from "./pages/CarDetails";
import InsurancePage from "./pages/InsurancePage";

// localhost:8080/api/v1/users

function App() {

    const [data, setData] = useState("")

    const [cars, setCars] = useState([])

    const handleSubmit = () => {
        const options = {
            method: 'GET',
            url: 'http://localhost:8080/api/v1/users'
        }

        axios.request(options).then((res) => {
                console.log(res)
            }
        )
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register"
                       element={<Register />} />
                <Route path="/"
                       element={<Home />} />

                <Route path="/sign-in"
                       element={<SignIn /> } />

                <Route path="/cars/:carId"
                       element={<CarDetails /> } />

                <Route path="/insurance"
                       element={<InsurancePage />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;


// <div>
//     <Register/>
// </div>

// <div className="bg-gray-200 m-20 rounded-3xl border-2 border-black gap-10 h-screen justify-between flex-row">
//     <CarCardList/>
//     {/*{*/}
//     {/*    console.log(data)*/}
//     {/*}*/}
//     {/*<div className="h-96 w-full mx-4 mt-2 flex flex-row gap-36 ">*/}
//     {/*    <Input className="h-32" label="Make" onChange={(e) => setData(e.target.value)}/>*/}
//     {/*</div>*/}
//
//     {/*<Button className="bg-blue-400 animate-pulse" onClick={() => Swal2.fire(*/}
//     {/*    {*/}
//
//     {/*    }*/}
//     {/*)}>*/}
//     {/*    Submit*/}
//     {/*</Button>*/}
// </div>