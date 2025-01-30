import React from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';

class Configuration extends React.Component {
	render() {
		return (
			<div>
				<h1 className="page-header">Configuration<small>header small text goes here...</small></h1>
				<Panel>
					<PanelHeader>FTP login</PanelHeader>
					<PanelBody>
						<form action="" method="POST">
							<fieldset>
								<legend className="m-b-15">FTP-url</legend>
								<div className="form-group">
									<label htmlFor="FTPUrl">FTP-URL</label>
									<input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
								</div>
								<div className="form-group">
									<label htmlFor="password">Password</label>
									<input type="password" className="form-control" id="password" placeholder="Password" />
								</div>
								<button type="submit" className="btn btn-sm btn-primary m-r-5">Login</button>
								<button type="submit" className="btn btn-sm btn-default">Cancel</button>
							</fieldset>
						</form>
					</PanelBody>
				</Panel>
			</div>
		)
	}
}

export default Configuration;