import { Box, Textarea } from '@chakra-ui/react';
import React, { useRef, useEffect } from 'react';
import ErrorMessage from './ErrorMessage';

const ChakraUITextarea = ({
    value,
    onChange,
    errorMessage,
    placeholder = '',
    size = '',
}: {
    value: string;
    onChange: (arg: string) => void;
    errorMessage: string;
    placeholder?: string;
    size: string;
}) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        // Function to adjust the height of the textarea based on content
        const adjustHeight = () => {
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'; // Reset height
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set new height based on content
            }
        };

        adjustHeight(); // Adjust height on initial render and when value changes
    }, [value]);

    return (
        <Box sx={{ width: '100%', position: 'relative' }}>
            {/* @ts-ignore */}
            <Textarea
                ref={textareaRef}
                placeholder={placeholder}
                value={value}
                size="sm"
                resize="none" // Set resize to none to prevent manual resizing
                isInvalid={!!errorMessage}
                onChange={(e) => {
                    onChange(e.target.value);
                }}
                fontSize={size}
                sx={{
                    '::placeholder': {
                        fontSize: '12px',
                        fontWeight: 400,
                    },
                    overflow: 'hidden', // Hide scrollbar
                }}
            />
            <ErrorMessage text={errorMessage} />
        </Box>
    );
};

export default ChakraUITextarea;