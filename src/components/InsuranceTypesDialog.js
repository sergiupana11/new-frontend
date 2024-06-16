import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter, Tooltip, Typography, IconButton,
} from "@material-tailwind/react";
import InfoIcon from "../icons/InfoIcon";

export function InsuranceTypesDialog() {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(!open);

    return (
        <>
            <IconButton onClick={handleOpen} variant="outlined" color="blue-gray">
                <InfoIcon />
            </IconButton>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Insurance types</DialogHeader>
                <DialogBody className="overflow-scroll">
                    <Typography className="font-normal">
                        <Typography variant="h4">Basic</Typography>
                        Only covers damage if you were involved in an accident
                        that you did not cause.
                        <br />
                        <br />
                        <Typography variant="h4">Medium</Typography>
                        Covers everything that the <strong>Basic</strong> insurance does, plus engine and
                        transmission damage, even if they were caused by you
                        <br /> <br />
                        <Typography variant="h4">Premium</Typography>
                        Covers everything that the <strong>Medium</strong> insurance does, plus any other kind
                        of damage on the car, including interior damage. Includes 24/7 roadside assistance and
                        replacement car if anything goes wrong.
                    </Typography>
                </DialogBody>
                <DialogFooter className="space-x-2">
                    <Button variant="gradient" color="green" onClick={handleOpen}>
                        Okay
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}