import * as XLSX from "xlsx";

function stox(wb) {
  var out = [];
  wb.SheetNames.forEach(function (name) {
    var o = { name: name, rows: {} };
    var ws = wb.Sheets[name];
    var aoa = XLSX.utils.sheet_to_json(ws, { raw: false, header: 1 });
    aoa.forEach(function (r, i) {
      var cells = {};
      r.forEach(function (c, j) {
        cells[j] = { text: c };
      });
      o.rows[i] = { cells: cells };
    });
    out.push(o);
  });
  return out;
}

export default stox;
