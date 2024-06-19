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
                       value={formValues.brand}
                       required/>
                <Input label="Model"
                       size="lg"
                       name="model"
                       onChange={handleInputChange}
                       value={formValues.model}
                       required/>
                <Input label="Model year"
                       size="lg"
                       name="modelYear"
                       value={formValues.modelYear}
                       onChange={handleInputChange}
                       required/>
                <Input label="Horsepower"
                       size="lg"
                       name="horsepower"
                       value={formValues.horsepower}
                       onChange={handleInputChange}
                       required/>
                <Input label="Number of kilometers"
                       name="numberOfKilometers"
                       value={formValues.numberOfKilometers}
                       onChange={handleInputChange}
                       size="lg" required/>
                <Input label="Fuel consumption"
                       name="fuelConsumption"
                       value={formValues.fuelConsumption}
                       onChange={handleInputChange}
                       size="lg" required/>
                <Input label="Number of doors"
                       name="numDoors"
                       value={formValues.numDoors}
                       onChange={handleInputChange}
                       size="lg"
                       required/>
                <Select label="Fuel type"
                        value={formValues.fuelType}
                        onChange={(value) => {
                            console.log(formValues.fuelType)
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
                        value={formValues.bodyType}
                        onChange={(value) => {
                            console.log(formValues.bodyType)
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
                        value={formValues.minimumInsuranceType}
                        onChange={(value) => {
                            console.log(formValues.minimumInsuranceType)
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
                       value={formValues.price}
                       onChange={handleInputChange}
                       required/>
                <Textarea label="Description"
                          name="description"
                          onChange={handleInputChange}
                          value={formValues.description}
                          required/>
            </div>
        </div>
    )
}