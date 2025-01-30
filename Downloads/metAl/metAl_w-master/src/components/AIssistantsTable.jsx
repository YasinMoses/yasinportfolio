import React, { Component } from "react";
import Table from "./../common/table";
import AIssistant from "../pages/AIML/AIssistant";

// import { Link, withRouter } from "react-router-dom";
// import moment from "moment";
// import { Image } from "react-bootstrap";
// import { apiUrl } from "../config/config.json";

const checkboxStyles = {
  width: "15px",
  height: "15px",
  marginTop: "0.4rem",
  borderRadius: 0,
};
class AISsistantsTable extends Component {
  columns = [
    {
      key: "checkbox",
      label: (
        <input
          type="checkbox"
          style={checkboxStyles}
          onChange={this.props.handleSelectAllChange}
          checked={
            this.props.checkedFields.length > 0 &&
            this.props.checkedFields.length ===
              this.props.AIserviceproviders.length
          }
        />
      ),
      content: (AIssistant) => (
        <span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
          {/* {console.log(AIssistant._id)} */}
          <input
            type="checkbox"
            style={checkboxStyles}
            onChange={this.props.handleCheckboxChange}
            checked={this.props.checkedFields.includes(AIssistant._id)}
            value={AIssistant._id}
          />
        </span>
      ),
    },
    /*
		{
			key: "avatar",
			label: "avatar",
			content: (user) => (
				<span className="icon-img sm-r-5">
					<img
						style={{ width: "20px", height: "20px", borderRadius: "50%" }}
						src={user.imageSrc}
						alt=""
					/>
				</span>
			),
		}, */
    {
      label: "Username",
      content: (AIssistant) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Image */}
          {AIssistant.userNo.imageSrc && (
            <img
              src={AIssistant.userNo.imageSrc}
              alt="Avatar"
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}
          {/* Username */}
          <span>{AIssistant.userNo.username}</span>
        </div>
      ),
    },
    
    //{label: "Image", path: "image" },    // for Image field
    // {
    // 	label: "Image",
    // 	content: (el) => (el.AIserviceProviderImage.map(img=>
    // 		<Image
    // 		style={AIserviceProviderImage}
    // 		src={`${apiUrl}/${img?.filePath}`}
    // 		//alt="AIserviceProvider image"
    // 		alt="AIserviceProvider image"
    // 		width={35}
    // 	  />
    // 	  )),

    // },
    // {label: "User", path: "user" },`
    // {label: 'BusinessNo',   path: "businessNo" } ,
    // {label: 'Name',   path: "name" } ,
    { label: "BusinessName", path: "businessNo.companyInfo.businessName" },

    // {label: "Category", path: "category" },
    // {label: "MadeIn", path: "madeIn" },
    // {label: "AIServiceProviderType", path: "AIserviceProviderType" },

    {
      label: "AIserviceProviderName",
      content: (AIserviceproviders) => (
        <div>
          {AIserviceproviders.AIServiceProviderNO.map((item, index) => (
            <div key={index}>
              {item.name}
              {index < AIserviceproviders.AIServiceProviderNO.length - 1 && ','}
            </div>
          ))}
        </div>
      ),
    },
    {
      label: "BusinessName",
      content: (AIserviceproviders) => (
        <div>
          {AIserviceproviders.AIServiceProviderNO.map((item, index) => (
            <div key={index}>
              {item.businessNo?.companyInfo?.businessName}
              {index < AIserviceproviders.AIServiceProviderNO.length - 1 && ','}
            </div>
          ))}
        </div>
      ),
    },
    {
      label: "AIserviceproviderlist",
      content: (AIserviceproviders) => (
        <div>
          {AIserviceproviders.AIServiceProviderNO.map((item, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
              <img
                style={{ verticalAlign: "middle", marginRight: "8px" }}
                src={item.serviceproviderNo?.logoImage}
                alt="AIserviceProvider"
                width={25}
                height={25}
              />
              <span>{item.serviceproviderNo?.name || "N/A"}</span>
              {index < AIserviceproviders.AIServiceProviderNO.length - 1 && ','}
            </div>
          ))}
        </div>
      ),
    },
    {
      label: "Valid Till",
      content: (AIserviceproviders) => (
        <div>
          {AIserviceproviders.AIServiceProviderNO.map((item, index) => (
            <div key={index}>
              {formatDate(item.validTill)}
              {index < AIserviceproviders.AIServiceProviderNO.length - 1 && ','}
            </div>
          ))}
        </div>
      ),
    },
    {
      label: "Note",
      content: (AIserviceproviders) => (
        <div>
          {AIserviceproviders.AIServiceProviderNO.map((item, index) => (
            <div key={index}>
              {item.note}
              {index < AIserviceproviders.AIServiceProviderNO.length - 1 && ','}
            </div>
          ))}
        </div>
      ),
    },
    {
      label: "Status",
      content: (AIserviceproviders) => (
        <div>
          {AIserviceproviders.AIServiceProviderNO.map((item, index) => (
            <div key={index}>
              {item.status}
              {index < AIserviceproviders.AIServiceProviderNO.length - 1 && ','}
            </div>
          ))}
        </div>
      ),
    },
    
    // { label: "Note", path: "note" },
    // { label: "Status", path: "status" },
  ];
  

  render() {
    //console.log(this.columns) ;
    const { AIssistants, onSort, sortColumn } = this.props;
    // console.log("AIssistants table: ",AIssistants)

    return (
      <Table
        columns={this.columns}
        sortColumn={sortColumn}
        onSort={onSort}
        data={AIssistants}
      />
    );
  }
}
const formatDate = (dateString) => {
  if (!dateString) return "N/A"; // Handle missing date
  const date = new Date(dateString);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
};

const AIserviceProviderImage = {
  maxHeight: "50px",
  maxWidth: "50px",
  margin: "5px",
  cursor: "pointer",
};

export default AISsistantsTable;
