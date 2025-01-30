import React, { useEffect, useRef } from "react";
import Spreadsheet from "x-data-spreadsheet";
import "x-data-spreadsheet/dist/xspreadsheet.css";
import empty from "is-empty";
export default function SpreadsheetEditor({
  sheetState,
  setSheetState,
  sheetRef,
}) {
  const block = useRef(null);
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
      .loadData(sheetState)
      .change((data) => {
        let newSheets = sheetState;
        if (!empty(sheetState)) {
          let idx = sheetState.findIndex((sheet) => sheet.name === data.name);
          newSheets[idx] = data;
          setSheetState(newSheets);
        } else {
          setSheetState([data]);
        }
      });
    sheetRef.current = sheet;
    let bc = block.current;

    return () => {
      bc.innerHTML = "";
    };
    // eslint-disable-next-line
  }, []);

  return <div ref={block} className="my-2"></div>;
}
