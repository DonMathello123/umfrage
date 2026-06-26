/**
 * Google Apps Script Backend für die Abi-25-Web-App.
 *
 * Einrichtung:
 * 1. Google Drive öffnen.
 * 2. Neues Google Sheet erstellen, z. B. "Abi 25 Antworten".
 * 3. Erweiterungen > Apps Script.
 * 4. Diesen Code einfügen.
 * 5. Deploy > New deployment > Web app.
 * 6. Execute as: Me.
 * 7. Who has access: Anyone.
 * 8. Web-App-URL kopieren und in index.html bei WEB_APP_URL einfügen.
 */

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Antworten");
  if (!sheet) {
    sheet = ss.insertSheet("Antworten");
    var headers = ["Zeitpunkt", "Name freiwillig"];
    for (var i = 1; i <= 25; i++) {
      headers.push("F" + i + " Auswahl");
      headers.push("F" + i + " Freitext");
    }
    sheet.appendRow(headers);
  }

  var data = JSON.parse(e.postData.contents);
  var row = [new Date(), data.participantName || ""];

  for (var q = 1; q <= 25; q++) {
    var answer = data.answers[String(q)] || {};
    row.push(answer.choice || "");
    row.push(answer.comment || "");
  }

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
