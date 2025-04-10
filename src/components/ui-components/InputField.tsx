import React from 'react'
import styles from './index.module.css'
import ErrorMessage from './ErrorMessage'
import { Box } from '@chakra-ui/react'

type propType = {
    placeholder?: string,
    errorMessage?: string,
    onChange: (arg: string, evt?: any) => void,
    type?: string,
    value: string | number,
    handleKeyChange?: (arg: any) => void,
    isBorderBottom?: boolean,
    isMulti?: boolean,
    bgColor?: string,
    color?: string,
    size?: string,
    weight?: number | string,
    borderLess?: boolean
    onCopy?: (arg: any) => void,
    onPast?: (arg: any) => void,
    onCut?: (arg: any) => void,
    rows?: number,
    normalField?: boolean,
    inputRef?: any
}

const InputField = (
    {
        placeholder = '',
        errorMessage,
        onChange,
        type = 'text',
        value,
        handleKeyChange = () => { },
        isBorderBottom = false,
        isMulti = false,
        bgColor = '',
        color = "",
        size = '',
        weight = '',
        borderLess = false,
        onCopy = () => { },
        onPast = () => { },
        onCut = () => { },
        rows = 5,
        normalField = false,
        inputRef = () => { }

    }: propType) => {
    const Element = isMulti ? 'textarea' : 'input'


    // const handlePaste = (e: any) => {
    //     e.preventDefault()
    // }



    return (
        <Box
            borderRadius={'6px'}
            overflow={'hidden'}
        >
            {React.createElement(Element, {
                type,
                value,
                rows: normalField ? rows : isMulti && value ? 5 : 1,
                className: `${isBorderBottom ? styles.inputFieldBorderBottom : styles.inputField}`,
                placeholder,
                style: {
                    border: borderLess ? 'none' : errorMessage ? '1px solid red' : '',
                    backgroundColor: bgColor,
                    color: color,
                    fontSize: size,
                    fontWeight: weight,
                    // height: isMulti ? undefined : '32px',  // Smaller height
                },
                // @ts-ignore
                onChange: (e) => onChange(e?.target?.value, e),
                onKeyUp: handleKeyChange,
                onWheel: (e) => (e.target as HTMLInputElement).blur(),
                onCopy: onCopy,
                onPaste: onPast,
                onCut: onCut,
                ref: inputRef
            })}
            <ErrorMessage text={errorMessage} />
        </Box>
    )
}

export default InputField