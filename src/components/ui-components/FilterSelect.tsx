import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { TiFilter } from "react-icons/ti";

const useStyles = makeStyles(theme => ({
    formControl: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                height: "56px",
            },
        },
    },
    select: {
        display: 'flex',
        alignItems: 'center',
    },

}));

const lists = ["Ten", "twenty", "Thirty", "Fourty", "Fifity", "Sixty"];

const FilterSelect = () => {
    const classes = useStyles();
    const [age, setAge] = React.useState("");

    const inputLabel: any = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        if (inputLabel?.current?.offsetWidth)
            setLabelWidth(inputLabel?.current?.offsetWidth);
    }, []);

    const handleChange = (event: any) => {
        setAge(event.target.value);
    };
    return (
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel style={{ display: "flex", alignItems: "center", justifyContent: "center", }} ref={inputLabel} >
                <TiFilter size={20} style={{ marginTop: "-5px" }} /> <span style={{ fontSize: "14px", fontWeight: 700 }}>Filter By Status</span>
            </InputLabel>
            <Select
                value={age}
                onChange={handleChange}
                labelWidth={150}
            >
                {lists?.map(item => (
                    <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

export default FilterSelect