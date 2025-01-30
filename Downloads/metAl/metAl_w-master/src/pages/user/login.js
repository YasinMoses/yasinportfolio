import React from "react";
import { Link, withRouter } from "react-router-dom";
import { PageSettings } from "../../config/page-settings.js";
import Joi from "joi";
import Form from "../../common/form.jsx";
import auth from "../../services/authservice";
class LoginV2 extends Form {
	static contextType = PageSettings;

	constructor(props) {
		super(props);

		this.state = {
			data: {
				username: "",
				password: "",
			},
			errors: {},
			activeBg: "/assets/img/login-bg/login-bg-17.jpg",
			bg1: true,
			bg2: false,
			bg3: false,
			bg4: false,
			bg5: false,
			bg6: false,
		};
		this.selectBg = this.selectBg.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		//this.validate = this.validate.bind(this);
	}

	selectBg(e, active, bg) {
		e.preventDefault();

		this.setState((state) => ({
			activeBg: bg,
			bg1: active === "bg1" ? true : false,
			bg2: active === "bg2" ? true : false,
			bg3: active === "bg3" ? true : false,
			bg4: active === "bg4" ? true : false,
			bg5: active === "bg5" ? true : false,
			bg6: active === "bg6" ? true : false,
		}));
	}

	componentDidMount() {
		this.context.handleSetPageSidebar(false);
		this.context.handleSetPageHeader(false);
	}

	componentWillUnmount() {
		this.context.handleSetPageSidebar(true);
		this.context.handleSetPageHeader(true);
	}

	schema = Joi.object({
		username: Joi.string().required().label("Username"),
		password: Joi.string().required().label("Password"),
	});

	doSubmit = async () => {
		console.log("working");
		try {
			const { data } = this.state;
			await auth.login(data.username, data.password);
			//console.log(jwt);

			//this line after register
			//localStorage.setItem('token',response.headers['x-auth-token']);
			//redirect
			//this.props.history.push('/dashboard/v2');
			//this.props.history.push('/');
			window.location = "/";
		} catch (ex) {
			if (ex.response && ex.response.status === 400) {
				const errors = { ...this.state.errors };
				errors.username = ex.response.data;
				this.setState({ errors });
			}
		}
	};

	render() {
		const { data, errors } = this.state;
		return (
			<React.Fragment>
				<div className="login-cover">
					<div className="login-cover-image" style={{ backgroundImage: "url(" + this.state.activeBg + ")" }}></div>
					<div className="login-cover-bg"></div>
				</div>

				<div className="login login-v2">
					<div className="login-header">
						<div className="brand">
							<span className="logo"></span>
							<small></small>
						</div>
						<div className="icon">
							<i className="fa fa-lock"></i>
						</div>
					</div>
					<div className="login-content">
						<form className="margin-bottom-0" onSubmit={this.handleSubmit}>
							<div className="form-group m-b-20">
								<input
									type="text"
									id="username"
									name="username"
									value={data.username}
									className="form-control form-control-lg"
									placeholder="Username"
									onChange={this.handleChange}
									autoFocus
								/>
								{errors.username && <div className="alert alert-danger">{errors.username}</div>}
							</div>
							{/* {this.renderInput('username','Username')} */}
							<div className="form-group m-b-20">
								<input
									type="password"
									id="password"
									name="password"
									value={data.password}
									className="form-control form-control-lg"
									placeholder="Password"
									onChange={this.handleChange}
								/>
								{errors.password && <div className="alert alert-danger">{errors.password}</div>}
							</div>

							{/* <div className="form-group m-b-20">
							<input className="form-control form-control-lg" type="text" id="dbname" value={this.state.data.dbname} readOnly />
							</div> */}

							<div className="checkbox checkbox-css m-b-20">
								<input type="checkbox" id="remember_checkbox" />
								<label htmlFor="remember_checkbox">Remember Me</label>
							</div>
							<div className="login-buttons">
								<button type="submit" disabled={this.Validate()} className="btn btn-success btn-block btn-lg">
									Sign me in
								</button>
							</div>
							<div className="m-t-20">
								Not a member yet? Click <Link to="/user/register.js">here</Link> to register.
							</div>
						</form>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default withRouter(LoginV2);
