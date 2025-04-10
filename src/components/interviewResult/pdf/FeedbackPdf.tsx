import React, { useState, useEffect } from 'react';
import {
    Document,
    Page,
    Text,
    View,
    Image,
    Svg,
    Path,
} from "@react-pdf/renderer";
import { styles } from './PdfStyle';
import profile from '../../../assets/images/profileImg.png'
import dayjs from "dayjs";
import toast from 'react-hot-toast';
import { getJobDescription } from '../../../services/jobListingApi';



const CalenderIcon = () => (
    <Svg
        width="14"
        height="11"
        viewBox="0 0 10 10"
        fill="none"
        // @ts-ignore
        xmlns="http://www.w3.org/2000/svg"
    >
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3.41463 0.487805C3.41463 0.2184 3.19624 0 2.92683 0C2.65742 0 2.43902 0.2184 2.43902 0.487805V0.734639C2.1971 0.738424 1.98213 0.747078 1.79279 0.766859C1.44185 0.803532 1.12371 0.882683 0.840781 1.0785C0.647742 1.21211 0.480401 1.37945 0.346796 1.57249C0.150976 1.85542 0.0718248 2.17356 0.0351565 2.5245C0.00295163 2.83269 0.000239516 3.20878 2.00037e-05 3.65854L4.6499e-07 3.73338C4.6499e-07 3.75043 4.6499e-07 3.76759 4.6499e-07 3.78485V6.6198C-1.41692e-05 7.28034 -2.87556e-05 7.82502 0.0579273 8.25615C0.118781 8.70873 0.251449 9.10844 0.571503 9.42849C0.891552 9.74854 1.29127 9.88122 1.74387 9.94205C2.17497 10 2.71965 10 3.38019 10H6.37585C7.03639 10 7.58112 10 8.01224 9.94205C8.46483 9.88122 8.86454 9.74854 9.18459 9.42849C9.50463 9.10844 9.63732 8.70873 9.6982 8.25615C9.75615 7.82502 9.7561 7.28034 9.7561 6.6198V3.78485C9.7561 3.76994 9.7561 3.75506 9.7561 3.74031V3.65854C9.75585 3.20878 9.75317 2.83269 9.72093 2.5245C9.68429 2.17356 9.60512 1.85542 9.40932 1.57249C9.27571 1.37945 9.10834 1.21211 8.91532 1.0785C8.63239 0.882683 8.31424 0.803532 7.96332 0.766859C7.77395 0.747078 7.55902 0.738424 7.31707 0.734639V0.487805C7.31707 0.2184 7.09868 0 6.82927 0C6.55985 0 6.34146 0.2184 6.34146 0.487805V0.731707H3.41463V0.487805ZM8.78044 3.65854C8.7801 3.2017 8.77703 2.87858 8.75064 2.62589C8.72224 2.35452 8.67137 2.22058 8.60707 2.12771C8.54029 2.03119 8.45663 1.94752 8.3601 1.88071C8.26722 1.81644 8.13327 1.76554 7.8619 1.73719C7.71024 1.72134 7.53317 1.7139 7.31707 1.7104V1.95122C7.31707 2.22062 7.09868 2.43902 6.82927 2.43902C6.55985 2.43902 6.34146 2.22062 6.34146 1.95122V1.70732H3.41463V1.95122C3.41463 2.22062 3.19624 2.43902 2.92683 2.43902C2.65742 2.43902 2.43902 2.22062 2.43902 1.95122V1.7104C2.22291 1.7139 2.04585 1.72134 1.89418 1.73719C1.62281 1.76554 1.48887 1.81644 1.396 1.88071C1.29948 1.94752 1.21581 2.03119 1.14901 2.12771C1.08473 2.22058 1.03384 2.35452 1.00548 2.62589C0.979079 2.87858 0.976005 3.2017 0.975654 3.65854H8.78044ZM0.97561 4.63415V6.58537C0.97561 7.28902 0.976649 7.76766 1.02484 8.12615C1.07115 8.47054 1.15279 8.63005 1.26136 8.73863C1.36993 8.84722 1.52945 8.92888 1.87387 8.97517C2.23232 9.02337 2.71099 9.02439 3.41463 9.02439H6.34146C7.04512 9.02439 7.52376 9.02337 7.88224 8.97517C8.22663 8.92888 8.38615 8.84722 8.49473 8.73863C8.60332 8.63005 8.68498 8.47054 8.73127 8.12615C8.77946 7.76766 8.78049 7.28902 8.78049 6.58537V4.63415H0.97561Z"
            fill="#A3A9B6"
        />
    </Svg>
);

