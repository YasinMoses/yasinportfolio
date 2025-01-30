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
import {saveTitle,getTitle} from './../../services/titles';

const apiUrl = process.env.REACT_APP_API_URL;

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;


class Title extends Form {
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
		this.onChangeImgHandler = this.onChangeImgHandler.bind(this);
	}

	async populateTitle() { 
		try {
		  const titleId = this.props.match.params.id;
		
		  if (titleId === "new") return;
	
		  const { data: Title } = await getTitle(titleId);
            const Title = Title[0];
		    console.log(Title);
			 if(Title.dateBirth)Title.dateBirth = new Date();
		     
			title.name =title.name;

		  this.setState({ data: this.mapToViewModel(Title) });

		  console.log(this.state.data);
		} catch (ex) {
		  if (ex.response && ex.response.status === 404)
			this.props.history.replace("/error");
		}
	  }


	async componentDidMount() {
		
		await this.populateTitle();
	
	}


schema = Joi.object({
		name: Joi.string(),

	});

	onChangeImgHandler=event=>{

		this.setState({ imageSrc: event.target.files[0] });
	  console.log(event.target.files[0]);
	
	}


	doSubmit = async (Title) => {
		//console.log('working');
	    try{
			console.log(this.state.data);
			await saveTitle(this.state.data,this.state.imageSrc);
			//console.log(this.state.data);
			this.props.history.push("/books/titles");
		}catch(ex){
			//if(ex.response && ex.response.status === 404){
			if(ex.response){
				const errors = {...this.state.errors};
				//console.log(ex.response.data.split('"')[1]);
				const path = ex.response.data.split('"')[1];
				//errors.Titlename = ex.response.data;
				errors[path] = ex.response.data;
				this.setState({errors});
				//console.log(this.state.errors);
			}
		}
		
	};
	
	mapToViewModel(Title) {
		return {
            _id: title._id,
            name: title.name,
		};
	  }

	render() {

		const { data, errors } = this.state;
		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/form/plugins">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/form/plugins">Titles</Link></li>
						<li className="breadcrumb-item active">Add Title</li>
					</ol>
					<h1 className="page-header">
						Add Title <small>Title-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add Title</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >
										{this.renderInput("name","Name","text","* Enter Name")}
										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="imageSrc">Avatar</label>
											<div className="col-lg-8">
												<div className="row row-space-10">
													<input type="file" id="imageSrc" name="imageSrc"													
														className="form-control-file m-b-5"
														onChange={this.onChangeImgHandler}
													/>
													{errors.imageSrc && (
														<div className="alert alert-danger">
															{errors.imageSrc}
														</div>
													)}
												</div>
											</div>
										</div>
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

export default withRouter(Title);