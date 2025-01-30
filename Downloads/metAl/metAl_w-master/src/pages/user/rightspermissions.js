import React from 'react';
import { Link } from 'react-router-dom';
import { Panel, PanelHeader, PanelBody } from './../../components/panel/panel.jsx';
import { UnControlled as CodeMirror } from 'react-codemirror2'
require('codemirror/mode/xml/xml.js');
require('codemirror/mode/javascript/javascript.js');

class FormElements extends React.Component {
	constructor(props) {
		super(props);
		
		this.codeMirrorOptions = {
			mode: 'application/xml',
			theme: 'material',
			lineNumbers: true,
			indentWithTabs: true,
			tabSize: 2,
			autoScroll: false
		}
	}
	render() {
		return (
			<div>
					
				<h3 className="m-b-20">Checkboxes and Radios</h3>
				<div className="row">
					<div className="col-xl-6">
						<Panel>
							<PanelHeader>
								Rights & Permissions for User-Roles<span className="label label-success"></span>
							</PanelHeader>
							<PanelBody>
								<form>
									<div className="form-group row m-b-10">
										<label className="col-md-3 col-form-label">Users</label>
										<div className="col-md-9">

											<div className="checkbox checkbox-css checkbox-inline">
												<input type="checkbox" value={permission.access.new} id="moduleName1"
												/>
												<label htmlFor="moduleName1">Create {permission.module.mname}</label>
											</div>
										
											<div className="checkbox checkbox-css checkbox-inline">
												<input type="checkbox" value={permission.access.read} id="moduleName2"
												/>
												<label htmlFor="moduleName2">View {permission.module.mname}</label>
											</div>
											
											<div className="checkbox checkbox-css checkbox-inline">
												<input type="checkbox" value="{permission.access.editWrite}" id="moduleName3" />
												<label htmlFor="moduleName3">Edit/Write {permission.module.mname}</label>
											</div>
											<div className="checkbox checkbox-css checkbox-inline">
												<input type="checkbox" value={permission.access.del} id="moduleName4" />
												<label htmlFor="moduleName4">Del {permission.module.mname}</label>
											</div>
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

export default FormElements;