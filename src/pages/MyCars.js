import {NavbarSimple} from "../components/Navbar";
import {Typography} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import CarCardList from "../components/CarCardList";
import {AddNewCarDialog} from "../components/AddNewCarDialog";

export default function MyCars() {

    const [token, setToken] = useState('')

    useEffect(() => {
        setToken(localStorage.getItem('jwt'))
    }, [token])

    return (
        <div>
            <NavbarSimple/>
            <div className="flex flex-col text-center m-10">
                <Typography variant="h5">
                    My cars
                </Typography>
            </div>
            <AddNewCarDialog/>

            <CarCardList token={token} showMyCars/>
        </div>
    )
}