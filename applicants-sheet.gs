/**
 * Basketball Biomechanics — Applicants capture
 * Google Apps Script bound to the "BB Applicants" Google Sheet.
 *
 * Receives application data from /api/apply and appends one row per applicant.
 * The sheet is your durable record AND your email list (export anytime).
 *
 * SETUP: see APPLICANTS_SETUP.md in this folder.
 */

// Must match GOOGLE_SHEET_SECRET in the site's environment variables.
const SHARED_SECRET = 'REPLACE_WITH_A_LONG_RANDOM_STRING';

// Tab name to write into. Leave as-is unless you rename the tab.
const SHEET_NAME = 'Applicants';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Reject anything without the shared secret.
    if (!SHARED_SECRET || data.secret !== SHARED_SECRET) {
      return json({ ok: false, error: 'unauthorized' });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

    // Write a header row once.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Name', 'Email', 'Phone', 'Role', 'Level',
        'Player (on behalf)', 'Improving', 'Level of play / scope', 'IP',
      ]);
    }

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.role || '',
      data.level || '',
      data.playerName || '',
      data.improve || '',
      data.scope || '',
      data.ip || '',
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
