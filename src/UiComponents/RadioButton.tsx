import React, { useEffect } from 'react'
import { FormControl, FormControlLabel, FormHelperText, Radio, RadioGroup } from '@material-ui/core'
import { Box } from '@chakra-ui/react'
import { makeStyles, Theme } from '@material-ui/core/styles';
interface StyleProps {
    radioBorderColor: string;
    radioColor: string;
}

// Create custom styles using makeStyles
const useStyles = makeStyles<Theme, StyleProps>({
    root: {
        '&$checked': {
            color: '#2877EE', // Change this to your desired color
        },
        color: props => props?.radioBorderColor || '#E5E5E5',
    },
    checked: {},
    flexContainer: {
        display: 'flex',
        flexDirection: 'row',
        color: '#858D9D',
        fontSize: "12px",
        flexWrap: "wrap",
    },
});


const RadioButton = ({ value, onChange, options, errorMessage, color = '', radioColor = '', radioBorderColor = '' }:
    { value: string, onChange: (arg: string) => void, options: any, errorMessage: string, color?: string, radioColor?: string, radioBorderColor?: string }) => {
    const classes = useStyles({ radioColor, radioBorderColor });

    return (

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
                            <FormControlLabel
                                key={index}
                                value={item.value}
                                control={<Radio size='small' classes={{ root: classes.root, checked: classes.checked }} />}
                                label={<Box fontSize={'12px'} color={color}>{item.label}</Box>}
                            />
                        );
                    })}
                </Box>
            </RadioGroup>
            <FormHelperText>{errorMessage}</FormHelperText>
        </FormControl>
    )
}

export default RadioButton