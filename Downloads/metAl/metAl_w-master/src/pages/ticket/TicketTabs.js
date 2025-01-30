import React from "react";
import { Link } from "react-router-dom";
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from "reactstrap";
import classnames from "classnames";
import BasicInfo from "./BasicInfoFields/BasicInfo";
import {
  Panel,
  PanelHeader,
  PanelBody,
} from "./../../components/panel/panel.jsx";
// import Actions from "./BasicInfoFields/Action";

//import { Collapse, CardHeader, CardBody, Card } from 'reactstrap';
//import Actions from "./../../../src/components/ticket/Action";
//import Card from "./../../../src/components/ticket/Card";
//import Filter from "./../../../src/components/ticket/Filters";
//import Category from "./../../../src/components/ticket/Category";
//import "./../../../src/components/kanban/style.css";

class TicketTabs extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: "1",
      dropdownOpen: false,
      readOnly: true,
    };
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.toggle = this.toggle.bind(this);
    this.setReadOnly = this.setReadOnly.bind(this);
  }
  toggleCollapse() {
    console.log("lll");
  }

  toggle = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  setReadOnly = () => this.setState({ readOnly: !this.state.readOnly });

  render() {
    return (
      <div>
        <ol className="breadcrumb float-xl-right">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/tickets">Tickets</Link>
          </li>
        </ol>
        <h1 className="page-header">Ticket-profile</h1>
        <div className="row">
          <div className="col-xl-10">
            <Panel>
              <PanelHeader noButton>Tickets</PanelHeader>
              <PanelBody>
                <h1>Ticket name</h1>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#b6c2c9",
                  }}
                >
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        style={{
                          background: `${
                            this.state.activeTab === "1" ? "#ffffff" : "#FFC69F"
                          }`,
                          borderTop: `${
                            this.state.activeTab === "1"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          borderLeft: `${
                            this.state.activeTab === "1"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          borderRight: `${
                            this.state.activeTab === "1"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          cursor: "default",
                        }}
                        className={classnames({
                          active: this.state.activeTab === "1",
                        })}
                        onClick={() => {
                          this.toggleTab("1");
                        }}
                      >
                        <span className="d-sm-none">Basic information</span>
                        <span className="d-sm-block d-none">
                          Basic information
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{
                          background: `${
                            this.state.activeTab === "2" ? "#ffffff" : "#DED99F"
                          }`,
                          borderTop: `${
                            this.state.activeTab === "2"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          borderLeft: `${
                            this.state.activeTab === "2"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          borderRight: `${
                            this.state.activeTab === "2"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          cursor: "default",
                        }}
                        className={classnames({
                          active: this.state.activeTab === "2",
                        })}
                        onClick={() => {
                          this.toggleTab("2");
                        }}
                      >
                        <span className="d-sm-none">Data Spreadsheet</span>
                        <span className="d-sm-block d-none">
                          Data Spreadsheet
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{
                          background: `${
                            this.state.activeTab === "3" ? "#ffffff" : "#FFC6FF"
                          }`,
                          borderTop: `${
                            this.state.activeTab === "3"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          borderLeft: `${
                            this.state.activeTab === "3"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          borderRight: `${
                            this.state.activeTab === "3"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          cursor: "default",
                        }}
                        className={classnames({
                          active: this.state.activeTab === "3",
                        })}
                        onClick={() => {
                          this.toggleTab("3");
                        }}
                      >
                        <span className="d-sm-none">Comments</span>
                        <span className="d-sm-block d-none">Comments</span>
                      </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink
                        style={{
                          background: `${
                            this.state.activeTab === "4" ? "#ffffff" : "#FFF5AD"
                          }`,
                          borderTop: `${
                            this.state.activeTab === "4"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          borderLeft: `${
                            this.state.activeTab === "4"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          borderRight: `${
                            this.state.activeTab === "4"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          cursor: "default",
                        }}
                        className={classnames({
                          active: this.state.activeTab === "4",
                        })}
                        onClick={() => {
                          this.toggleTab("4");
                        }}
                      >
                        <span className="d-sm-none">Reviews</span>
                        <span className="d-sm-block d-none">Reviews</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{
                          background: `${
                            this.state.activeTab === "5" ? "#ffffff" : "#A2F5AD"
                          }`,
                          borderTop: `${
                            this.state.activeTab === "5"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          borderLeft: `${
                            this.state.activeTab === "5"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          borderRight: `${
                            this.state.activeTab === "5"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          cursor: "default",
                        }}
                        className={classnames({
                          active: this.state.activeTab === "5",
                        })}
                        onClick={() => {
                          this.toggleTab("5");
                        }}
                      >
                        <span className="d-sm-none">Sharing</span>
                        <span className="d-sm-block d-none">Sharing</span>
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{
                          background: `${
                            this.state.activeTab === "6" ? "#ffffff" : "#FFFFC9"
                          }`,
                          borderTop: `${
                            this.state.activeTab === "6"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          borderLeft: `${
                            this.state.activeTab === "6"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          borderRight: `${
                            this.state.activeTab === "6"
                              ? "1px solid #b6c2c9"
                              : "none"
                          }`,
                          cursor: "default",
                        }}
                        className={classnames({
                          active: this.state.activeTab === "6",
                        })}
                        onClick={() => {
                          this.toggleTab("6");
                        }}
                      >
                        <span className="d-sm-none">Notes</span>
                        <span className="d-sm-block d-none">Notes</span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                  <div>
                    <div className="btn-group mx-2">
                      <ButtonDropdown
                        isOpen={this.state.dropdownOpen}
                        toggle={this.toggle}
                      >
                        <DropdownToggle color="default" caret>
                          Actions
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem>
                            <i className="fa fa-save"></i> Save as PDF
                          </DropdownItem>
                          <DropdownItem onClick={() => this.setReadOnly()}>
                            <i className="fas fa-edit"></i>
                            Edit
                          </DropdownItem>
                          <DropdownItem>
                            <i className="fas fa-print"></i> Print
                          </DropdownItem>
                          <DropdownItem>
                            <i className="fas fa-archive"></i> Archive
                          </DropdownItem>
                          <DropdownItem>
                            <i className="ion-md-share"></i> Share{" "}
                          </DropdownItem>
                        </DropdownMenu>
                      </ButtonDropdown>
                    </div>
                  </div>
                </div>

                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <BasicInfo
                      readOnly={this.state.readOnly}
                      setReadOnly={() => this.setReadOnly()}
                    />
                  </TabPane>
                  <TabPane tabId="2">
                    <h4>Data input in spreadsheet</h4>
                    <p>
                      Nullam ac sapien justo. Nam augue mauris, malesuada non
                      magna sed, feugiat blandit ligula. In tristique tincidunt
                      purus id iaculis. Pellentesque volutpat tortor a mauris
                      convallis, sit amet scelerisque lectus adipiscing.
                    </p>
                  </TabPane>
                  <TabPane tabId="3">
                    <h4>Comments</h4>
                    <p>
                      Nullam ac sapien justo. Nam augue mauris, malesuada non
                      magna sed, feugiat blandit ligula. In tristique tincidunt
                      purus id iaculis. Pellentesque volutpat tortor a mauris
                      convallis, sit amet scelerisque lectus adipiscing.
                    </p>
                  </TabPane>

                  <TabPane tabId="4">
                    <h4>Reviews</h4>
                    <p>
                      Nullam ac sapien justo. Nam augue mauris, malesuada non
                      magna sed, feugiat blandit ligula. In tristique tincidunt
                      purus id iaculis. Pellentesque volutpat tortor a mauris
                      convallis, sit amet scelerisque lectus adipiscing.
                    </p>
                  </TabPane>
                  <TabPane tabId="5">
                    <h4>Sharing</h4>
                    <p>
                      Nullam ac sapien justo. Nam augue mauris, malesuada non
                      magna sed, feugiat blandit ligula. In tristique tincidunt
                      purus id iaculis. Pellentesque volutpat tortor a mauris
                      convallis, sit amet scelerisque lectus adipiscing.
                    </p>
                  </TabPane>
                  <TabPane tabId="6">
                    <h4>Notes</h4>
                    <p>
                      Nullam ac sapien justo. Nam augue mauris, malesuada non
                      magna sed, feugiat blandit ligula. In tristique tincidunt
                      purus id iaculis. Pellentesque volutpat tortor a mauris
                      convallis, sit amet scelerisque lectus adipiscing.
                    </p>
                  </TabPane>
                </TabContent>
              </PanelBody>
            </Panel>
          </div>
        </div>
      </div>
    );
  }
}

export default TicketTabs;
