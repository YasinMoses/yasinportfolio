import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
import {
    Panel,
    PanelHeader,
    PanelBody,
  } from "../../components/panel/panel.jsx";



// import { apiUrl } from "../../config/config.json";
import http from "../../services/httpService";
import VerticalTabNavs from './verticalNavTabs';
import Tab from './Tab';

const apiUrl = process.env.REACT_APP_API_URL;
class PermissionTab extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
		dropdownOpen: false,
        readOnly: true,
        activeTab: 1,
        read: true,
        profiles : [], 
      
		};
	
  this.toggleTab = this.toggleTab.bind(this);
	}
	





  
	
    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab,
          });
        }
      }



    async getProfiles() {
		const { data: profiles } = await http.get(apiUrl + "/profiles");
        this.setState({ profiles: profiles.map((e)=>({label: e.profileName, id: e._id, background:"#CCC"})) 
    });
	}



    async componentDidMount(){
        await this.getProfiles();
       
    }

 

  
	render() {
		return (
            <Fragment>

          <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/ui">UI Elements</Link>
          </li>
          <li className="breadcrumb-item active">Tabs & Accordions</li>
        </ol>
        <h1 className="page-header">
         Right & Permissions
        </h1>
        {console.log("Active Tab", this.state.activeTab)}
        <div className="row">
          <div className="col-xl-12">
            <Panel>
              <PanelHeader noButton>Permissions</PanelHeader>
              <div
                className="rounded"
                style={{ border: "0.8px solid grey", overflow: "hidden" }}
              >
                <PanelBody>
                  <div className="row">
                    <div className="col-4">
            <VerticalTabNavs
                toggleTab={this.toggleTab}
                activeTab={this.state.activeTab}
                navprops={this.state.profiles}
            />
                    </div>
                    <div
                      className="col-8  bg-white pb-2 rounded"
                      style={{ marginLeft: "-4em" }}
                    >



            <Tab
                activeTab={this.state.activeTab}
                navprops={this.state.profiles}
            /> 
                    
              
                    </div>
                  </div>
                </PanelBody>
              </div>
            </Panel>
          </div>
        </div>
      </div>
        </Fragment>
		)
	}
}
export default PermissionTab;