import { useDropzone, Accept, FileRejection, DropEvent } from "react-dropzone";
import { useCallback, useRef, CSSProperties } from "react";
import toast from "react-hot-toast";
import { Box } from "@chakra-ui/react";
import { TbFileUpload } from "react-icons/tb";

const containerStyle: CSSProperties = {
  borderRadius: '8px',
  padding: "100px 150px",
  width: "500px",
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
  value: File | null | undefined;
  onChange: (file: File) => void;
  errorMessage?: string;

}

const DragDropFile = ({
  value,
  onChange,
  errorMessage
}: DragDropFileProps) => {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const onDrop = useCallback(
    (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => {
      if (acceptedFiles.length !== 0) {
        onChange(acceptedFiles[0]);
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
      <div

        {...getRootProps()}
        style={{
          ...containerStyle,
          border: `1.5px dashed ${errorMessage ? "#d74848" : value ? "#6DAA39" : "#0D111B"}`,
        }}
      >
        {isDragActive && <p>Drop File Here</p>}
        <input
          {...getInputProps()}
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
        />
        {!isDragActive && !value && (
          <>
            <Box>
              <TbFileUpload color="#F3F3F3" size={25} />
            </Box>
            <p
              style={{
                fontFamily: "Inter-regular",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "24px",
                textDecoration: "underline",
                color: "#F3F3F3",
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
              <span style={{ ...orTextStyle, color: "#F3F3F3", }}>Or</span>  Browse
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
        {
          !isDragActive && value && (
            <>
              <Box>
                <TbFileUpload color="#F3F3F3" size={25} />
              </Box>
              <p
                style={{
                  fontFamily: "Inter-regular",
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "24px",
                  textDecoration: "underline",
                  color: "#F3F3F3",
                }}
              >
                Drag & Drop
              </p>
              <Box
                onClick={handleButtonClick}
                style={{
                  color: "#6DAA39",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer"
                }}>
                <span style={{ ...orTextStyle, color: "#F3F3F3", }}>Or</span>  Change
              </Box>
              <Box
                sx={{
                  color: "#F3F3F3",
                  fontSize: "12px",
                  opacity: 0.6
                }}
              >
                {value && value?.name}
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
          )
        }
      </div>
    </>
  );
};

export default DragDropFile;
