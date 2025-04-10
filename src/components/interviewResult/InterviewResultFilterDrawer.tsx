import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { IoMdArrowDropup } from 'react-icons/io'
import RadioButton from '../../UiComponents/RadioButton'
import DateRange from '../../UiComponents/DateRange'
import MultiSelectTag from '../ui-components/MultiSelectTag'
import { RxCross2 } from 'react-icons/rx'

import dayjs from 'dayjs';
import { getInitialFilterDetails } from '../../pages/job-listing'

const InterviewFilterDrawer = (
    {
        isOpen,
        onClose,
        filterDetails,
        handleFilterDetails,
        handleFetchInterviewResult,
        handleSearch,
        jobListingOptions,
        setJobListingOptions,
        handleSearchInput
    }:
        {
            isOpen: boolean, onClose: () => void,
            filterDetails: any,
            handleFilterDetails: any,
            handleFetchInterviewResult: (arg: any) => void,
            handleSearch: (arg: string) => void,
            jobListingOptions: any,
            setJobListingOptions: any,
            handleSearchInput: (arg: string) => void
        }) => {

    console.log('filterDetails', filterDetails)

    const handleDate = (value: string) => {
        if (value === 'Custom') {
            handleFilterDetails((pre: any) => {
                return {
                    ...filterDetails,
                    customDateStatus: value,
                    startDate: null,
                    endDate: null
                }
            });
        } else if (value === 'Recent') {
            handleFilterDetails((pre: any) => {
                return {
                    ...filterDetails,
                    customDateStatus: value,
                    startDate: dayjs(),
                    endDate: dayjs()
                }
            });
        } else if (value === 'Yesterday') {
            handleFilterDetails((pre: any) => {
                return {
                    ...filterDetails,
                    customDateStatus: value,
                    startDate: dayjs().subtract(1, 'day'),
                    endDate: dayjs()
                }
            });
        } else if (value === 'Last week') {
            handleFilterDetails((pre: any) => {
                return {
                    ...filterDetails,
                    customDateStatus: value,
                    startDate: dayjs().subtract(1, 'week'),
                    endDate: dayjs()
                }
            });
        } else if (value === 'Last month') {
            handleFilterDetails((pre: any) => {
                return {
                    ...filterDetails,
                    customDateStatus: value,
                    startDate: dayjs().subtract(1, 'month'),
                    endDate: dayjs()
                }
            });
        } else if (value === 'Last year') {
            handleFilterDetails((pre: any) => {
                return {
                    ...filterDetails,
                    customDateStatus: value,
                    startDate: dayjs().subtract(1, 'year'),
                    endDate: dayjs()
                }
            });
        }
    }

    const handleDeleteJobListingName = (ind: number) => {
        const newJobListingName = [...filterDetails?.jobListingName];
        newJobListingName.splice(ind, 1);

        handleFilterDetails((pre: any) => {
            return {
                ...filterDetails,
                jobListingName: newJobListingName
            }
        });
    }

    const handleApplyFilter = () => {
        handleSearch('')
        handleSearchInput('')
        handleFetchInterviewResult(filterDetails)
        onClose()
    }

    const handleClearFilter = () => {
        handleFilterDetails(getInitialFilterDetails())
        handleSearch('')
        handleSearchInput('')
        handleFetchInterviewResult(getInitialFilterDetails())
        onClose()
    }

    return (
        <>

            {/* @ts-ignore */}
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                size='sm'
            >
                <DrawerOverlay />
                {/* @ts-ignore */}
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader sx={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#1D1F2C",
                        borderBottom: "1px solid #E5E5E5"
                    }}>Filter by</DrawerHeader>

                    <DrawerBody p='0px' m='0px' >
                        <Box
                            fontSize={'14px'}
                            color='#1D1F2C'
                            p='12px 16px 25px 16px'
                        >
                            {filterDetails?.customDateStatus &&
                                <span
                                    style={{
                                        display: "flex",
                                        gap: "5px",
                                        backgroundColor: "#F9F9FC",
                                        padding: "4px 12px",
                                        minWidth: "150px",
                                        width: "200px",
                                        borderRadius: "5px"
                                    }}

                                >
                                    Date :
                                    <span
                                        style={{ display: "flex", alignItems: "center", gap: "5px", color: "#6F747E" }}

                                    >{filterDetails?.customDateStatus} <RxCross2
                                            style={{ cursor: "pointer" }}
                                            color='#6F747E'
                                            onClick={() =>
                                                handleFilterDetails({
                                                    ...filterDetails,
                                                    customDateStatus: null,
                                                    startDate: null,
                                                    endDate: null
                                                })}
                                        />
                                    </span>
                                </span>
                            }
                            {filterDetails.jobListingName && filterDetails.jobListingName.length > 0 &&
                                <Box
                                    sx={{

                                        backgroundColor: "#F9F9FC",
                                        padding: "4px 12px",
                                        borderRadius: "5px",
                                        marginTop: "8px"
                                    }}
                                >
                                    <Box>
                                        Job Listing Name
                                    </Box>
                                    <Box
                                        display={'flex'}
                                        gap={'5px'}
                                        flexWrap={'wrap'}

                                    >
                                        {filterDetails?.jobListingName?.map((item: string, ind: number) => {
                                            return <span
                                                key={ind}
                                                style={{
                                                    display: "flex",
                                                    gap: "5px",
                                                    alignItems: "center"

                                                }}
                                            >{item} <RxCross2 onClick={() => handleDeleteJobListingName(ind)} style={{ cursor: 'pointer' }} /> </span>
                                        })}
                                    </Box>
                                </Box>}
                            {filterDetails.status && <span
                                style={{
                                    display: "flex",
                                    gap: "5px",
                                    backgroundColor: "#F9F9FC",
                                    padding: "4px 12px",
                                    minWidth: "300px",
                                    width: "300px",
                                    borderRadius: "5px",
                                    marginTop: "8px "
                                }}
                            >
                                Status :
                                <span
                                    style={{ display: "flex", alignItems: "center", gap: "5px", color: "#6F747E" }}

                                >{filterDetails?.status} <RxCross2
                                        color='#6F747E'
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            handleFilterDetails({
                                                ...filterDetails,
                                                status: null,
                                            })}
                                    />
                                </span>
                            </span>
                            }
                        </Box>
                        <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            backgroundColor={'#F9F9FC'}
                            p='7px 16px'
                            width={'100%'}
                            color={'#535353'}
                            fontSize={'14px'}
                            m={0}
                        >
                            Date
                            <IoMdArrowDropup color='#535353' size={22} />
                        </Box>
                        <Box
                            px='16px'
                        >
                            <RadioButton
                                value={filterDetails?.customDateStatus ?? ''}
                                color='#000000'
                                onChange={(value) => handleDate(value)}
                                options={[
                                    { label: "Custom", value: "Custom" },
                                    { label: "Recent", value: "Recent" },
                                    { label: "Yesterday", value: "Yesterday" },
                                    { label: "Last week", value: "Last week" },
                                    { label: "Last month", value: "Last month" },
                                    { label: "Last year", value: "Last year" }
                                ]}
                                errorMessage=''
                            />
                        </Box>

                        <Box
                            color='#1D1F2C'
                            fontSize={'12px'}
                            fontWeight={600}
                            px='16px'
                            mb='7px'
                            mt='20px'
                        >
                            Custom
                        </Box>
                        <Box position={'relative'} zIndex={100} >
                            <DateRange
                                filterDetails={filterDetails}
                                onChange={(data: any) => handleFilterDetails(data)}
                                disable={filterDetails?.customDateStatus !== 'Custom'}
                            />
                        </Box>
                        <Button
                            size='small'
                            bg='#FFFFFF'
                            _hover={'#FFFFFF'}
                            _active={'#FFFFFF'}
                            border={'none'}
                            color={'#1D1F2C'}
                            fontSize={'12px'}
                            fontWeight={400}
                            textDecoration={'underline'}
                            onClick={() => handleFilterDetails((pre: any) => {
                                return {
                                    ...pre, customDateStatus: null,
                                    startDate: null,
                                    endDate: null
                                }
                            })}
                            mb='25px'
                            mt='15px'
                            mx='16px'
                            p='0'
                        >Clear</Button>
                        <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            backgroundColor={'#F9F9FC'}
                            p='7px 16px'
                            width={'100%'}
                            color={'#535353'}
                            fontSize={'14px'}
                            m={0}
                        >
                            Job Listing Name
                            <IoMdArrowDropup color='#535353' size={22} />
                        </Box>
                        <Box
                            p='16px'
                        >
                            <MultiSelectTag
                                value={filterDetails?.jobListingName?.map((item: string) => {
                                    return {
                                        label: item,
                                        value: item
                                    }
                                })}
                                onChange={(value) => {
                                    console.log('value', value)
                                    const newValue = value?.map((item) => {
                                        return item.value
                                    })
                                    console.log('newValue', newValue)
                                    handleFilterDetails((pre: any) => {
                                        return { ...pre, jobListingName: newValue }
                                    })
                                }}
                                options={jobListingOptions}
                                errorMessage=''
                                placeholder='Select'
                            />
                            <Box
                                display={'flex'}
                                gap='10px'
                                pt='10px'
                            >
                                {filterDetails?.jobListingName?.map((item: string) => {
                                    return <Box
                                        key={item}
                                        bg='#EAF1FD'
                                        p='4px 8px'
                                        fontSize={'10px'}
                                        borderRadius={'4px'}
                                    >
                                        {item}
                                    </Box>
                                })}
                            </Box>
                        </Box>
                        <Button
                            size='small'
                            bg='#FFFFFF'
                            _hover={'#FFFFFF'}
                            _active={'#FFFFFF'}
                            border={'none'}
                            color={'#1D1F2C'}
                            fontSize={'12px'}
                            fontWeight={400}
                            textDecoration={'underline'}
                            onClick={() => handleFilterDetails((pre: any) => {
                                return {
                                    ...pre, jobListingName: []
                                }
                            })}
                            mb='25px'
                            mt='15px'
                            mx='16px'
                            p='0'
                        >Clear</Button>
                        <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            backgroundColor={'#F9F9FC'}
                            p='7px 16px'
                            width={'100%'}
                            color={'#535353'}
                            fontSize={'14px'}
                            m={0}
                        >
                            Status
                            <IoMdArrowDropup color='#535353' size={22} />
                        </Box>
                        <Box
                            px='16px'

                        >
                            <RadioButton
                                color='#000000'
                                value={filterDetails?.status}
                                onChange={(value) => handleFilterDetails((pre: any) => {
                                    return {
                                        ...pre, status: value
                                    }
                                })}
                                options={[{ label: "Interview Selected", value: "Interview Selected" }, { label: "Interview Rejected", value: "Interview Rejected" }]}
                                errorMessage=''
                            />
                        </Box>
                        <Button
                            size='small'
                            bg='#FFFFFF'
                            _hover={'#FFFFFF'}
                            _active={'#FFFFFF'}
                            border={'none'}
                            color={'#1D1F2C'}
                            fontSize={'12px'}
                            fontWeight={400}
                            textDecoration={'underline'}
                            onClick={() => handleFilterDetails((pre: any) => {
                                return {
                                    ...pre, status: null
                                }
                            })}
                            mb='25px'
                            mt='15px'
                            mx='16px'
                            p='0'
                        >Clear</Button>
                    </DrawerBody>

                    <DrawerFooter
                        sx={{ padding: "0px", margin: "0px" }}
                    >
                        <Box
                            display={"flex"}
                            width={'100%'}
                            justifyContent="space-between"
                            p='8px 16px 18px 16px'
                        >
                            <Button
                                size='small'
                                px='11px'
                                py={'7px'}
                                color={'#003D86'}
                                border='1px solid #003D86'
                                _hover={'#FFFFFF'}
                                _active={'#FFFFFF'}
                                bg={'#FFFFFF'}
                                fontSize={'14px'}
                                fontWeight={500}
                                onClick={handleClearFilter}
                            >
                                Clear all Filters
                            </Button>
                            <Button
                                size='small'
                                px='40px'
                                py={'7px'}
                                bg={'#003D86'}
                                _active={'#003D86'}
                                _hover={"#003D86"}
                                color='#FFFFFF'
                                fontSize={'14px'}
                                fontWeight={500}
                                onClick={handleApplyFilter}
                            >Apply</Button>
                        </Box>
                    </DrawerFooter>
                </DrawerContent >
            </Drawer >
        </>
    )
}

export default InterviewFilterDrawer