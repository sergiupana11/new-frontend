import {Button, Card, CardBody, CardFooter, Dialog, Typography} from "@material-tailwind/react";
import React, {useState} from "react";
import CarDataForm from "./CarDataForm";
import Swal2 from "sweetalert2";
import axios from "axios";

export default function EditCarDialog(props) {
    const [token] = useState(localStorage.getItem('jwt'))
    const [open, setOpen] = useState(false);
    const [formValues, setFormValues] = useState(props.formValues);

    const handleOpen = () => setOpen((cur) => !cur);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
    };

    const handleSubmit = () => {
        console.log(formValues)
        axios.put(
            `http://localhost:8080/api/v1/cars/${props.carId}`,
            formValues,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then(() => {
            handleOpen()
            Swal2.fire({
                title: 'Success!',
                text: 'Car updated successfully',
                icon: 'success'
            }).then(() => {
                window.location.reload()
            })
        }).catch(async () => {
            handleOpen()
            await Swal2.fire({
                title: 'Success!',
                text: 'Car updated successfully',
                icon: 'success'
            })
        })
    }

    return (
        <div className="p-4">
            <Button onClick={handleOpen}>Edit car</Button>
            <Dialog
                size="md"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="blue-gray">
                            Edit car
                        </Typography>
                        <Typography
                            className="mb-3 font-normal"
                            variant="paragraph"
                            color="gray"
                        >
                            Complete all the details to add a new car
                        </Typography>
                        <CarDataForm formValues={formValues} setFormValues={setFormValues}
                                     handleInputChange={handleInputChange}/>
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button variant="gradient" onClick={handleSubmit} fullWidth>
                            Submit
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </div>
    )
}