import {Input, Option, Select, Textarea} from "@material-tailwind/react";
import React from "react";

export default function CarDataForm(props) {

    const handleInputChange = props.handleInputChange
    const setFormValues = props.setFormValues
    const formValues = props.formValues

    return (
        <div>
            <div className="grid grid-cols-2 gap-2 my-2">
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
            <div className="flex flex-col gap-2">
                <Input label="Price per day (Euro)"
                       name="price"
                       onChange={handleInputChange}
                       required/>
                <Textarea label="Description" name="description" onChange={handleInputChange} required/>
            </div>
        </div>
    )
}