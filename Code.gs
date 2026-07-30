/**
 * SUNSHINE YARDS — Lead capture backend
 * -------------------------------------
 * Logs every inquiry to a Google Sheet named "Leads".
 *
 * How the two-step tracking works:
 *  - Step 1 (email entered)  -> row created with status "Address fall off"
 *  - Step 2 (address added)  -> that SAME row is updated to "Needs estimate"
 *
 * So your sheet is always a clean list: one row per person, labeled
 * exactly "Needs estimate" or "Address fall off".
 *
 * Optional: set NOTIFY_EMAIL to get an email whenever a full
 * "Needs estimate" lead comes in. Leave blank to disable.
 */

const NOTIFY_EMAIL = "";   // e.g. "you@gmail.com" — or leave "" for no alerts
const SHEET_NAME = "Leads";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000); // avoid race between step 1 and step 2 writes

  try {
    const sheet = getSheet_();
    const email = String(e.parameter.email || "").trim().toLowerCase();
    const address = String(e.parameter.address || "").trim();
    const status = String(e.parameter.status || "").trim();
    if (!email) return ok_();

    const now = new Date();
    const data = sheet.getDataRange().getValues(); // includes header row

    // Look for an existing row with this email (most recent first)
    let rowIndex = -1;
    for (let i = data.length - 1; i >= 1; i--) {
      if (String(data[i][1]).toLowerCase() === email) { rowIndex = i + 1; break; }
    }

    if (status === "Needs estimate" && rowIndex > 0) {
      // Upgrade the fall-off row instead of duplicating
      sheet.getRange(rowIndex, 3).setValue(address);           // Address
      sheet.getRange(rowIndex, 4).setValue("Needs estimate");  // Status
      sheet.getRange(rowIndex, 5).setValue(now);               // Updated
    } else if (rowIndex > 0 && status === "Address fall off") {
      // Repeat visitor re-entering their email — just bump the timestamp
      sheet.getRange(rowIndex, 5).setValue(now);
    } else {
      sheet.appendRow([now, email, address, status, now]);
    }

    if (status === "Needs estimate" && NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        "🌞 New estimate request — " + address,
        "New Sunshine Yards lead:\n\nEmail: " + email +
        "\nAddress: " + address +
        "\n\nMeasure it on Google Earth and reply within 24 hours."
      );
    }

    return ok_();
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Created", "Email", "Address", "Status", "Updated"]);
    sheet.getRange("A1:E1").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function ok_() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
