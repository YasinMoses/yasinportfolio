import React from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import auth from './../../../services/authservice';
import {getUser} from './../../../services/users';
import { Link, withRouter } from 'react-router-dom';
class DropdownProfile extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			dropdownOpen: false,
			currentUser:{
			 firstName: '',
			 lastName : '',
			 username: '',
			 imageSrc: ''
			}
		};
	}

	toggle() {
		this.setState(prevState => ({
			dropdownOpen: !prevState.dropdownOpen
		}));
	}
  
    async componentDidMount(){
		try{
				const user = auth.getProfile();	
		if(user){
			const {data:currentUser} = await getUser(user._id);
			this.setState({ currentUser: this.mapToViewModel(currentUser) });
		}
		}catch(ex){
			console.log(ex);
		}
	
	
	}
	

	mapToViewModel(user) {
		return {
		  _id: user._id,
		  username: user.username,
		  password: user.password,
		  profile: user.profile,
		  email: user.email,
		  firstName: user.contactName.first,
		  lastName: user.contactName.last,
		  initials: user.contactName.initials,
		  country: user.country,
		  gender: user.gender,
		  prefix: user.prefix,
		  imageSrc: user.imageSrc
		};
	  }

		
	render() {
	const { currentUser} = this.state;
		return (
			<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} className="dropdown navbar-user" tag="li">
				<DropdownToggle tag="a">
					<img src={currentUser.imageSrc} alt="" /> 
					<span className="d-none d-md-inline">{currentUser.firstName} {currentUser.lastName}</span> <b className="caret"></b>
				</DropdownToggle>
				<DropdownMenu className="dropdown-menu dropdown-menu-right" tag="ul">
					<DropdownItem><Link to="/user/profile">Edit Profile</Link></DropdownItem>
					<DropdownItem><span className="badge badge-danger pull-right">2</span> Inbox</DropdownItem>
					<DropdownItem><Link to="/calendar">Calendar</Link></DropdownItem>
					<DropdownItem><Link to="/settings">Setting</Link></DropdownItem>
					<div className="dropdown-divider"></div>
					<DropdownItem><Link to="/logout">Log Out</Link></DropdownItem>
				</DropdownMenu>
			</Dropdown>
		);
	}
};

export default DropdownProfile;