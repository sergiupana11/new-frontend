import React, {useEffect, useState} from "react";
import axios from "axios";
import Swal2 from "sweetalert2";
import {Link, useNavigate} from "react-router-dom";
import {NavbarSimple} from "../components/Navbar";
import {
    Card,
    IconButton,
    Tab,
    TabPanel,
    Tabs,
    TabsBody,
    TabsHeader,
    Tooltip,
    Typography,
} from "@material-tailwind/react";
import {ArrowDownIcon, ArrowUpIcon, CheckIcon, NoSymbolIcon, XMarkIcon,} from "@heroicons/react/24/solid";
import {format} from "date-fns";
import {ACCEPT_ACTION, CANCEL_ACTION, DECLINE_ACTION} from "../utils/constants";
import {mapActionToAlertText} from "../utils/enumUtils";
import ReviewDialog from "../components/ReviewDialog";

export default function MyRentals() {
    const navigate = useNavigate();
    const [token] = useState(localStorage.getItem("jwt"));
    const [rentalsData, setRentalsData] = useState({
        incoming: [],
        outgoing: [],
    });
    const [view, setView] = useState("incoming");

    useEffect(() => {
        function getRentalData() {
            axios
                .get("http://localhost:8080/api/v1/rentals", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setRentalsData(res.data);
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

        getRentalData();
    }, [navigate, token]);

    const handleAccept = (id) => {
        submitAction(id, ACCEPT_ACTION);
    };

    const handleDecline = (id) => {
        submitAction(id, DECLINE_ACTION);
    };

    const handleCancel = (id) => {
        submitAction(id, CANCEL_ACTION);
    };

    const submitAction = (rentalId, action) => {
        const reqBody = {
            rentalId,
            action,
        };

        const getStatusFromAction = (action) => {
            switch (action) {
                case ACCEPT_ACTION:
                    return "ACCEPTED";
                case DECLINE_ACTION:
                    return "DECLINED";
                case CANCEL_ACTION:
                    return "CANCELLED";
                default:
                    return "";
            }
        };

        axios
            .patch("http://localhost:8080/api/v1/rentals", reqBody, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                Swal2.fire({
                    title: "Success",
                    text: mapActionToAlertText(action),
                    icon: "success",
                });

                // Update the rentals data in state
                setRentalsData((prevState) => {
                    const updateRentals = (rentals) => {
                        return rentals.map((rental) =>
                            rental.id === rentalId
                                ? {...rental, status: getStatusFromAction(action)}
                                : rental
                        );
                    };

                    return {
                        incoming: updateRentals(prevState.incoming),
                        outgoing: updateRentals(prevState.outgoing),
                    };
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const renderActions = (rental, currentView) => {
        const now = new Date();
        const startDate = new Date(rental.startDate);

        if (currentView === "outgoing") {
            if (rental.status === "PENDING" || (rental.status === "ACCEPTED" && now < startDate)) {
                if (rental.price === 100) {
                    console.log(rental.id)
                }
                return (
                    <Tooltip content="Cancel">
                        <IconButton
                            onClick={() => handleCancel(rental.id)}
                            variant="outlined"
                            color="black"
                            className="mx-10"
                        >
                            <NoSymbolIcon className="w-5 h-5"/>
                        </IconButton>
                    </Tooltip>
                );
            } else if (rental.status === "COMPLETED") {
                return (
                    <Tooltip content="Leave a Review">
                        <ReviewDialog iconButton id={rental.id}/>
                    </Tooltip>
                );
            }
        }

        if (currentView === "incoming") {
            if (rental.status === "PENDING") {
                return (
                    <>
                        <Tooltip content="Accept">
                            <IconButton
                                onClick={() => handleAccept(rental.id)}
                                variant="outlined"
                                color="green"
                                className="mx-2"
                            >
                                <CheckIcon className="w-5 h-5"/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip content="Decline">
                            <IconButton
                                onClick={() => handleDecline(rental.id)}
                                variant="outlined"
                                color="red"
                                className="mx-2"
                            >
                                <XMarkIcon className="w-5 h-5"/>
                            </IconButton>
                        </Tooltip>
                    </>
                );
            } else if (rental.status === "ACCEPTED" && now < startDate) {
                return (
                    <Tooltip content="Cancel">
                        <IconButton
                            onClick={() => handleCancel(rental.id)}
                            variant="outlined"
                            color="black"
                            className="mx-8"
                        >
                            <NoSymbolIcon className="w-5 h-5"/>
                        </IconButton>
                    </Tooltip>
                );
            } else if (rental.status === "ACCEPTED" && now >= startDate) {
                return (
                    <Tooltip content="Leave a Review">
                        <ReviewDialog iconButton id={rental.id}/>
                    </Tooltip>
                );
            }
        }

        return null;
    };

    const calculateTotalPrice = (startDate, endDate, price) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const durationInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return durationInDays * price;
    };

    const renderTable = (rentals, currentView) => {
        const TABLE_HEAD = ["Car", "Start Date", "End Date", "Total Price", "Status", "Actions"];

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
                    {rentals.map((rental, index) => {
                        const isLast = index === rentals.length - 1;
                        const classes = isLast
                            ? "p-4 text-center max-w-xs"
                            : "p-4 border-b border-blue-gray-50 text-center max-w-xs";

                        return (
                            <tr key={rental.id}>
                                <td className={classes}>
                                    <Typography
                                        as={Link}
                                        to={`/cars/${rental.carId}`}
                                        variant="small"
                                        color="blue"
                                        className="font-normal hover:underline"
                                    >
                                        {rental.carName}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {format(new Date(rental.startDate), "dd-MMM-yyyy HH:mm")}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {format(new Date(rental.endDate), "dd-MMM-yyyy HH:mm")}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        ${calculateTotalPrice(rental.startDate, rental.endDate, rental.price)}
                                    </Typography>
                                </td>
                                <td className={classes}>
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        {rental.status}
                                    </Typography>
                                </td>
                                <td className={classes}>{renderActions(rental, currentView)}</td>
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
                        <Tab value="incoming" onClick={() => setView("incoming")}>
                            <div className="flex items-center gap-2">
                                <ArrowDownIcon className="w-5 h-5"/>
                                Incoming Requests
                            </div>
                        </Tab>
                        <Tab value="outgoing" onClick={() => setView("outgoing")}>
                            <div className="flex items-center gap-2">
                                <ArrowUpIcon className="w-5 h-5"/>
                                Outgoing Requests
                            </div>
                        </Tab>
                    </TabsHeader>
                    <TabsBody>
                        <TabPanel value="outgoing">{renderTable(rentalsData.outgoing, "outgoing")}</TabPanel>
                        <TabPanel value="incoming">{renderTable(rentalsData.incoming, "incoming")}</TabPanel>
                    </TabsBody>
                </Tabs>
            </div>
        </div>
    );
}