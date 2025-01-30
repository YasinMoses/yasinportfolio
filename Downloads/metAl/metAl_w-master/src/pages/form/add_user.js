import React from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import ReactTags from 'react-tag-autocomplete';
import DatePicker from 'react-datepicker';
import DateTime from 'react-datetime';
import Select from 'react-select';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment"


const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

class AddUser extends React.Component {
	constructor(props) {
		super(props);
		
		var maxYesterday = '';
		var minYesterday = DateTime.moment().subtract(1, 'day');
		
		this.minDateRange = (current) => {
			return current.isAfter( minYesterday );
		};
		this.maxDateRange = (current) => {
			return current.isAfter( maxYesterday );
		};
		this.minDateChange = (value) => {
			this.setState({
				maxDateDisabled: false
			});
			maxYesterday = value;
		};
		this.handleChange = (date) => {
			this.setState({
				startDate: date
			});
		}
		this.state = {
			maxDateDisabled: true,
			startDate: new Date(),
		
			suggestions: [
				{ id: 3, name: 'Bananas' },
				{ id: 4, name: 'Mangos' },
				{ id: 5, name: 'Lemons' },
				{ id: 6, name: 'Apricots' }
			]
		}
	
	

		this.selectOptions = [
			{ value: 'chocolate', label: 'Chocolate' },
			{ value: 'strawberry', label: 'Strawberry' },
			{ value: 'vanilla', label: 'Vanilla' }
		];
		
		this.handleSlider = (props) => {
			const { value, dragging, index, ...restProps } = props;
			return (
				<Tooltip
					prefixCls="rc-slider-tooltip"
					overlay={value}
					visible={dragging}
					placement="top"
					key={index}
				>
					<Handle value={value} {...restProps} />
				</Tooltip>
			);
		}
		this.disableFutureDt = this.disableFutureDt.bind(this)
	}
	   
	disableFutureDt = current => {
		const today = moment()
		return current.isBefore(today)
	  }
	render() {
		return (
			<div>
				<ol className="breadcrumb float-xl-right">
					<li className="breadcrumb-item"><Link to="/form/plugins">Home</Link></li>
					<li className="breadcrumb-item"><Link to="/form/plugins">Users</Link></li>
					<li className="breadcrumb-item active">Add User</li>
				</ol>
				<h1 className="page-header">Add User <small>header small text goes here...</small></h1>
				
				<div className="row">
					<div className="col-xl-10">
						<Panel>
							<PanelHeader>
								Add User
							</PanelHeader>
							<PanelBody className="panel-form">
								<form className="form-horizontal form-bordered">
                                <div className="form-group row">
										<label className="col-lg-4 col-form-label">UserName</label>
										<div className="col-lg-8">
											<div className="row row-space-10">
                                            <input type="text" className="form-control m-b-5" placeholder="Enter username" />
											</div>
										</div>
									</div>
                                    <div className="form-group row">
										<label className="col-lg-4 col-form-label">Email</label>
										<div className="col-lg-8">
											<div className="row row-space-10">
                                            <input type="email" className="form-control m-b-5" placeholder="Enter email" />
											</div>
										</div>
									</div>
                                    <div className="form-group row">
										<label className="col-lg-4 col-form-label">Password</label>
										<div className="col-lg-8">
											<div className="row row-space-10">
                                            <input type="password" className="form-control m-b-5" />
											</div>
										</div>
									</div>
									<div className="form-group row">
										<label className="col-lg-4 col-form-label">Default Date Time</label>
										<div className="col-lg-8">
											<DateTime inputProps={{ placeholder: 'Datepicker' }} closeOnSelect={true} />
										</div>
									</div>
								
                                    <div className="form-group row">
										<label className="col-lg-4 col-form-label">React Select Dropdown</label>
										<div className="col-lg-8">
											<Select options={this.selectOptions} />
										</div>
									</div>


                                    <div className="form-group row">
										<label className="col-lg-4 col-form-label">Date of Birth</label>
										<div className="col-lg-8">
											<DatePicker 
												selected={this.state.startDate} 
												onChange={this.handleChange} 
												className="form-control"
												maxDate={new Date()}
												 />
										</div>
									</div>

                                    



								</form>
							</PanelBody>
						</Panel>
						
					
						
					
					
					</div>

				</div>
			</div>
		)
	}
}

export default AddUser;