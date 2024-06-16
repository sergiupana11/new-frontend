import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from "@material-tailwind/react";
import defaultImage from '../images/defaultImage.jpeg'

const CarCard = (props) => {
    const navigate = useNavigate();

    const imageSrc = props.image ? props.image : defaultImage
    const car = props.car

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-4 hover:bg-blue-300 hover:cursor-pointer transform
        hover:scale-105 transition-transform duration-300"
             onClick={() => navigate(`/cars/${car.id}`)}>
            <div className="flex">
                {console.log(props.image)}
                <div className="w-1/3">
                    <img
                        className="object-cover w-32 h-32"
                        alt="car"
                        src={imageSrc}
                    />
                </div>
                <div className="w-2/3 pl-4">
                    <div className="h-3/4">
                        <Typography variant="h4">
                            {car.brand}
                        </Typography>
                        <Typography variant="small">
                            {car.model}
                        </Typography>
                    </div>
                    <div className="h-1/4">
                        <Typography variant="h6">
                            {car.price}€ / day
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarCard;