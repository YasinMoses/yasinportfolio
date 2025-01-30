import React, { useState, useEffect, Fragment, createRef, useRef } from "react"
import { NavLink as ALink, useHistory } from "react-router-dom"
import Grid from "@material-ui/core/Grid"
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "./../../components/panel/panel.jsx"
import axios from "axios"
import { getCOAs } from "./../../services/coas"
import "bootstrap/dist/css/bootstrap.min.css"
//import FloatSubMenu from './../../components/float-sub-menu/float-sub-menu';
import Pagination from "../../common/pagination"
import { paginate } from "../../utils/paginate"
import COAsTable from "../../components/coasTable.jsx"
import SearchBox from "./../../common/searchBox"
import _ from "lodash"
import { Nav, NavItem, NavLink, Button, ButtonGroup, Alert } from "reactstrap"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"

import classnames from "classnames"
// import http from "./../../services/httpService";
// import { apiUrl } from "./../../config/config.json";
// import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

import COAsTree from "../../components/COAsTree.jsx"
import { retry } from "async"
import { withStyles } from "@material-ui/styles"
// import { el } from "date-fns/locale"
import { coavalues, categories } from "./coaExamples"

import { Link } from "react-router-dom"
import ReactToPrint, { PrintContextConsumer } from "react-to-print"
import jsPDF from "jspdf"
import "jspdf-autotable"
import XLSX from "xlsx"
import { format } from "date-fns"
// -> icons
import newIcon from "../../assets/Icons/new.svg"
import editIcon from "../../assets/Icons/edit.svg"
import trashIcon from "../../assets/Icons/trash.svg"
import csvIcon from "../../assets/Icons/csv.svg"
import pdfIcon from "../../assets/Icons/pdf.svg"
import printIcon from "../../assets/Icons/printer-xxl.svg"
import lockIcon from "../../assets/Icons/lock.svg"
import unlockIcon from "../../assets/Icons/unlock.svg"
import banIcon from "../../assets/Icons/ban.svg"
import unbanIcon from "../../assets/Icons/unban.svg"
import emailIcon from "../../assets/Icons/email.svg"
import messageIcon from "../../assets/Icons/message.svg"
import xlsIcon from "../../assets/Icons/xls.svg"
import importIcon from "../../assets/Icons/import.svg"
//import downloadIcon from "../../assets/Icons/download1.svg";
import copy2clipboardIcon from "../../assets/Icons/copy2clipboard.svg"
import exportIcon from "../../assets/Icons/export.svg"

const exportExcel = (data) => {
  let moddedUserData =
    data &&
    data.map((elt) => {
      return {
        name: elt.name,
        category: elt.category,
        code: elt.code,
        businessName: elt.businessName,
        balanceType: elt.balanceType,
        createdOn: format(new Date(elt.createdOn), "MM/dd/yyyy"),
        description: elt.description,
        status: elt.status,
        subCategory: elt.subCategory,
        normalContra: elt.normalContra,
        note: elt.note,
        userNo: elt.userNo,
      }
    })
  let coasWS = XLSX.utils.json_to_sheet(moddedUserData)

  // Create a new Workbook
  var wb = XLSX.utils.book_new()

  // Name your sheet
  XLSX.utils.book_append_sheet(wb, coasWS, "All COAS")

  // export your excel
  XLSX.writeFile(wb, "xlsx/result.xlsx")
}

const exportPdf = (d) => {
  const unit = "pt"
  const size = "A4" // Use A1, A2, A3 or A4
  const orientation = "landscape" // portrait or landscape
  const marginLeft = 40
  const doc = new jsPDF(orientation, unit, size)
  doc.setFontSize(8)
  const title = "All COAs"
  const headers = [
    [
      "Name",
      "category",
      "code",
      "businessName",
      "balanceType",
      "createdOn",
      "description",
      "status",
      "subCategory",
      "normalContra",
      "note",
      "userNo",
    ],
  ]

  const data =
    d &&
    d.map((elt) => [
      elt.name,
      elt.category,
      elt.code,
      elt.businessName,
      elt.balanceType,
      format(new Date(elt.createdOn), "MM/dd/yyyy"),
      elt.description,
      elt.status,
      elt.subCategory,
      elt.normalContra,
      elt.note,
      elt.userNo,
    ])
  let content = {
    startY: 50,
    head: headers,
    body: data,
    styles: {
      fontSize: 4,
      cellWidth: "wrap",
    },
    columnStyles: {
      1: { columnWidth: "auto" },
    },
  }
  doc.text(title, marginLeft, 40)
  doc.autoTable(content)
  doc.save("coas.pdf")
}

