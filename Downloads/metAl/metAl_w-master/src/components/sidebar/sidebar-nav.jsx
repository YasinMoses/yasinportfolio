import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
// import { apiUrl } from "../../config/config.json";
import auth from "../../services/authservice";
import http from "../../services/httpService";
import { PageSettings } from "./../../config/page-settings.js";
import { loadCurrentUser } from "./../../store/users";
import menuSadmin from "./menu.jsx";
import menuAccountant from "./menuAccountant.jsx";
//import menuTCMClinic from "./menuTCMClinic.jsx";
//import menuHomeoClinic from "./menuHomeoClinic.jsx";
import menuSupervisor from "./menuSupervisor.jsx";
import menuReception from "./menuReception.jsx";
//import menuEROTL  from "./menuEROTL.jsx";
import menuCompany  from "./menuCompany.jsx";
import menuERO from "./menuERO.jsx";
import menuCustomerService from "./menuCustomerService.jsx";


import SidebarNavList from "./sidebar-nav-list.jsx";
const apiUrl = process.env.REACT_APP_API_URL;


class SidebarNav extends React.Component {
  static contextType = PageSettings;

  constructor(props) {
    super(props);
    this.state = {
      active: -1,
      clicked: -1,
      currentUser: {},
      loading: true,
      //menus: menus,
      menus:[],
      //kanbansData: [],
      //allkanbans: [],
      //kanbans: [],
      permissions: [],
      maps: [],
    };

    this.handleSidebarSearch = this.handleSidebarSearch.bind(this);
  }

  async getMaps() {
    const { data } = await http.get(apiUrl + "/maps");
    this.setState({
      maps: [
        {
          path: "/maps",
          title: "Maps",
          children: data.map((map) => ({
            path: `/ero/mapviews/${map._id}`,
            title: map.name,
          })),
        },
      ],
    });
    this.state.menus.map((item) => {
      if (item.path === "/ERO") item.children.unshift(this.state.maps[0]);
    });
  }

  async getRoles() {
    //const { data: profiles } = await http.get(apiUrl + "/profiles");
    const { data } = await http.get(apiUrl + "/userroles");
    this.setState({
      permissions: [
        {
          path: "/user/permissions",
          title: "UserRoles Permissions",
          children: data.map((role) => ({
            path: `/user/permissions/${role._id}`,
            title: role.name,
          })),
        },
      ],
    });
    this.state.menus.map((item) => {
      if (item.path === "/Users")
        item.children.splice(0, 0, this.state.permissions[0]);
    });
  }

  async componentDidMount() {
    const user = auth.getProfile();
    if (user) {
      await this.props.loadCurrentUser(user._id);
      await this.getRoles();
      this.setState({ currentUser: this.props.currentUser });
      if(this.props.currentUser.role?.name === "Company") this.setState({ menus: menuCompany });
      if(this.props.currentUser.role?.name === "ERO") this.setState({ menus: menuERO });
    //if(this.props.currentUser.role?.name === "EROTL") this.setState({ menus: menuEROTL });
      if(this.props.currentUser.role?.name === "Clinic") this.setState({ menus: menuSadmin });
      if(this.props.currentUser.role?.name === "Accountant") this.setState({ menus: menuAccountant });		
      if(this.props.currentUser.role?.name === "Reception") this.setState({ menus: menuReception });			
      //if(this.state.currentUser.role?.name === "menu") this.setState({ menus: menuSadmin });				
      if(this.props.currentUser.role?.name === "CustomerService") this.setState({ menus: menuCustomerService });					
      if(this.props.currentUser.role?.name === "Supervisor") this.setState({ menus: menuSupervisor });		
       await this.getMaps();
      this.setState({ loading: false });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.someProp !== this.props.someProp) {
      this.setState({ someState: nextProps.someProp });
    }
  }

  handleExpand(e, i, match) {
    e.preventDefault();

    if (this.state.clicked === -1 && match) {
      this.setState((state) => ({
        active: -1,
        clicked: 1,
      }));
    } else {
      this.setState((state) => ({
        active: this.state.active === i ? -1 : i,
        clicked: 1,
      }));
    }
  }

  handleSidebarSearch(e) {
    let searchValue = e.target.value;
    searchValue = searchValue.toLowerCase();

    this.setState((state) => {
      let newMenus = [];
      if (searchValue !== "") {
        newMenus = this.state.menus.filter((item) => {
          let title = item.title;
          title = title.toLowerCase();
          if (title.search(searchValue) > -1) {
            item.search = true;
            return true;
          } else {
            if (item.children) {
              for (var i = 0; i < item.children.length; i++) {
                let title2 = item.children[i]["title"];
                title2 = title2.toLowerCase();

                if (title2.search(searchValue) > -1) {
                  item.search = true;
                  return true;
                }
              }
            }
            return false;
          }
        });
      } else {
        newMenus = this.state.menus.filter((item) => {
          item.search = false;
          return true;
        });
      }
      return {
        menus: newMenus,
      };
    });
  }

  // function to validate should side bar item show or not START
  shouldAccessSideNavItem(item) {
    if (!this.state.loading) {
      if (item === "Dashboard") {
        return true;
      } else {
        for (
          let i = 0;
          //i < this.state.currentUser?.profile?.profileAccess?.length;
          i < this.state.currentUser?.role?.Permissions?.Permissions?.length;
          i++
        ) {
          //let module = this.state.currentUser.profile.profileAccess[i].module;
          let module = this.state.currentUser?.role?.Permissions?.Permissions[i]?.module?.name;
          if (item === module) {
            let access = this.state.currentUser?.role?.Permissions?.Permissions[i];
            return access.read;
          }
        }
        return true;
      }
    }
  }
  // function to validate should side bar item show or not END




  render() {
    return (
      <ul className="nav">
        {this.context.pageSidebarSearch && (
          <li className="nav-search">
            <input
              type="text"
              className="form-control"
              placeholder="Sidebar menu filter..."
              onKeyUp={this.handleSidebarSearch}
            />
          </li>
        )}
        <li className="nav-header">Navigation</li>
       
        {this.state.menus.map((menu, i) => (
          <Fragment key={i}>
              <Route
                path={menu.path}
                exact={menu.exact}
                key={i}
                children={({ match }) => (
                  <SidebarNavList
                    data={menu}
                    key={i}
                    expand={(e) => this.handleExpand(e, i, match)}
                    active={i === this.state.active}
                    clicked={this.state.clicked}
                  />
                )}
              />
          </Fragment>
        ))}
      </ul>
    );
  }
}

//export default Profile;
const mapStateToProps = (state) => ({
  currentUser: state.entities.users.currentUser,
});
const mapDispatchToProps = (dispatch) => ({
  loadCurrentUser: (id) => dispatch(loadCurrentUser(id)),
});
export default connect(mapStateToProps, mapDispatchToProps)(SidebarNav);
