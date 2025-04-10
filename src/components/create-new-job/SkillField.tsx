import { Box } from "@chakra-ui/react";
import { Select } from "antd";
import React from "react";
import styles from "./SkillField.module.css"


const SkillField = ({ type = "text",
    label = "",
    name = "",
    placeholder = "",
    value = "",
    index = "",
    options = [],
    refs = () => { },
    onChangeFn = () => { } }) => {
    const Field = () => {
        switch (type) {
            case "text":
                return (
                    <input
                        className={styles.skillInput}
                        style={{
                            padding: "8px",
                            boxSizing: "border-box",
                            color: "#4D4D4D",
                            fontSize: "12px",
                            fontWeight: 400,
                            borderRadius: "6px",
                            background: "#FFFFFF",
                            border: "1px solid #E0E2E7",
                            outlineColor: "#8BBBFF",
                            width: "100%",
                        }}
                        placeholder={placeholder}
                        maxLength={120}
                        value={value}
                        autoFocus={true}
                        ref={refs}
                        onChange={(e) => {
                            onChangeFn(name, index, e.target.value)
                        }}
                    />
                )

            case "select":
                return (
                    <Box
                        className={styles.skillSelectField}
                    >
                        <Select
                            style={{
                                width: "100%",
                                color: value === "" ? "#858D9D" : "#4D4D4D",
                                fontSize: "12px",
                                fontWeight: 400,
                                borderRadius: "6px",
                                background: "#FFFFFF",
                                height: "36px",
                                outline: "none"
                            }}
                            defaultValue={value === "" ? "Select" : value}
                            options={options}
                            onChange={(value) => { onChangeFn(name, index, value) }}
                        />
                    </Box>
                )

            default:
                return (
                    <input
                        style={{
                            padding: "8px",
                            boxSizing: "border-box",
                            color: "#4D4D4D",
                            fontSize: "12px",
                            fontWeight: 400,
                            borderRadius: "6px",
                            background: "#FFFFFF",
                            border: "1px solid #E0E2E7",
                            outlineColor: "#8BBBFF",
                            width: "100%",
                        }}
                        value={value}
                        maxLength={120}
                        autoFocus={true}
                        ref={refs}
                        onChange={(e) => {
                            onChangeFn(name, index, e.target.value)
                        }}
                    />
                )
        }
    }
    return (
        <>
            <Box
                sx={{
                    fontWeight: 700,
                    fontSize: "12px",
                    color: "#1D1F2C",
                    marginBottom: "8px"
                }}
            >{label}</Box>
            <Field />
        </>
    )
}

export default SkillField;