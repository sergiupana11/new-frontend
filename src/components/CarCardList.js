import CarCard from "./CarCard";
import {useEffect, useState} from "react";
import axios from "axios";
import {notifyUserSessionExpired} from "../utils/jwtUtils";
import {useNavigate} from "react-router-dom";
import defaultImage from "../images/defaultImage.jpeg";
import Swal2 from "sweetalert2";

export default function CarCardList(props) {

    const navigate = useNavigate()

    const [carsList, setCarsList] = useState([])
    const [token] = useState(localStorage.getItem('jwt'))
    const [imagesList] = useState([])

    useEffect(() => {
        function getRequestUrl(showMyCars) {
            if (showMyCars) {
                return 'http://localhost:8080/api/v1/cars/me'
            } else {
                return 'http://localhost:8080/api/v1/cars'
            }
        }

        const url = getRequestUrl(props.showMyCars)
        const options = {
            method: 'GET',
            url,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }

        axios.request(options)
            .then((res) => {
                setCarsList(res.data)
                console.log(res)
            }).catch((err) => {
            if (err.response && err.response.status === 500) {
                notifyUserSessionExpired(navigate)
            } else {
                Swal2.fire({
                        title: 'Server Error',
                        text: 'Please try again later',
                        icon: 'error'
                    }
                ).then(() => {
                    navigate('/sign-in')
                })
            }
            console.log(err)
        })

    }, [navigate, props.showMyCars, token])

    return (
        <div className="bg-gray-200 grid grid-cols-4 gap-10 p-8">
            {
                carsList.map((car, index) => {
                    if (car.mainImageId) {
                        const options = {
                            method: 'GET',
                            url: `http://localhost:8080/api/v1/images/${car.mainImageId}`,
                            headers: {
                                'Authorization': `Bearer ${token}`,
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
    )
}