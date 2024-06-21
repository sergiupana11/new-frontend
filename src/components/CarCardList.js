import CarCard from "./CarCard";
import {useEffect, useState} from "react";
import axios from "axios";
import {notifyUserSessionExpired} from "../utils/jwtUtils";
import {useNavigate} from "react-router-dom";
import defaultImage from "../images/carPlaceholder.jpeg";
import Swal2 from "sweetalert2";

export default function CarCardList(props) {

    const navigate = useNavigate()

    const [carsList, setCarsList] = useState([])
    const [token] = useState(localStorage.getItem('jwt'))
    const [loading, setLoading] = useState(true)

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
                loading && carsList.map((car, index) => {
                    if (index === carsList.length) {
                        setLoading(false)
                    }
                    return (
                        <CarCard car={car}
                                 image={car.mainImageId ? `http://localhost:8080/api/v1/images/${car.mainImageId}` : defaultImage}/>
                    )
                })
            }
        </div>
    )
}