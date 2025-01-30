import React, { useEffect, useRef } from "react";
import Spreadsheet from "x-data-spreadsheet";
import "x-data-spreadsheet/dist/xspreadsheet.css";
import * as XLSX from "xlsx";
export default function SpreadSheetFetch({
  sheetState,
  setSheetState,
  sheetRef,
}) {
  const block = useRef(null);
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
  let excelFile = JSON.parse(localStorage.getItem("excel"));
  useEffect(() => {
    setSheetState(null);

    console.log("excelFile", excelFile);
    const data = new Promise(function (resolve, reject) {
      var reader = new FileReader();
      var rABS = !!reader.readAsBinaryString;
      reader.onload = function (e) {
        var bstr = e.target.result;
        var wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
        resolve(wb);
      };
      if (rABS) reader.readAsBinaryString(excelFile);
      else reader.readAsArrayBuffer(excelFile);
    });
    data.then((exceldata) => {
      console.log("exceldata", exceldata);
      setSheetState(stox(exceldata));
    });
  }, []);
  useEffect(() => {
    const sheet = new Spreadsheet(block?.current, {
      view: {
        height: () => document.documentElement.clientHeight,
        width: () => document.documentElement.clientWidth,
      },
      mode: "edit",
      showToolbar: true,
      showGrid: true,
      showContextmenu: true,
    })
      .loadData(excelFile)
      .change((data) => {
        let newSheets = sheetState;
        let idx = sheetState.findIndex((sheet) => sheet.name === data.name);
        newSheets[idx] = data;
        setSheetState(newSheets);
        // console.log(data);
      });
    sheetRef.current = sheet;
    let bc = block.current;

    return () => {
      bc.innerHTML = "";
    };
    // eslint-disable-next-line
  }, [excelFile]);

  return <div ref={block} className="my-2"></div>;
}
