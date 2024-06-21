import {
    Button,
    Card,
    CardBody,
    CardFooter,
    Dialog,
    IconButton,
    Input,
    Rating,
    Textarea,
    Typography
} from "@material-tailwind/react";
import React, {useState} from "react";
import {ChatBubbleBottomCenterTextIcon} from "@heroicons/react/24/solid";
import axios from "axios";
import Swal2 from "sweetalert2";

export default function ReviewDialog(props) {

    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [token] = useState(localStorage.getItem('jwt'))

    const handleOpen = () => setOpen((cur) => !cur);

    const handleSubmit = () => {
        const reviewData = {
            rentalId: props.id,
            title,
            rating,
            message: description
        };

        axios.post(
            'http://localhost:8080/api/v1/reviews',
            reviewData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        ).then(async () => {
            handleOpen()
            await Swal2.fire({
                title: 'Success',
                text: 'Review submitted successfully',
                icon: 'success'
            })
        }).catch(async (err) => {
            console.log(err)
            handleOpen()
            await Swal2.fire({
                title: 'Error',
                text: 'There was an error submitting your review. Please try again later.',
                icon: 'error'
            });
            console.error('Error submitting review', err);
        });
    };

    const renderButton = () => {
        if (props.iconButton) {
            return (
                <IconButton
                    onClick={handleOpen}
                    variant="outlined"
                    color="purple"
                    className="mx-8"
                >
                    <ChatBubbleBottomCenterTextIcon className="w-5 h-5"/>
                </IconButton>
            )
        }

        return (
            <Button onClick={handleOpen}>Leave a Review</Button>
        )
    }

    return (
        <div className="p-4">
            {renderButton()}
            <Dialog
                size="sm"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="blue-gray">
                            Leave a review
                        </Typography>

                        <Rating
                            value={rating}
                            onChange={(value) => {
                                console.log(value)
                                setRating(value)
                            }}
                            size="large"
                            className="mb-4"
                        />

                        <Input
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <Textarea
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </CardBody>
                    <CardFooter className="pt-0">
                        {title && rating !== 0 && description && (
                            <Button variant="gradient" fullWidth onClick={handleSubmit}>
                                Submit
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </Dialog>
        </div>
    )
}