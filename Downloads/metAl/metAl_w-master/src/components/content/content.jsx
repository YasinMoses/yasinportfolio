import React from "react";
import { Redirect, Route, Switch, withRouter } from "react-router-dom";
//import routes from './../../config/page-route.jsx';
import { PageSettings } from "./../../config/page-settings.js";
//import { Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./../../common/ProtectedRoute";
////////////////////////////////////////////////////////////////////
import Drive from "./../../pages/drive/yourdrive.js";
import Profile from "./../../pages/user/profile/profile.js";
//import LoginV1 from './../../pages/user/login-v1.js';
import LoginV2 from "../../pages/user/login.js";
import User from "./../../pages/user/user.js";
import UserTable from "./../../pages/user/users.js";
import Supervisor from "./../../pages/user/supervisor.js";
import SupervisorTable from "./../../pages/user/supervisors.js";
//import Accountant from "./../../pages/user/accountant.js";
//import AccountantTable from "./../../pages/user/accountants.js";
//import Reception from "./../../pages/user/reception.js";
//import ReceptionTable from "./../../pages/user/receptions.js";
//import Calendar from "./../../pages/ero/calendar/calendar.js";
import RegisterV3 from "./../../pages/register.js";
//import AdminShift from "./../../pages/user/adminshift.js";
//import AdminShiftsTable from "./../../pages/user/adminshifts.js";
//import Leave from "./../../pages/user/leave.js";
//import LeaveTable from "./../../pages/user/leaves.js";
//import Shift from "./../../pages/user/shift.js";
//import ShiftTable from "./../../pages/user/shifts.js";
//import Skill from "./../../pages/user/skill.js";
//import SkillTable from "./../../pages/user/skills.js";

//import AdminCertificate from "./../../pages/planning/admincertificate.js";
//import AdminCertificateTable from "./../../pages/planning/admincertificates.js";
//import AdminSkill from "./../../pages/planning/adminskill.js";
//import AdminSkillTable from "./../../pages/planning/adminskills.js";
//import LeaveReason from "./../../pages/planning/leavereason.js";
//import LeaveReasonTable from "./../../pages/planning/leavereasons.js";
//import Review from "./../../pages/review/review.js";

import Logout from "./../../common/logout";

import PermissionTab from "./../../pages/user/permissions.js";
import UserRole from "./../../pages/user/userrole.js";
//import AgendaView from "../../pages/calendar/AgendaView";
import FileView from "../../pages/drive/FileViewer/fileviewer";
import UserRoleTableData from "./../../pages/user/userroles";
//import UserRole from "./../../pages/user/userrole";
//for now not needed
import Userrole from "../../pages/user/userrole_new";
import ModulePermission from "../../pages/user/modulepermission";
import ModulePermissionTable from "../../pages/user/modulepermissions";
import DashboardV2 from "./../../pages/dashboard/dashboardV2.js";

//AIML
//import AIMLTask from "./../../pages/AIML/AIMLTaskProfile/AIMLtask.jsx";
import AIMLTask from "./../../pages/AIML/AIMLtask.js";
import AIMLTaskTableHarsha from "./../../pages/AIML/AIMLtasksHarsha.js";
import AIMLTaskProfile from "./../../pages/AIML/AIMLTaskProfile/aimltaskprofile.jsx";


import AIserviceproviderlists from "./../../pages/AIML/AIserviceproviderlists.js";
import AIserviceproviderlist from "./../../pages/AIML/AIserviceproviderlist.js";

import AIserviceproviders from "./../../pages/AIML/AIserviceproviders.js";
import AIserviceprovider from "./../../pages/AIML/AIserviceprovider.js";

import industriesTable from "./../../pages/martial/industries.js";
import industry from "./../../pages/martial/industry.js";

import beltsTable from "../../pages/martial/belts.js";
import belt from "../../pages/martial/belt.js";

import AIssistant from "../../pages/AIML/AIssistant.js";
import AIssistantTable from "../../pages/AIML/AIssistants.js";
import IncidentsTableData from "../../pages/calendar/events.js"

