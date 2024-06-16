import {Button, Input, Typography} from "@material-tailwind/react";
import axios from "axios";
import Swal2 from "sweetalert2";
import {useNavigate} from "react-router-dom";
import {useState} from "react";

export default function SignIn() {

    const navigate = useNavigate()

    const [formValues, setFormValues] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({...formValues, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formValues);
        try {
            const response = await axios.post(
                '/api/v1/users/sessions',
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
                    title: "Wrong username or password",
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
                <div className="flex flex-col justify-center items-center my-32 bold text-3xl">
                    <Typography variant="h2" className="font-sans" color="blue-gray">
                        Welcome to Wheelshare
                    </Typography>

                    <Typography variant="small" className="font-sans">
                        Please sign in to continue
                    </Typography>
                </div>
                <div className="flex flex-col gap-4 px-10">
                    <Input label="Email" name="email" size="lg" required onChange={handleChange}/>
                    <Input label="Password" name="password" type="password" size="lg" required onChange={handleChange}/>
                    <Button onClick={handleSubmit} className="bg-blue-500 text-white px-6 py-2 rounded-xl">
                        Sign in
                    </Button>
                </div>
            </div>
        </div>
    )
}