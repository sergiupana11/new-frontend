import './App.css';
import Register from "./pages/Register";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import CarDetails from "./pages/CarDetails";
import InsurancePage from "./pages/InsurancePage";
import MyCars from "./pages/MyCars";

// localhost:8080/api/v1/users

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