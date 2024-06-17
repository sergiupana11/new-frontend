import {NavbarSimple} from "../components/Navbar";
import {Button, Typography} from "@material-tailwind/react";
import InsuranceDialog from "../components/InsuranceDialog";
import CreateInsuranceDialog from "../components/CreateInsuranceDialog";
import {useState} from "react";

export default function InsurancePage() {

    const [insuranceData, setInsuranceData] = useState({

    })

    return (
        <div>
            <NavbarSimple />
            <div className="flex flex-row justify-center m-10">
                <Typography variant="h5" >
                    Insurance
                </Typography>
            </div>

            <div className="flex flex-row justify-center">
                <div className="text-center w-1/4 bg-gray-100 rounded-xl">
                    <CreateInsuranceDialog />
                </div>
            </div>

        </div>
    )
}