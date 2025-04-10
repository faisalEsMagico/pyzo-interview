import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Box, Button, useDisclosure } from '@chakra-ui/react'
import CommonDateFilterPanel from '../../components/ui-components/DateFilter'
import { getAllJobListing, getCandidatesDetails, getJobListing } from '../../services/jobListingApi';
import toast from 'react-hot-toast';
import SearchInput from '../../components/ui-components/SearchInput';
import FilterSelect from '../../components/ui-components/FilterSelect';
import { useRouter } from 'next/router';
import ApplicationTable from '../../components/application/ApplicationTable';
import SelectTag from '../../components/ui-components/SelectTag';
import filterIcon from '../../assets/svg/filterIcon.svg'
import ApplicationFilterDrawer from '../../components/application/ApplicationFilterDrawer';
import dayjs from 'dayjs';
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

  // Check if aiScreeningResult is a valid string
  if (
    filters.aiScreeningResult &&
    typeof filters.aiScreeningResult === 'string' &&
    filters.aiScreeningResult.trim() !== ''
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
    aiScreeningResult: null
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
  const [jobListingOptions, setJobListingOptions] = useState([])
  const [organizationOptions, setOrganizationOptions] = useState<any[]>([])
  const [org, setOrg] = useState('')
  // const [filterDetails, setFilterDetails] = useState(getInitialFilterDetails())
  const router = useRouter()
  const windowWidth = document?.documentElement?.clientWidth;
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { applicationFilterDetails, setApplicationFilterDetails } = useCredits();


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
    const org = localStorage.getItem('companyName') ?? '';
    setOrganizationOptions([{ label: org, value: org }])
    fetchAllJobTitles()
  }, [])

  const handleFetchJobListing = async (filterDetails: any) => {
    const id = localStorage.getItem("userId") ?? ''
    const filterStatus = filterDetails?.aiScreeningResult === 'Accepted' ? true : filterDetails?.aiScreeningResult === 'Rejected' ? false : ''
    const startDate = filterDetails?.startDate ? `&start_date=${dayjs(filterDetails?.startDate).format('YYYY-MM-DD') ?? ''}` : ''
    const endDate = filterDetails?.endDate ? `&end_date=${dayjs(filterDetails?.endDate).format('YYYY-MM-DD') ?? ''}` : ''
    const aiScreeningResult = typeof filterStatus == 'boolean' && (filterStatus == true || filterStatus == false) ? `&aiscreeningresult=${filterStatus}` : ''

    const jobTitles = filterDetails?.jobListingName && filterDetails?.jobListingName.length > 0 ? `&jobtitles=${JSON.stringify(filterDetails?.jobListingName)}` : ''
    const filterSearch = searchInput ? `&search=${searchInput}` : search ? `&search=${search}` : ''
    const orgFilter = org ? `&organizatio=${org}` : ''
    const status = filterDetails?.status ? `&interviewstatus=${filterDetails?.status}` : ''

    try {
      setLoading(true)
      const resp = await getCandidatesDetails(id, currentPage, perPage, jobTitles, status, aiScreeningResult, filterSearch, startDate, endDate)
      console.log('resp', resp)
      setLoading(false)
      setTotalPage(resp?.totalpages)
      setData(resp?.detail)
      setTotalDataCount(resp?.totalcandidates)
    } catch (e) {
      setLoading(false)
      console.log('error for get job listing', e)
      toast?.error("Something went wrong please try again!");
    }
  }

  useEffect(() => {
    const userId = localStorage.getItem("userId") ?? '';
    if (!userId) {
      router.push('/login')
      return
    }
    handleFetchJobListing(applicationFilterDetails)
  }, [router, perPage, currentPage, search, searchInput])

  return (
    <Layout>
      <Box sx={{
        paddingLeft: "220px",
        paddingRight: "20px",
        paddingTop: "85px",
        overflowY: "auto",
        height: "100vh",
        backgroundColor: "#F7F9FC",
        // height: "90vh",
        // overflowY: "scroll"

      }}>
        {loading && <Backdrop open={true} style={{ zIndex: 999, color: "#fff" }}>
          <CircularProgress color="inherit" />
        </Backdrop>}
        <ApplicationFilterDrawer
          isOpen={isOpen}
          onClose={onClose}
          filterDetails={applicationFilterDetails}
          handleFilterDetails={setApplicationFilterDetails}
          handleFetchJobListing={handleFetchJobListing}
          handleSearch={setSearch}
          jobListingOptions={jobListingOptions}
          setJobListingOptions={setJobListingOptions}
          handleSearchInput={setSearchInput}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: '16px'
          }}
        >
          <Box>
            <Box
              display={'flex'}
              gap={'40px'}
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
                }}
                  options={organizationOptions}
                  placeholder='--Select--'
                />
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
              <SearchInput value={searchInput}
                onChange={(value) => setSearchInput(value)}
                placeholder='Search here...' />
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
              mt='40px'
              leftIcon={<img src={filterIcon.src} alt='img' />}
              onClick={onOpen}
            >Filters ({filterCount(applicationFilterDetails)})</Button>
          </Box>
        </Box>
        <ApplicationTable
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