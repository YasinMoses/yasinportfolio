import React from 'react';
import { Link } from 'react-router-dom';
import { PageSettings } from './../../config/page-settings.js';
import auth from "../../services/authservice";
import { getUser } from "../../services/users.js";

class SidebarProfile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			profileActive: 0,
			currentUser: {
				firstName: "",
				lastName: "",
				about: "",
				imageSrc: ''
			  },
		};
		this.handleProfileExpand = this.handleProfileExpand.bind(this);
	}

	//handleProfileExpand(e) {
		//e.preventDefault();
		
		//var targetSidebar = document.querySelector('.app-sidebar:not(.app-sidebar-end)');
		//var targetMenu = e.target.closest('.menu-profile');
		//var targetProfile = document.querySelector('#appSidebarProfileMenu');
		//var expandTime = (targetSidebar && targetSidebar.getAttribute('data-disable-slide-animation')) ? 0 : 250;
	
		//if (targetProfile) {
			//if (targetProfile.style.display === 'block') {
				//targetMenu.classList.remove('active');
			//} else {
				//targetMenu.classList.add('active');
			//}
			//slideToggle(targetProfile, expandTime);
			//targetProfile.classList.toggle('expand');
		//}
	//}

		handleProfileExpand(e) {
		e.preventDefault();
		this.setState(state => ({
			profileActive: !this.state.profileActive,
		}));
	}

	async componentDidMount() {
		try {
		  const user = auth.getProfile();
		  if (user) {
			const { data: currentUser } = await getUser(user._id);
			this.setState({ currentUser: this.mapToViewModel(currentUser) });
		  }
		} catch (ex) {
		  console.log(ex);
		}
	  }
	  mapToViewModel(user) {
		return {
		  _id: user._id,
		  //   username: user.username,
		  //   password: user.password,
		  //   profile: user.profile,
		  //   email: user.email,
		  firstName: user.contactName.first,
		  lastName: user.contactName.last,
		  about: user.about,
		  imageSrc: user.imageSrc,
		  mood:user.mood,
		  //   initials: user.contactName.initials,
		  //   country: user.country,
		  //   gender: user.gender,
		  //   prefix: user.prefix,
		};
	  }
  
	render() {
		const { currentUser } = this.state;
		return (
		<PageSettings.Consumer>
				{({pageSidebarMinify}) => (
					<div className="menu">
						<div className="menu-profile">
							<Link to="/" onClick={this.handleProfileExpand} className="menu-profile-link">
								<div className="menu-profile-cover with-shadow"></div>
								<div className="menu-profile-image">
								<img src={currentUser.imageSrc} alt="" />
								</div>
								<div className="menu-profile-info">
									<div className="d-flex align-items-center">
										<div className="flex-grow-1">
										{currentUser.firstName} {currentUser.lastName}
										</div>
										<div className="menu-caret ms-auto"></div>
									</div>
									<small>{currentUser.mood}</small>
								</div>
							</Link>
						</div>
						
					<li>
							<ul className={"nav nav-profile " + (this.state.profileActive && !pageSidebarMinify ? "d-block " : "")}>
								<li><Link to="/"><i className="fa fa-cog"></i> Settings</Link></li>
								<li><Link to="/"><i className="fa fa-pencil-alt"></i> Send Feedback</Link></li>
								<li><Link to="/"><i className="fa fa-question-circle"></i> Helps</Link></li>
							</ul>
						</li>
						</div>
				)}
			</PageSettings.Consumer>
		)
	}
}

export default SidebarProfile;
