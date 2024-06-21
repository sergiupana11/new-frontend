import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {NavbarSimple} from '../components/Navbar';
import defaultUserImage from '../images/userPlaceholder.png'
import {Button, Spinner, Typography} from "@material-tailwind/react";
import ChangeProfilePictureDialog from "../components/ChangeProfilePictureDialog";
import Swal2 from "sweetalert2";
import {format} from "date-fns";

const Profile = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        userId: '',
        fullName: '',
        totalCars: 0,
        incomingRequests: 0,
        outgoingRequests: 0,
        averageRating: 0.0,
        imageId: '',
        dateCreated: '',
        drivingLicenceNumber: '',
        email: '',
        phoneNumber: '',
        insuranceLevel: '',
    });
    const [loading, setLoading] = useState(true);
    const [userImage, setUserImage] = useState(null)
    const token = localStorage.getItem('jwt');

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        axios
            .get('http://localhost:8080/api/v1/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                setProfileData(response.data);
                setUserImage(response.data.imageId
                    ? `http://localhost:8080/api/v1/images/${response.data.imageId}`
                    : defaultUserImage)
                setLoading(false);
            })
            .catch(() => {
                Swal2.fire({
                    title: 'Error',
                    text: 'Could not load profile data. Please try again later',
                    icon: 'error'
                }).then(() => {
                    navigate('/')
                })
            });
    }, [navigate, token]);

    const getAverageRating = () => {
        if (profileData.averageRating === 0.0) {
            return 'No reviews yet'
        }

        return profileData.averageRating
    }

    const getIncomingRentalsText = () => {
        if (profileData.incomingRequests === 0) {
            return 'You did not rent away any cars yet'
        }

        return `You rented away your cars ${profileData.incomingRequests} times`
    }

    const getOutgoingRentalsText = () => {
        if (profileData.outgoingRequests === 0) {
            return 'You did not rent any cars from other users yet'
        }

        return `You rented away your cars ${profileData.outgoingRequests} times`
    }

    return (
        <div>
            <NavbarSimple/>
            <div className="bg-gray-200 rounded-xl p-8 my-8 mx-72 shadow-xl">
                {loading ? (
                    <div className="flex flex-col items-center">
                        <Spinner className="w-12 h-12"/>
                    </div>
                ) : (
                    <div className="flex flex-col items-center ">
                        <img
                            src={userImage}
                            alt="Profile"
                            className="w-48 h-48 rounded-full"
                        />
                        <ChangeProfilePictureDialog userId={profileData.userId} token={token}/>
                        <Typography variant="h1" className="font-sans">
                            {profileData.fullName}
                        </Typography>
                        <Typography variant="h3" className="text-blue-gray-600">Your personal details</Typography>
                        <Typography>
                            Member since {format(new Date(profileData.dateCreated), "dd MMM yyyy")}
                        </Typography>
                        <Typography>Driving licence number: {profileData.drivingLicenceNumber}</Typography>
                        <Typography>Email: {profileData.email}</Typography>
                        <Typography>Phone number: {profileData.phoneNumber}</Typography>
                        <Typography>Insurance level: {profileData.insuranceLevel}</Typography>
                    </div>
                )}
            </div>
            {!loading && (
                <div className="bg-gray-200 rounded-xl p-8 my-8 mx-72 shadow-xl flex flex-col items-center">
                    <Typography variant="h3" className="text-blue-gray-600">Your stats</Typography>
                    <Typography>Owned Cars: {profileData.totalCars}</Typography>
                    <Typography>{getIncomingRentalsText()}</Typography>
                    <Typography>{getOutgoingRentalsText()}</Typography>
                    <Typography>Total rating: {getAverageRating()}</Typography>
                    <Button variant="outlined" className="mt-4 -mb-2" onClick={() => navigate('reviews')}>
                        See reviews
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Profile;