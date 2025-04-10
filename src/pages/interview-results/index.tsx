import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Box, Button, useDisclosure } from '@chakra-ui/react'
import CommonDateFilterPanel from '../../components/ui-components/DateFilter'
import { getAllJobListing, getInterviewResult } from '../../services/jobListingApi';
import toast from 'react-hot-toast';
import SearchInput from '../../components/ui-components/SearchInput';
import FilterSelect from '../../components/ui-components/FilterSelect';
import { useRouter } from 'next/router';
import ApplicationTable from '../../components/application/ApplicationTable';
import InterviewResultTable from '../../components/interviewResult/InterviewResultTable';
import SelectTag from '../../components/ui-components/SelectTag';
import filterIcon from '../../assets/svg/filterIcon.svg'
import dayjs from 'dayjs';
import InterviewFilterDrawer from '../../components/interviewResult/InterviewResultFilterDrawer';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { useCredits } from '../../context/CreditsContext';

const filterCount = (filters: any) => {
  let count = 0;

  // Check if status is a valid string
  if (filters.status && typeof filters.status === 'string' && filters.status.trim() !== '') {
    count++;
  }

  // Check if customDateStatus is a valid string
  if (
    filters.customDateStatus &&
    typeof filters.customDateStatus === 'string' &&
    filters.customDateStatus.trim() !== ''
  ) {
    count++;
  }

  // Check if jobListingName is a non-empty array of strings
  if (
    Array.isArray(filters.jobListingName) &&
    filters.jobListingName.length > 0 &&
    filters.jobListingName.every((name: any) => typeof name === 'string' && name.trim() !== '')
  ) {
    count++;
  }

  return count;
};


export const getInitialFilterDetails = () => {
  return {
    startDate: null,
    endDate: null,
    jobListingName: [],
    status: null,
    customDateStatus: null,
  }
}

