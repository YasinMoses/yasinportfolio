//download functions for x-data-spread-sheet and more
import XLSX from "xlsx"
function xtos(sdata) {
    var out = XLSX.utils.book_new();
    sdata.forEach(function (xws) {
        var aoa = [[]];
        var rowobj = xws.rows;
        for (var ri = 0; ri < rowobj.len; ++ri) {
            var row = rowobj[ri];
            if (!row) continue;
            aoa[ri] = [];
            /* eslint-disable no-loop-func */
            Object.keys(row.cells).forEach(function (k) {
                var idx = +k;
                if (isNaN(idx)) return;
                aoa[ri][idx] = row.cells[k].text;
            });
        }
        var ws = XLSX.utils.aoa_to_sheet(aoa);
        XLSX.utils.book_append_sheet(out, ws, xws.name);
    });
    return out;
}

//provide it with the SpreadSheet
export function downloadXLX(s) {
    var new_wb = xtos(s.getData());
    var ab = XLSX.write(new_wb, { bookType: "xlsx", type: "array" });
    var blob = new Blob([ab]);
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.download = "SheetJS.xlsx";
    a.href = url;
    document.body.appendChild(a);
    a.click();
}