const handlePrint = (tableRef) => {
  // let w = window.open();
  // w.document.write(this.tableRef.current);
  // w.print();
  // w.close();
  // const nodeHtml = tableRef.current
  // console.log(nodeHtml)
}

const COATable = () => {
  const history = useHistory()
  const [coas, setCoas] = useState([])
  const [sortColumn, setSortColumn] = useState({ path: "title", order: "asc" })
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [pageSize, setpageSize] = useState(10)
  const [key, setKey] = useState("Assets")
  const [tableView, setTableView] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubCategory, setSelectedSubCategory] = useState("")
  const [categoryDropDownOpen, setCategoryDropDownOpen] = useState(false)
  const [subCategoryDropDownOpen, setSubCategoryDropDownOpen] = useState(false)

  const [exportDropdownOpen, setExportDropdownOpen] = useState(false)
  const [panelHeaderColor, setPanelHeaderColor] = useState("white")
  const [selectedCoa, setSelectedCoa] = useState("")

  const tableRef = useRef()
  const toggleCategoryDropdown = () => {
    setCategoryDropDownOpen((CDDO) => !CDDO)
  }
  const toggleSubCategoryDropdown = () => {
    setSubCategoryDropDownOpen((SCDDO) => !SCDDO)
  }

  const toggleExport = () => {
    setExportDropdownOpen(!exportDropdownOpen)
  }
  const fetchCoa = async () => {
    try {
      const { data: coashttp } = await getCOAs()
      if (coashttp) {
        setCoas(coashttp)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchCoa()
  }, [])

  useEffect(() => {
    setCoas(
      coas.filter((el) => el.category.toLowerCase() === key.toLowerCase())
    )
  }, [key])

  const handleChange = (value) => {
    // console.log(value);
    setKey(value)
  }

  const handleCheckboxClick = (id) => {
    setSelectedCoa(id)
    console.log(id)
  }
  const handleCoaEdit = (selectedCoa) => {
    if (selectedCoa) history.push(`/accounting/coas/edit/${selectedCoa}`)
  }
  const handleDelete = (id) => {
    // console.log(user);

    if (id) {
      const newCoas = coas.filter((el) => el._id !== id)
      setCoas(newCoas)
    }
  }
  //sorting columns
  const handleSort = (sortColumn) => {
    setSortColumn(setSortColumn)
  }
  const handlePageChange = (page) => {
    // console.log(page);
    setCurrentPage(page)
  }

  const handleSearch = (query) => {
    // console.log(query);
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const getDataPgnation = () => {
    //
    //filter maybe next time
    let filtered = coas
    if (searchQuery) {
      // console.log(searchQuery);
      filtered = coas.filter(
        (el) =>
          // console.log(el.name)
          el.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          (el.description &&
            el.description
              .toLowerCase()
              .startsWith(searchQuery.toLowerCase())) ||
          (el.sub_category &&
            el.sub_category
              .toLowerCase()
              .startsWith(searchQuery.toLowerCase())) ||
          el.code.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    }
    // console.log(filtered);
    //
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order])
    // console.log(sorted)
    const cs = paginate(sorted, currentPage, pageSize)
    // console.log(cs);
    return { data: tableView ? cs : sorted }
  }

  // const { length: count } = coas;
  // if (count === 0) return "<p>No data available</p>";

  const { data: coasByPagination } = getDataPgnation()
  useEffect(() => {
    console.log(selectedCategory, selectedSubCategory)
  }, [selectedCategory, selectedSubCategory])
  return (
    <div>
      {/* <ol className="breadcrumb float-xl-right">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        <li className="breadcrumb-item">
          <Link to="/">Tables</Link>
        </li>
        <li className="breadcrumb-item active">Data Tables</li>
      </ol> */}
      <h1 className="page-header">COAs </h1>
      <Panel>
        <PanelHeader color={panelHeaderColor}>COAs Management</PanelHeader>
        <div className="tab2">
          <div className="toolbar" style={toolbarStyles}>
            <button
              className="btn btn-default active m-r-5 m-b-5"
              title="Add COA"
              style={btnStyles}
            >
              <Link to="/accounting/coas/new">
                <img style={iconStyles} src={newIcon} />
              </Link>{" "}
            </button>

            <button
              className="btn btn-default active m-r-5 m-b-5"
              title="Edit COA"
              style={btnStyles}
            >
              <img
                style={iconStyles}
                src={editIcon}
                onClick={() => handleCoaEdit(selectedCoa)}
              />
            </button>
            <button
              className="btn btn-default active m-r-5 m-b-5"
              title="delete COA"
              style={btnStyles}
            >
              <img
                style={iconStyles}
                src={trashIcon}
                onClick={() => handleDelete(selectedCoa)}
              />
            </button>
            <button
              className="btn btn-default active m-r-5 m-b-5"
              title="save as CSV"
              style={btnStyles}
            >
              <img
                style={iconStyles}
                src={csvIcon}
                onClick={() => exportExcel(coas)}
              />
            </button>
            <button
              className="btn btn-default active m-r-5 m-b-5"
              title="Save as PDF"
              style={btnStyles}
            >
              <img
                style={iconStyles}
                src={pdfIcon}
                onClick={() => exportPdf(coas)}
              />
            </button>
            <ReactToPrint
              content={() => tableRef.current}
              trigger={() => (
                <button
                  className="btn btn-default active m-r-5 m-b-5"
                  title="print"
                  style={btnStyles}
                  onClick={handlePrint(tableRef)}
                >
                  <img style={iconStyles} src={printIcon} />
                </button>
              )}
            ></ReactToPrint>
            <button
              className="btn btn-default active m-r-5 m-b-5"
              title="copy to clipboad"
              style={btnStyles}
            >
              <Link to="/accounting/coas">
                <img style={iconStyles} src={copy2clipboardIcon} />
              </Link>{" "}
            </button>
            <Dropdown
              as="button"
              className="btn btn-default active m-r-5 m-b-5"
              isOpen={exportDropdownOpen}
              toggle={toggleExport}
              style={btnStyles}
            >
              <DropdownToggle
                caret
                title="export"
                style={{
                  padding: 0,
                  margin: 0,
                  border: 0,
                  background: "inherit",
                }}
              >
                <img style={iconStyles} src={exportIcon} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem value="xlsx" onClick={() => exportExcel(coas)}>
                  <img style={iconStyles} src={xlsIcon} /> Excel
                </DropdownItem>
                <DropdownItem value="csv" onClick={() => exportExcel(coas)}>
                  <img style={iconStyles} src={csvIcon} /> CSV
                </DropdownItem>
                <DropdownItem onClick={() => exportPdf(coas)}>
                  <img style={iconStyles} src={pdfIcon} />
                  PDF
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <button
              className="btn btn-default active m-r-5 m-b-5"
              title="import"
              style={btnStyles}
            >
              {" "}
              <Link to="/accounting/coas">
                <img style={iconStyles} src={importIcon} />
              </Link>{" "}
            </button>
          </div>
        </div>
        <PanelBody>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
          >
            {/* <Grid item>
              <ALink
                className="btn btn-primary"
                to="/accounting/coas/new"
                m={1}
              >
                Add COA
              </ALink>
            </Grid> */}
            <Grid item>
              <ButtonGroup color="primary" m={1}>
                <Button
                  onClick={() => setTableView(true)}
                  style={{ background: tableView && "blue" }}
                >
                  Table View
                </Button>
                <Button
                  onClick={() => setTableView(false)}
                  style={{ background: !tableView && "blue" }}
                >
                  Tree View
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item>
              <Dropdown
                isOpen={categoryDropDownOpen}
                toggle={toggleCategoryDropdown}
              >
                <DropdownToggle caret>Filter Category</DropdownToggle>
                <DropdownMenu>
                  {categories.map((c, id) => (
                    <DropdownItem
                      key={id}
                      onClick={(e) =>
                        setSelectedCategory(e.currentTarget.textContent)
                      }
                    >
                      {c.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </Grid>
            <Grid item>
              <Dropdown
                isOpen={subCategoryDropDownOpen}
                toggle={toggleSubCategoryDropdown}
              >
                <DropdownToggle caret>Filter Sub Category</DropdownToggle>
                <DropdownMenu>
                  {categories
                    .filter((c) =>
                      selectedCategory ? c.name === selectedCategory : true
                    )
                    .map((c, id) => (
                      <Fragment key={id}>
                        <DropdownItem header>{c.name}</DropdownItem>
                        {c.sub_category.map((sc, id) => (
                          <DropdownItem
                            key={id}
                            onClick={(e) =>
                              setSelectedSubCategory(
                                e.currentTarget.textContent
                              )
                            }
                          >
                            {sc}
                          </DropdownItem>
                        ))}
                      </Fragment>
                    ))}
                </DropdownMenu>
              </Dropdown>
            </Grid>
            <Grid item>
              <Button
                className="btn btn-warning"
                // to="/accounting/coas/new"
                onClick={() => {
                  setSelectedCategory("")
                  setSelectedSubCategory("")
                }}
                m={1}
              >
                Clear Filters
              </Button>
            </Grid>
            {/* <Grid item>
              <Button
                className="btn btn-danger"
                // to="/accounting/coas/new"
                m={1}
              >
                Delete
              </Button>
            </Grid> */}
          </Grid>
          <Nav tabs className="my-1">
            {coavalues.map((cv, id) => (
              <NavItem key={id}>
                <NavLink
                  style={{
                    background: `${cv.color}`,
                    borderTop: `${
                      key === cv.value ? `1px solid ${cv.color}` : "none"
                    }`,
                    borderLeft: `${
                      key === cv.value ? `1px solid ${cv.color}` : "none"
                    }`,
                    borderRight: `${
                      key === cv.value ? `1px solid ${cv.color}` : "none"
                    }`,
                    cursor: "pointer",
                  }}
                  value={cv.value}
                  className={classnames({ active: key === cv.value })}
                  onClick={() => {
                    handleChange(cv.value)
                    setPanelHeaderColor(cv.color)
                  }}
                >
                  {cv.label}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          {/* <Tabs
            value={key}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example"
          >
            {coavalues.map((cv, id) => (
              <Tab
                key={id}
                label={cv.label}
                value={cv.value}
                style={{ backgroundColor: `1px solid ${cv.color}` }}
              />
            ))}
          </Tabs> */}
          <div className="table-responsive">
            <p
              className="page-header float-xl-left"
              style={
                ({ marginBottom: 5 }, { marginLeft: 20 }, { marginTop: 5 })
              }
            >
              {coas.length} entries
            </p>
            <SearchBox value={searchQuery} onChange={handleSearch} />
            {coas.length === 0 ? (
              <p>No data available</p>
            ) : (
              <>
                {tableView ? (
                  <div ref={tableRef}>
                    <COAsTable
                      selectedCategory={selectedCategory}
                      selectedSubCategory={selectedSubCategory}
                      coas={coasByPagination}
                      onDelete={handleDelete}
                      onSort={handleSort}
                      sortColumn={sortColumn}
                      handleCheckboxClick={handleCheckboxClick}
                    />
                  </div>
                ) : (
                  <COAsTree
                    selectedCategory={selectedCategory}
                    selectedSubCategory={selectedSubCategory}
                    coas={coasByPagination}
                    coavalues={coavalues}
                    handleCheckboxClick={handleCheckboxClick}
                  />
                )}
              </>
            )}
          </div>
        </PanelBody>

        <hr className="m-0" />

        {tableView && (
          <PanelBody>
            <div className="d-flex align-items-center justify-content-center">
              <Pagination
                itemsCount={coas.length}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                currentPage={currentPage}
              />
            </div>
          </PanelBody>
        )}
      </Panel>
    </div>
  )
}
const toolbarStyles = {
  background: "#c8e9f3",
  padding: "10px",
}
const btnStyles = { background: "#348fe2", margin: "0rem" }
const iconStyles = {
  width: "25px",
  height: "25px",
  marginRight: "0rem",
}
export default COATable
