import React, {useState} from "react";
import axios from 'axios';
import {Button, Card, CardBody, CardFooter, Dialog, Typography} from "@material-tailwind/react";
import Swal2 from "sweetalert2";
import CarDataForm from "./CarDataForm";

export function AddNewCarDialog() {
    const [token] = useState(localStorage.getItem('jwt'));
    const [loading, setLoading] = useState(false)
    const [formValues, setFormValues] = useState({
        brand: '',
        model: '',
        fuelType: '',
        horsepower: '',
        description: '',
        price: '',
        modelYear: '',
        numberOfKilometers: '',
        fuelConsumption: '',
        numDoors: '',
        bodyType: '',
        minimumInsuranceType: ''
    });
    const [images, setImages] = useState([]);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen((cur) => !cur);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues({...formValues, [name]: value});
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        console.log(files)
        setImages(files);
    };

    const handleSubmit = () => {
        setLoading(true)
        axios.post(
            'http://localhost:8080/api/v1/cars',
            formValues,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        ).then(async (res) => {
            if (images.length > 0) {
                await uploadImages(res.data.id)
            }
            setLoading(false)
        }).catch(async () => {
            setLoading(false)
            await Swal2.fire({
                title: 'Server error',
                text: 'Please try again later',
                icon: 'error'
            })
        })
    }

    const uploadImages = async (carId) => {
        console.log('uploading images')
        const formData = new FormData();
        formData.append('carId', carId)
        images.forEach((image) => {
            formData.append('images', image);
        });

        axios.post('http://localhost:8080/api/v1/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        }).then(() => {
            handleOpen()
            Swal2.fire({
                title: 'Success',
                text: 'Car added successfully',
                icon: 'success'
            }).then(() => {
                window.location.reload()
            })
        }).catch((err) => {
            console.error('There was an error uploading the images:', err);
        })
    };

    return (
        <div className="p-4">
            <Button onClick={handleOpen}>Add new car</Button>
            <Dialog
                size="md"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="blue-gray">
                            Add new car
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
                        <div className="flex flex-col gap-2 mt-4">
                            <Typography variant="h6">Upload Images</Typography>
                            <input type="file" accept="image/*" multiple onChange={handleFileChange}/>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {images.map((image, index) => (
                                    <div key={index} className="w-24 h-24 border border-gray-300">
                                        <img src={URL.createObjectURL(image)} alt={`preview-${index}`}
                                             className="w-full h-full object-cover"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button variant="gradient" onClick={handleSubmit} fullWidth>
                            Submit
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </div>
    );
}