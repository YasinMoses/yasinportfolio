import React from "react";
import { Link, useParams } from "react-router-dom";
import {Panel,PanelHeader, PanelBody,} from "../../components/panel/panel.jsx";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle } from "reactstrap";
import ReactTags from "react-tag-autocomplete";
//import DatePicker from "react-datepicker";
import TextField from '@mui/material/TextField';
import DateTime from "react-datetime";
import moment from "moment";
//import Select from 'react-select';
//import Select from "../../common/select";
import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Joi, { date } from "joi";
import Form from "../../common/form.jsx";
import { saveTicketCategory, getTicketCategory } from "./../../services/ticketcategories";
import { getTicketCategories } from "./../../services/ticketcategories";
import Select from 'react-select'
import auth from "../../services/authservice";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Handle = Slider.Handle;

class TicketCategory extends Form {
  constructor(props) {
    super(props);

    const user = auth.getProfile();
    var maxYesterday = "";
    var minYesterday = DateTime.moment().subtract(1, "day");

    this.minDateRange = (current) => {
      return current.isAfter(minYesterday);
    };
    this.maxDateRange = (current) => {
      return current.isAfter(maxYesterday);
    };
    this.minDateChange = (value) => {
      this.setState({
        maxDateDisabled: false,
      });
      maxYesterday = value;
    };

    this.state = {
      maxDateDisabled: true,
      ticketcategories:[],
      data: {
	    name: "",
	    color: "#000000",	
      user : user._id
      },
      errors: {},
    };

    this.handleSlider = (props) => {
      const { value, dragging, index, ...restProps } = props;
      return (
        <Tooltip
          prefixCls="rc-slider-tooltip"
          overlay={value}
          visible={dragging}
          placement="top"
          key={index}
        >
          <Handle value={value} {...restProps} />
        </Tooltip>
      );
    };

    this.handleSelectChange = ( { _id } , field ) => {
      console.log("SELECT ONCHANGE : " , _id)
      this.setState({ data: {...this.state.data , [field] : _id }})
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
    
  schema = Joi.object({
	name: Joi.string().optional(),
    color: Joi.any().optional(),
  });

  handleDateChange = (e) => {
    const errors = { ...this.state.errors };
    const data = { ...this.state.data };
	  data["date"] = new Date(e);
    this.setState({ data });
    console.log(this.state.data);
  };
  

  doSubmit = async (ticketcategory) => {
    
    try
    {
	    const data = { ...this.state.data };

      this.setState({ data });
      await saveTicketCategory( data );
      this.props.history.push("/kaizen/ticketcategories");

    }
    catch (ex)
    {
      console.error(ex)
      if (ex.response) {
        const errors = { ...this.state.errors };
        errors.status = ex.response.data;
        this.setState({ errors });
        console.log(this.state.errors);
      }
    }
  };

  async populateTicketCategory ()
  {
    const ID = this.props.match.params.id
    if ( ID === "new" )
    return

    let { data : wasteType } = await getTicketCategory(ID)
    console.log( "populating waste type : " ,  wasteType )
    this.setState({ data : this.mapToViewModel(wasteType) })

    console.log( "after mapping : " , this.state.data)

  }

  async componentDidMount()
  {
    await this.populateTicketCategory()
  }

  mapToViewModel(TicketCategory) {
    return {
      user : TicketCategory.user._id , 
      _id: TicketCategory._id,
	    name: TicketCategory.name,		
      color: TicketCategory.color,
    };
  }

  render() {
    const { data, errors } = this.state;
    console.log("ticketcategory data : " , data)
    return (
      <React.Fragment>
        <div>
          <ol className="breadcrumb float-xl-right">
            <li className="breadcrumb-item">
              <Link to="/kaizen/ticketcategoriess">TicketCategories</Link>
            </li>
            <li className="breadcrumb-item active">Add/Edit TicketCategory</li>
          </ol>
          <h1 className="page-header">
            Add TicketCategory <small>TicketCategory-registration-form</small>
          </h1>

          <div className="row">
            <div className="col-xl-10">
              <Panel>
                <PanelHeader>Add/Edit TicketCategory</PanelHeader>
                <PanelBody className="panel-form">
                  <form className="form-horizontal form-bordered" onSubmit={this.handleSubmit}>
							    {this.renderInput("name", "Name", "name", "Enter name of waste-type")}									  
							    {this.renderInput("color", "Color", "color", "Enter color")}					

                    <div className="form-group row">
                      <div className="col-lg-4">
                        <button type="submit" disabled={this.validate} className="btn btn-primary btn-block btn-lg" >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                </PanelBody>
              </Panel>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default TicketCategory;
