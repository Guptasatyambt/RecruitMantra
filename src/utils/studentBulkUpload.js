import * as XLSX from 'xlsx';
import Papa from 'papaparse';

/**
 * Parse CSV or Excel file and convert to JSON format for bulk student upload
 * @param {File} file - The uploaded CSV or Excel file
 * @returns {Promise<{data: Array, errors: Array}>} - Parsed data and any validation errors
 */
export const parseStudentBulkUpload = (file) => {
  return new Promise((resolve, reject) => {
    try {
      // Check file extension to determine parsing method
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (['csv'].includes(fileExtension)) {
        // Parse CSV file
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log(results.data)
            const { parsedData, validationErrors } = validateAndFormatStudentData(results.data);
            resolve({
              data: parsedData,
              errors: validationErrors
            });
          },
          error: (error) => {
            reject({
              message: 'Failed to parse CSV file',
              error
            });
          }
        });
      } else if (['xlsx', 'xls'].includes(fileExtension)) {
        // Parse Excel file
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            const { parsedData, validationErrors } = validateAndFormatStudentData(jsonData);
            resolve({
              data: parsedData,
              errors: validationErrors
            });
          } catch (error) {
            reject({
              message: 'Failed to parse Excel file',
              error
            });
          }
        };
        reader.onerror = (error) => {
          reject({
            message: 'Failed to read file',
            error
          });
        };
        reader.readAsArrayBuffer(file);
      } else {
        reject({
          message: 'Unsupported file format. Please upload a CSV or Excel file.'
        });
      }
    } catch (error) {
      reject({
        message: 'An error occurred while processing the file',
        error
      });
    }
  });
};

/**
 * Validate and format student data from parsed file
 * @param {Array} data - Raw parsed data from file
 * @returns {Object} - Validated data and any validation errors
 */
const validateAndFormatStudentData = (data) => {
  const parsedData = [];
  const validationErrors = [];
  console.log(data) 
  // Process each row
  data.forEach((row, index) => {
    // Normalize field names (handle different case variations)
    const normalizedRow = {};
    Object.keys(row).forEach(key => {
      const lowerKey = key.toLowerCase().trim();
      normalizedRow[lowerKey] = row[key];
      console.log(normalizedRow)
    });
    
    // Extract fields with various possible column names
    const firstName = normalizedRow.firstname || normalizedRow.FirstName || normalizedRow['first name'] ||normalizedRow['First Name']|| normalizedRow['student first name'] || '';
    const lastName = normalizedRow.lastname || normalizedRow.lastName || normalizedRow['last name']||normalizedRow['Last Name'] || normalizedRow['student last name'] || '';
    const email = normalizedRow.email||normalizedRow.Email || normalizedRow['email address'] || normalizedRow['student email'] || '';
    const branch = normalizedRow.branch||normalizedRow.Branch || normalizedRow.department || normalizedRow.stream || '';
    const year = normalizedRow.year||normalizedRow.Year || normalizedRow['year of study'] || '';
    const cgpa = normalizedRow.cgpa||normalizedRow.CGPA || normalizedRow.gpa || normalizedRow['grade point'] || '';
    const rollNo = normalizedRow.rollNo ||normalizedRow.rollno|| normalizedRow.RollNo || normalizedRow['Roll No'] || normalizedRow['student roll no'] || '';
    console.log(firstName,lastName,rollNo,email,branch,year,cgpa)
    // Validate required fields
    const rowErrors = [];
    if (!firstName) rowErrors.push('First Name is required');
    if (!lastName) rowErrors.push('Last Name is required');
    if (!rollNo) rowErrors.push('Roll No is required');
    if (!email) rowErrors.push('Email is required');
    if (!branch) rowErrors.push('Branch is required');
    if (!year) rowErrors.push('Year is required');
    if (!cgpa) rowErrors.push('CGPA is required');
    
    // Basic email validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      rowErrors.push('Invalid email format');
    }
    
    // If validation errors exist, add to error list
    if (rowErrors.length > 0) {
      validationErrors.push({
        row: index + 2, // +2 because index is 0-based and we need to account for header row
        email: email || `Row ${index + 2}`,
        errors: rowErrors
      });
    } else {
      // Add valid student data
      parsedData.push({
        firstName,
        lastName,
        rollNo,
        email,
        branch,
        year: String(year), // Ensure year is a string
        cgpa
      });
    }
  });
  console.log(parsedData)
  return { parsedData, validationErrors };
};

/**
 * Format validation errors for display
 * @param {Array} errors - Validation errors from parsing
 * @returns {String} - Formatted error message
 */
export const formatValidationErrors = (errors) => {
  if (!errors || errors.length === 0) return '';
  
  return errors.map(error => {
    return `Row ${error.row} (${error.email}): ${error.errors.join(', ')}`;
  }).join('\n');
};