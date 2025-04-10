import {
    Box,
    Button,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    PortalManager
} from '@chakra-ui/react'
import React, { useState } from 'react'
import filterIcon from '../../assets/svg/filterIcon.svg'
import MultiSelectTag from '../ui-components/MultiSelectTag'
import toast from 'react-hot-toast'

const CandidateResultFilterPopup = ({ skillOptions, allData, handleInterviewQuestion, isOpen, setIsOpen }: any) => {
    const [filterData, setFilterData] = useState([]);

    const handleReset = () => {
        setFilterData([])
        handleInterviewQuestion(allData)
        setIsOpen(false)
    }

    const handleApplyFilter = () => {
        if (!filterData || filterData.length === 0) {
            toast.error('Please select skills first!');
            return; // Prevent further execution if no filterData
        }

        console.log('filterData', filterData);
        // @ts-ignore
        const newData = allData?.filter((item: any) => filterData.includes(item?.skill)); // Remove @ts-ignore and ensure correct types

        console.log('newData', newData);

        handleInterviewQuestion(() => newData);
        setIsOpen(false);
    };

    return (
        <Popover
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            placement='bottom-start'
            closeOnBlur={false}
        >
            {/* @ts-ignore */}
            <PopoverTrigger>
                {/* @ts-ignore */}
                <Button
                    _active={'#FFFFFF'}
                    _hover={"#FFFFFF"}
                    bg='#FFFFFF'
                    color={'#667085'}
                    border={'1px solid #E0E2E7'}
                    fontSize={'12px'}
                    width={'150px'}
                    mb='8px'
                    onClick={() => setIsOpen(true)}
                    leftIcon={<img src={filterIcon.src} alt='img' />}
                //   onClick={onOpen}

                >Filters ({filterData?.length})</Button>
            </PopoverTrigger>
            <PortalManager>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    {/* @ts-ignore */}
                    <PopoverBody
                        p='14px'
                    >
                        <Box
                            fontSize={'12px'}
                            fontWeight={600}
                            color={'#2C313B'}
                            mb='20px'
                        >Filter by Skill</Box>
                        <MultiSelectTag
                            options={skillOptions}
                            value={filterData?.map((value) => {
                                return {
                                    label: value,
                                    value: value
                                }
                            })}
                            // @ts-ignore
                            onChange={(value) => setFilterData(value?.map((item) => item?.value))}
                            placeholder='Select'
                        />
                        <Box
                            mt='8px'
                        >
                            {filterData.map((item, i) => {
                                return <span
                                    key={i}
                                    style={{
                                        fontSize: "10px",
                                        color: '#141926',
                                        padding: "4px 8px",
                                        backgroundColor: "#EAF1FD",
                                        borderRadius: '4px',
                                        marginRight: "5px"
                                    }}
                                >{item}</span>
                            })}

                        </Box>
                    </PopoverBody>
                    <PopoverFooter
                        border={'none'}
                    >
                        <Box
                            display={'flex'}
                            gap={'10px'}
                            mt={'100px'}

                        >
                            <Button
                                size='small'
                                bg='#B9D9FF'
                                _hover={'#B9D9FF'}
                                _active={'#B9D9FF'}
                                width={'50%'}
                                color={'#003D86'}
                                fontSize={'12px'}
                                fontWeight={500}
                                p='7px'
                                onClick={handleReset}
                            >Reset</Button>
                            <Button
                                size='small'
                                bg='#003D86'
                                _hover={'#003D86'}
                                _active={'#003D86'}
                                width={'50%'}
                                color={'#FFFFFF'}
                                fontSize={'12px'}
                                fontWeight={500}
                                p='7px'
                                onClick={handleApplyFilter}
                            >Apply</Button>
                        </Box>
                    </PopoverFooter>
                </PopoverContent>
                {/* @ts-ignore */}
            </PortalManager>
        </Popover>
    )
}

export default CandidateResultFilterPopup