const ClockIcon = () => (
    <Svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        // @ts-ignore
        xmlns="http://www.w3.org/2000/svg"
    >
        <Path
            d="M7.38911 4.18039C7.38911 3.96561 7.215 3.7915 7.00022 3.7915C6.78543 3.7915 6.61133 3.96561 6.61133 4.18039V6.99984C6.61133 7.10297 6.6523 7.20188 6.72523 7.27482L8.47523 9.02482C8.62709 9.1767 8.87334 9.1767 9.0252 9.02482C9.17708 8.87296 9.17708 8.62672 9.0252 8.47485L7.38911 6.83876V4.18039Z"
            fill="#A3A9B6"
            stroke="#A3A9B6"
            stroke-width="0.6"
        />
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.00033 1.1665C3.77867 1.1665 1.16699 3.77818 1.16699 6.99984C1.16699 10.2215 3.77867 12.8332 7.00033 12.8332C10.222 12.8332 12.8337 10.2215 12.8337 6.99984C12.8337 3.77818 10.222 1.1665 7.00033 1.1665ZM1.94477 6.99984C1.94477 4.20773 4.20822 1.94428 7.00033 1.94428C9.79243 1.94428 12.0559 4.20773 12.0559 6.99984C12.0559 9.79194 9.79243 12.0554 7.00033 12.0554C4.20822 12.0554 1.94477 9.79194 1.94477 6.99984Z"
            fill="#A3A9B6"
            stroke="#A3A9B6"
            stroke-width="0.6"
        />
    </Svg>
);

