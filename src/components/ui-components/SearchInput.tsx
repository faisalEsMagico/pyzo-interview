import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import React from 'react'
import { IoSearchOutline } from "react-icons/io5";

type PropType = {
    placeholder?: string,
    value: string,
    onChange: (arg: string) => void
}


const SearchInput = ({ placeholder = "Search jobs", value, onChange }: PropType) => {
    return (
        <div>
            {/* @ts-ignore */}
            <InputGroup
                sx={{
                    backgroundColor: "#FFFFFF",
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: 'center',
                    border: "1px solid #B6B6B6",
                    borderRadius: "6px",
                    overflow: "hidden",
                    marginTop: "16px",
                    height:"30px"
                }} >
                <InputLeftElement   >
                    <IoSearchOutline
                        size={20}
                        color='#BCBCBC'
                        style={{ marginBottom: '10px' }}
                    />
                </InputLeftElement>
                <Input
                    sx={{ border: "none" }}
                    size='sm'
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </InputGroup>
        </div>
    )
}

export default SearchInput