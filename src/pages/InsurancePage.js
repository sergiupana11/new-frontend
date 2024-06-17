import {NavbarSimple} from "../components/Navbar";
import {Spinner, Typography} from "@material-tailwind/react";
import CreateInsuranceDialog from "../components/CreateInsuranceDialog";
import {useEffect, useState} from "react";
import axios from "axios";
import InsuranceDetails from "../components/InsuranceDetails";
import Swal2 from "sweetalert2";
import {useNavigate} from "react-router-dom";

export default function InsurancePage() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [insuranceData, setInsuranceData] = useState({
        id: '',
        beneficiaryId: '',
        beneficiaryName: '',
        insuranceCompanyId: '',
        insuranceCompanyName: '',
        insuranceType: '',
        startDate: '',
        endDate: '',
        price: '',
    })
    const [token] = useState(localStorage.getItem('jwt'))

    useEffect(() => {
        axios.get(
            'http://localhost:8080/api/v1/insurances',
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        ).then((res) => {
            setInsuranceData(res.data)
        }).catch((err) => {
            if (err.response && err.response.status === 404) {
                setInsuranceData({
                    ...insuranceData,
                    id: 'no-insurance'
                })
            } else {
                Swal2.fire({
                    title: 'Oops',
                    text: 'There was an error. Please try again later',
                    icon: 'error'
                }).then(() => {
                    navigate('/')
                })
            }
        }).finally(() => {
            setLoading(false)
        })

    }, [insuranceData, navigate, token])

    return (
        <div>
            <NavbarSimple/>
            <div className="flex flex-row justify-center m-10">
                <Typography variant="h5">
                    Insurance
                </Typography>
            </div>

            <div className="flex flex-row justify-center">
                <div className="text-center w-1/4 bg-gray-100 rounded-xl">
                    {loading ? (
                            <div className="flex flex-col items-center">
                                <Spinner/>
                            </div>
                        ) :
                        (insuranceData.id === 'no-insurance' ? (
                            <CreateInsuranceDialog/>
                        ) : (
                            <InsuranceDetails insuranceData={insuranceData}/>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}