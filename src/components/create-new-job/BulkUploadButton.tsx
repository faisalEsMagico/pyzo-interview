import { Box, Button } from '@chakra-ui/react'
import React, { useState } from 'react'
import BulkUploadPopup from './BulkUploadPopup'
import { TbFileUpload } from 'react-icons/tb'

const BulkUploadButton = ({ title,id, setFetchCandidateResume }: any) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Box>
      <BulkUploadPopup title={title} id={id} setFetchCandidateResume={setFetchCandidateResume} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      {/* @ts-ignore */}
      <Button
        size='sm'
        leftIcon={<TbFileUpload color={'#003D86'} size={16} />}
        _hover='#FFFFFF'
        _active='#FFFFFF'
        bg='#FFFFFF'
        color='#003D86'
        border='1px solid #003D86'
        onClick={() => setIsOpen(true)}
        fontSize={'12px'}
        fontWeight={500}
        px='20px'
      >
        {false ? 'Bulk upload resume for this job listing' : "Upload more resumes"}
      </Button>
    </Box>
  )
}

export default BulkUploadButton