import React, { useEffect } from 'react'
import { FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup } from '@material-ui/core'
import { Box } from '@chakra-ui/react'
import { makeStyles } from '@material-ui/core/styles';

// Create custom styles using makeStyles
const useStyles = makeStyles({
    root: {
        '&$checked': {
            color: '#F3F3F3', // Change this to your desired color
        },
        color:"#F3F3F3"
    },
    checked: {},
    flexContainer: {
        display: 'flex',
        flexDirection: 'column', // Change to 'column' if you want them stacked vertically
        gap: '10px', // Adjust the gap between radio buttons
        color: '#F3F3F3',
        fontSize: "12px"
    },
});


const FormRadioButton = ({ value, onChange, options, errorMessage }:
    { value: string, onChange: (arg: string) => void, options: any, errorMessage: string }) => {
    const classes = useStyles();

    return (
        <Box>
            <FormControl error={!!errorMessage}>
                <RadioGroup
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        console.log(e.target.value)
                    }}
                >
                    <Box className={classes.flexContainer}>
                        {options?.map((item: any, index: number) => {
                            return (
                                <Box key={index}
                                    sx={{
                                        backgroundColor: "#282C36",
                                        width: "44vw",
                                        paddingLeft: "10px",
                                        borderRadius: "8px"
                                    }}
                                >
                                    <FormControlLabel

                                        value={item.value}
                                        control={<Radio classes={{ root: classes.root, checked: classes.checked }} />}
                                        label={item.label}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                </RadioGroup>
                <FormHelperText>{errorMessage}</FormHelperText>
            </FormControl>
        </Box>


    )
}

export default FormRadioButton