//import DashboardV3 from './../../pages/dashboard/dashboard-v3.js';
import Contacts from "../../pages/contacts/Contacts.js";
import Bootstrap4 from "./../../pages/bootstrap/bootstrap-4.js";
import EmailCompose from "./../../pages/email/email-compose.js";
import EmailDetail from "./../../pages/email/email-detail.js";
import EmailInbox from "./../../pages/email/email-inbox.js";
import FormElements from "./../../pages/form/form-elements.js";
import FormPlugins from "./../../pages/form/form-plugins";
import FormWizards from "./../../pages/form/form-wizards.js";
//import TableBasic from "./../../pages/table/table-basic.js";
import UIButtons from "./../../pages/ui/ui-buttons.js";
import UIGeneral from "./../../pages/ui/ui-general.js";
import UIIcons from "./../../pages/ui/ui-icons.js";
import UIIonicons from "./../../pages/ui/ui-ionicons.js";
import UILanguageBarIcon from "./../../pages/ui/ui-language-bar-icon.js";
import UIMediaObject from "./../../pages/ui/ui-media-object.js";
import UIModalNotification from "./../../pages/ui/ui-modal-notification.js";
import UISimpleLineIcons from "./../../pages/ui/ui-simple-line-icons.js";
import UISocialButtons from "./../../pages/ui/ui-social-buttons.js";
import UITabsAccordion from "./../../pages/ui/ui-tabs-accordion.js";
import UITypography from "./../../pages/ui/ui-typography.js";
import UIWidgetBoxes from "./../../pages/ui/ui-widget-boxes.js";
import Widgets from "./../../pages/widget/widget.js";
//import ChartJS from "./../../pages/chart/chart-js.js";
import ChartApex from "./../../pages/chart/chart-apex.js";
import ChartD3 from "./../../pages/chart/chart-d3.js";
//import Map from "./../../pages/ero/map.js";
//import MapView from "./../../pages/ero/mapview.js";
import ExtraError from "./../../pages/extra-error.js";
import Gallery from "./../../pages/gallery/gallery.js";
import PageBoxedLayoutWithMixedMenu from "./../../pages/option/page-boxed-layout-with-mixed-menu.js";
import PageFullHeight from "./../../pages/option/page-full-height.js";
import PageWithBoxedLayout from "./../../pages/option/page-with-boxed-layout.js";
import PageWithFooter from "./../../pages/option/page-with-footer.js";
import PageWithLightSidebar from "./../../pages/option/page-with-light-sidebar.js";
import PageWithMegaMenu from "./../../pages/option/page-with-mega-menu.js";
import PageWithMinifiedSidebar from "./../../pages/option/page-with-minified-sidebar.js";
import PageWithMixedMenu from "./../../pages/option/page-with-mixed-menu.js";
import PageWithRightSidebar from "./../../pages/option/page-with-right-sidebar.js";
import PageWithSearchSidebar from "./../../pages/option/page-with-search-sidebar.js";
import PageWithTopMenu from "./../../pages/option/page-with-top-menu.js";
import PageWithTransparentSidebar from "./../../pages/option/page-with-transparent-sidebar.js";
import PageWithTwoSidebar from "./../../pages/option/page-with-two-sidebar.js";
import PageWithWideSidebar from "./../../pages/option/page-with-wide-sidebar.js";
import PageWithoutSidebar from "./../../pages/option/page-without-sidebar.js";

import school from "../../pages/martial/school.js";
import schoolsTable from "../../pages/martial/schools.js";
import federation from "../../pages/martial/federation.js";
import federationsTable from "../../pages/martial/federations.js";
import athlete from "../../pages/martial/athlete.js";
//import athletesTable from "../../pages/martial/athletes.js";
import coach from "../../pages/martial/coach.js";
//import coachsTable from "../../pages/martial/coachs.js";
import examinator from "../../pages/martial/examinator.js";
import examinatorsTable from "../../pages/martial/examinators.js";
import referee from "../../pages/martial/referee.js";
import refereesTable from "../../pages/martial/referees.js";

function setTitle(path, routeArray) {
  var pageTitle;
  for (var i = 0; i < routeArray.length; i++) {
    if (routeArray[i].path === path) {
      pageTitle = "TCMFiles | " + routeArray[i].title;
    }
  }
  document.title = pageTitle ? pageTitle : "TCMFiles | Users";
}

//const store = configureStore();

