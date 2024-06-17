import {Typography} from "@material-tailwind/react";
import {toSentenceCase} from "../utils/stringUtils";
import {parseISO} from "date-fns";
import React from "react";
import {InsuranceTypesDialog} from "./InsuranceTypesDialog";

export default function InsuranceDetails(props) {

    const insurance = props.insuranceData

    const formatDate = (dateString) => {
        return parseISO(dateString).toDateString().slice(4)
    }

    return (
        <div>
            <div className="my-2 p-4 text-center justify-center">
                <Typography>
                    Your insurance details
                </Typography>
            </div>
            <div className="flex flex-col gap-6 text-start p-4 m-2">
                <Typography>
                    <strong>Insurance type:</strong> {toSentenceCase(insurance.insuranceType)} <InsuranceTypesDialog/>
                </Typography>
                <Typography>
                    <strong>Insurance company:</strong> {insurance.insuranceCompanyName}
                </Typography>
                <Typography>
                    {/*TODO make date in format dd MON YYYY*/}
                    <strong>Valid from:</strong> {formatDate(insurance.startDate)}
                </Typography>
                <Typography>
                    <strong>Valid until:</strong> {formatDate(insurance.endDate)}
                </Typography>
            </div>
        </div>
    )
}