import React, {useEffect, useState} from "react";
import axios from 'axios';
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Dialog,
    Input,
    Option,
    Select,
    Textarea,
    Typography
} from "@material-tailwind/react";

export function AddNewCarDialog() {
    const [token] = useState(localStorage.getItem('jwt'));
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

    const handleSubmit = async () => {
        const formData = new FormData();
        images.forEach((image) => {
            formData.append('images', image);
        });
        Object.keys(formValues).forEach((key) => {
            formData.append(key, formValues[key]);
        });

        try {
            const response = await axios.post('http://localhost:8080/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            // Handle success response (e.g., show a success message)
        } catch (error) {
            console.error('There was an error uploading the images:', error);
            // Handle error response (e.g., show an error message)
        }
    };

    useEffect(() => {

    }, [token]);

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
                        <div className="grid grid-cols-2 gap-2">
                            <Input label="Brand"
                                   size="lg"
                                   name="brand"
                                   onChange={handleInputChange}
                                   required/>
                            <Input label="Model"
                                   size="lg"
                                   name="model"
                                   onChange={handleInputChange}
                                   required/>
                            <Input label="Model year"
                                   size="lg"
                                   name="modelYear"
                                   onChange={handleInputChange}
                                   required/>
                            <Input label="Horsepower"
                                   size="lg"
                                   name="horsepower"
                                   onChange={handleInputChange}
                                   required/>
                            <Input label="Number of kilometers"
                                   name="numberOfKilometers"
                                   onChange={handleInputChange}
                                   size="lg" required/>
                            <Input label="Fuel consumption"
                                   name="fuelConsumption"
                                   onChange={handleInputChange}
                                   size="lg" required/>
                            <Input label="Number of doors"
                                   name="numDoors"
                                   onChange={handleInputChange}
                                   size="lg"
                                   required/>
                            <Select label="Fuel type"
                                    onChange={(value) => {
                                        setFormValues({
                                            ...formValues,
                                            fuelType: value
                                        });
                                    }}
                                    required>
                                <Option value="PETROL">Petrol</Option>
                                <Option value="DIESEL">Diesel</Option>
                                <Option value="LPG">LPG</Option>
                                <Option value="PETROL_HYBRID">Hybrid (Petrol + Electric)</Option>
                                <Option value="DIESEL_HYBRID">Hybrid (Diesel + Electric)</Option>
                                <Option value="ELECTRIC">Electric</Option>
                                <Option value="OTHER">Other</Option>
                            </Select>
                            <Select label="Body type"
                                    onChange={(value) => {
                                        setFormValues({
                                            ...formValues,
                                            bodyType: value
                                        });
                                    }}
                                    required>
                                <Option value="SEDAN">Sedan</Option>
                                <Option value="COUPE">Coupe</Option>
                                <Option value="CONVERTIBLE">Convertible</Option>
                                <Option value="ESTATE">Estate</Option>
                                <Option value="SUV">SUV</Option>
                                <Option value="HATCHBACK">Hatchback</Option>
                                <Option value="PICKUP">Pickup</Option>
                                <Option value="MINIVAN">Minivan</Option>
                            </Select>
                            <Select label="Minimum insurance"
                                    onChange={(value) => {
                                        setFormValues({
                                            ...formValues,
                                            minimumInsuranceType: value
                                        });
                                    }}
                                    required>
                                <Option value="BASIC">Basic</Option>
                                <Option value="MEDIUM">Medium</Option>
                                <Option value="PREMIUM">Premium</Option>
                            </Select>
                        </div>
                        <div className="flex flex-col gap-2 -mt-2">
                            <Input label="Price per day (Euro)"
                                   name="price"
                                   onChange={handleInputChange}
                                   required/>
                            <Textarea label="Description" name="description" onChange={handleInputChange} required/>
                        </div>
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