
/**
 * 
 * Instructions:
 * 1. Create a new Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this code into Code.gs.
 * 4. Click Deploy > New Deployment.
 * 5. Select type: Web app.
 * 6. Description: "Aura Auth Backend".
 * 7. Execute as: "Me" (your email).
 * 8. Who has access: "Anyone".
 * 9. Click Deploy.
 * 10. Copy the Web App URL and paste it into `src/services/sheetsService.js` in your React Native project.
 * 
 */

function doPost(e) {
    var lock = LockService.getScriptLock();
    lock.tryLock(10000);

    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
        var headers = sheet.getRange(1, 1, 1, 6).getValues()[0];
        var nextRow = sheet.getLastRow() + 1;

        // Check if headers exist, if not add them
        if (headers[0] !== "Name") {
            sheet.getRange(1, 1, 1, 6).setValues([["Name", "ID", "Email", "Password", "Date", "Token"]]);
            nextRow = 2;
        }

        var data = JSON.parse(e.postData.contents);

        var newRow = [
            data.name,
            data.id,
            data.email,
            data.password, // Warning: Storing passwords in plain text is insecure
            data.date,
            data.token
        ];

        sheet.getRange(nextRow, 1, 1, 6).setValues([newRow]);

        return ContentService
            .createTextOutput(JSON.stringify({ "result": "success", "row": nextRow }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (e) {
        return ContentService
            .createTextOutput(JSON.stringify({ "result": "error", "error": e }))
            .setMimeType(ContentService.MimeType.JSON);
    } finally {
        lock.releaseLock();
    }
}

function doGet(e) {
    return ContentService
        .createTextOutput(JSON.stringify({ "result": "success", "message": "GET request received. Use POST to submit data." }))
        .setMimeType(ContentService.MimeType.JSON);
}

// Setup function to initialize sheet headers manually if needed
function setup() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.getRange(1, 1, 1, 6).setValues([["Name", "ID", "Email", "Password", "Date", "Token"]]);
}
