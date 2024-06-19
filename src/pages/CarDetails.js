import {NavbarSimple} from "../components/Navbar";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {notifyUserSessionExpired} from "../utils/jwtUtils";
import axios from "axios";
import {Button, Carousel, Spinner, Typography} from "@material-tailwind/react";
import defaultImage from '../images/defaultImage.jpeg';
import DateTimePicker from "../components/DateTimePicker";
import {isBefore, parseISO} from 'date-fns';
import Swal2 from "sweetalert2";
import {checkInsuranceEligibility} from "../utils/constants";
import {toSentenceCase} from "../utils/stringUtils";
import EditCarDialog from "../components/EditCarDialog";

// TODO: similar to Insurance, calculate the price and display it to the user before making the request
//  - create my-cars page with the function to add new cars with images
//  - create my-rentals page where you can see your rental offers and offers to accept / decline
//  - on the my-rentals page, if you are the renter, you can cancel the request no matter the status (ACCEPTED or PENDING)
//                            if you are the renter, you can only ACCEPT / DECLINE if it is PENDING, or CANCEL if it is ACCEPTED
//  - profile page where you can see your personal information and reviews, both given by you to others and given by others to you
//  - on my-rentals page, add a button to create review (use form dialog modal)
//  - for ADMIN user, when logging in (so in the SignIn page) redirect him to /admin page where he can add insurance companies
//  - add option to edit or at least delete a car
//  - on insurance page, check if the user has an active insurance. If yes, display his current insurance's details. else,
//                                                                  display form to create a new one
//  if I am the owner of the car, instead of the rent card, display nothing or let me update the car

