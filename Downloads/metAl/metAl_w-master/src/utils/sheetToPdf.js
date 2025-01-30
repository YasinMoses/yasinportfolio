import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function sheetToPdf(spreadsheet, fileName) {
  spreadsheet = spreadsheet.getData();
  const doc = new jsPDF();
  spreadsheet.forEach(function (sheet) {
    var aoa = [[]];
    var rowobj = sheet.rows;
    for (var ri = 0; ri < rowobj.len; ++ri) {
      var row = rowobj[ri];
      if (!row) continue;
      aoa[ri] = [];
      Object.keys(row.cells).forEach(function (k) {
        var idx = +k;
        if (isNaN(idx)) return;
        aoa[ri][idx] = row.cells[k].text;
      });
    }
    const Head = aoa[0];
    aoa.shift();
    autoTable(doc, {
      headStyles: {
        cellWidth: "wrap",
        overflow:"linebreak"
      },
      bodyStyles: {
        cellWidth: "wrap",
        overflow:"linebreak"
      },
      head: [[...Head]],
      body: [...aoa],
      theme: "plain",
    });
  });
  doc.save(`${fileName}.pdf`);
}

export default sheetToPdf;
