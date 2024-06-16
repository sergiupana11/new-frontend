import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import {
    Input,
    Popover,
    PopoverHandler,
    PopoverContent,
} from "@material-tailwind/react";
import { format, isBefore, isEqual, parseISO, getHours, getMinutes } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";

// Forwarding refs to allow parent components to access the date value
const DateTimePicker = forwardRef(({ label = "Select a Date", onChange, minDate, value }, ref) => {
    const [date, setDate] = useState(value ? parseISO(value) : null);
    const [hours, setHours] = useState(value ? String(getHours(parseISO(value))).padStart(2, "0") : "00");
    const [minutes, setMinutes] = useState(value ? String(getMinutes(parseISO(value))).padStart(2, "0") : "00");

    useImperativeHandle(ref, () => ({
        getDate: () => date,
        setDate: (newDate) => setDate(newDate),
        getHours: () => hours,
        setHours: (newHours) => setHours(newHours),
        getMinutes: () => minutes,
        setMinutes: (newMinutes) => setMinutes(newMinutes),
    }));

    useEffect(() => {
        if (value) {
            const parsedDate = parseISO(value);
            setDate(parsedDate);
            setHours(String(getHours(parsedDate)).padStart(2, "0"));
            setMinutes(String(getMinutes(parsedDate)).padStart(2, "0"));
        }
    }, [value]);

    useEffect(() => {
        if (minDate && date && isEqual(parseISO(minDate), date)) {
            const minHour = getMinHour();
            if (parseInt(hours) < minHour) {
                setHours(String(minHour).padStart(2, "0"));
            }
        }
    }, [date, minDate]);

    const handleDateChange = (newDate) => {
        if (minDate && (isBefore(newDate, parseISO(minDate)) || isEqual(newDate, parseISO(minDate)))) {
            newDate = parseISO(minDate);
        }
        setDate(newDate);
        if (onChange) onChange(newDate ? formatDateTime(newDate, hours, minutes) : "");
    };

    const handleTimeChange = (newHours, newMinutes) => {
        setHours(newHours);
        setMinutes(newMinutes);
        if (onChange) onChange(date ? formatDateTime(date, newHours, newMinutes) : "");
    };

    const formatDateTime = (date, hours, minutes) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return `${dateStr} ${hours}:${minutes}`;
    };

    const getMinHour = () => {
        if (minDate && date && isEqual(parseISO(minDate), date)) {
            return getHours(parseISO(minDate));
        }
        return 0;
    };

    const minHour = getMinHour();

    return (
        <div>
            <Popover placement="bottom">
                <PopoverHandler>
                    <Input
                        label={label}
                        onChange={() => null}
                        value={date ? formatDateTime(date, hours, minutes) : ""}
                    />
                </PopoverHandler>
                <PopoverContent>
                    <DayPicker
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        showOutsideDays
                        disabled={minDate ? [{ before: parseISO(minDate) }] : undefined}
                        className="border-0"
                        classNames={{
                            caption: "flex justify-center py-2 mb-4 relative items-center",
                            caption_label: "text-sm font-medium text-gray-900",
                            nav: "flex items-center",
                            nav_button:
                                "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                            nav_button_previous: "absolute left-1.5",
                            nav_button_next: "absolute right-1.5",
                            table: "w-full border-collapse",
                            head_row: "flex font-medium text-gray-900",
                            head_cell: "m-0.5 w-9 font-normal text-sm",
                            row: "flex w-full mt-2",
                            cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            day: "h-9 w-9 p-0 font-normal",
                            day_range_end: "day-range-end",
                            day_selected:
                                "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                            day_today: "rounded-md bg-gray-200 text-gray-900",
                            day_outside:
                                "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                            day_disabled: "text-gray-500 opacity-50",
                            day_hidden: "invisible",
                        }}
                        components={{
                            IconLeft: ({ ...props }) => (
                                <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                            ),
                            IconRight: ({ ...props }) => (
                                <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                            ),
                        }}
                    />
                    <div className="flex justify-center mt-4 space-x-2">
                        <select
                            value={hours}
                            onChange={(e) => handleTimeChange(e.target.value, minutes)}
                            className="border rounded-md p-2"
                        >
                            {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={String(i).padStart(2, "0")} disabled={i < minHour}>
                                    {String(i).padStart(2, "0")}
                                </option>
                            ))}
                        </select>
                        <span>:</span>
                        <select
                            value={minutes}
                            onChange={(e) => handleTimeChange(hours, e.target.value)}
                            className="border rounded-md p-2"
                        >
                            {Array.from({ length: 60 }, (_, i) => (
                                <option key={i} value={String(i).padStart(2, "0")}>
                                    {String(i).padStart(2, "0")}
                                </option>
                            ))}
                        </select>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
});

export default DateTimePicker;