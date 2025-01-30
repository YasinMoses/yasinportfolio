import React from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from '../../components/panel/panel.jsx';
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import ReactTags from 'react-tag-autocomplete';
import DatePicker from 'react-datepicker';
import DateTime from 'react-datetime';
import moment from "moment";
//import Select from 'react-select';
//import Select from "../../common/select";

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';
import Joi from 'joi';
import Form from '../../common/form.jsx';
import {getClinicByUser} from '../../services/clinics';
import { saveTransaction, getTransaction } from './../../services/transactions';
import { getProfile } from '../../transactions/authservice.js';
import withRouter from '../../common/withRouter.jsx';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;


class Transaction extends Form {
	constructor(props) {
		super(props);

		var maxYesterday = '';
		var minYesterday = DateTime.moment().subtract(1, 'day');

		this.minDateRange = (current) => {
			return current.isAfter(minYesterday);
		};
		this.maxDateRange = (current) => {
			return current.isAfter(maxYesterday);
		};
		this.minDateChange = (value) => {
			this.setState({
				maxDateDisabled: false
			});
			maxYesterday = value;
		};

		this.state = {
			maxDateDisabled: true,
			users: [],
			data: {
				userNo: '',
				clinicNo: '',
				COA: '',
				title: '',
				narration: '',
				amount: '',
				currency: '',				
				paidDate: '',
				note: '',
				paidMethod: '',
				status: '',
			},
			selectedFile: null,
			errors: {}
		}

		this.paidMethodOptions = [
			{ value: "active", label: "Active" },
			{ value: "pending", label: "Pending" },
			{ value: "new", label: "New" },
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
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	async populateTransaction() {
		try {
			const userId = this.props.match.params.id;

			if (userId === "new") return;

			const { data: transaction } = await getTransaction(userId);
			console.log(transaction);

			if(!transaction.paidDate) transaction.paidDate = new Date();

			transaction.clinicNo = transaction.clinicNo;
			transaction.userNo = transaction.userNo;
			transaction.COA = transaction.COA;
			transaction.title = transaction.title;
			transaction.narration = transaction.narration;
			transaction.amount = transaction.amount;
			transaction.currency = transaction.currency;			
			transaction.note = transaction.note;
			transaction.paidMethod = transaction.paidMethod;

			this.setState({ data: this.mapToViewModel(transaction) });

			console.log(this.state.data);
		} catch (ex) {
			if (ex.response && ex.response.paidMethod === 404)
				this.props.history.replace("/error");
		}
	}


	async populatePaidMethod(){
		this.selectPaidMethod = this.paidMethodOptions.map(option => (
			<option key={option.label} value={option.value}>
				{option.value}
			</option>
		));
		}

	async componentDidMount() {

		await this.populateService();
		await this.populateStatus();
		const user = await getProfile();
		const{data:clinic} = await getClinicByUser(user._id);
		const data = { ...this.state.data };
		data.clinicNo = clinic._id;
		data.userNo = user._id;
		this.setState({ data });

	}

	schema = Joi.object({
		//clinicNo: Joi.string(),
		//userNo: Joi.string(),
		name: Joi.string().required(),
		COA: Joi.string().optional(),
		narration: Joi.string().optional(),
		duration: Joi.string().optional(),
		amount: Joi.string().required(),
		paidDate: Joi.any().optional(),
		note: Joi.string().optional(),
		paidMethod: Joi.string().optional(),
		status: Joi.string().required(),			
	});

	handleValidTillChange = (e) => {
		const errors = { ...this.state.errors };
		const obj = { ['paidDate']: e };

		const data = { ...this.state.data };
		data['paidDate'] = e;
		//const data = {...this.state.data};
		//data.paidDate = e;
		this.setState({ data });
		console.log(this.state.data);
	};


	doSubmit = async (transaction) => {
		//console.log('working');
		try {
			console.log(this.state.data);
			await saveService(this.state.data);
			//console.log(this.state.data);
			this.props.history.push("/accounting/transactions");
		} catch (ex) {
			//if(ex.response && ex.response.paidMethod === 404){
			if (ex.response) {
				console.log(ex.response.data);
				const errors = { ...this.state.errors };
				//console.log(ex.response.data.split('"')[1]);
				const path = ex.response.data.split('"')[1];
				//errors.username = ex.response.data;
				errors[path] = ex.response.data;
				this.setState({ errors });
				//console.log(this.state.errors);
			}
		}

	};

	mapToViewModel(transaction) {
		return {
			_id: transaction._id,
			clinicNo: transaction.clinicNo,
			userNo: transaction.userNo,
			name: transaction.name,
			COA: transaction.COA,
			narration: transaction.narration,
			amount: transaction.amount,
			currency: transaction.currency,			
			paidDate: new Date(transaction.paidDate),
			note: transaction.note,
			paidMethod: transaction.paidMethod,
			status: transaction.status,			
		};
	}


	render() {

		const { data, errors } = this.state;
		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/form/plugins">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/accounting/transactions">Transactions</Link></li>
						<li className="breadcrumb-item active">Add Transaction</li>
					</ol>
					<h1 className="page-header">
						Add Transaction <small>Transaction-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add Transaction</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >

										{this.renderInput("title", "Title", "text", "Enter title")}
										{this.renderInput("COA", "Code", "text", "Enter Code")}
										{this.renderInput("narration", "Narration", "text", "Enter narration")}
										{this.renderInput("amount", "Price", "number", "Enter amount")}
										{this.renderInput("currency", "Currency", "text", "Enter currency")}										
										{this.renderInput("note", "Note", "text", "Enter note")}

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="paidMethod">
												PaidMethod
											</label>
											<div className="col-lg-8">
												<select name="paidMethod" id="paidMethod" value={data.paidMethod} onChange={this.handleChange} className="form-control">
													<option value="">Select Paid-Method</option>
													{this.selectPaidMethod}
												</select>
											</div>
											{errors.paidMethod && <div className="alert alert-danger">{errors.paidMethod}</div>}
										</div>
										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="status" >Select Status</label>
											<div className="col-lg-8">
												<select name="status" id="status" value={data.status} onChange={this.handleChange} className="form-control" >
													<option value="">Select Status</option>
													{this.statusoptions}
												</select>
											</div>
											{errors.status && (<div className="alert alert-danger">{errors.status}</div>)}
										</div>

										<div className="form-group row">
											<div className="col-lg-8">
												<button type="submit" disabled={this.validate()} className="btn btn-primary width-65">Submit</button>
											</div>
										</div>
									</form>
								</PanelBody>
							</Panel>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default withRouter(Transaction);