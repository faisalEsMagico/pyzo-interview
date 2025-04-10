import React, { useEffect, useRef } from 'react';
import styles from './index.module.css'
import { postInterviewDetails } from '../../services/aiInterviewQuestion';
import { useRouter } from 'next/router';
import axios from 'axios';
import timer from '../../assets/images/timer.png';
import { withWidth } from '@material-ui/core';

function Timer({ seconds,
  handleSeconds,
  minutes,
  handleMinutes,
  hours,
  handleHours,
  isTimerStop }: any) {

  const router = useRouter();
  const { candidate_id } = router.query;
  const audioRef = useRef(new Audio('https://interviewbot1.blob.core.windows.net/interviewbot1/temp/50e49278-7b22-4b23-9bfe-6c8fffd64329'));

  function isEven(number: number) {
    return number % 2 === 0;
  }

  useEffect(() => {
    if (isTimerStop) return
    const interval = setInterval(() => {
      if (hours === 0 && minutes === 0 && seconds === 0) {
        clearInterval(interval);
        return;
      }

      if (seconds > 0) {
        handleSeconds((prevSeconds: number) => prevSeconds - 1);
      } else {
        if (minutes > 0) {
          handleMinutes((prevMinutes: number) => prevMinutes - 1);
          handleSeconds(59);
        } else {
          if (hours > 0) {
            handleHours((prevHours: number) => prevHours - 1);
            handleMinutes(59);
            handleSeconds(59);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [hours, minutes, seconds, isTimerStop]);

  const handleTimer = async () => {
    const userId = localStorage.getItem('userId') ?? ''
    const token = localStorage.getItem('userToken') ?? ''
    const request = {
      candidate_id: candidate_id,
      interview_time: `${hours}:${minutes}:${seconds}`
    }
    const resp = await postInterviewDetails(request)
  }

  useEffect(() => {

    if (isEven(minutes)) {
      handleTimer()
    }

  }, [minutes]);

  const getAudioUrl = async (text: string) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/ai/text-speech/`, { input: text, voice: 'nova' });

      return response?.data;
    } catch (e) {
      console.log('error while calling t2s api', e)
    }
  }

  const handleEndIndication = async () => {
    const message = 'Only 10 minutes remain. Please begin concluding your response to ensure you finish on time. Stay focused and concise'

    const resp = await getAudioUrl(message);
    console.log('audio url', resp);

    // Create a new Audio object with the URL
    const audio = new Audio(resp?.detail);
    await audio.play();
  }

  useEffect(() => {

    // Check if 10 minutes are remaining
    if (hours === 0 && minutes === 10 && seconds === 4) {
      handleEndIndication()
    }
  }, [minutes, seconds, hours]);


  return (
    <div className={styles.clock} style={{ backgroundColor: 'rgba(109, 170, 57, 0.16)', borderRadius: "7px", width: '40%' }}  >
      {/* Time Elapsed */}
      <span style={{
        fontSize: "14px",
        fontWeight: 900,
        display: 'flex',
        borderRadius: "4px",
        justifyContent: "space-around",
        alignItems: "end",
      }}>
        <img src={timer.src} alt='icon' style={{ width: '17%', height: '10%', marginBottom: '2px' }} />
        <div style={{ marginTop: '5px' }}>
          <span style={{ color: "#6daa39", marginLeft: "10px" }}>
            {String(hours).padStart(2, '0')}:
          </span>
          <span style={{ color: "#6daa39" }}>
            {String(minutes).padStart(2, '0')}:
          </span>
          <span style={{ color: "#6daa39" }}>
            {String(seconds).padStart(2, '0')}
          </span>
        </div>
      </span>
    </div>


  );
}

export default Timer;
