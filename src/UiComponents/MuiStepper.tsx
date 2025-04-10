import { Box } from "@chakra-ui/react";
import { Step, StepLabel, Stepper } from "@material-ui/core";
import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";

const steps = [
  "Create User Form",
  "Select Required Skill Set",
  "Copy The Generated Link",
];

// const useStyles = makeStyles((theme) => ({
//     root: {
//       '& .MuiStepIcon-root': {
//         color: '#003D86', // Default color
//         '&.MuiStepIcon-active': {
//           color: '#003D86', // Color when active
//         },
//         '&.MuiStepIcon-completed': {
//           color: '#003D86', // Color when completed
//         },
//       },
//     },
//   }));


const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiStepIcon-root": {
      color: "#FFFFFF", // Default color for inactive steps
      border: "1px solid #7E8794",
      borderRadius: "50%",
      "&.MuiStepIcon-active": {
        color: "#003D86", // Color when active
        border: "0px solid #003D86",
        "& text": {
          fill: "#FFFFFF", // Text color when completed
          fontWeight: "bold", // Optional: change font weight
        },
      },
      "&.MuiStepIcon-completed": {
        color: "#003D86", // Color when completed
        border: "0px solid #003D86",
        "& text": {
          fill: "#FFFFFF", // Text color when completed
          fontWeight: "bold", // Optional: change font weight
        },
      },
      "& text": {
        fill: "#7E8794", // Change this to your desired text color
        fontWeight: "bold", // Optional: change font weight
      },

    },
    "& .MuiStepLabel-label": {
      color: "#7E8794", // Default label color
      "&.MuiStepLabel-active": {
        color: "#003D86", // Label color when active
        fontWeight: "bold", // Make the active label bold
      },
      "&.MuiStepLabel-completed": {
        color: "#003D86", // Label color when completed
      },
    },
    "& .MuiStepConnector-line": {
      borderColor: "#7E8794", // Default color of the connector line
    },
    "& .MuiStepConnector-active .MuiStepConnector-line": {
      borderColor: "#003D86", // Color of the connector line when active
    },
    "& .MuiStepConnector-completed .MuiStepConnector-line": {
      borderColor: "#003D86", // Color of the connector line when completed
    },
  },
}));

export default function MuiStepper({ activeStep }: { activeStep: number }) {
  const classes = useStyles();

  return (
    <Box sx={{ marginX: "40px" }} className={classes.root}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          return (
            <Step
              key={label}
            >
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
