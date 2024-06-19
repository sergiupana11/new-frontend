import {Button, Input, Option, Select, Typography} from "@material-tailwind/react";
import {useState} from "react";
import axios from "axios";
import Swal2 from "sweetalert2";
import InfoIcon from "../icons/InfoIcon";
import {useNavigate} from "react-router-dom";

export default function Register() {

    const navigate = useNavigate()

    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: '',
        drivingLicenceNumber: '',
        gender: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
    }

    const handleSelectChange = (value) => {
        setFormValues({...formValues, gender: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formValues);
        try {
            const response = await axios.post(
                'http://localhost:8080/api/v1/users',
                formValues,
                {
                    headers: {
                        'Content-Type': "application/json"
                    }
                });

            localStorage.setItem('jwt', response.data.token)
            navigate('/')
        } catch (err) {
            console.error('Error: ', err);
            if (err.response.status === 400) {
                await Swal2.fire({
                    title: "Invalid input",
                    text: "Please check the data and try again.",
                    icon: "warning"
                })
            } else {
                await Swal2.fire({
                    title: "Server error",
                    text: "There was an error. Please try again later.",
                    icon: "error"
                })
            }
        }
    }

    return (
        <div className="flex flex-row justify-center">
            <div className="bg-gray-200 rounded-3xl h-screen w-1/2">
                <div className="flex flex-row justify-center my-32 bold text-3xl">
                    <Typography variant="h1" className="font-sans">
                        Create an account
                    </Typography>
                </div>
                <div className="flex flex-row gap-2 px-10 my-4">
                    <Input label="First name" name="firstName" size="lg" required onChange={handleChange}/>
                    <Input label="Last name" name="lastName" size="lg" required onChange={handleChange}/>
                </div>
                <div className="flex flex-col gap-4 px-10">
                    <Input label="Phone number" name="phoneNumber" size="lg" required onChange={handleChange}/>
                    <Input label="Driving licence number" name="drivingLicenceNumber" size="lg" required
                           onChange={handleChange}/>
                    <Select label="Gender" name="gender" size="lg" required onChange={handleSelectChange}>
                        <Option value="MALE">Male</Option>
                        <Option value="FEMALE">Female</Option>
                        <Option value="OTHER">Other</Option>
                    </Select>
                    <Input label="Email" name="email" size="lg" required onChange={handleChange}/>
                    <Input label="Password" name="password" type="password" size="lg" required onChange={handleChange}/>
                    <Typography
                        variant="small"
                        color="gray"
                        className="mt-2 flex items-center gap-1 font-normal"
                    >
                        <InfoIcon/>
                        Password should have at least 6 characters.
                    </Typography>
                    <Button onClick={handleSubmit} className="bg-blue-500 text-white px-6 py-2 rounded-xl">
                        Create account
                    </Button>
                    <Button className="bg-gray-700 text-white px-6 py-2 rounded-xl"
                            onClick={() => navigate('/sign-in')}>
                        Already have an account? Log in
                    </Button>
                </div>
            </div>
        </div>
    )
}