import React, { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import * as XLSX from "xlsx";
import stox from "../../utils/stox";
import xtos from "../../utils/xtos";
import sheetToPdf from "../../utils/sheetToPdf";
//import axios from "axios";
import empty from "is-empty";
//import { apiUrl } from "../../config/config.json";
import { toast } from "react-toastify";
import { getTicket, saveExcelTicket } from "../../services/tickets";
import { useBeforeunload } from "react-beforeunload";
import http from "../../services/httpService";
import SpreadsheetEditor from "./SpreadsheetEditor";
import SpreadsheetReader from "./SpreadsheetReader";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupText,
  UncontrolledDropdown,
} from "reactstrap";

const apiUrl = process.env.REACT_APP_API_URL;

const SpreadSheet = ({
  readOnly,
  setReadOnly,
  id,
  ticketNo,
  sheetState,
  setSheetState,
  isExporting,
  setIsExporting,
  exportFileType,
  setExportFileType,
  isSavingSheet,
  setIsSavingSheet,
  handleSaveSheet,
  savedAttachments,
}) => {
  // console.log("sheet state", sheetState);
  // const [sheetState, setSheetState] = useState({});
  const [ticket, setTicket] = useState({});
  const sheetRef = React.useRef(null);
  const [rand, setRand] = useState("");
  const [editFileInfo, setEditFileInfo] = useState({
    path: null,
    name: ticketNo,
    type: ".xls",
  });
  const onFileChangeHandler = (excelFile, fileName = null) => {
    setSheetState(null);
    let name = excelFile.name ?? fileName;
    setEditFileInfo((prev) => ({
      ...prev,
      name: nameTrimmer(name).name,
      type: nameTrimmer(name).type,
    }));
    if (excelFile) {
      if (!name.match(/\.(xlsx|xls|csv|xlsm)$/)) {
        alert("Please Upload Excel File");
      } else {
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
          setSheetState(stox(exceldata));
          if (readOnly) {
            setReadOnly();
          }
        });
      }
    }
  };

  function handleExportSheet(sheet, fileName = ticketNo, fileType = "xls") {
    // For Xlsx, Xlx and Csv export
    if (["xlsx", "xls", "csv"].includes(fileType)) {
      if (isSheetEmpty(sheet)) {
        toast.warning("Edit the sheet first, then save");
        return;
      }
      let new_wb = xtos(sheet.getData());
      try {
        XLSX.writeFile(
          new_wb,
          `${fileName ? fileName : "export-spreadsheet"}.${fileType}`
        );
      } catch (e) {
        toast.error("An Error Occoured");
        console.log(e);
      }
    }
    // For PDF export
    else if ((fileType = "pdf")) {
      toast.info("Pdf export isn't supported yet");
      // sheet to pdf isn't completed and needs fixation,
      // changing to some other library might help
      // sheetToPdf(sheet, fileName)
    }
  }

  function isSheetEmpty(sheet) {
    return !sheet
      .getData()
      .some((sheet) => Object.keys(sheet.rows).length !== 1);
  }

  async function handleLoadSheet(filePath, fileName) {
    // filePath format = attachments/undefined-62346235644.filetype
    setEditFileInfo((prev) => ({
      ...prev,
      path: filePath,
    }));
    try {
      const res = await http.get(apiUrl + "/" + filePath, {
        responseType: "arraybuffer",
      });
      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      onFileChangeHandler(blob, fileName);
    } catch (error) {
      console.log("error:", error);
    }
  }

  function nameTrimmer(filename) {
    const indexOfDot = filename.lastIndexOf(".");
    const name = filename.slice(0, indexOfDot);
    const type = filename.slice(indexOfDot, filename.length);
    return { name, type };
  }

  function resetState() {
    setSheetState([]);
    setEditFileInfo({
      path: null,
      name: ticketNo,
      type: ".xls",
    });
    setReadOnly();
  }
  // useEffect for file export
  useEffect(() => {
    if (!isExporting) return;
    handleExportSheet(sheetRef.current, ticketNo, exportFileType);
    setIsExporting(false);
    setExportFileType("");
  }, [isExporting]);

  // useEffect for Sheet Save
  useEffect(() => {
    if (!isSavingSheet) return;
    handleSaveSheet(
      sheetRef.current.getData(),
      editFileInfo.path,
      editFileInfo.name + editFileInfo.type
    );
  }, [isSavingSheet]);

  // Saving sheetBeingEditted to local storage to get it after refresh
  useBeforeunload(() => {
    localStorage.setItem("sheetBeingEditted", JSON.stringify(sheetState));
    localStorage.setItem("sheetBeingEdittedInfo", JSON.stringify(editFileInfo));
  });

  useEffect(() => {
    getTicket(id).then((res) => setTicket(res.data));
    // getting the sheet from storage after refresh
    const sheet = JSON.parse(localStorage.getItem("sheetBeingEditted"));
    const sheetInfo = JSON.parse(localStorage.getItem("sheetBeingEdittedInfo"));
    if (!empty(sheet)) {
      setSheetState(sheet);
      setEditFileInfo(sheetInfo);
      // setting readOnly to false
      setReadOnly();
    }
    localStorage.removeItem("sheetBeingEditted");
  }, []);
  // const sheetRef = React.useRef(null);
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className="my-3" style={{ width: "auto" }}>
        <div className="custom-file d-flex flex-wrap" style={{ gap: "20px" }}>
          <label
            className="custom-file-label"
            htmlFor="customFile"
            style={{ maxWidth: "300px" }}
          >
            Choose a spreadsheet file from computer
          </label>
          <input
            type="file"
            name="customFile"
            className="custom-file-input"
            onChange={(e) => {
              onFileChangeHandler(e.target.files[0]);
            }}
            style={{ maxWidth: "300px" }}
          />
          <UncontrolledDropdown group>
            <DropdownToggle>
              <span>Select from saved Attachments</span>
            </DropdownToggle>
            <DropdownMenu>
              {savedAttachments?.map((item, i) => {
                return (
                  <DropdownItem key={i}>
                    <span
                      onClick={() => {
                        handleLoadSheet(item.filePath, item.fileName);
                      }}
                    >
                      {item.fileName}
                    </span>
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        {!readOnly && (
          <div className="d-flex flex-wrap my-3" style={{ gap: "20px" }}>
            <InputGroup style={{ maxWidth: "300px" }}>
              <InputGroupText
                style={{
                  borderTopRightRadius: "0px",
                  borderBottomRightRadius: "0px",
                }}
              >
                Filename
              </InputGroupText>
              <UncontrolledDropdown group style={{ borderRadius: "none" }}>
                <DropdownToggle caret style={{ borderRadius: "none" }} />
                <DropdownMenu>
                  <DropdownItem>
                    <span
                      onClick={() => {
                        setEditFileInfo((prev) => ({
                          ...prev,
                          name: ticketNo,
                        }));
                      }}
                    >
                      Set TicketNo as Name
                    </span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <Input
                value={editFileInfo.name}
                onChange={(e) =>
                  setEditFileInfo((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
              <InputGroupText
                style={{
                  borderTopLeftRadius: "0px",
                  borderBottomLeftRadius: "0px",
                }}
              >
                {editFileInfo.type}
              </InputGroupText>
            </InputGroup>
            <button
              className="btn btn-secondary"
              onClick={() => setIsSavingSheet(true)}
            >
              save
            </button>
            <button className="btn btn-secondary" onClick={() => resetState()}>
              Clear Sheet
            </button>
          </div>
        )}
      </div>
      <>
        {readOnly ? (
          <SpreadsheetReader
            sheetRef={sheetRef}
            sheetState={sheetState}
            setSheetState={(ss) => setSheetState(ss)}
          />
        ) : (
          <SpreadsheetEditor
            sheetRef={sheetRef}
            sheetState={sheetState}
            setSheetState={(ss) => setSheetState(ss)}
          />
        )}
      </>
    </div>
  );
};

export default SpreadSheet;
