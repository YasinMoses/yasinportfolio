import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Panel,
  PanelHeader,
  PanelBody,
} from './../../components/panel/panel.jsx';

import { deleteShift, getShifts } from '../../services/shifts.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import _ from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Icons imports
import newIcon from '../../assets/Icons/new.svg';
import pdfIcon from '../../assets/Icons/pdf.svg';
import sharingIcon from '../../assets/Icons/sharing.svg';
import trashIcon from '../../assets/Icons/trash.svg';
import xlsIcon from '../../assets/Icons/xls.svg';
import csvIcon from '../../assets/Icons/csv.svg';
import editIcon from '../../assets/Icons/edit.svg';
import http from './../../services/httpService';
import { apiUrl } from './../../config/config.json';
import Pagination from '../../common/pagination';
import ShiftsTable from '../../components/shiftsTable.jsx';
import { paginate } from '../../utils/paginate';
import SearchBox from './../../common/searchBox';

class ShiftTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Shifts: [],
      pageSize: 10,
      currentPage: 1,
      sortColumn: { path: 'title', order: 'asc' },
      searchQuery: '',
      errors: {},
      checkedFields: [],
    };
  }

  async componentDidMount() {
    //const {data:Shifts} = await axios.get("http://localhost:4500/api/Shifts");

    const data = await getShifts();
    console.log('data', data);

    this.setState({ Shifts: data.data });
  }

  async handleMassDelete(data) {
    console.log(data);
    for (let i = 0; i < data?.length; i++) {
      console.log(data[i]);
      const Shifts = await this?.state?.Shifts?.filter(
        (el) => el?._id !== data[i]
      );
      this && this.setState({ Shifts: Shifts });
      console.log(this.state.Shifts);

      await deleteShift(data[i]);

      toast.success('Shift Deleted!');

      this.setState((event) => {
        const selectedPort = event.checkedFields;
        const falseIndex = selectedPort.indexOf(data[i]);
        i--;
        return selectedPort.splice(falseIndex, 1);
      });
    }
  }
  handleCheckboxChange = (e) => {
    const { value, checked } = e?.target;

    this.setState((event) => {
      const selectedPort = event.checkedFields;
      if (!checked) {
        const falseIndex = selectedPort.indexOf(value);
        console.log(falseIndex);
        return selectedPort.splice(falseIndex, 1);
      }
      return selectedPort.push(value);
    });
  };

  //sorting columns
  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };
  handlePageChange = (page) => {
    console.log(page);
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    console.log(query);
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  getDataPgnation = () => {
    const { pageSize, currentPage, Shifts, sortColumn, searchQuery } =
      this.state;
    //filter maybe next time
    let filtered = Shifts;
    if (searchQuery) {
      console.log(searchQuery, filtered, Shifts);
      filtered = Shifts?.filter(
        (el) =>
          el?.name?.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          el?.ShiftType?.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    }

    //
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    let nShifts = paginate(sorted, currentPage, pageSize);
    return { data: nShifts };
  };

  render() {
    const { length: count } = this.state.Shifts;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    const { data: Shifts } = this.getDataPgnation();

    return (
      <div>
        <ToastContainer />

        <ol className='breadcrumb float-xl-right'>
          <li className='breadcrumb-item'>
            <Link to='/'>Home</Link>
          </li>
          <li className='breadcrumb-item'>
            <Link to='/user/Shifts'>Tables</Link>
          </li>
          <li className='breadcrumb-item active'>Data Tables</li>
        </ol>
        <h1 className='page-header'>Shifts </h1>
        <Panel>
          <PanelHeader>Shifts Management</PanelHeader>

          <React.Fragment>
            {/* {user && ( <button className="btn btn-default active m-r-5 m-b-5" style={{marginBottom:20},{marginLeft:20},{marginTop:20}}>  <Link to="/clinic/user/new">Add User</Link>  </button>)} */}
            <div className='toolbar' style={toolbarStyles}>
              <button
                className='btn btn-default active m-r-5 m-b-5'
                title='add shift'
                style={btnStyles}
              >
                {' '}
                <Link to='/user/shifts/new'>
                  <img style={iconStyles} src={newIcon} alt='New Icon' />
                </Link>{' '}
              </button>
              <button
                className='btn btn-default active m-r-5 m-b-5'
                title='edit'
                style={btnStyles}
              >
                {' '}
                <Link
                  to={
                    this.state.checkedFields
                      ? `/user/shifts/${this.state.checkedFields[0]}`
                      : '/user/Shifts/'
                  }
                >
                  <img style={iconStyles} src={editIcon} alt='Edit Icon' />
                </Link>{' '}
              </button>
              <button
                className='btn btn-default active m-r-5 m-b-5'
                title='delete'
                style={btnStyles}
                onClick={() => this.handleMassDelete(this.state.checkedFields)}
              >
                {' '}
                <img
                  style={{ width: '25px', height: '25px' }}
                  src={trashIcon}
                  alt='Trash Icon'
                />
              </button>
              <button
                className='btn btn-default active m-r-5 m-b-5'
                title='excel'
                style={btnStyles}
              >
                {' '}
                <Link to='/user/Shifts/'>
                  <img style={iconStyles} src={xlsIcon} alt='XLS Icon' />
                </Link>{' '}
              </button>
              <button
                className='btn btn-default active m-r-5 m-b-5'
                title='csv'
                style={btnStyles}
              >
                {' '}
                <Link to='/user/Shifts/'>
                  <img style={iconStyles} src={csvIcon} alt='CSV Icon' />
                </Link>{' '}
              </button>

              <button
                className='btn btn-default active m-r-5 m-b-5'
                title='pdf'
                style={btnStyles}
              >
                {' '}
                <Link to='/user/Shifts/'>
                  <img style={iconStyles} src={pdfIcon} alt='PDF Icon' />
                </Link>{' '}
              </button>
              <button
                className='btn btn-default active m-r-5 m-b-5'
                title='Share to other'
                style={btnStyles}
              >
                {' '}
                <Link to='/user/Shifts/'>
                  <img
                    style={iconStyles}
                    src={sharingIcon}
                    alt='Sharing Icon'
                  />
                </Link>{' '}
              </button>
            </div>

            <div className='table-responsive'>
              <SearchBox value={searchQuery} onChange={this.handleSearch} />
              <p
                className='page-header float-xl-left'
                style={
                  ({ marginBottom: 5 }, { marginLeft: 20 }, { marginTop: 5 })
                }
              >
                {count} entries
              </p>

              <ShiftsTable
                Shifts={Shifts}
                onSort={this.handleSort}
                sortColumn={sortColumn}
                handleCheckboxChange={this.handleCheckboxChange}
              />
            </div>
          </React.Fragment>

          <hr className='m-0' />
          <PanelBody>
            <div className='d-flex align-items-center justify-content-center'>
              <Pagination
                itemsCount={count}
                pageSize={pageSize}
                onPageChange={this.handlePageChange}
                currentPage={currentPage}
              />
            </div>
          </PanelBody>
        </Panel>
      </div>
    );
  }
}
const toolbarStyles = {
  background: '#c8e9f3',
  padding: '10px',
};

const btnStyles = { background: '#348fe2', margin: '0rem' };

const iconStyles = {
  width: '25px',
  height: '25px',
  marginRight: '0rem',
};

export default ShiftTable;
