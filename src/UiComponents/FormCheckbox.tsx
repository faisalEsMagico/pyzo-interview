import { Box, Checkbox } from '@chakra-ui/react'
import React from 'react'
import ErrorMessage from '../components/ui-components/ErrorMessage'

const FormCheckbox = ({ options, value, onChange, errorMessage = '' }: any) => {

    const handleChange = (e: any, selectedValue: string) => {
        console.log(e.target.checked)
        if (e.target.checked) {
            onChange([...value, selectedValue])
        } else {
            const newValue = value.filter((item: string) => item !== selectedValue)
            onChange(newValue)
        }
    }

    return (
        <div>
            {options?.map((item: string) => {
                // @ts-ignore
                return <Box
                    key={item}
                    sx={{
                        backgroundColor: "#282C36",
                        width: "44vw",
                        padding: "10px",
                        borderRadius: "8px",
                        marginTop: "10px"

                    }}
                >
                    {/* @ts-ignore */}
                    <Checkbox
                        colorScheme='white'
                        isChecked={value?.includes(item)}
                        onChange={(e) => handleChange(e, item)}
                        color={'#FFFFFF'}
                    >
                        {item}
                    </Checkbox>
                </Box>
            })}
            <ErrorMessage text={errorMessage} />
        </div>
    )
}

export default FormCheckbox