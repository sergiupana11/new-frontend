import CarCardList from "../components/CarCardList";
import {NavbarSimple} from "../components/Navbar";
import {Typography} from "@material-tailwind/react";

export default function Home() {

    return (
        <div>
            <NavbarSimple/>
            <div className="flex flex-col text-center m-10">
                <Typography variant="h5">
                    Rent your next car
                </Typography>
            </div>
            <CarCardList/>
        </div>
    )
}