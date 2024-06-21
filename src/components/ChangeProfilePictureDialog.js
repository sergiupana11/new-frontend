import {Button, Card, CardBody, CardFooter, Dialog, Typography} from "@material-tailwind/react";
import React, {useState} from "react";
import axios from "axios";
import Swal2 from "sweetalert2";

export default function ChangeProfilePictureDialog(props) {

    const [imageFile, setImageFile] = useState(null);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = () => {
        const formData = new FormData()
        formData.append('personId', props.userId)
        formData.append('images', imageFile)

        axios.post('http://localhost:8080/api/v1/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${props.token}`
            }
        }).then(() => {
            handleOpen()
            Swal2.fire({
                title: 'Success',
                text: 'Profile image changed successfully',
                icon: 'success'
            }).then(() => {
                window.location.reload()
            })
        }).catch((err) => {
            console.error('There was an error uploading the image:', err);
            Swal2.fire({
                title: 'Oops',
                text: 'There was an error uploading the images. Please try again later',
                icon: 'error'
            }).then(() => {
                window.location.reload()
            })
        })
    }

    return (
        <div className="p-4">
            <Button onClick={handleOpen}>Change profile picture</Button>
            <Dialog
                size="sm"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="blue-gray">
                            Change your profile picture
                        </Typography>
                        <div className="flex flex-col gap-2 mt-4">
                            <Typography variant="h6">Upload Image</Typography>
                            <input type="file" accept="image/*" onChange={handleFileChange}/>
                            {imageFile && (
                                <div className="w-24 h-24 border border-gray-300">
                                    <img src={URL.createObjectURL(imageFile)} alt="preview"
                                         className="w-full h-full object-cover"/>
                                </div>
                            )}
                        </div>
                    </CardBody>
                    <CardFooter className="pt-0">
                        {imageFile &&
                            <Button variant="gradient" fullWidth onClick={handleSubmit}>
                                Submit
                            </Button>
                        }
                    </CardFooter>
                </Card>
            </Dialog>
        </div>
    )
}