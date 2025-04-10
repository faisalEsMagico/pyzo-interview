import { Button } from '@chakra-ui/react';
import React, { useState } from 'react';
import uploadIcon from '../../assets/svg/uploadIcon.svg'
import { CircularProgress } from '@material-ui/core';

const BulkUploadButton = ({ onChange, isLoading = false }: { onChange: any, isLoading: boolean }) => {

    const handleFileChange = (event: any) => {
        // @ts-ignore
        onChange([...event.target.files])
    };

    const handleUploadClick = () => {
        document?.getElementById('fileInput')?.click();

    };

    return (
        <div className="file-upload">
            {/* @ts-ignore */}
            <Button leftIcon={<img src={uploadIcon.src} alt='icon' />}
                onClick={handleUploadClick}
                bg={'#003D86'}
                size='small'
                p='7px'
                color="#FFFFFF"
                margin='auto'
                _hover={{ bg: "#003D86" }}  // Change this to your desired hover color
                _active={{ bg: "#003D86" }}
                width={'220px'}
                isLoading={isLoading}
            >

                Bulk Upload
            </Button>
            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                accept=".pdf"
                multiple
                onChange={handleFileChange}
            />
        </div>
    );
};

export default BulkUploadButton;
