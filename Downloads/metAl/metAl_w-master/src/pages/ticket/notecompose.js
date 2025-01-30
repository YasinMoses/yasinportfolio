import React from 'react';
import ReactTags from 'react-tag-autocomplete';
import ReactQuill from 'react-quill';
import { Link } from 'react-router-dom';
import { PageSettings } from './../../config/page-settings.js';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar';

class NoteCompose extends React.Component {
	static contextType = PageSettings;
	
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.toggleMobileNoteNav = this.toggleMobileNoteNav.bind(this);
		this.state = {
			dropdownOpen: false,
			cc: false,
			bcc: false,
			isMobileNoteNavOn: false,
			text: '',
			editor: {
				height: (window.innerHeight > 600) ? window.innerHeight - 315 : 300
			}
		};
	}

	componentDidMount() {
		this.context.handleSetPageContentFullHeight(true);
		this.context.handleSetPageContentFullWidth(true);
	}

	componentWillUnmount() {
		this.context.handleSetPageContentFullHeight(false);
		this.context.handleSetPageContentFullWidth(false);
	}

	toggle() {
		this.setState(prevState => ({
			dropdownOpen: !prevState.dropdownOpen
		}));
	}
  
	handleTagDelete (i) {
		const tags = this.state.tags.slice(0)
		tags.splice(i, 1)
		this.setState({ tags })
	}

	handleTagAddition (tag) {
		const tags = [].concat(this.state.tags, tag)
		this.setState({ tags })
	}

	handleCc(e) {
		e.preventDefault();
		this.setState(state => ({
			cc: true
		}));
	}

	handleChange(value) {
		this.setState({ text: value })
	}
	
	toggleMobileNoteNav() {
		this.setState(state => ({
      isMobileNoteNavOn: !state.isMobileNoteNavOn
    }));
	}
  
	render() {
		return (
			<div className="vertical-box with-grid inbox bg-light">
				<div className="vertical-box-column">
					<div className="vertical-box">
						<div className="wrapper">
							<ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
								<DropdownToggle color="white btn-sm">
									<i className="fa fa-ellipsis-h"></i>
								</DropdownToggle>
								<DropdownMenu>
									<DropdownItem>Save draft</DropdownItem>
									<DropdownItem>Show From</DropdownItem>
									<DropdownItem>Check names</DropdownItem>
									<DropdownItem>Switch to plain text</DropdownItem>
									<DropdownItem>Check for accessibility issues</DropdownItem>
								</DropdownMenu>
							</ButtonDropdown>
						</div>
						<div className="vertical-box-row bg-white">
							<div className="vertical-box-cell">
								<div className="vertical-box-inner-cell">
									<PerfectScrollbar className="height-full p-15" options={{suppressScrollX: true}}>
										<form action="/" method="POST" name="email_to_form">
											<div className="email-subject">
												<input type="text" className="form-control form-control-lg" placeholder="Subject" />
											</div>
											<div className="email-content p-t-15">
												<ReactQuill value={this.state.text} onChange={this.handleChange} style={{ height: this.state.editor.height + 'px', marginBottom: '20px' }} />
											</div>
										</form>
									</PerfectScrollbar>
								</div>
							</div>
						</div>
						<div className="wrapper text-right">
							<button type="submit" className="btn btn-white p-l-40 p-r-40 m-r-5">Discard</button>
							<button type="submit" className="btn btn-primary p-l-40 p-r-40">Save Note</button>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default NoteCompose;