const FeedbackPdf = ({ data, candidateData, feedbackHeaderData, feedbackShowCircleData, feedbackOverviewData }: any) => {
    let count = 1
    const date = dayjs(data?.created);
    const formattedDate = date.format("D MMM YYYY"); // Format for the date
    const formattedTime = date.format("h:mmA");

    return (
        <Document>
            <Page size="A4" wrap>
                <View style={styles.TopNavbar}>
                    <Text style={styles.headingText}>Interview Feedback</Text>
                </View>
                <View style={styles.mainContainer}>
                    <View style={styles.userDetails}>
                        <Image
                            style={styles.profilePhoto}
                            src={profile.src}
                        />

                        <View style={styles.personalDetails} >
                            <View>
                                <Text style={styles.label}>Applicant name: </Text>
                                <Text style={styles.userName}>{data?.name}</Text>
                                <Text style={styles.label}>Email address: </Text>
                                <Text style={styles.userEmail}>{data?.email}</Text>
                            </View>
                            <View>
                                <Text style={styles.label}>Mobile number: </Text>
                                <Text style={styles.userName}>{data?.phone}</Text>
                                <Text style={styles.label}>Role applying for: </Text>
                                <Text style={styles.userEmail}>{data?.jobdescription__job_title}</Text>
                            </View>
                            <View>
                                {feedbackHeaderData[5]?.isChecked && <><Text style={styles.label}>Expected salary (In LPA): </Text>
                                    <Text style={styles.userEmail}>{candidateData.expected_CTC}</Text></>}
                                <Text style={styles.label}>Years of Experince: </Text>
                                <Text style={styles.userEmail}>{candidateData.years_of_experience}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.flexContainer1}>
                        <View style={styles.flexContainer2}>
                            <CalenderIcon />
                            <Text style={styles.textStyle2}>{formattedDate}</Text>
                        </View>
                        <View style={styles.flexContainer2}>
                            <ClockIcon />
                            <Text style={styles.textStyle2}>{formattedTime}</Text>
                        </View>
                    </View>

                </View>
                <Text style={styles.detailsBorder}></Text>

                <View style={styles.questionContainer}>
                    {(feedbackShowCircleData[0]?.isChecked || feedbackShowCircleData[1]?.isChecked) && <Text style={styles.Heading}>Score Insides</Text>}
                    <View style={styles.skillMainContainer} >

                        <View style={styles.circleContainer}>
                            {feedbackShowCircleData[0]?.isChecked && <View wrap={false} style={styles.container}>
                                <View
                                    style={styles.progressBar}
                                >
                                    <Text style={styles.overallOutOff} >
                                        {data?.feedback_overallscore ? <Text> <Text style={styles.overallScore} >{data?.feedback_overallscore}</Text>/10</Text> : '--'}
                                    </Text>
                                    <Text style={styles.overallScoreText} >Overall Score</Text>
                                </View>
                            </View>}
                            {feedbackShowCircleData[1]?.isChecked && <View wrap={false} style={styles.container}>
                                <View
                                    style={styles.progressBar}
                                >
                                    <Text style={styles.overallOutOff}>
                                        {data?.sentimentscore != null ? (
                                            <Text>
                                                <Text style={styles.overallScore}>{data.sentimentscore}</Text>/10
                                            </Text>
                                        ) : (
                                            '--'
                                        )}
                                    </Text>

                                    <Text style={styles.sentimentScoreText} >Soft Skill Score</Text>
                                </View>
                            </View>}
                        </View>
                    </View>
                    <View
                        style={styles.evaluationReasonContainer}
                    >
                        <Text style={styles.Heading}>Evaluation Reason From AI</Text>
                        <Text
                            style={styles.evaluationReasonText}
                        >
                            {data?.feedback_suitable_position ?? '--'}
                        </Text>
                    </View>
                </View>
                {feedbackOverviewData[0].flag && <View style={styles.tableContainer} wrap={false}>
                    {/* Resume Evaluation Header placed right above the table */}
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginBottom: 8,
                            marginTop: 8,
                            textAlign: 'center',
                        }}
                    >
                        Resume Evaluation
                    </Text>

                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <View style={styles.tableCol1}>
                                <Text style={styles.tableCell}>Sr. No</Text>
                            </View>
                            <View style={styles.tableCol2}>
                                <Text style={styles.tableCell}>Criteria</Text>
                            </View>
                            <View style={styles.tableCol3}>
                                <Text style={styles.tableCell}>Score</Text>
                            </View>
                            <View style={styles.tableCol4}>
                                <Text style={styles.tableCell}>Evaluation Reason</Text>
                            </View>
                        </View>

                        {/* Table Rows */}
                        {data?.resume_shortlisting_criteria_evaluation?.map((item: any, index: number) => (
                            <View style={[styles.tableRow, styles.tableBodyText]} key={index}>
                                <View style={styles.tableCol1}>
                                    <Text style={styles.tableCell}>{index + 1}</Text>
                                </View>
                                <View style={styles.tableCol2}>
                                    <Text style={styles.tableCell}>{item.criteria}</Text>
                                </View>
                                <View style={styles.tableCol3}>
                                    <Text style={styles.tableCell}>{item.score}</Text>
                                </View>
                                <View style={styles.tableCol4}>
                                    <Text style={styles.tableCell}>{item.evaluation_reason}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>}
                {feedbackOverviewData[1]?.flag && <View style={styles.tableContainer} wrap={false}>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginBottom: 8,
                            marginTop: 8,
                            textAlign: 'center',
                        }}
                    >
                        Skill Evaluation
                    </Text>

                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <View style={styles.tableCol1}>
                                <Text style={styles.tableCell}>Sr. No</Text>
                            </View>
                            <View style={styles.tableCol2}>
                                <Text style={styles.tableCell}>Skill Tested</Text>
                            </View>
                            <View style={styles.tableCol3}>
                                <Text style={styles.tableCell}>Score</Text>
                            </View>
                            <View style={styles.tableCol4}>
                                <Text style={styles.tableCell}>Evaluation Reason</Text>
                            </View>
                        </View>

                        {/* Table Rows */}
                        {data?.feedback_skill_evaluation?.map((item: any, index: number) => (
                            <View style={[styles.tableRow, styles.tableBodyText]} key={index}>
                                <View style={styles.tableCol1}>
                                    <Text style={styles.tableCell}>{index + 1}</Text>
                                </View>
                                <View style={styles.tableCol2}>
                                    <Text style={styles.tableCell}>{item.skill}</Text>
                                </View>
                                <View style={styles.tableCol3}>
                                    <Text style={styles.tableCell}>
                                        {item.score !== null ? item.score : '--'}
                                    </Text>
                                </View>

                                <View style={styles.tableCol4}>
                                    <Text style={styles.tableCell}>{item.evaluation_reason}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>}


                {feedbackOverviewData[2]?.flag && <View style={styles.questionContainer} break>
                    <Text style={styles.Heading}>Questions review</Text>
                    {data?.interviews?.map((item: any, ind: number) => {
                        return item?.questions_responses?.map((values: any, i: number) => {
                            return <View wrap={false} key={`${i}-${ind}`} style={styles.questionAnswerContainer}>
                                <View style={styles.questionCount}>
                                    <Text>Question:{count++}</Text>
                                </View>
                                <View style={styles.questionPadding} >
                                    <View style={styles.flexContainer3}>
                                        <Text style={styles.quesStyle}>
                                            Question: {values?.questions}
                                        </Text>
                                    </View>
                                    <View style={styles.flexContainer3}>
                                        <Text style={styles.ansStyle}>
                                            <Text style={styles.ansHeadingStyle} >{`Interviewee's`} Answer: </Text>
                                            {values.response}</Text>
                                    </View>
                                </View>
                                <View style={styles.scoreLogicContainer}>
                                    <Text style={styles.scoreTextStyle}>Skill Tested:</Text>
                                    <Text style={styles.ansStyle1}>
                                        {item.skill ?? '--'}
                                    </Text>
                                    <Text style={styles.scoreTextStyle}>Level Score:</Text>
                                    <Text style={styles.ansStyle1}>
                                        {item.level && item.level != 'N/A' ? `${item.level}/10` : '--'}
                                    </Text>
                                    <Text style={styles.scoreTextStyle}>Evaluation reason:</Text>
                                    <Text style={styles.ansStyle1}>
                                        {values.evaluation_reason ?? '--'}
                                    </Text>
                                </View>
                            </View>
                        })
                    })}
                </View>}
            </Page>
        </Document>
    );
};

export default FeedbackPdf;
