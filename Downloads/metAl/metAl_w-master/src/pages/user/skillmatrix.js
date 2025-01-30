import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from '../../components/panel/panel.jsx';

import DateTime from 'react-datetime';

import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import 'react-datetime/css/react-datetime.css';
import 'react-datepicker/dist/react-datepicker.css';
import Joi from 'joi';
import Form from '../../common/form.jsx';

import { saveSkill, getSkill } from './../../services/skills';
import { getProfile } from '../../services/authservice.js';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;


class Skill extends Form {
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

			data: {
				userNo: "",
				name: "",
				level: "",
				note: "",				
				createdOn: new Date(),
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

		this.skillOptions = [
			{ value: "no-knowledge", label: "No knowledge" }, //orange
			{ value: "beginner", label: "Beginner" }, 		//blue
			{ value: "independent", label: "Independent" },	//yellow
			{ value: "expert", label: "Expert" },		//green
			{ value: "trainer", label: "Trainer" },		//brown
		];
	
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.onChangeImgHandler = this.onChangeImgHandler.bind(this);
	}

	async populateSkill(){
		this.selectSkill = this.skillOptions.map(option => (
			<option key={option.label} value={option.value}>
				{option.value}
			</option>
		));
		}

	async populateSkill() {
		try {
			const skillId = this.props.match.params.id;
			console.log(skillId);
			if (skillId === "new") return;

			const { data: skill } = await getSkill(skillId);
			console.log("edit ", skill);

			this.setState({ data: this.mapToViewModel(skill) });

			console.log(this.state.data);
		} catch (ex) {
			if (ex.response && ex.response.status === 404)
				this.props.history.replace("/error");
		}
	}


	async componentDidMount() {
		await this.populateSkill();
		const user = await getProfile();
		const data = { ...this.state.data };
		data.userNo = user._id;
		this.setState({ data });
	}


	schema = Joi.object({
		name: Joi.string(),
		skill: Joi.any().optional(),
	});

	onChangeImgHandler = event => {
		this.setState({ imageSrc: event.target.files[0] });
		console.log(event.target.files[0]);
	}

	doSubmit = async () => {
		console.log('working');
		try {
			
			await saveSkill(this.state.data, this.state.imageSrc);
			console.log("done");
			this.props.history.push("/accounting/skills");
		} catch (ex) {
		
			if (ex.response) {
				const errors = { ...this.state.errors };
			
				const path = ex.response.data.split('"')[1];
				
				errors[path] = ex.response.data;
				this.setState({ errors });
				console.log(this.state.errors);
			}
		}
	};

	mapToViewModel(skill) {
		return {
			_id: skill._id,
			userNo: skill.userNo,
			name: skill.name,
			level: skill.level,
			note: skill.note,
			createdOn: skill.createdOn,
		};
	}


	render() {
		const { data, errors } = this.state;
		
		return (
			<React.Fragment>
				<div>
					<ol className="breadcrumb float-xl-right">
						<li className="breadcrumb-item"><Link to="/form/plugins">Home</Link></li>
						<li className="breadcrumb-item"><Link to="/form/plugins">Skills</Link></li>
						<li className="breadcrumb-item active">Add Skill</li>
					</ol>
					<h1 className="page-header">
						Add Skill <small>Skill-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add Skill</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit} >

										{this.renderInput("name", "Name", "text", "Enter name *")}

										<div className="form-group row">
											<label className="col-lg-4 col-form-label" htmlFor="level">
												Level
											</label>
											<div className="col-lg-8">
												<select
													name="level"
													id="level"
													value={data.status}
													onChange={this.handleChange}
													className="form-control"
												>
													<option value="">Select Level</option>
													{this.selectLevel}
												</select>
											</div>
											{errors.status && <div className="alert alert-danger">{errors.status}</div>}
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

export default withRouter(Skill);