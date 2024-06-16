import CarCard from "./CarCard";
import {useEffect, useState} from "react";
import axios from "axios";
import {Typography} from "@material-tailwind/react";
import {notifyUserSessionExpired} from "../utils/jwtUtils";
import {useNavigate} from "react-router-dom";
import defaultImage from "../images/defaultImage.jpeg";

export default function CarCardList(props) {

    const navigate = useNavigate()

    const [carsList, setCarsList] = useState([])
    const [image, setImage] = useState(defaultImage)
    const [imagesList, setImageList] = useState([])

    useEffect( () => {
        const options = {
            method: 'GET',
            url: 'http://localhost:8080/api/v1/cars',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${props.token}`,
            }
        }

        axios.request(options)
            .then((res) => {
                setCarsList(res.data)
                console.log(res)
        }).catch((err) => {
            if (err.response.status === 500) {
                notifyUserSessionExpired(navigate)
            }
            console.log(err)
        })

    }, [navigate, props.token])

    return (
        <div>
            <div className="flex flex-row justify-center m-10">
                <Typography variant="h5">
                    RENT YOUR NEXT CAR
                </Typography>
            </div>
            <div className="bg-gray-200 grid grid-cols-4 gap-10 p-8">
                {
                    carsList.map((car, index) => {
                        if (car.mainImageId) {
                            const options = {
                                method: 'GET',
                                url: `http://localhost:8080/api/v1/images/${car.mainImageId}`,
                                headers: {
                                    'Authorization': `Bearer ${props.token}`,
                                },
                                responseType: 'blob'
                            }

                            axios.request(options).then((res) => {
                                imagesList[index] = URL.createObjectURL(res.data)

                                }).catch((err) => {
                                    console.error('Error fetching image', err);
                                    imagesList[index] = defaultImage; // Use default image if fetch fails
                                });
                        }

                        return (
                            <CarCard car={car} image={imagesList[index]}/>
                        )
                    })
                }
            </div>
        </div>
    )
}