export default function CarDetails() {

    const navigate = useNavigate()
    const {carId} = useParams();

    const [carDetails, setCarDetails] = useState({
        id: '',
        ownerId: '',
        ownerName: '',
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
        minimumInsuranceType: '',
        isOwner: false,
        imageIds: [],
    });

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [insuranceData, setInsuranceData] = useState({
        id: '',
        beneficiaryId: '',
        beneficiaryName: '',
        insuranceCompanyId: '',
        insuranceCompanyName: '',
        insuranceType: '',
        startDate: '',
        endDate: '',
        price: '',
    })
    const [jwt] = useState(localStorage.getItem('jwt'))

    useEffect(() => {
        axios.get(
            'http://localhost:8080/api/v1/insurances',
            {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                }
            }
        ).then((res) => {
            setInsuranceData(res.data)
        }).catch(() => {
        })

        const options = {
            method: 'GET',
            url: `http://localhost:8080/api/v1/cars/${carId}`,
            headers: {
                'Authorization': `Bearer ${jwt}`,
            }
        };

        axios.request(options).then(async (res) => {
            res.data.fuelType = toSentenceCase(res.data.fuelType);
            res.data.bodyType = toSentenceCase(res.data.bodyType);
            res.data.minimumInsuranceType = toSentenceCase(res.data.minimumInsuranceType);
            setCarDetails(res.data);

            // Fetch each image and add it to the images state
            const imageFetches = res.data.imageIds.map((imageId) => {
                const imageOptions = {
                    method: 'GET',
                    url: `http://localhost:8080/api/v1/images/${imageId}`,
                    responseType: 'blob'
                };

                return axios.request(imageOptions).then((imageRes) => {
                    return URL.createObjectURL(imageRes.data);
                }).catch((err) => {
                    console.error('Error fetching image', err);
                    return defaultImage; // Use default image if fetch fails
                });
            });

            const imageUrls = await Promise.all(imageFetches);
            setImages(imageUrls);
        }).catch((err) => {
            if (err.response && err.response.status === 500) {
                notifyUserSessionExpired(navigate);
            } else {
                console.error('Error fetching car details', err);
            }
        }).finally(() => {
            setLoading(false);
        });
    }, [carId, jwt, navigate]);

    const handleStartDateChange = (newStartDate) => {
        setStartDate(newStartDate);
        if (!endDate || isBefore(parseISO(endDate), parseISO(newStartDate))) {
            setEndDate(newStartDate);
        }
    };

    const handleRentalSubmission = () => {
        if (insuranceData.id === '') {
            Swal2.fire({
                title: 'Cannot rent this car',
                text: 'You don\'t have a valid insurance. Click to navigate to the insurance page.',
                icon: 'warning'
            }).then(() => {
                navigate('/insurance')
            })
            return;
        }

        if (!checkInsuranceEligibility(insuranceData.insuranceType, carDetails.minimumInsuranceType)) {
            Swal2.fire({
                title: 'Cannot rent this car',
                text: 'Your insurance minimum level is below the car\'s minimum insurance level',
                icon: 'warning'
            })
            return;
        }

        const formData = {
            startDate,
            endDate,
            carId: carDetails.id,
            insuranceId: insuranceData.id
        }
        axios.post(
            'http://localhost:8080/api/v1/rentals',
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                }
            }
        ).then(() => {
            Swal2.fire({
                title: 'Success',
                text: 'Rental request sent successfully',
                icon: 'success'
            }).then(() => {
                navigate('/')
            })
        }).catch(() => {
            Swal2.fire({
                title: 'Error',
                text: 'There was an error. Please try again later',
                icon: 'error'
            })
        })
    }

    return (
        <div>
            <NavbarSimple/>
            <div className="flex flex-row justify-center">
                {
                    loading ? (
                        <div className="flex justify-center items-center w-full h-full">
                            <Spinner className="h-12 w-12"/>
                        </div>
                    ) : (
                        <div>
                            <div className="p-4 w-full flex flex-row justify-between mt-10">
                                <Carousel className="rounded-xl w-1/2 m-2 h-auto">
                                    {images.length > 0 ? images.map((image, index) => (
                                        <img key={index} src={image} alt={index}
                                             className="h-full w-full object-cover"/>
                                    )) : (
                                        <img src={defaultImage} alt="Default" className="h-full w-full object-cover"/>
                                    )}
                                </Carousel>

                                <div className="w-1/2">
                                    <div className="text-center">
                                        <Typography variant="h1" textGradient color="blue-gray" className="m-2">
                                            {carDetails.brand} {carDetails.model}
                                        </Typography>

                                        <Typography variant="h6" color="blue-gray" className="m-2">
                                            Owner: {carDetails.ownerName}
                                        </Typography>
                                    </div>

                                    <div
                                        className="grid grid-cols-3 gap-8 mx-4 bg-gray-200 rounded-xl text-center p-8 shadow-xl">
                                        <div><strong>Fuel Type:</strong> {carDetails.fuelType}</div>
                                        <div><strong>Horsepower:</strong> {carDetails.horsepower} HP</div>
                                        <div><strong>Price:</strong> {carDetails.price} € / day</div>
                                        <div><strong>Model Year:</strong> {carDetails.modelYear}</div>
                                        <div><strong>Odometer:</strong> {carDetails.numberOfKilometers} km</div>
                                        <div><strong>Fuel Consumption:</strong> {carDetails.fuelConsumption} %
                                        </div>
                                        <div><strong>Number of Doors:</strong> {carDetails.numDoors}</div>
                                        <div><strong>Body Type:</strong> {carDetails.bodyType}</div>
                                        <div><strong>Minimum Insurance:</strong> {carDetails.minimumInsuranceType}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-row gap-8 mx-4 justify-between mb-10">
                                        <div className="w-1/2 bg-gray-200 p-10 rounded-xl shadow-xl">
                                            <Typography variant="h2" color="blue-gray" className="m-2 text-center">
                                                Description
                                            </Typography>
                                            <Typography variant="body1" color="blue-gray" className="m-2">
                                                {carDetails.description}
                                            </Typography>
                                        </div>

                                        <div className="w-1/2 bg-gray-200 rounded-xl text-center p-10 shadow-xl">
                                            {
                                                carDetails.isOwner ? (
                                                    <div>
                                                        <Typography variant="h2" color="blue-gray" className="m-2">
                                                            You own this car
                                                        </Typography>
                                                        <EditCarDialog carId={carDetails.id}/>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Typography variant="h2" color="blue-gray" className="m-2">
                                                            Rent now
                                                        </Typography>
                                                        <div className="flex flex-col mt-12">
                                                            <div className="m-2">
                                                                <DateTimePicker label="Start date"
                                                                                onChange={handleStartDateChange}
                                                                                value={startDate}/>
                                                            </div>
                                                            <div className="m-2">
                                                                <DateTimePicker label="End date" onChange={setEndDate}
                                                                                minDate={startDate}
                                                                                value={endDate}/>
                                                            </div>
                                                        </div>

                                                        <Button variant="filled"
                                                                color="light-blue"
                                                                className="mt-10"
                                                                onClick={handleRentalSubmission}>
                                                            Submit
                                                        </Button>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}