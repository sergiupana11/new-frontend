import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {NavbarSimple} from '../components/Navbar';
import defaultUserImage from '../images/userPlaceholder.png'
import {Spinner, Typography} from "@material-tailwind/react";
import ChangeProfilePictureDialog from "../components/ChangeProfilePictureDialog";
import Swal2 from "sweetalert2";

const Profile = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        userId: '',
        firstName: '',
        totalCars: 0,
        incomingRequests: 0,
        outgoingRequests: 0,
        imageId: '',
    });
    const [loading, setLoading] = useState(true);
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

    return (
        <div>
            <NavbarSimple/>
            <div className="bg-gray-200 rounded-xl p-8 my-8 mx-auto shadow-xl">
                {loading ? (
                    <Spinner/>
                ) : (
                    <div className="flex flex-col items-center ">
                        <img
                            src={
                                profileData.imageId
                                    ? `http://localhost:8080/api/v1/images/${profileData.imageId}`
                                    : defaultUserImage
                            }
                            alt="Profile"
                            className="w-48 h-48 rounded-full"
                        />
                        <ChangeProfilePictureDialog userId={profileData.userId} token={token}/>
                        <Typography variant="h1" className="font-sans">
                            {profileData.firstName}
                        </Typography>
                        <Typography variant="h3" className="text-blue-gray-600">Your stats:</Typography>
                        <Typography>Owned Cars: {profileData.totalCars}</Typography>
                        <Typography>Incoming Requests: {profileData.incomingRequests}</Typography>
                        <Typography>Outgoing Requests: {profileData.outgoingRequests}</Typography>
                        <Typography>Total rating: TODO</Typography>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;