class Content extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    //set page title dinamically
    //setTitle(this.props.history.location.pathname, routes);
    /*     try{
    const user = auth.getProfile();
    //if(user){
       const {data:currentUser} = await getUser(user._id);
       this.setState({ user: this.mapToViewModel(currentUser) });
    //}
    }catch(ex){
      console.log(ex);
    } */
  }

  // componentWillMount() {
  //   //set page title dinamically
  //   this.props.history.listen(() => {
  // 		//setTitle(this.props.history.location.pathname, routes);
  //   });
  // }

  render() {
    const { user } = this.state;
    return (
      <PageSettings.Consumer>
        {({
          pageContentFullWidth,
          pageContentClass,
          pageContentInverseMode,
        }) => (
          <div
            className={
              "content " +
              (pageContentFullWidth ? "content-full-width " : "") +
              (pageContentInverseMode ? "content-inverse-mode " : "") +
              pageContentClass
            }
          >
            <React.Fragment>
              <ToastContainer />

              <Switch>
                <ProtectedRoute
                  path="/dashboard/"
                  title="Clinic Dashboard"
                  component={DashboardV2}
                />
                {/* <ProtectedRoute path="/Appointment/Request" title="Request For Appointment" component={ReqAppointment} />

								<ProtectedRoute path="/Edit/:id" title="RequestAppointmentEdit" component={RequestAppointmentEdit} /> */}
                <Route path="/" exact>
                  <Redirect to="/dashboard/" />
                </Route>

                <Route
                  path="/login"
                  title="Login"
                  render={(props) => {
                    if (this.state.user) return <Redirect to="/dashboard" />;
                    return <LoginV2 {...props} />;
                  }}
                />
                <Route path="/logout" title="Logout" component={Logout} />
                <Route
                  path="/register"
                  title="Register"
                  component={RegisterV3}
                />
                <ProtectedRoute
                  path="/user/users/:id"
                  title="User"
                  component={User}
                />
                <ProtectedRoute
                  path="/user/users"
                  title="Users"
                  component={UserTable}
                />

                <ProtectedRoute
                  path="/calendar/events"
                  title="Events"
                  component={IncidentsTableData}
                />
		      {/*
                <ProtectedRoute
                  path="/user/accountants/:id"
                  title="Accountant"
                  component={Accountant}
                />
                <ProtectedRoute
                  path="/user/accountants"
                  title="Accountants"
                  component={AccountantTable}
                />

                <ProtectedRoute
                  path="/user/receptions/:id"
                  title="Receptions"
                  component={Reception}
                />
                <ProtectedRoute
                  path="/user/receptions"
                  title="Receptions"
                  component={ReceptionTable}
                />   /*}

                <ProtectedRoute
                  path="/user/supervisors/:id"
                  title="Supervisors"
                  component={Supervisor}
                />
                <ProtectedRoute
                  path="/user/supervisors"
                  title="Supervisors"
                  component={SupervisorTable}
                />
                {/* 								
								<ProtectedRoute path="/user/certificates/:id" title="Skill" component={Certificate} />
<ProtectedRoute path="/user/certificates" title="Skills" component={CertificateTable} /> */}
                {/* 	
                <ProtectedRoute
                  path="/user/skills/:id"
                  title="Skill"
                  component={Skill}
                />
                <ProtectedRoute
                  path="/user/skills"
                  title="Skills"
                  component={SkillTable}
                />
             

                <ProtectedRoute
                  path="/user/shifts/:id"
                  title="Shift"
                  component={Shift}
                />

                <ProtectedRoute
                  path="/user/adminshifts/:id"
                  title="AdminShift"
                  component={Shift}
                />

                <ProtectedRoute
                  path="/user/adminshifts"
                  title="AdminShifts"
                  component={AdminShiftsTable}
                />
                <ProtectedRoute
                  path="/user/shifts"
                  title="Shifts"
                  component={ShiftTable}
                />
                <ProtectedRoute
                  path="/user/leaves/:id"
                  title="Leave"
                  component={Leave}
                />
                <ProtectedRoute
                  path="/user/leaves"
                  title="Leaves"
                  component={LeaveTable}
                />
                */}
                {/* <ProtectedRoute path="/planning/leaves" title="AdminSkills" component={AdminSkillsTable} />								 */}
                <Route
                  path="/drive/yourdrive/"
                  title="Your Drive"
                  component={Drive}
                />
                <Route
                  path="/drive/fileviewer"
                  title="file viewer"
                  component={FileView}
                />
                {/*
                <ProtectedRoute
                  path="/planning/adminskills/:id"
                  title="AdminSkill"
                  component={AdminSkill}
                />
                <ProtectedRoute
                  path="/planning/adminskills"
                  title="AdminSkillTable"
                  component={AdminSkillTable}
                />
              <ProtectedRoute
                  path="/planning/admincertificates/:id"
                  title="AdminCertificate"
                  component={AdminCertificate_new}
                />
                <ProtectedRoute
                  path="/planning/admincertificates"
                  title="AdminCertificateTable"
                  component={AdminCertificateTable}
                />
                <ProtectedRoute
                  path="/planning/leavereasons/:id"
                  title="leaveReason"
                  component={LeaveReason}
                />
                <ProtectedRoute
                  path="/planning/leavereasons"
                  title="LeaveReasonTable"
                  component={LeaveReasonTable}
                />
 */}
                <Route
                  path="/email/inbox"
                  title="Email Inbox"
                  component={EmailInbox}
                />
                <Route
                  path="/email/compose"
                  title="Email Compose"
                  component={EmailCompose}
                />
                <Route
                  path="/email/detail"
                  title="Email Detail"
                  component={EmailDetail}
                />
                <Route path="/widgets" title="Widgets" component={Widgets} />
                <Route
                  path="/ui/general"
                  title="UI General"
                  component={UIGeneral}
                />
                <Route
                  path="/ui/typography"
                  title="UI Typography"
                  component={UITypography}
                />
                <Route
                  path="/ui/tabs-accordion"
                  title="UI Tabs Accordion"
                  component={UITabsAccordion}
                />
                <Route
                  path="/ui/modal-notification"
                  title="UI Modal Notification"
                  component={UIModalNotification}
                />
                <Route
                  path="/ui/widget-boxes"
                  title="UI Widget Boxes"
                  component={UIWidgetBoxes}
                />
                <Route
                  path="/ui/media-object"
                  title="UI Media Object"
                  component={UIMediaObject}
                />
                <Route
                  path="/ui/buttons"
                  title="UI Buttons"
                  component={UIButtons}
                />
                <Route path="/ui/icons" title="UIIcons" component={UIIcons} />
                <Route
                  path="/ui/simple-line-icons"
                  title="UISimpleLineIcons"
                  component={UISimpleLineIcons}
                />
                <Route
                  path="/ui/ionicons"
                  title="UIIonicons"
                  component={UIIonicons}
                />
                <Route
                  path="/ui/language-bar-icon"
                  title="UILanguageBarIcon"
                  component={UILanguageBarIcon}
                />
                <Route
                  path="/ui/social-buttons"
                  title="UISocialButtons"
                  component={UISocialButtons}
                />
                <Route
                  path="/bootstrap-4"
                  title="Bootstrap4"
                  component={Bootstrap4}
                />
                <Route
                  path="/form/elements"
                  title="FormElements"
                  component={FormElements}
                />
                <Route
                  path="/form/wizards"
                  title="FormWizards"
                  component={FormWizards}
                />
                <Route
                  path="/form/form"
                  title="FormPlugins"
                  component={FormPlugins}
                />

                {/* <Route path="/table/data" title="Table" component={Table} /> */}
                {/* <Route path="/pos/customer-order" title="PosCustomerOrder" component={PosCustomerOrder} />
								<Route path="/pos/kitchen-order" title="PosKitchenOrder" component={PosKitchenOrder} />
								<Route path="/pos/counter-checkout" title="PosCounterCheckout" component={PosCounterCheckout} />
								<Route path="/pos/table-booking" title="PosTableBooking" component={PosTableBooking} />
								<Route path="/pos/menu-stock" title="PosMenuStock" component={PosMenuStock} /> */}
                {/* <Route path="/chart/js" title="ChartJS" component={ChartJS} /> */}
                <Route path="/chart/d3" title="ChartD3" component={ChartD3} />
                <Route
                  path="/chart/apex"
                  title="ChartApex"
                  component={ChartApex}
                />

                <Route path="/gallery" title="Gallery" component={Gallery} />
                <Route
                  path="/page-option/with-footer"
                  title="PageWithFooter"
                  component={PageWithFooter}
                />
                <Route
                  path="/page-option/without-sidebar"
                  title="PageWithoutSidebar"
                  component={PageWithoutSidebar}
                />
                <Route
                  path="/page-option/with-right-sidebar"
                  title="PageWithRightSidebar"
                  component={PageWithRightSidebar}
                />
                <Route
                  path="/page-option/with-minified-sidebar"
                  title="PageWithMinifiedSidebar"
                  component={PageWithMinifiedSidebar}
                />
                <Route
                  path="/page-option/with-two-sidebar"
                  title="PageWithTwoSidebar"
                  component={PageWithTwoSidebar}
                />
                <Route
                  path="/page-option/full-height"
                  title="PageFullHeight"
                  component={PageFullHeight}
                />
                <Route
                  path="/page-option/with-wide-sidebar"
                  title="PageWithWideSidebar"
                  component={PageWithWideSidebar}
                />
                <Route
                  path="/page-option/with-light-sidebar"
                  title="PageWithLightSidebar"
                  component={PageWithLightSidebar}
                />
                <Route
                  path="/page-option/with-mega-menu"
                  title="PageWithMegaMenu"
                  component={PageWithMegaMenu}
                />
                <Route
                  path="/page-option/with-top-menu"
                  title="PageWithTopMenu"
                  component={PageWithTopMenu}
                />
                <Route
                  path="/page-option/with-boxed-layout"
                  title="PageWithBoxedLayout"
                  component={PageWithBoxedLayout}
                />
                <Route
                  path="/page-option/with-mixed-menu"
                  title="PageWithMixedMenu"
                  component={PageWithMixedMenu}
                />
                <Route
                  path="/page-option/boxed-layout-with-mixed-menu"
                  title="PageBoxedLayoutWithMixedMenu"
                  component={PageBoxedLayoutWithMixedMenu}
                />
                <Route
                  path="/page-option/with-transparent-sidebar"
                  title="PageWithTransparentSidebar"
                  component={PageWithTransparentSidebar}
                />
                <Route
                  path="/page-option/with-search-sidebar"
                  title="Page With Search Sidebar"
                  component={PageWithSearchSidebar}
                />
                <Route
                  path="/user/permissions/:id"
                  title="Permissions"
                  component={UserRole}
                />
                <Route
                  path="/user/permissions"
                  title="Permissions"
                  component={PermissionTab}
                />
                <Route
                  path="/user/userroles/:id"
                  title="Userrole"
                  component={Userrole}
                />
                {/* <Route path="/user/userroles/:id" title="Userrole" component={UserRole} />   */}
                <Route
                  path="/user/userroles"
                  title="Userroles"
                  component={UserRoleTableData}
                />
                <Route
                  path="/user/modulepermissions/:id"
                  title="Permission"
                  component={ModulePermission}
                />
                <Route
                  path="/user/modulepermissions/new"
                  title="Permission"
                  component={ModulePermission}
                />
                <Route
                  path="/user/modulepermissions"
                  title="Permission"
                  component={ModulePermissionTable}
                />

                {/* <ProtectedRoute path="/messenger" title="Messenger" component={Messenger} /> */}

                {/* <Provider store={store}> */}
                <Route
                  path="/user/profile"
                  title="Extra Profile"
                  component={Profile}
                />
                <Route
                  path={"/contacts"}
                  title="Contacts"
                  component={Contacts}
                />
                <ProtectedRoute
                  path="/AIML/AIserviceproviders/:id"
                  title="Add AI Service Provider"
                  component={AIserviceprovider}
                />
                <ProtectedRoute
                  path="/AIML/AIserviceproviders"
                  title="AI Service Provider"
                  component={AIserviceproviders}
                />
                <ProtectedRoute
                  path="/AIML/AIserviceproviderlists/:id"
                  title="Add AI Service Provider List"
                  component={AIserviceproviderlist}
                />
                <ProtectedRoute
                  path="/AIML/AIserviceproviderlists"
                  title="AI Service Provider List"
                  component={AIserviceproviderlists}
                />

                <ProtectedRoute
                  path="/AIML/AIssistants/:id"
                  title=" Add AIssistant"
                  component={AIssistant}
                />
                <ProtectedRoute
                  path="/AIML/AIssistants"
                  title="AIssistants"
                  component={AIssistantTable}
                />

                {/* <ProtectedRoute
                  exact
                  path="/AIML/AIMLtasks/new"
                  title="Add AIML Task"
                  component={AIMLTask}
                /> */}
                {/* <ProtectedRoute
                  path="/AIML/AIMLtasks/new"
                  title="New AIML Task"
                  component={AIMLTask}
                />
                <ProtectedRoute
                  path="/AIML/AIMLtasks/edit/:id"
                  title="Edit AIML Task"
                  component={AIMLTask}
                /> */}

		      {/*    <ProtectedRoute
                  path="/AIML/AIMLtask/:id?"  // The ? makes the id parameter optional
                  title="Add AIML Task"
                  component={AIMLTask}
                /> */}

                <ProtectedRoute
                  path="/AIML/AIMLtasks/profile/:id"
                  title="AIML Task Profile"
                  component={AIMLTaskProfile}
                />
                <ProtectedRoute
                  path="/AIML/AIMLtasks/edit/:id"
                  title="Edit AIML Task"
                  component={AIMLTask}
                />
                <ProtectedRoute
                  path="/AIML/AIMLtasks"
                  title="AIML Tasks Harsha"
                  component={AIMLTaskTableHarsha}
                />

                <ProtectedRoute path="/martial/industries/:id" title="Add/Edit Industry" component={industry} />
                <ProtectedRoute path="/martial/industries" title="Industries" component={industriesTable} />
                {/* <Redirect from="/" exact to="/martial/industries" />
                <Redirect to="/not-found" /> */}


                <ProtectedRoute path="/martial/belts/:id"  title="Add/Edit Belt" component={belt}/>
                <ProtectedRoute path="/martial/belts/:new"  title="Add Belt" component={belt}/>
                <ProtectedRoute path="/martial/belts" title="Belts" component={beltsTable}/>
                {/* <Redirect from="/" exact to="/martial/belts" />
                <Redirect to="/not-found" />				 */}
                
                <ProtectedRoute path="/martial/examinators/:id"  title="Add examinator" component={examinator}/>				
                <ProtectedRoute path="/martial/examinators" title="Examinators" component={examinatorsTable}/>		      										      
                <ProtectedRoute path="/martial/athletes/:id"  title="Add Athlete" component={athlete}/>						      
                <ProtectedRoute path="/martial/referees/:id"  title="Add referee" component={referee}/>						      
                <ProtectedRoute path="/martial/referees" title="Referees" component={refereesTable}/>			      
                <ProtectedRoute path="/martial/coachs/:id"  title="Add coach" component={coach}/>				

                <ProtectedRoute path="/martial/schools/:id"  title="Add School" component={school}/>	
                <ProtectedRoute path="/martial/schools" title="Schools" component={schoolsTable}/>
                <ProtectedRoute path="/martial/federations/:id"  title="Add Federation" component={federation}/>						      
                <ProtectedRoute path="/martial/federations" title="Federations" component={federationsTable}/>		      										      		      
                {/* <ProtectedRoute path="/martial/belts" title="Belts" component={beltsTable}/>	 */}

                    {/* <ProtectedRoute path="/martial/industries" title="Industries" component={industriesTable}/>		       */}
		{/*                
                <ProtectedRoute path="/martial/industries" title="Industries" component={industriesTable}/>		      
                <ProtectedRoute path="/martial/belts/:id"  title="Add Belt" component={belt}/>
                <ProtectedRoute path="/martial/belts" title="Belts" component={beltsTable}/>				
                <ProtectedRoute path="/martial/schools/:id"  title="Add School" component={school}/>				
                <ProtectedRoute path="/martial/schools" title="Schools" component={schoolsTable}/>
                <ProtectedRoute path="/martial/federations/:id"  title="Add Federation" component={federation}/>				
                <ProtectedRoute path="/martial/federations" title="Federations" component={federationsTable}/>		      								
                <ProtectedRoute path="/martial/athletes/:id"  title="Add Athlete" component={athlete}/>				
                <ProtectedRoute path="/martial/athletes" title="Athletes" component={athletesTable}/>	      								
                <ProtectedRoute path="/martial/coachs" title="Coachs" component={coachsTable}/>		      										      				
		
				*/}

                <Route title="404" component={ExtraError} />
                {/* </Provider> */}
              </Switch>
            </React.Fragment>
          </div>
        )}
      </PageSettings.Consumer>
    );
  }
}
export default withRouter(Content);
