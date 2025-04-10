import React from 'react'
import MuiDatePicker from './MuiDatePicker'
import styles from './index.module.css'
import toast from 'react-hot-toast';
import dayjs, { Dayjs } from 'dayjs';
import { Box } from '@chakra-ui/react';

const DateRange = ({ filterDetails, onChange, disable = false }: any) => {

    const calculateMaxDate = (selectedStartDate: Dayjs) => {
        const currentDate = dayjs();
        const oneMonthAfter = selectedStartDate.add(1, 'month');
        const oneMonthAfterWithToday = oneMonthAfter.isAfter(currentDate)
            ? currentDate
            : oneMonthAfter;

        return oneMonthAfterWithToday.toDate();
    };

    const handleEndDate = (key: string, date: Date) => {
        if (filterDetails.startDate) {
            onChange({ ...filterDetails, [key]: date })
        } else {
            // toast.error(t("label.date_warning"))

        }
    }


    return (
        <Box
            display={'flex'}
            gap='10px'
            px='16px'
        >
            <Box width={'50%'}>
                {/* <Box
                    fontSize={'12px'}
                    color={'#8E8F96'}
                    mb='8px'
                >From</Box> */}
                <MuiDatePicker
                    value={filterDetails?.startDate}
                    onChange={(date) => onChange({ ...filterDetails, startDate: date })}
                    maxDate={new Date()}
                    placeholder="From Date"
                    disabled={disable}
                />
            </Box>
            <Box width={'50%'}>
                {/* <Box
                    fontSize={'12px'}
                    color={'#8E8F96'}
                    mb='8px'
                >To</Box> */}
                <MuiDatePicker
                    value={filterDetails?.endDate}
                    onChange={(date) => handleEndDate('endDate', date)}
                    minDate={filterDetails?.startDate}
                    maxDate={calculateMaxDate(dayjs(filterDetails?.startDate))}
                    placeholder="To Date"
                    disabled={disable}
                />
            </Box>
        </Box>

    )
}

export default DateRange