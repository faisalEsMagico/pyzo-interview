import React from "react";
import dayjs from "dayjs";
import calenderIcon from "../../assets/svg/calenderIcon.svg";
import MuiDatePicker from "../../UiComponents/MuiDatePicker";
import { Box } from "@chakra-ui/react";
import { makeStyles, MenuItem, Select } from "@material-ui/core";


// css
const containerStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    borderRadius: "5px",
    padding: "6px 6px 6px 0px",
    border: "1px solid #D9D9D9",
    boxSizing: "border-box",
    background: "#fff",
};

const useStyles = makeStyles(() => ({
    select: {
        backgroundColor: '#FFFFFF',
        boxShadow: 'none',
        '.MuiOutlinedInput-notchedOutline': { border: 0 }
    },
}));

const CommonDateFilterPanel = ({
    filterSelectOptions = [],
    handleDateFilter,
    dateFilter,
}: any) => {

    const classes = useStyles();

    return (
        <Box sx={containerStyle}>
            <img
                src={calenderIcon.src}
                alt="calender-icon"
                style={{ marginLeft: "20px", height: "20px", width: "20px" }}
            />
            <Select
                // displayEmpty
                classes={{ root: classes.select }}
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                name="select"
                placeholder="select"
                value={dateFilter?.select ?? ""}
                onChange={(e: any) => {
                    const { name, value } = e.target;
                    handleDateFilter(name, value);
                }}
            >
                <MenuItem value="" disabled>
                    --Select--
                </MenuItem>
                {filterSelectOptions?.length > 0 &&
                    filterSelectOptions?.map((res: any) => (
                        <MenuItem key={res?.label} value={res.value}>
                            {res.label}
                        </MenuItem>
                    ))}
            </Select>
            <Box sx={{ display: "flex" }}>
                <MuiDatePicker
                    name={"from_time"}
                    isDisabled={dateFilter?.select !== "CUSTOM"}
                    maxDate={dateFilter?.to_time ? dayjs(dateFilter?.to_time) : null}
                    value={dateFilter?.from_time ? dayjs(dateFilter?.from_time) : null}
                    onChange={(value) => handleDateFilter('name', value)}
                    label={"From"}
                />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            width: "15px",
                            height: "2px",
                            background: "#d9d9da",
                            margin:'10px'
                        }}
                    ></Box>
                </Box>
                <MuiDatePicker
                    name={"to_time"}
                    isDisabled={dateFilter?.select !== "CUSTOM"}
                    minDate={
                        dateFilter?.from_time ? dayjs(dateFilter?.from_time) : null
                    }
                    value={dateFilter?.to_time ? dayjs(dateFilter?.to_time) : null}
                    onChange={(value) => handleDateFilter('name', value)}
                    label={"To"}
                />
            </Box>
        </Box>
    );
};

export default CommonDateFilterPanel;
