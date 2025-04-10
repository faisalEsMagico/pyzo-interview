import React, { useState } from 'react'
import {
    Box,
    Button,
    Checkbox,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/react'
import { PostSaveTemplates } from '../../services/jobListingApi'
import InputField from '../ui-components/InputField'
import toast from 'react-hot-toast'
import { CircularProgress } from '@material-ui/core'

const SaveTemplatePopup = ({ isOpen, onClose, mandatoryData, customData,
    setIsTemplateGenerate }:
    {
        isOpen: boolean,
        onClose: () => void,
        mandatoryData: any,
        customData: any,
        setIsTemplateGenerate: (arg: any) => void
    }) => {
    const [name, setName] = useState('')
    const [mandatoryFields, setMandatoryFields] = useState<string[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSaveTemplate = async () => {
        const usersId = localStorage.getItem('userId') ?? ''
        if (!name) {
            setError('name is required!')
            return
        }
        let data = [...mandatoryData].filter((item) => mandatoryFields.includes(item.question));
        data = data?.map((item) => {

            if (item.question === 'Enter Job Title') {
                return {
                    job_title: item.value
                }
            }
            if (item.question.trim() === 'Enter Job Description') {
                return {
                    job_description: item.value
                }
            }
            if (item.question === 'Enter Role And Responsibility') {
                return {
                    roles_and_responsibilities: item.value
                }
            }
            if (item.question === 'About Company') {
                return {
                    about_company: item.value
                }
            }
            if (item.question === 'Enter Skills Required') {
                return {
                    skills_required: item.value
                }
            }
            if (item.question === 'Enter Expected Years Of Experience') {
                return {
                    years_of_experience: item.value
                }
            }
            if (item.question === 'Enter Expected Salary (In LPA)') {
                return {
                    salary: item.value
                }
            }
            if (item.question === 'What Is Your Expected Location ?') {
                return {
                    location: item.value
                }
            }
            if (item.question === 'Select Expected Mode Of Work') {
                return {
                    mode_of_work: item.value
                }
            }
        })
        data = data.reduce((acc, obj) => {
            return { ...acc, ...obj };
        }, {});
        const newData = {
            about_company: "",
            job_description: "",
            job_title: "",
            location: "",
            mode_of_work: "",
            roles_and_responsibilities: "",
            salary: "0",
            skills_required: "",
            years_of_experience: "",
            ...data
        }
        console.log('save template', newData)
        setLoading(true)
        try {
            const resp = await PostSaveTemplates({ name: name, recruiter: usersId, ...newData })
            console.log('resp', resp)
            toast.success("template save successfully!")
            setIsTemplateGenerate((pre: any) => !pre)
            setLoading(false)
            setMandatoryFields([])
            onClose()
        } catch (e) {
            console.log('error while calling post template api')
            setLoading(false)
            toast.error('Something went wrong. Please try again!')
        }
    }

    const handleChange = (e: any,
        value: string,
        handleSet: (arg: any) => void,
        data: any) => {
        e?.preventDefault()
        const status = e.target.checked
        if (status) {
            handleSet((pre: any) => {
                return [...pre, value]
            })
            return
        } else {
            let newData = [...data];
            newData = newData.filter((item) => item != value)
            handleSet(newData)
        }
    }

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )
    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose} size='xl'>
            {OverlayOne()}
            {/* @ts-ignore */}
            <ModalContent>
                <ModalHeader
                    bg='#F7F9FC'
                    fontSize={'18px'}
                    fontWeight={600}
                    color='#1D1F2C'
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    paddingRight={'60px'}
                >
                    <InputField
                        bgColor='#F7F9FC'
                        errorMessage={error}
                        value={name}
                        borderLess={true}
                        onChange={(value) => {
                            if (error) { setError('') }
                            setName(value)
                        }}
                        placeholder='Please enter template name here'
                        size='14px'
                    />
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody >
                    <Box
                        fontSize={'14px'}
                        fontWeight={600}
                        mt='22px'
                        mb='18px'
                    >
                        Select the fields You Want To Save in the template
                    </Box>
                    <Box
                        display='flex'
                        gap='10px'
                    >
                        <Box
                            width={'100%'}
                        >
                            <Box
                                fontSize={'12px'}
                                color='#667085'
                            >
                                Mandatory fields
                            </Box>
                            <Box
                                height={'200px'}
                                overflow={'auto'}
                                display={'flex'}
                                flexDirection={'column'}
                                paddingLeft={'5px'}
                            >
                                {mandatoryData?.map((item: any, i: number) => {
                                    if (i > 4) {
                                        return null
                                    }
                                    return <Checkbox
                                        key={item?.question}
                                        mt='20px'
                                        isChecked={mandatoryFields.includes(item?.question)}
                                        onChange={(e) => handleChange(e, item.question,
                                            setMandatoryFields, mandatoryFields)}
                                    >
                                        <Text fontSize="14px">{item?.question}</Text>
                                    </Checkbox>
                                })}
                            </Box>
                        </Box>
                    </Box>
                    <Box
                        mt='50px'
                        mb='20px'
                    >
                        <Button
                            onClick={handleSaveTemplate}
                            size='small'
                            py='7px'
                            bg={'#003D86'}
                            _hover='#003D86'
                            _active='#003D86'
                            color='#FFFFFF'
                            px='50px'
                            disabled={loading}
                        >{loading ? <CircularProgress color="inherit" /> : 'Save As Template'}</Button>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal >
    )
}

export default SaveTemplatePopup