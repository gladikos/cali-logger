// ============================================
// 📊 GOOGLE APPS SCRIPT - WEBHOOK HANDLER
// ============================================
// This script receives workout data from your React app
// and writes it to the appropriate Google Sheet

// ⚙️ CONFIGURATION
// Replace with your actual Google Sheet ID
// (Found in the URL: docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit)
const SPREADSHEET_ID = '1Rcs5Aoq1kNb8dblQyhxQ86rjlkpG_jluzMO0eKFZ7yQ';

/**
 * Handle POST requests from the React app
 */
function doPost(e) {
  try {
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Log for debugging
    Logger.log('Received workout data:', data);
    
    // Write data to Google Sheet
    writeWorkoutToSheet(data);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Workout logged successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error processing workout:', error);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet() {
  return ContentService.createTextOutput('CaliLogger API is running!');
}

/**
 * Write workout data to the appropriate sheet
 * NEW FORMAT: One row per set
 * Columns: Date | Exercise | Set | Expected Reps | Actual Reps | Notes
 */
function writeWorkoutToSheet(data) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Get or create the appropriate weekly sheet
  let sheet = spreadsheet.getSheetByName(data.weekSheet);
  
  if (!sheet) {
    // Create the sheet if it doesn't exist
    sheet = spreadsheet.insertSheet(data.weekSheet);
    
    // Add headers - NEW FORMAT
    sheet.getRange(1, 1, 1, 6).setValues([[
      'Date', 'Exercise', 'Set', 'Expected Reps', 'Actual Reps', 'Notes'
    ]]);
    
    // Style the header row
    sheet.getRange(1, 1, 1, 6)
      .setBackground('#0ba5ec')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
  }
  
  // Get the next empty row
  let lastRow = sheet.getLastRow();
  let currentRow = lastRow + 1;
  
  // Write each SET as a separate row (not each exercise)
  data.sets.forEach((set, index) => {
    sheet.getRange(currentRow, 1, 1, 6).setValues([[
      data.date,
      set.exercise,
      set.setNumber,
      set.expectedReps,
      set.actualReps || '',
      index === 0 ? data.notes : '' // Only show notes on first row
    ]]);
    
    currentRow++;
  });
  
  // Add a separator row
  sheet.getRange(currentRow, 1, 1, 6)
    .setBackground('#f3f4f6')
    .setBorder(false, false, true, false, false, false, '#000000', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, 6);
}

/**
 * Test function - run this to test your setup
 * NEW FORMAT: Sets array with one row per set
 */
function testWorkoutSubmission() {
  const testData = {
    date: '2026-04-23',
    weekSheet: 'Week 1',
    notes: 'Test workout',
    sets: [
      {
        exercise: 'Push-ups',
        setNumber: 1,
        expectedReps: 10,
        actualReps: 12
      },
      {
        exercise: 'Push-ups',
        setNumber: 2,
        expectedReps: 10,
        actualReps: 11
      },
      {
        exercise: 'Squats',
        setNumber: 1,
        expectedReps: 15,
        actualReps: 18
      },
      {
        exercise: 'Squats',
        setNumber: 2,
        expectedReps: 15,
        actualReps: 17
      }
    ]
  };
  
  writeWorkoutToSheet(testData);
  Logger.log('Test workout written successfully!');
}

/**
 * Setup function - creates initial weekly sheets
 * Run this once to set up your spreadsheet
 * NEW FORMAT: Date | Exercise | Set | Expected Reps | Actual Reps | Notes
 */
function setupWeeklySheets() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const numberOfWeeks = 8; // Create sheets for 8 weeks
  
  for (let i = 1; i <= numberOfWeeks; i++) {
    const sheetName = `Week ${i}`;
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      
      // Add headers - NEW FORMAT
      sheet.getRange(1, 1, 1, 6).setValues([[
        'Date', 'Exercise', 'Set', 'Expected Reps', 'Actual Reps', 'Notes'
      ]]);
      
      // Style the header row
      sheet.getRange(1, 1, 1, 6)
        .setBackground('#0ba5ec')
        .setFontColor('#ffffff')
        .setFontWeight('bold')
        .setHorizontalAlignment('center');
      
      // Set column widths
      sheet.setColumnWidth(1, 100);  // Date
      sheet.setColumnWidth(2, 150);  // Exercise
      sheet.setColumnWidth(3, 60);   // Set
      sheet.setColumnWidth(4, 120);  // Expected Reps
      sheet.setColumnWidth(5, 120);  // Actual Reps
      sheet.setColumnWidth(6, 200);  // Notes
    }
  }
  
  Logger.log(`Created ${numberOfWeeks} weekly sheets`);
}
