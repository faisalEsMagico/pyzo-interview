import React, { useEffect, useState } from 'react';
import StartInterviewPage from '../../components/interview/StartInterviewPage';
import InterviewScreen from '../../components/interview/InterviewScreen';
import { getPreSignApi, postVideoChunk, preSignApiCall } from '../../services/applicationFormApi';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { Backdrop, CircularProgress } from '@material-ui/core';
import MobilePopup from '../../components/ui-components/MobilePopup';
import ChatContext, { useChatContext } from '../../context/ChatContext';
import { authorizeUser, getInterviewDetails, interviewFeedback, postInterviewDetails } from '../../services/aiInterviewQuestion';
import { Progress, Spinner } from '@chakra-ui/react';

const Interview: React.FC = () => {
    const { messages, setMessages } = useChatContext()
    const [interviewDetails, setInterviewDetails] = useState({})
    const [isInterviewStart, setIsInterviewStart] = useState<boolean>(false);
    const [screenRecorder, setScreenRecorder] = useState<MediaRecorder | null>(null);
    const [userRecorder, setUserRecorder] = useState<MediaRecorder | null>(null);
    const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
    const [loading, setLoading] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [hours, setHours] = useState(1);
    const [interviewCompleted, setInterviewCompleted] = useState(false)
    const [validUser, setValidUser] = useState(false)
    const [interviewStarted, setIsInterviewStarted] = useState(false);
    const [videoRecordingUpload, setVideoRecordingUpload] = useState(true)
    const [videoPercentage, setVideoPercentage] = useState(0)
    const [screenPercentage, setScreenPercentage] = useState(0)
    const [screenInterval, setScreenInterval] = useState<NodeJS.Timeout | null>(null);
    const [videoInterval, setVideoInterval] = useState<NodeJS.Timeout | null>(null);
    const router = useRouter();
    const { token, jobid, candidate_id, recruiter_id } = router.query;
    const windowWidth = document?.documentElement?.clientWidth;

    const handleVerify = async (jobId: string, candidateId: string, token: string) => {
        try {
            const resp = await authorizeUser(jobId, candidateId, token)
            setValidUser(true)

        } catch (e) {
            console.log('error for authorize user api:-', e);
            toast.error('User is not authorized!')
            setValidUser(false)
        }
    }

    useEffect(() => {
        if (typeof jobid === 'string' &&
            jobid && typeof candidate_id === 'string' &&
            candidate_id &&
            typeof token === 'string'
            && token) {
            handleVerify(jobid, candidate_id, token)
        }
    }, [token, candidate_id, jobid])

    // function to handle screen share and record
    const handleScreenRecording = async () => {
        const stream = await navigator.mediaDevices.getDisplayMedia({
            // @ts-ignore
            video: { mediaSource: "screen" },
        });

        let displaySurface = stream.getVideoTracks()[0].getSettings().displaySurface;
        if (displaySurface !== "monitor") {
            alert("Selection of entire screen mandatory!");
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            return;

        }
        setIsInterviewStart(true);
        const track = stream.getVideoTracks()[0]; // Assuming there's only one video track

        track.onended = function () {
            // Screen sharing has ended
            setIsInterviewStart(false);
            // You can perform any necessary actions here, such as notifying the user
        };

        const screenRecorderInstance = new MediaRecorder(stream);
        screenRecorderInstance.ondataavailable = (event) => handleDataAvailable(event, 'screen');
        screenRecorderInstance.start();
        setScreenRecorder(screenRecorderInstance);
        setScreenStream(stream);

        // Stop and restart recording every 1 minute
        const interval = setInterval(() => {
            if (screenRecorderInstance.state !== "inactive") {
                screenRecorderInstance.stop(); // Stop current recording
                screenRecorderInstance.start(); // Restart recording
                console.log("Recording restarted");
            }
        }, 150000); // 2.5 minute interval
        setScreenInterval(interval);
    }

    // function to handle video record
    const handleVideoRecording = async () => {
        console.log("Recording video started");
        const cameraStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });

        const userRecorderInstance = new MediaRecorder(cameraStream);
        userRecorderInstance.ondataavailable = (event) => handleDataAvailable(event, 'video');
        userRecorderInstance.start();
        setUserRecorder(userRecorderInstance);

        // Stop and restart recording every 1 minute
        const interval = setInterval(() => {
            if (userRecorderInstance.state !== "inactive") {
                userRecorderInstance.stop(); // Stop current recording
                userRecorderInstance.start(); // Restart recording
                console.log("Recording restarted");
            }
        }, 150000); // 2.5 minute interval
        setVideoInterval(interval)

    }

    const startRecording = async () => {
        console.log('screen recorded')
        try {
            await handleScreenRecording();
            await handleVideoRecording();
            toast.success("Recording started!");
        } catch (error) {
            toast.error("Failed to start recording.");
        }

    };

    const handleDataAvailable = async (event: BlobEvent, type: string) => {
        console.log('calling -------------------')
        if (event.data.size > 0 && candidate_id) {
            const videoBlob = new Blob([event.data], { type: 'video/mp4' });
            const formData = new FormData();
            formData.append('recording_chunk', videoBlob)
            // @ts-ignore
            formData.append('candidate_id', candidate_id)
            formData.append('recording_type', type)
            try {
                const resp = await postVideoChunk(formData)
                console.log(resp)
            } catch (e) {
                console.log('error while calling post video chunk ', e)
            }
            return event.data.size;
        }
    };

    const stopScreenSharing = () => {
        if (screenStream) {
            const tracks = screenStream.getTracks();
            tracks.forEach((track) => track.stop());
            setScreenStream(null);
        }
    };

    const fetchFile = async (recorder: MediaRecorder, type: string): Promise<File> => {
        return new Promise((resolve) => {
            let chunks: any = [];
            if (recorder) {
                recorder.ondataavailable = (event) => handleDataAvailable(event, type);
            }
        });
    };

    const stopRecording = async () => {

        if (screenInterval) clearInterval(screenInterval);
        if (videoInterval) clearInterval(videoInterval);

        if (screenRecorder && screenRecorder.state === "recording") {
            screenRecorder.stop();
        }

        if (userRecorder && userRecorder.state === "recording") {
            userRecorder.stop();
        }

        stopScreenSharing();
        setLoading(true)
        const screenFile = await fetchFile(screenRecorder as MediaRecorder, 'screen');
        const userFile = await fetchFile(userRecorder as MediaRecorder, 'video');
        setLoading(false)
    };

    const handleStartInterview = async () => {
        alert('Please ensure screen sharing is active for smooth communication. Remember to share your entire screen! After screen sharing, do not click on the stop sharing button. Just click on hide.');
        setIsInterviewStarted(true)

        //this line already commented
        // setIsInterviewStart(true);

        startRecording();
    };

    const handlePostInterviewDetails = async (interviewEndState: string) => {
        const request = {
            candidate_id: candidate_id,
            interview_time: `${hours}:${minutes}:${seconds}`,
            interview_end_reason: interviewEndState,
            interview_end_flag: true
        }
        try {
            const resp = await postInterviewDetails(request)
            console.log("API for user post interview details:-", resp)
            if (resp?.status == 200) {
                router.push('/interview-completed')
                localStorage.clear()
                setLoading(false)
                return resp
            }
        } catch (e) {
            console.log("error", e)
            toast.error("Something went wrong!")
        }
    }


    const handleFeedback = async (interviewEndState: string) => {
        setLoading(true)
        try {
            const { organisation_id } = router.query
            // console.log("interviewEnd2", jobid, candidate_id, recruiter_id, organisation_id)
            const resp = await interviewFeedback(jobid, candidate_id, organisation_id)
            const response = await handlePostInterviewDetails(interviewEndState)
            if (response?.status == 200) {
                return
            }
            // router.push('/interview-completed')
            // setLoading(false)
        } catch (e) {
            // @ts-ignore
            if (e?.response?.data === 'No Interview Session Found') {
                router.push('/interview-completed')
                localStorage.clear()
                setLoading(false)
                return
            }
            console.log(e?.response, "getfeedack")
            if (e?.response?.data?.message === "Subscribe Plan, Insufficient Credits!! ") {

                // const response = await handlePostInterviewDetails()
                // if(response?.status == 200) {
                //     return
                // }
            }
            console.log('error in feedback api:-', e);
            toast.error('Something went wrong!')
        }
    }

    const handleStopRecording = async (interviewEndState: string) => {
        const userConfirmed = confirm("Do you want to end the test?");
        if (userConfirmed) {
            // setInterviewCompleted(true)
            handleFeedback(interviewEndState)
            await stopRecording();
            router.push('/interview-completed')
        }
    }

    const handleInterviewResume = async () => {
        alert('Please ensure screen sharing is active for smooth communication. Remember to share your entire screen! After screen sharing, do not click on the stop sharing button. Just click on hide.');
        await handleScreenRecording()
    }

    const getLiveInterviewDetails = async () => {
        try {
            const resp = await getInterviewDetails(candidate_id)

            console.log('resp for get interview api', resp)

            let interviewTime: any = resp?.data?.interview_time ?? ''
            interviewTime = interviewTime?.trim()?.split(':');

            if ((interviewTime[0] == '00' || interviewTime[0] == '0') &&
                (interviewTime[1] == '00' || interviewTime[1] == '0') &&
                (interviewTime[2] == '00' || interviewTime[2] == '0')) {
                router.push('/interview-completed')
                return
            }
            setHours(interviewTime[0] ? parseInt(interviewTime[0]) : 1)
            setMinutes(interviewTime[1] ? parseInt(interviewTime[1]) : 0)
            setSeconds(interviewTime[2] ? parseInt(interviewTime[2]) : 0)

            setInterviewDetails({
                applyingFor: resp?.data?.jobdescription?.job_title,
                logo: resp?.data?.logo,
                interviewingFor: resp?.data?.interviewing_for,
                interviewPause: resp?.data?.interviewpause,
                name: resp?.data?.name,
                jobDescription: resp?.data?.jobdescription
            })


        } catch (e) {
            console.log('error while calling get live interview details api:-', e)
            toast.error('Something went wrong!')
        }
    }

    useEffect(() => {
        if (candidate_id) {
            getLiveInterviewDetails()
        }

    }, [candidate_id])

    useEffect(() => {
        if (seconds == 1 && hours === 0 && minutes === 0) {
            // setInterviewCompleted(true)
            stopRecording()
            handleFeedback("Time Elapsed")
        }
    }, [seconds, hours, minutes, router])


    return (
        <ChatContext>
            <>
                {loading && <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
                    <CircularProgress color="inherit" />
                </Backdrop>}
                {windowWidth <= 950 && <MobilePopup />}
                {/* <InterviewStartPopUP
                    isOpen={askToStart}
                    onClose={() => setAskToStart(false)}
                    handleStartInterview={handleStartInterview}
                /> */}
                {interviewCompleted && (
                    <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
                        {videoRecordingUpload ?
                            <div
                                style={{
                                    width: "40%",
                                    backgroundColor: "#FFFFFF",
                                    padding: "15px",
                                    borderRadius: "8px"
                                }}>
                                <div style={{
                                    fontFamily: 'Inter-regular',
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    lineHeight: '38px',
                                    textAlign: 'center',
                                    color: '#2b4078',
                                    marginBottom: "10px"
                                }}>Video Recording Uploading {videoPercentage}%
                                    {/* @ts-ignore */}
                                    <Spinner size='md' style={{ marginLeft: "10px", marginBottom: "-5px" }} /> </div>
                                <Progress hasStripe value={videoPercentage} size='md' />
                                <div
                                    style={{

                                        fontFamily: 'Inter-regular',
                                        fontSize: '12px',
                                        fontWeight: 400,
                                        lineHeight: '38px',
                                        textAlign: 'left',
                                        color: 'black',
                                        marginBottom: "10px"
                                    }}
                                ><b>Note:</b> Uploading may take some time, so please do not refresh the page or close the tab.</div>
                            </div> :
                            <div style={{
                                width: "40%",
                                backgroundColor: "#FFFFFF",
                                padding: "15px",
                                borderRadius: "8px"
                            }}>
                                <div style={{
                                    fontFamily: 'Inter-regular',
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    lineHeight: '38px',
                                    textAlign: 'center',
                                    color: '#2b4078',
                                    marginBottom: "10px"
                                }}>Screen Recording Uploading {screenPercentage}%

                                    <Spinner size='md' style={{ marginLeft: "10px", marginBottom: "-5px" }} /></div>
                                <Progress hasStripe value={screenPercentage} size='md' />
                                <div
                                    style={{

                                        fontFamily: 'Inter-regular',
                                        fontSize: '12px',
                                        fontWeight: 400,
                                        lineHeight: '38px',
                                        textAlign: 'left',
                                        color: 'black',
                                        marginBottom: "10px"
                                    }}
                                ><b>Note:</b> Uploading may take some time, so please do not refresh the page or close the tab.</div>
                            </div>}
                    </Backdrop>
                )}
                <div>
                    <div>
                        {isInterviewStart
                        //  && validUser
                          ? (
                            <InterviewScreen
                                handleStopRecording={handleStopRecording}
                                seconds={seconds} handleSeconds={setSeconds}
                                minutes={minutes}
                                handleMinutes={setMinutes}
                                hours={hours}
                                handleHours={setHours}
                                interviewDetails={interviewDetails}
                            />
                        ) : (
                            <StartInterviewPage
                                handleInterviewStart={interviewStarted ?
                                    handleInterviewResume : handleStartInterview}
                                interviewDetails={interviewDetails} />
                        )}
                    </div>
                </div>
            </>
        </ChatContext>
    );
};

export default Interview;
