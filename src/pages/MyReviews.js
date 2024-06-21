import React, {useEffect, useState} from "react";
import axios from "axios";
import Swal2 from "sweetalert2";
import {Link, useNavigate} from "react-router-dom";
import {NavbarSimple} from "../components/Navbar";
import {Card, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography,} from "@material-tailwind/react";
import {ArrowDownIcon, ArrowUpIcon,} from "@heroicons/react/24/solid";
import {format} from "date-fns";

export default function MyReviews() {
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem("jwt"));
    const [reviewsData, setReviewsData] = useState({
        received: [],
        posted: [],
    });
    const [view, setView] = useState("received");

    useEffect(() => {
        function getReviewData() {
            axios
                .get("http://localhost:8080/api/v1/reviews/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setReviewsData(prevState => ({...prevState, posted: res.data}));
                })
                .catch(() => {
                    Swal2.fire({
                        title: "Server error",
                        text: "Please try again later",
                        icon: "error",
                    }).then(() => {
                        navigate("/");
                    });
                });

            axios
                .get("http://localhost:8080/api/v1/reviews/received", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setReviewsData(prevState => ({...prevState, received: res.data}));
                })
                .catch(() => {
                    Swal2.fire({
                        title: "Server error",
                        text: "Please try again later",
                        icon: "error",
                    }).then(() => {
                        navigate("/");
                    });
                });
        }

        getReviewData();
    }, [navigate, token]);

    const renderTable = (reviews) => {
        const TABLE_HEAD = ["Car", "Reviewer", "Message", "Rating", "Date"];

        return (
            <Card className="h-full w-full overflow-scroll">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                    <tr>
                        {TABLE_HEAD.map((head) => (
                            <th
                                key={head}
                                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4 text-center max-w-xs"
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal leading-none opacity-70"
                                >
                                    {head}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {reviews.map((review, index) => {
                        const isLast = index === reviews.length - 1;
                        const classes = isLast
                            ? "p-4 text-center max-w-xs"
                            : "p-4 border-b border-blue-gray-50 text-center max-w-xs";

                        return (
                            <tr key={review.id}>
                                <td className={classes}>
                                    <Typography
                                        as={Link}
                                        to={`/cars/${review.carId}`}
                                        variant="small"
                                        color="blue"
                                        className="font-normal hover:underline"
                                    >
                                        {review.carName}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {review.posterName}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {review.text}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {review.rating}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {format(new Date(review.dateCreated), "dd-MMM-yyyy HH:mm")}
                                    </Typography>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </Card>
        );
    };

    return (
        <div>
            <NavbarSimple/>
            <div className="container mx-auto p-4">
                <Tabs value={view}>
                    <TabsHeader>
                        <Tab value="received" onClick={() => setView("received")}>
                            <div className="flex items-center gap-2">
                                <ArrowDownIcon className="w-5 h-5"/>
                                Reviews Received
                            </div>
                        </Tab>
                        <Tab value="posted" onClick={() => setView("posted")}>
                            <div className="flex items-center gap-2">
                                <ArrowUpIcon className="w-5 h-5"/>
                                Reviews Posted
                            </div>
                        </Tab>
                    </TabsHeader>
                    <TabsBody>
                        <TabPanel value="received">{renderTable(reviewsData.received)}</TabPanel>
                        <TabPanel value="posted">{renderTable(reviewsData.posted)}</TabPanel>
                    </TabsBody>
                </Tabs>
            </div>
        </div>
    );
}