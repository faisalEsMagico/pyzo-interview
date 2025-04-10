import React, { useState } from "react";
import CandidateResultFilterPopup from "./CandidateResultFilterPopup";

const navTextStyle = {
    fontFamily: "Inter-regular",
    fontSize: "16px",
    fontWeight: 600,
    lineHeight: "21px",
    textAlign: "left",
    padding: "15px 0px",
    cursor: "pointer",
};

const InterviewResultNav = ({
    activeNav,
    setActiveNav,
    skillOptions,
    handleInterviewQuestion,
    allData,
}: any) => {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                borderBottom: "1px solid #D9D9D9",
            }}
        >
            <div
                style={{
                    display: "flex",
                    gap: "40px",
                    width: "100%"
                }}
            >
                <span
                    // @ts-ignore
                    style={{
                        ...navTextStyle,
                        color: activeNav === "overview" ? "#5D79C2" : "#B3B3B3",
                        borderBottom: activeNav === "overview" ? "3px solid #5D79C2" : "",
                    }}
                    onClick={() => setActiveNav("overview")}
                >
                    Overview
                </span>
                <span
                    // @ts-ignore
                    style={{
                        ...navTextStyle,
                        color: activeNav === "QA" ? "#5D79C2" : "#B3B3B3",
                        borderBottom: activeNav === "QA" ? "3px solid #5D79C2" : "",
                    }}
                    onClick={() => setActiveNav("QA")}
                >
                    Q&A Summary
                </span>
                <span
                    // @ts-ignore
                    style={{
                        ...navTextStyle,
                        color: activeNav === "recording" ? "#5D79C2" : "#B3B3B3",
                        borderBottom: activeNav === "recording" ? "3px solid #5D79C2" : "",
                    }}
                    // onClick={() => setActiveNav("recording")}
                >
                    Recordings
                </span>
            </div>
            {activeNav === 'QA' &&
                <CandidateResultFilterPopup
                    skillOptions={skillOptions}
                    handleInterviewQuestion={handleInterviewQuestion}
                    allData={allData}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            }
        </div>
    );
};

export default InterviewResultNav;
