import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Box, Button, useDisclosure } from '@chakra-ui/react'
import { getAllJobListing, getJobListing } from '../../services/jobListingApi';
import toast from 'react-hot-toast';
import SearchInput from '../../components/ui-components/SearchInput';
import SelectTag from '../../components/ui-components/SelectTag';
import JobListingTable from '../../components/job-listing/JobListingTable';
import { useRouter } from 'next/router';
import { GoPlus } from 'react-icons/go';
import filterIcon from '../../assets/svg/filterIcon.svg'
import dayjs from 'dayjs';
import { Backdrop, CircularProgress } from '@material-ui/core';
import JobListingFilterDrawer from '../../components/job-listing/JobListingFilterDrawer';
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
    customDateStatus: null
  }
}

const JobListing = () => {
  const [companyName, setCompanyName] = useState('')
  const [data, setData] = useState([])
  const [isUpdate, setIsUpdate] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalDataCount, setTotalDataCount] = useState(0)
  const [perPage, setPerPage] = useState(15)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [totalPage, setTotalPage] = useState(3)
  const [loading, setLoading] = useState(false)
  const [jobListingOptions, setJobListingOptions] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  // const [filterDetails, setFilterDetails] = useState(getInitialFilterDetails())
    const { jobListingFilterDetails, setJobListingFilterDetails } = useCredits();
  const router = useRouter()

  const handleFetchJobListing = async (filterDetails: any) => {
    const userId = localStorage.getItem('userId')

    const filterStatus = filterDetails?.status === 'Active' ? false : filterDetails?.status === 'Archive' ? true : ''

    const startDate = filterDetails?.startDate ? `&start_date=${dayjs(filterDetails?.startDate).format('YYYY-MM-DD') ?? ''}` : ''
    const endDate = filterDetails?.endDate ? `&end_date=${dayjs(filterDetails?.endDate).format('YYYY-MM-DD') ?? ''}` : ''
    const status = typeof filterStatus == 'boolean' && (filterStatus == true || filterStatus == false) ? `&status=${filterStatus}` : ''

    console.log('status', status, typeof filterStatus == 'boolean' && (filterStatus === true || filterStatus === false))

    const jobTitles = filterDetails?.jobListingName && filterDetails?.jobListingName.length > 0 ? `&jobtitles=${JSON.stringify(filterDetails?.jobListingName)}` : ''

    const filterSearch = searchInput ? `&search=${searchInput}` : search ? `&search=${search}` : ''

    try {
      const resp = await getJobListing(userId, currentPage, perPage, jobTitles, status, filterSearch, startDate, endDate)
      console.log(resp)
      setTotalPage(resp?.totalpages)
      setData(resp?.data)
      setTotalDataCount(resp.totaldata)
    } catch (e) {
      console.log('error for get job listing', e)
      toast?.error("Something went wrong please try again!");
    }
  }

  const fetchAllJobTitles = async () => {

    const userId = localStorage.getItem('userId') ?? ''
    if (userId) {
      try {
        setLoading(true)
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
    const orgName = localStorage.getItem("companyName") ?? '';
    if (!userId) {
      router.push('/login')
      return
    }
    setCompanyName(orgName)
    handleFetchJobListing(jobListingFilterDetails)
  }, [router, isUpdate, perPage, currentPage, search, searchInput])

  return (
    <Layout>
      {loading && <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Backdrop>}
      <JobListingFilterDrawer
        isOpen={isOpen}
        onClose={onClose}
        filterDetails={jobListingFilterDetails}
        handleFilterDetails={setJobListingFilterDetails}
        handleFetchJobListing={handleFetchJobListing}
        handleSearch={setSearch}
        jobListingOptions={jobListingOptions}
        setJobListingOptions={setJobListingOptions}
      />
      <Box
        sx={{
          paddingLeft: "220px",
          paddingRight: "20px",
          overflowY: "auto",
          height: "100vh",
          backgroundColor: "#F7F9FC",
          // height: "90vh",
          paddingTop: "85px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            // marginTop: "85px",
            marginBottom: "16px",
          }}

        >
          <Box>
            <Box
              // position="relative"
              fontSize={'14px'}
              fontWeight={500}
              color={'#003D86'}
              display={'flex'}
              gap={'10px'}
              alignItems={'center'}
              zIndex={2}
            >
              View Job Listing For {companyName}
              <SelectTag width='25vw' value={search} onChange={(value) => {
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
            {/* <Box></Box> */}
            <Box
              width={'50%'}
            >
              <SearchInput value={searchInput}
                onChange={(value) => setSearchInput(value)}
                placeholder='Search here...' />
            </Box>
          </Box>
          <Box
            display={'flex'}
            flexDirection={'column'}
            gap={'16px'}
            alignItems={'flex-end'}
          >
            {/* @ts-ignore */}
            <Button
              size='small'
              _hover='#003D86'
              _active={'#003D86'}
              bg='#003D86'
              color="#FFFFFF"
              fontSize='12px'
              fontWeight={500}
              p={'7px'}
              leftIcon={<GoPlus size={15} />}
              onClick={() => router.push('/job-listing/create-new-job')}
            >
              Create New Job Listing
            </Button>
            <Button
              size='small'
              _active={'#FFFFFF'}
              _hover={"#FFFFFF"}
              bg='#FFFFFF'
              color={'#667085'}
              border={'1px solid #E0E2E7'}
              fontSize={'12px'}
              width={'150px'}
              p={'7px'}
              leftIcon={<img src={filterIcon.src} alt='img' />}
              onClick={onOpen}

            >Filters ({filterCount(jobListingFilterDetails)})</Button>
          </Box>
        </Box>
        <JobListingTable
          data={data}
          setIsUpdate={setIsUpdate}
          totalPage={totalPage}
          setTotalPage={setTotalPage}
          perPage={perPage} setPerPage={setPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalDataCount={totalDataCount}
        />
      </Box>
    </Layout>
  )
}

export default JobListing