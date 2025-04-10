
// import axios from "axios";
import React, {
    FC, useEffect, useState,
} from "react";
import { ChatMessageItemPropType } from "../../types";
import { Box } from "@chakra-ui/react";
import styles from './index.module.css'
import profileImage from '../../assets/icons/candidateProfile.png';
import iviIcon from '../../assets/images/companyLogo.png';
import { useChatContext } from "../../context/ChatContext";
import companyLogo from '../../assets/images/companyLogo.png'
import { PulseLoader } from 'react-spinners'

const ChatMessageItem: FC<ChatMessageItemPropType> = ({
    message,
}) => {
    const { messages, isTypeWriterStopped } = useChatContext()
    const { content, type } = message;
    const [profilePic, setProfilePic] = useState(profileImage.src)

    const disableCopyPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        console.log('Copy-paste actions are disabled!');
    };

    useEffect(() => {
        const profile = localStorage.getItem('userProfile') || profileImage.src
        setProfilePic(profile);
    }, [profilePic]);

    switch (type) {
        case "loader":
            return <div className={styles.loadingProfileContainer}>
                <div className={styles.profileContainer}>
                    <img src={iviIcon.src} alt='profile' className={styles.profileImage} />
                </div>
                <div className={styles.loadingContainer}>
                    <PulseLoader
                        color={'#ACAdB1'}
                        loading={true}
                        size={12}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            </div>;
        case "text":
            const messageContent = content?.data?.message;
            const question = messages[messages?.length - 1]?.position === 'left' && messages?.length > 0 ? messages[messages.length - 1]?.message : ''
            console.log('content', content)

            return (
                <div
                    className={`${styles.speechBubbleContainer}`}
                    onCopy={disableCopyPaste}
                    onCut={disableCopyPaste}
                >
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: "center",
                            alignItems: 'flex-start'
                        }}>
                        <Box  >
                            <img
                                src={content?.data?.position === 'left' ? companyLogo.src : profilePic}
                                className={styles.userImage}
                                alt="profile"
                            />
                        </Box>

                        <Box
                            style={{
                                textAlign: 'left',
                                backgroundColor: '#141926',
                                width: '345px',
                                fontWeight: 400,
                                fontSize: "14px",
                                color: '#E5E5E5',
                            }}
                        >
                            <Box
                                sx={{
                                    fontSize: "12px",
                                    fontWeight: 300,
                                    color: "#E5E5E5",
                                    opacity: 0.7
                                }} >
                                {content?.data?.position === 'left' ? 'AI' : 'You'}
                            </Box>
                            {messageContent}
                        </Box>
                    </div>
                </div>
            );
        default:
            return (
                <Box></Box>

            );
    }
};

export default ChatMessageItem;
