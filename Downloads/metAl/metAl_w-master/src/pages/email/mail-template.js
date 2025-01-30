import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Panel, PanelHeader, PanelBody } from "../../components/panel/panel.jsx";
import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Joi from "joi";
import Form from "../../common/form.jsx";
import { apiUrl } from "../../config/config.json";
import http from "../../services/httpService";
import auth from "../../services/authservice";
import { saveMailTemplate, getMailTemplate } from "./../../services/emailtemplates";
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

class EmailTemplate extends Form {
	constructor(props) {
		super(props);

	
		this.state = {
			isEditable: true,
			data: {
				title: "",
				body: "",	
			},
			errors: {},
		};

		this.handleSlider = (props) => {
			const { value, dragging, index, ...restProps } = props;
			return (
				<Tooltip prefixCls="rc-slider-tooltip" overlay={value} visible={dragging} placement="top" key={index}>
					<Handle value={value} {...restProps} />
				</Tooltip>
			);
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	async populate() {
		try {
			const id = this.props.match.params.id;
			if (id === "new") return;
			const { data: mailTemplate } = await getMailTemplate(id);
			this.setState({ data: this.mapToViewModel(mailTemplate) });
			console.log(this.state.data);
		} catch (ex) {
			if (ex.response && ex.response.status === 404) this.props.history.replace("/error");
		}
	}

	async componentDidMount() {
		await this.populate();
	
	}
	schema = Joi.object({
		title: Joi.string(),
		body: Joi.any().optional(),
	});




	

	doSubmit = async () => {
		try {
			await saveMailTemplate(this.state.data);
			console.log(this.state.data.body);
			//this.props.history.push("/email/emails");
		} catch (ex) {
			if (ex.response) {
				const errors = { ...this.state.errors };
				errors.status = ex.response.data;
				this.setState({ errors });
			}
		}
	};

	
	mapToViewModel(e) {
		return {
			_id: e._id,
			title: e.title,
			body: e.body,
		};
	}

	render() {
		const { data, errors } = this.state;
		return (
			<React.Fragment>
				<div>
					<h1 className="page-header">
						Add Ticket-Solo <small>Ticket-registration-form</small>
					</h1>

					<div className="row">
						<div className="col-xl-10">
							<Panel>
								<PanelHeader>Add Ticket</PanelHeader>
								<PanelBody className="panel-form">
									<form className="form-horizontal form-bordered" onSubmit={this.handleSubmit}>
										{this.renderInput(
											"title",
											"Name",
											"text",
											"Enter Name/Title/subject mail template"
										)}

										{this.renderTextarea("body", "Body", "text", "Enter ...")}	
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

export default withRouter(EmailTemplate);