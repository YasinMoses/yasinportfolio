import React from 'react';
import { Link,withRouter} from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from '../../components/panel/panel.jsx';
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import ReactTags from 'react-tag-autocomplete';
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
import Joi from 'joi';
import Form from '../../common/form.jsx';
import http from '../../services/httpService';
import {saveReservedUsername,getReservedUsername} from './../../services/reservedusernames';

const apiUrl = process.env.REACT_APP_API_URL;

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;


class ReservedUsername extends Form {
	constructor(props) {
		super(props);

		this.state = {
			maxDateDisabled: true,
			data: {
				name: '',
				note: '',
			},
            selectedFile: null,
			errors: {}
		}
		
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

	async populateReservedUsername() { 
		try {
		  const bankId = this.props.match.params.id;
		
		  if (bankId === "new") return;
	
		  const { data: ReservedUsername } = await getReservedUsername(bankId);
            const ReservedUsername = ReservedUsername[0];
		    console.log(ReservedUsername);
			 if(ReservedUsername.dateBirth)ReservedUsername.dateBirth = new Date();
		     
			bank.name =bank.name;

		  this.setState({ data: this.mapToViewModel(ReservedUsername) });

		  console.log(this.state.data);
		} catch (ex) {
		  if (ex.response && ex.response.status === 404)
			this.props.history.replace("/error");
		}
	  }


	async componentDidMount() {
		
		await this.populateReservedUsername();
	
	}


schema = Joi.object({
		name: Joi.string(),

	});

	}


	doSubmit = async (ReservedUsername) => {
		//console.log('working');
	    try{
			console.log(this.state.data);
			await saveReservedUsername(this.state.data,this.state.imageSrc);
			//console.log(this.state.data);
			this.props.history.push("/books/banks");
		}catch(ex){
			//if(ex.response && ex.response.status === 404){
			if(ex.response){
				const errors = {...this.state.errors};
				//console.log(ex.response.data.split('"')[1]);
				const path = ex.response.data.split('"')[1];
				//errors.ReservedUsernamename = ex.response.data;
				errors[path] = ex.response.data;
				this.setState({errors});
				//console.log(this.state.errors);
			}
		}
		
	};
	
	mapToViewModel(ReservedUsername) {
		return {
            _id: reservedusername._id,
            name: reservedusername.name,
		};
	  }

	render() {

		const { data, errors } = this.state;
		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/form/plugins">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/databases/reservedusernames">ReservedUsernames</Link></li>
						<li className="breadcrumb-item active">Add ReservedUsername</li>
					</ol>
					<h1 className="page-header">
						Add ReservedUsername <small>ReservedUsername-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add ReservedUsername</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >
										{this.renderInput("username","UserName","text","* Enter UserName")}
										<div className="form-group row">
											<div className="col-lg-8">
												<button	type="submit" disabled={this.validate()} className="btn btn-primary width-65">Submit</button>
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

export default withRouter(ReservedUsername);