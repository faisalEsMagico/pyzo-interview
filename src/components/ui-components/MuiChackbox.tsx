import { FormControl } from "@chakra-ui/react";
import { Checkbox, FormControlLabel, FormGroup } from "@material-ui/core";
import React from "react";
import { makeStyles } from '@material-ui/core/styles';

// Create custom styles using makeStyles
const useStyles = makeStyles({
    root: {
        '&$checked': {
            color: '#075FCC', // Change this to your desired color
        },
        '& .MuiCheckbox-root': {
            padding: '5px', 
        },
    },
    checked: {},
});

function MuiCheckbox({ label, checked, onChange }: any) {
    const classes = useStyles();
    return (
        <FormGroup>
            {/* @ts-ignore */}
            <FormControl>
                <FormControlLabel
                    control={
                        <Checkbox size="small" classes={{ root: classes.root, checked: classes.checked }} name={label} checked={checked} onChange={(e) => onChange(e)} />
                    }
                    label={label}
                />
            </FormControl>
        </FormGroup>
    );
}

export default MuiCheckbox;