const Applications = () => {
  const [data, setData] = useState([])
  const [isUpdate, setIsUpdate] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalDataCount, setTotalDataCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(0)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [organizationOptions, setOrganizationOptions] = useState<any[]>([])
  const [org, setOrg] = useState('')
  const [jobListingOptions, setJobListingOptions] = useState([])
  // const [filterDetails, setFilterDetails] = useState(getInitialFilterDetails())
   const { interviewResultFilterDetails, setInterviewResultFilterDetails } = useCredits();

  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  const handleFetchInterviewResult = async (filterDetails: any) => {
    const id = localStorage.getItem('userId')

    const startDate = filterDetails?.startDate ? `&start_date=${dayjs(filterDetails?.startDate).format('YYYY-MM-DD') ?? ''}` : ''
    const endDate = filterDetails?.endDate ? `&end_date=${dayjs(filterDetails?.endDate).format('YYYY-MM-DD') ?? ''}` : ''

    const jobTitles = filterDetails?.jobListingName && filterDetails?.jobListingName.length > 0 ? `&jobtitles=${JSON.stringify(filterDetails?.jobListingName)}` : ''
    const filterSearch = searchInput ? `&search=${searchInput}` : search ? `&search=${search}` : ''
    const status = filterDetails?.status ? `&interviewstatus=${filterDetails?.status}` : ''
    const orgFilter = org ? `&organizatio=${org}` : ''
    try {
      setLoading(true)
      const resp = await getInterviewResult(id, currentPage, perPage, jobTitles, status, filterSearch, startDate, endDate)
      console.log(resp)
      setLoading(false)
      setData(resp?.detail)
      setTotalPage(resp?.totalpages)
      setTotalDataCount(resp?.totalcandidates)
    } catch (e) {
      setLoading(false)
      console.log('error for get job listing', e)
      toast?.error("Something went wrong please try again!");
    }
  }

  const fetchAllJobTitles = async () => {
    setLoading(true)
    const userId = localStorage.getItem('userId') ?? ''
    if (userId) {
      try {

        const resp = await getAllJobListing(userId)
        const options = resp?.data?.map((item: string) => {
          return {
            label: item,
            value: item
          }
        })
        setLoading(false)
        setJobListingOptions(options)
      } catch (e) {
        setLoading(false)
        console.log('error while calling get job listing api', e)
        toast.error('Something went wrong!')
      }
    }
  }

  useEffect(() => {
    fetchAllJobTitles()
  }, [])

  useEffect(() => {
    const userId = localStorage.getItem("userId") ?? '';
    const org = localStorage.getItem('companyName') ?? '';
    if (!userId) {
      router.push('/login')
      return
    }
    setOrganizationOptions([{ label: org, value: org }])
    handleFetchInterviewResult(interviewResultFilterDetails)
  }, [router, searchInput, search, currentPage, perPage])

  return (
    <Layout>
      {loading && <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>}
      <InterviewFilterDrawer
        isOpen={isOpen}
        onClose={onClose}
        filterDetails={interviewResultFilterDetails}
        handleFilterDetails={setInterviewResultFilterDetails}
        handleFetchInterviewResult={handleFetchInterviewResult}
        handleSearch={setSearch}
        jobListingOptions={jobListingOptions}
        setJobListingOptions={setJobListingOptions}
        handleSearchInput={setSearchInput}
      />
      <Box
        sx={{
          marginLeft: "200px",
          paddingRight: "20px",
          backgroundColor: "#F9F9FC",
          paddingLeft: "20px",
          overflowY: "auto",
          height: "100vh",
          paddingTop: "85px"
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <Box>
            <Box
              display={'flex'}
              gap={'30px'}
            >
              <Box
                position="relative"
                fontSize={'14px'}
                fontWeight={500}
                color={'#003D86'}
                display={'flex'}
                gap={'10px'}
                alignItems={'center'}
                zIndex={2}
              >
                Organization
                <SelectTag width='12vw' value={org} onChange={(value) => {
                  if (typeof value == 'string') {
                    setOrg(value)
                  }
                }} options={organizationOptions} placeholder='--Select--' />
                <Button
                  size='small'
                  p={'7px'}
                  fontSize={'12px'}
                  _active={'#003D86'}
                  _hover={'#003D86'}
                  bg={'#003D86'}
                  color={"#FFFFFF"}
                  fontWeight={500}
                  onClick={() => setOrg('')}
                >Clear</Button>
              </Box>
              <Box
                position="relative"
                fontSize={'14px'}
                fontWeight={500}
                color={'#003D86'}
                display={'flex'}
                gap={'10px'}
                alignItems={'center'}
                zIndex={2}
              >
                Job Listing
                <SelectTag width='12vw' value={search} onChange={(value) => {
                  if (typeof value == 'string') {
                    setSearch(value)
                  }
                }} options={jobListingOptions} placeholder='--Select--' />
                <Button
                  size='small'
                  p={'7px'}
                  fontSize={'12px'}
                  _active={'#003D86'}
                  _hover={'#003D86'}
                  bg={'#003D86'}
                  color={"#FFFFFF"}
                  fontWeight={500}
                  onClick={() => setSearch('')}
                >Clear</Button>
              </Box>
            </Box>
            <Box
              width={'40%'}
            >
              <SearchInput value={searchInput} onChange={(value) => setSearchInput(value)} placeholder='Search here...' />
            </Box>
          </Box>
          <Box
            display={'flex'}
            flexDirection={'column'}
            gap={'10px'}
            alignItems={'flex-end'}
          >
            {/* @ts-ignore */}

            <Button
              size='small'
              p='7px'
              _active={'#FFFFFF'}
              _hover={"#FFFFFF"}
              bg='#FFFFFF'
              color={'#667085'}
              border={'1px solid #E0E2E7'}
              fontSize={'12px'}
              width={'150px'}
              leftIcon={<img src={filterIcon.src} alt='img' />}
              onClick={onOpen}

            >Filters ({filterCount(interviewResultFilterDetails)})</Button>
          </Box>
        </Box>
        <InterviewResultTable
          data={data}
          setIsUpdate={setIsUpdate}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          perPage={perPage}
          setPerPage={setPerPage}
          totalPage={totalPage}
          setTotalPage={setTotalPage}
          totalDataCount={totalDataCount}
        />
      </Box>
    </Layout>
  )
}

export default Applications