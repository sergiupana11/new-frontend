import React, {useState} from "react";
import {
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
} from "@material-tailwind/react";
import DateTimePicker from "./DateTimePicker";
import {isBefore, parseISO} from "date-fns";

export default function InsuranceDialog() {

    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("");
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);

    const handleStartDateChange = (newStartDate) => {
        setStartDate(newStartDate);
        if (!endDate || isBefore(parseISO(endDate), parseISO(newStartDate))) {
            setEndDate(newStartDate);
        }
    };

    return (
        <>
            <Button onClick={handleOpen}>Create insurance</Button>
            <Dialog
                size="xs"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full max-w-[24rem]">
                    <CardBody className="flex flex-col gap-4">
                        <Typography variant="h4" color="blue-gray">
                            Create insurance
                        </Typography>
                        <Typography
                            className="mb-3 font-normal"
                            variant="paragraph"
                            color="gray"
                        >
                            Complete this form to create your new insurance.
                        </Typography>

                        <DateTimePicker label="Start date" onChange={handleStartDateChange}
                                        value={startDate}/>
                        <DateTimePicker label="End date" onChange={setEndDate} minDate={startDate}
                                        value={endDate}/>

                        <Input label="Email" size="lg" />
                        <Input label="Password" size="lg" />
                    </CardBody>
                    <CardFooter className="pt-0">
                        <Button variant="gradient" onClick={handleOpen} fullWidth>
                            Submit
                        </Button>
                    </CardFooter>
                </Card>
            </Dialog>
        </>
    );
}