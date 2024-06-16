import {Button, IconButton, Option, Select, Tooltip, Typography} from "@material-tailwind/react";
import InsuranceDialog from "./InsuranceDialog";
import DateTimePicker from "./DateTimePicker";
import {useEffect, useState} from "react";
import {isBefore, parseISO} from "date-fns";
import axios from "axios";
import Swal2 from "sweetalert2";
import {InsuranceTypesDialog} from "./InsuranceTypesDialog";
import {notifyUserSessionExpired} from "../utils/jwtUtils";
import {useNavigate} from "react-router-dom";

export default function CreateInsuranceDialog() {

    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [insuranceCompanies, setInsuranceCompanies] = useState([])
    const [jwt, setJwt] = useState(localStorage.getItem('jwt'))
    const [formValues, setFormValues] = useState({
        startDate: '',
        endDate: '',
        insuranceType: '',
        insuranceCompanyId: ''
    })
    const [insurancePrice, setInsurancePrice] = useState(null)

    const navigate = useNavigate()

    const handleStartDateChange = (newStartDate) => {
        setStartDate(newStartDate)
        setFormValues({...formValues, startDate: newStartDate});
        if (!endDate || isBefore(parseISO(endDate), parseISO(newStartDate))) {
            setEndDate(newStartDate);
        }
    };

    const handleSubmit = () => {
        const options = {
            method: 'POST',
            body: formValues,
            url: 'http://localhost:8080/api/v1/insurances',
            headers: {
                'Authorization': `Bearer ${jwt}`,
            }
        }

        axios.post(
            'http://localhost:8080/api/v1/insurances',
            formValues,
            {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                }
            }).then(() => {
            Swal2.fire({
                title: 'Success',
                text: 'Your insurance has been created',
                icon: 'success',
            }).then(() => {
                navigate('/')
            })
        }).catch(() => {
            Swal2.fire({
                title: 'Oops',
                text: 'There was an error. Please try again later',
                icon: 'error'
            }).then(() => {
                navigate('/')
            })
        })
    }

    const handleEndDateChange = (newEndDate) => {
        setEndDate(newEndDate)
        setFormValues({...formValues, endDate: newEndDate});
    };

    useEffect(() => {
        if (!jwt) {
            notifyUserSessionExpired(navigate)
        }
        const options = {
            method: 'GET',
            url: 'http://localhost:8080/api/v1/insurance-companies',
        }

        axios.request(options).then((res) => {
            setInsuranceCompanies(res.data)
        }).catch((err) => {
            Swal2.fire({
                title: 'Oops',
                text: 'There was an error getting the insurance companies',
                icon: 'warning'
            })
        })
    })

    useEffect(() => {
        const getInsuranceOffer = () => {
            console.log('calling api')
            axios.post(
                'http://localhost:8080/api/v1/insurances/offers',
                formValues,
            ).then((res) => {
                setInsurancePrice(res.data.price)
                console.log(res.data.price)
            }).catch((err) => {
                if (err.response.status === 400) {
                    Swal2.fire({
                        title: 'Invalid data',
                        text: 'The minimum duration for an insurance is one week. Please adjust the dates and try again',
                        icon: 'warning'
                    })
                } else {
                    Swal2.fire({
                        title: 'Oops',
                        text: 'There was an error. Please try again later',
                        icon: 'error'
                    })
                }
            })
        }

        if (formValues.insuranceType && formValues.insuranceCompanyId && formValues.startDate && formValues.endDate) {
            getInsuranceOffer()
        }
    }, [formValues])

    const currentDate = new Date().toISOString();

    return (
        <div>
            <div className="my-2 p-4 text-center justify-center">
                <Typography>
                    You don't currently have any active insurance.
                </Typography>
                <Typography>
                    Create a new one by completing the form below.
                </Typography>
            </div>
            <div className="flex flex-col justify-center gap-4 px-8 my-4">
                <DateTimePicker label="Start date"
                                onChange={handleStartDateChange}
                                value={startDate}
                                name="startDate"
                                minDate={currentDate}
                />
                <DateTimePicker label="End date"
                                onChange={handleEndDateChange}
                                minDate={startDate}
                                value={endDate}
                                name="endDate" />
                <div className="flex flex-col gap-4 text-start">
                    <div className="flex flex-row gap-2">
                        <Select label="Insurance type"
                                onChange={(value) => {
                                    setFormValues({...formValues, insuranceType: value});
                                }}>
                            <Option value="BASIC">Basic</Option>
                            <Option value="MEDIUM">Medium</Option>
                            <Option value="PREMIUM">Premium</Option>
                        </Select>
                        <InsuranceTypesDialog />
                    </div>

                    <Select label="Insurance company"
                            onChange={(value) => {
                                setFormValues({...formValues, insuranceCompanyId: value});
                            }}>
                        {insuranceCompanies.map((insuranceCompany, index) => {
                            return (
                                <Option value={insuranceCompany.id}>{insuranceCompany.name}</Option>
                            )
                        })}
                    </Select>

                    {insurancePrice && (
                        <Typography>
                            Price: {insurancePrice} €
                        </Typography>
                    )}

                    <Button color="blue-gray" onClick={handleSubmit}>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}