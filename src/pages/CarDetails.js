import {NavbarSimple} from "../components/Navbar";
import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {notifyUserSessionExpired} from "../utils/jwtUtils";
import axios from "axios";
import {Button, Card, Carousel, Spinner, Typography} from "@material-tailwind/react";
import defaultImage from '../images/carPlaceholder.jpeg';
import DateTimePicker from "../components/DateTimePicker";
import {format, isBefore, parseISO} from 'date-fns';
import Swal2 from "sweetalert2";
import {checkInsuranceEligibility} from "../utils/constants";
import EditCarDialog from "../components/EditCarDialog";
import {mapFuelTypeToString} from "../utils/enumUtils";
import {toSentenceCase} from "../utils/stringUtils";
import {StarIcon} from "@heroicons/react/24/solid"; // Import the StarIcon from Heroicons

export default function CarDetails() {

    const navigate = useNavigate()
    const {carId} = useParams();
    const reviewsRef = useRef(null); // Create a reference for the reviews section

    const [carDetails, setCarDetails] = useState({
        id: '',
        ownerId: '',
        ownerName: '',
        ownerPhoneNumber: '',
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
    });
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
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
        });

        const options = {
            method: 'GET',
            url: `http://localhost:8080/api/v1/cars/${carId}`,
            headers: {
                'Authorization': `Bearer ${jwt}`,
            }
        };

        axios.request(options).then(async (res) => {
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

        // Fetch reviews for the car
        axios.get(`http://localhost:8080/api/v1/reviews/cars/${carId}`, {
            headers: {
                'Authorization': `Bearer ${jwt}`,
            }
        }).then((res) => {
            setReviews(res.data.reviews);
            setAverageRating(res.data.rating);  // Set the average rating
            console.log(res.data.reviews[0])
        }).catch((err) => {
            console.error('Error fetching car reviews', err);
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
        }).catch(async (err) => {
            if (err.response && err.response.status === 409) {
                await Swal2.fire({
                    title: 'Cannot rent this car',
                    text: 'The car is already rented in that time frame. Please choose another date',
                    icon: 'warning'
                })
            } else {
                await Swal2.fire({
                    title: 'Error',
                    text: 'There was an error. Please try again later',
                    icon: 'error'
                })
            }
        })
    }

    const scrollToReviews = () => {
        reviewsRef.current.scrollIntoView({behavior: 'smooth'});
    };

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
                                        <div className="flex items-center justify-center mt-2">
                                            <StarIcon className="h-6 w-6 text-yellow-700"/>
                                            {averageRating ? (
                                                <Typography variant="h6" color="blue-gray"
                                                            className="ml-2  cursor-pointer"
                                                            onClick={scrollToReviews}>
                                                    {averageRating.toFixed(1)} / 5
                                                </Typography>
                                            ) : (
                                                <Typography variant="h6" color="blue-gray" className="ml-2">
                                                    No reviews yet
                                                </Typography>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 bg-gray-200 rounded-xl m-4 shadow">
                                            <div>
                                                <Typography variant="h6" color="blue-gray" className="m-2">
                                                    Owner:
                                                </Typography>
                                                <Typography variant="small">
                                                    {carDetails.ownerName}
                                                </Typography>
                                            </div>

                                            <div>
                                                <Typography variant="h6" color="blue-gray" className="m-2">
                                                    Phone number:
                                                </Typography>
                                                <Typography variant="small">
                                                    {carDetails.ownerPhoneNumber}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="grid grid-cols-3 gap-8 mx-4 bg-gray-200 rounded-xl text-center p-8 shadow">
                                        <div><strong>Fuel
                                            Type:</strong> {mapFuelTypeToString(carDetails.fuelType)}
                                        </div>
                                        <div><strong>Horsepower:</strong> {carDetails.horsepower} HP</div>
                                        <div><strong>Price:</strong> {carDetails.price} € / day</div>
                                        <div><strong>Model Year:</strong> {carDetails.modelYear}</div>
                                        <div><strong>Odometer:</strong> {carDetails.numberOfKilometers} km</div>
                                        <div><strong>Fuel Consumption:</strong> {carDetails.fuelConsumption} %
                                        </div>
                                        <div><strong>Number of Doors:</strong> {carDetails.numDoors}</div>
                                        <div><strong>Body Type:</strong> {toSentenceCase(carDetails.bodyType)}</div>
                                        <div><strong>Minimum
                                            Insurance:</strong> {toSentenceCase(carDetails.minimumInsuranceType)}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-row gap-8 mx-4 justify-between mb-10">
                                        <div className="w-1/2 bg-gray-200 p-10 rounded-xl shadow">
                                            <Typography variant="h2" color="blue-gray" className="m-2 text-center">
                                                Description
                                            </Typography>
                                            <Typography variant="body1" color="blue-gray" className="m-2">
                                                {carDetails.description}
                                            </Typography>
                                        </div>

                                        <div className="w-1/2 bg-gray-200 rounded-xl text-center p-10 shadow">
                                            {
                                                carDetails.isOwner ? (
                                                    <div>
                                                        <Typography variant="h2" color="blue-gray" className="m-2">
                                                            You own this car
                                                        </Typography>
                                                        <EditCarDialog formValues={carDetails} carId={carDetails.id}/>
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
                            {reviews.length > 0 && <div className="mt-10" ref={reviewsRef}>
                                <Typography variant="h2" color="blue-gray" className="m-4 text-center">
                                    Reviews
                                </Typography>
                                <div className="flex flex-col space-y-4">
                                    {reviews.map((review) => (
                                        <Card key={review.id} className="flex flex-row p-4 shadow-lg">
                                            <div className="w-1/4">
                                                <Typography variant="h6" color="blue-gray" className="mb-2">
                                                    {review.posterName}
                                                </Typography>
                                                <Typography variant="body2" color="blue-gray" className="mb-2">
                                                    {format(new Date(review.dateCreated), "dd-MMM-yyyy HH:mm")}
                                                </Typography>
                                                <Typography variant="body2" color="blue-gray" className="mb-2">
                                                    Rating: {review.rating}
                                                </Typography>
                                            </div>
                                            <div className="w-3/4">
                                                <Typography variant="h6" color="blue-gray" className="mb-2">
                                                    {review.title || "Review"}
                                                </Typography>
                                                <Typography variant="body2" color="blue-gray">
                                                    {review.text}
                                                </Typography>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>}
                        </div>
                    )
                }
            </div>
        </div>
    );
}