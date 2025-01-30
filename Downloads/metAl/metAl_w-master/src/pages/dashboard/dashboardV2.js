import React from "react";
import { Link } from "react-router-dom";
import GoogleMapReact from "google-map-react";
import NVD3Chart from "react-nvd3";
import d3 from "d3";
import Calendar from "react-calendar";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Panel, PanelHeader, PanelFooter } from "./../../components/panel/panel.jsx";

import DashboardSolo from "./dashboardSolo.js";
import DashboardSales from "./dashboardSales.js";
import DashboardAdmin from "./dashboardAdmin.js";
import DashboardBanned from "./dashboardBanned.js";
import DashboardUser from "./dashboardUser.js";
//import DashboardBeauty from "./dashboardBeauty.js";
import DashboardClinic from "./dashboardClinic.js";
import DashboardReception from "./dashboardReception.js";
import DashboardClient from "./dashboardClient.js";
import DashboardERO from "./dashboardERO.js";
import DashboardTechnicalService from "./dashboardTechnicalService.js";
import DashboardAccountant from "./dashboardAccountant.js";
import DashboardCustomerService from "./dashboardCustomerService.js";
import { connect } from "react-redux";
import { loadCurrentUser } from "./../../store/users";
import auth from "../../services/authservice";

class DashboardV2 extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentUser: {},
			loading: true,
		};
	}

	async componentDidMount() {
		const user = auth.getProfile();
		if (user) {
			await this.props.loadCurrentUser(user._id);
			const currentUser = await this.props.currentUser;
			this.setState({ currentUser });
			console.log(currentUser);
			this.setState({ loading: false });
		}
	}

	//componentWillReceiveProps(nextProps) {
	//  this.setState({ currentUser: nextProps.currentUser });
	// this.setState({ loading: false });
	// console.log(
	//   "nextProps.currentUser",
	//   nextProps.currentUser.profile.profileName
	//   );
	//  }

	//getRole() {
	//  if (this.state.loading=== true) {
	//    return "loading";
	//   } else {
	//    return this.props.currentUser.profile.profileName;
	//  }
	//  }

	render() {
		if (this.state.loading === true) {
			return "loading";
		}
		return (
			<>
				{/* <DashboardPatient /> */}
				{this.props.currentUser.role === "Solo" ? <DashboardSolo /> : null}
				{this.props.currentUser.role === "Sales" ? <DashboardSales /> : null}
				{this.props.currentUser.role === "admin" ? <DashboardAdmin /> : null}
				{this.props.currentUser.role === "banned" ? <DashboardBanned /> : null}
				{this.props.currentUser.role === "User" ? <DashboardUser /> : null}
				{/* {this.props.currentUser.role === "Salon" ? <DashboardSalon /> : null} */}
				{this.props.currentUser.role === "Clinic" ? <DashboardClinic /> : null}
				{this.props.currentUser.role === "Reception" ? <DashboardReception /> : null}
				{this.props.currentUser.role === "Client" ? <DashboardClient /> : null}
				{this.props.currentUser.role === "ERO" ? <DashboardERO /> : null}
				{this.props.currentUser.role === "Technical Service" ? <DashboardTechnicalService /> : null}
				{this.props.currentUser.role === "Accountant" ? <DashboardAccountant /> : null}
				{this.props.currentUser.role === "Customer Service" ? <DashboardCustomerService /> : null}
			</>
		);
	}
}

//export default DashboardV2;
const mapStateToProps = (state) => ({
	currentUser: state.entities.users.currentUser,
});
const mapDispatchToProps = (dispatch) => ({
	loadCurrentUser: (id) => dispatch(loadCurrentUser(id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(DashboardV2);
