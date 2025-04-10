// A generic function that converts any array of objects to CSV format
export const convertToCSV = <T>(data: T[]): string => {
    if (!data || data.length === 0) return '';
  
    // Get headers from the keys of the first object
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')]; // Join headers with commas
  
    // Convert each object to a CSV row
    data.forEach(item => {
      const row = headers.map(header => {
        const value = item[header as keyof T];
  
        // Convert the value to a string and escape quotes
        return `"${value !== undefined ? String(value).replace(/"/g, '""') : ''}"`;
      }).join(',');
  
      csvRows.push(row);
    });
  
    return csvRows.join('\n'); // Join rows with newlines
  };
  