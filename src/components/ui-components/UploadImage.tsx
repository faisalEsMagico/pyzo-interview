import React, { useRef, useState } from "react";
import styles from './index.module.css'
import toast from "react-hot-toast";
import { Box, Button } from "@chakra-ui/react";
import { MdOutlineFileUpload } from "react-icons/md";

const ImageUpload = ({
    onChange,
    value,
    error,
    handleError
}: {
    onChange: (arg: string) => void,
    value: any,
    error: any,
    handleError: (arg: any) => void
}) => {
    const ImageInputRef = useRef<any>(null);
    const [imgFile, setImgFile] = useState<any>(null)

    const handleSelectImageClick = () => {
        ImageInputRef?.current?.click();
    };

    async function readImage(file: File) {
        if (file) {
            // @ts-ignore
            onChange(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgFile(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div
            style={{ marginBottom: "24px" }}
        >
            <div
                className={styles.imgInputContainer}
                style={{
                    border: error?.profile ? '1.5px dashed red' : '',

                }}
            >
                <input
                    type="file"
                    accept="image/jpeg"
                    ref={ImageInputRef}
                    onChange={(event) => {
                        if (event?.target.files && event.target.files.length > 0) {
                            const file = event.target.files[0];
                            const fileType = file.type;
                            if (fileType.includes('jpeg')) {
                                readImage(event.target.files[0]);
                                ImageInputRef.current.value = '';
                            } else {
                                toast.error("Invalid file type. Please select jpeg image.");
                                ImageInputRef.current.value = '';
                            }
                        }

                    }}
                    style={{ display: "none" }}
                />

                {value ? <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div >
                        <img src={imgFile} height={'116px'} width={'87px'} alt="img" />
                    </div>
                    <div>
                        {/* @ts-ignore */}
                        <Button
                            _hover={{ bg: "#50B089" }}  // Change this to your desired hover color
                            _active={{ bg: "#50B089" }}
                            sx={{ padding: "12px 30px", maxWidth: "180px", width: "100%", borderRadius: "8px", background: "#50B089", color: "#fff" }}
                            onClick={handleSelectImageClick}
                        >
                            Change
                        </Button>
                        {
                            ((!error?.profile && value && value?.name)) && <div
                                style={{
                                    color: '#333F51',
                                    fontFamily: "Inter-regular",
                                    fontSize: '12px',
                                    fontStyle: 'italic',
                                    fontWeight: 400,
                                    lineHeight: 'normal',
                                    marginTop: '12px'
                                }}
                            >
                                {value?.name ? value?.name : 'Profile-Image'}
                            </div>
                        }
                    </div>
                </div> : <div
                    onClick={handleSelectImageClick}
                    style={{ cursor: "pointer" }}
                >
                    <Box
                        sx={{
                            color: "#272728",
                            fontSize: "16px",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            justifyContent: "center"
                        }}
                    > <span style={{ padding: "4px", borderRadius: "40px", backgroundColor: "#D5D5D5" }}><MdOutlineFileUpload /></span> Upload Your Photo</Box>
                    <Box
                        sx={{
                            color: '#65758C',
                            fontSize: "12px",
                            textAlign: "center",
                            marginTop: "8px"
                        }}
                    >Maximum 500 kb. Upload .png / jpeg</Box>
                </div>}

            </div>
            {error.profile && <div
                style={{
                    color: '#EE574D',
                    fontFamily: "Inter-regular",
                    fontSize: '12px',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    lineHeight: 'normal',
                    marginTop: '5px'
                }}
            >
                Photo Is Required!</div>
            }
        </div>
    );
};

export default ImageUpload;
