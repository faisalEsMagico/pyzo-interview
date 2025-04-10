



export const formatDate = (dateTimeStr) => {
  if(!dateTimeStr)
    {
      return '--'
    }
  const date = new Date(dateTimeStr);
  // Options for date formatting
  const dateOptions = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", dateOptions);
  return formattedDate;
};

export const formatTime = (dateTimeStr) => {
  if(!dateTimeStr)
  {
    return '--'
  }
    const date = new Date(dateTimeStr);
    // Options for date formatting
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);
    return formattedTime;
  };
