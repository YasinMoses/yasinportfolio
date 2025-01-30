import React from 'react';
import { Link } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import NVD3Chart from 'react-nvd3';
import d3 from 'd3';
import Calendar from 'react-calendar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { Panel, PanelHeader, PanelFooter } from '../../components/panel/panel.jsx';

class DashboardSolo extends React.Component {
	constructor(props) {
		super(props);
		
		this.formatDate = (d) => {
			var monthsName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			d = new Date(d);
			d = monthsName[d.getMonth()] + ' ' + d.getDate();
			return d;
		}
		this.getDate = (minusDate) => {
			var d = new Date();
			d = d.setDate(d.getDate() - minusDate);
			return d;
		}


	
		
		this.map = {
			center: {
				lat: 59.95,
				lng: 30.33
			},
			zoom: 9
		}
		this.date = new Date();
	}
	render() {
		return (
			<div>
				<h1 className="page-header"><small></small></h1>
				<div className="row">
					<div className="col-xl-3 col-md-6">
						<div className="widget widget-stats bg-teal">
							<div className="stats-icon stats-icon-lg"><i className="fa fa-globe fa-fw"></i></div>
							<div className="stats-content">
								<div className="stats-title">Appointments</div>
								<div className="stats-number">7,842,900</div>
								<div className="stats-progress progress">
									<div className="progress-bar" style={{width: '70.1%'}}></div>
								</div>

							</div>
						</div>
					</div>
					<div className="col-xl-3 col-md-6">
						<div className="widget widget-stats bg-blue">
							<div className="stats-icon stats-icon-lg"><i className="fa fa-dollar-sign fa-fw"></i></div>
							<div className="stats-content">
								<div className="stats-title">Patients</div>
								<div className="stats-number">180,200</div>
								<div className="stats-progress progress">
									<div className="progress-bar" style={{width: '40.5%'}}></div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-md-6">
						<div className="widget widget-stats bg-indigo">
							<div className="stats-icon stats-icon-lg"><i className="fa fa-archive fa-fw"></i></div>
							<div className="stats-content">
								<div className="stats-title">Treatments</div>
								<div className="stats-number">38,900</div>
								<div className="stats-progress progress">
									<div className="progress-bar" style={{width: '76.3%'}}></div>
								</div>
								<div className="stats-desc">Better than last week (76.3%)</div>
							</div>
						</div>
					</div>
					<div className="col-xl-3 col-md-6">
						<div className="widget widget-stats bg-dark">
							<div className="stats-icon stats-icon-lg"><i className="fa fa-comment-alt fa-fw"></i></div>
							<div className="stats-content">
								<div className="stats-title">Your Posts</div>
								<div className="stats-number">3,988</div>
								<div className="stats-progress progress">
									<div className="progress-bar" style={{width: '54.9%'}}></div>
								</div>
								<div className="stats-desc">Better than last week (54.9%)</div>
							</div>
						</div>
					</div>
				</div>
				
				<div className="row">
				
					<div className="col-xl-4 col-lg-6">
						<Panel>
							<PanelHeader noButton={true}>
								Today's Schedule
							</PanelHeader>
							<div>
								<Calendar value={this.date} />
							</div>
							<div className="list-group">
								<Link to="/dashboard/v2" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-ellipsis">
									Sales Reporting
									<span className="badge f-w-500 bg-teal f-s-10">9:00 am</span>
								</Link> 
								<Link to="/dashboard/v2" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center text-ellipsis">
									Have a meeting with sales team
									<span className="badge f-w-500 bg-blue f-s-10">2:45 pm</span>
								</Link>
							</div>
						</Panel>
					</div>
				
				</div>
			</div>
		)
	}
};

export default DashboardSolo;
