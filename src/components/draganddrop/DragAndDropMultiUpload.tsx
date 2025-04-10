import { useDropzone, Accept, FileRejection, DropEvent } from "react-dropzone";
import { useCallback, useRef, CSSProperties, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Box, Checkbox } from "@chakra-ui/react";
import { TbFileUpload } from "react-icons/tb";
import { GoPlus } from "react-icons/go";

const containerStyle: CSSProperties = {
  borderRadius: '8px',
  padding: "100px 150px",
  minHeight: "186px",
  margin: "auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: "10px",
  backgroundColor: '#0D111B'
}

const orTextStyle: CSSProperties = {
  color: "rgba(51, 63, 81, 0.70)",
  fontFamily: 'Inter-regular',
  fontSize: '14px',
  fontWeight: 600,
  lineHeight: '24px',
};


interface DragDropFileProps {
  value: File[];
  onChange: (file: File[]) => void;
  errorMessage?: string;
  isMulti?: boolean;
  bgColor?: string,
  color?: string,
  // handleDelete: () => void,
  isDelete: boolean,
  handleIsDelete: (arg: boolean) => void,
  handleResumes: (arg: File[]) => void
}

const DragAndDropMultiUpload = ({
  value,
  onChange,
  errorMessage,
  bgColor = '',
  color = '#F3F3F3',
  // handleDelete,
  isDelete,
  handleIsDelete,
  handleResumes
}: DragDropFileProps) => {
  const [deletedIndexes, setDeletedIndexes] = useState<number[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeletedIndex = (index: number) => {
    const newArr = [...deletedIndexes]
    if (newArr.includes(index)) {
      newArr.splice(index, 1)
    } else {
      newArr.push(index)
    }
    setDeletedIndexes(newArr)
  }

  const handleSelectAll = () => {
    const length = value?.length;
    console.log(length)
    const array = Array.from({ length: length }, (_, index) => index);
    console.log(array)
    setDeletedIndexes(array);
  }

  const handleCancel = () => {
    setDeletedIndexes([])
    handleIsDelete(false);
  }

  const handleDelete = async () => {
    const newFiles = [...value];
    const newDeletedIndexes = [...deletedIndexes];

    const data = newFiles.filter((item, i) => {
      if (deletedIndexes.includes(i)) {
        newDeletedIndexes.splice(newDeletedIndexes.indexOf(i), 1);
        return false;
      }
      return true;
    });

    setDeletedIndexes(newDeletedIndexes);
    handleResumes(data);
  }


  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => {
      if (acceptedFiles.length !== 0) {

        onChange(acceptedFiles);

        if (fileInputRef.current) fileInputRef.current.value = ''
      }
      if (fileRejections.length !== 0) {
        toast.error("Please select a PDF");
      }
    },
    [onChange]
  );

  // Define the accept type
  const acceptTypes: Accept = {
    accept: ["application/pdf"],
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop,
    accept: acceptTypes,
    noClick: true,
  });

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <input
        id='input-field'
        {...getInputProps()}
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        style={{ display: "none" }}
        multiple
      />
      {value?.length === 0 && <div

        {...getRootProps()}
        style={{
          ...containerStyle,
          backgroundColor: bgColor,
          border: `1px solid ${errorMessage ? "#d74848" : "#E0E2E7"}`,
        }}
      >
        {isDragActive && <p>Drop File Here</p>}

        {!isDragActive && value?.length === 0 && (
          <>
            <Box>
              <TbFileUpload color={color} size={25} />
            </Box>
            <p
              style={{
                fontFamily: "Inter-regular",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "24px",
                textDecoration: "underline",
                color: color,
              }}
            >
              Drag & Drop
            </p>
            <Box
              onClick={handleButtonClick}
              style={{
                color: "#175DA9",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer"
              }}>
              <span style={{ ...orTextStyle, color: color, }}>Or</span>  Browse
            </Box>

            {errorMessage && <div
              style={{
                color: '#EE574D',
                fontFamily: "Inter-regular",
                fontSize: '12px',
                fontStyle: 'italic',
                fontWeight: 400,
                lineHeight: 'normal',
                textAlign: 'left'
              }}
            >
              {errorMessage}</div>
            }
          </>
        )}
      </div>}

      {
        !isDragActive && value.length > 0 && (
          <Box
            p='16px'
            borderRadius={'6px'}
            border={`1px solid ${errorMessage ? "#d74848" : "#E0E2E7"}`}
          >
            <Box
              sx={{
                display: 'flex',
                fontSize: "12px",
                fontWeight: 600,
                color: '#1D1F2C',
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px"
              }}
            >
              <Box>File Count: {value?.length} items</Box>
              {isDelete ? <Box
                sx={{ display: 'flex', gap: "20px", alignItems: "center", justifyContent: "center" }}
              >
                <Box
                  fontWeight={500}
                  color='#E25247'
                  cursor='pointer'
                  onClick={handleDelete}
                >
                  Delete
                </Box>
                <Box
                  fontWeight={500}
                  color='#1680FF'
                  cursor='pointer'
                  onClick={handleCancel}
                >
                  Cancel
                </Box>
                <Box
                  fontWeight={500}
                  color='#1680FF'
                  cursor='pointer'
                  onClick={handleSelectAll}
                >
                  Select All
                </Box>

              </Box> : <Box
                fontWeight={500}
                color='#1680FF'
                cursor='pointer'
                onClick={() => handleIsDelete(true)}
              >
                Delete
              </Box>}
            </Box>
            <Box
              mb='12px'
              maxHeight={'150px'}
              overflow={'auto'}
            >
              {value?.map((item, i) => {
                return <Box
                  key={item?.name}
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  borderBottom='1px solid #E0E2E7'
                  paddingRight={'5px'}
                >
                  <Box
                    display='flex'
                    justifyContent={'left'}
                    alignItems={'center'}
                    color='#858D9D'
                    fontSize={'12px'}
                    gap='8px'
                    p='8px'

                  >
                    <TbFileUpload color={'#1680FF'} size={16} />
                    {item?.name}
                  </Box>
                  {isDelete &&
                    <Box
                      mt='10px'
                    >
                      {/* @ts-ignore */}
                      <Checkbox isChecked={deletedIndexes.includes(i)} onChange={() => handleDeletedIndex(i)} />
                    </Box>}
                </Box>
              })}
            </Box>
            <Box
              display='flex'
              justifyContent={'flex-end'}
              alignItems='center'
              fontSize='10px'
              fontWeight={600}
              cursor='pointer'
              gap='5px'
              onClick={handleButtonClick}
            >
              <GoPlus size={18} />
              Add More
            </Box>
          </Box>
        )
      }

    </>
  );
};

export default DragAndDropMultiUpload;
