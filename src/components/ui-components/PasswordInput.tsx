import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import React, { useState } from 'react'
import ErrorMessage from './ErrorMessage'
import { BiSolidHide } from "react-icons/bi";
import { TiEye } from "react-icons/ti";
const PasswordInput = ({ value, onChange, errorMessage = 'dfdf', placeholder }:
    { value: string, onChange: (arg: string) => void, errorMessage: string, placeholder: string }) => {
    const [show, setShow] = useState(false)
    const handleClick = () => {
        setShow((pre) => !pre)
    }
    return (
        <>
            {/* @ts-ignore */}
            <InputGroup size='md' sx={{ backgroundColor: "#FFFFFF" }}>
                <Input
                    value={value}
                    pr='4.5rem'
                    type={show ? 'text' : 'password'}
                    placeholder='Enter password'
                    onChange={(e) => onChange(e.target.value)}
                    _placeholder={placeholder}
                />
                <InputRightElement width='4.5rem' onClick={handleClick} sx={{ cursor: "pointer" }}>
                    {show ? <BiSolidHide size={25} /> : <TiEye size={25} />}
                </InputRightElement>

            </InputGroup>
            <ErrorMessage text={errorMessage} />
        </>
    )
}

export default PasswordInput

