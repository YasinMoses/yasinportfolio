import React, { Component } from "react";
import Table from "./../newcommon/table";
import { Link, withRouter } from "react-router-dom";

class CertificatesTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // values: [],
		
    };

  }

  columns = [
    //   {path: '_id', label: 'Id'},
    {
      key: "checkbox",
      label: (
        <input
          type="checkbox"
          style={{
            width: "15px",
            height: "15px",
            marginTop: "0.4rem",
            borderRadius: 0,
          }}
          onChange={this.handleCheckboxAll}
        />
      ),
      content: (certificate) => (
        <span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
          {/* {console.log(certificate)} */}
          <input
            type="checkbox"
            style={{
              width: "15px",
              height: "15px",
              marginTop: "0.4rem",
              borderRadius: 0,
            }}
            onChange={this.props.handleCheckboxChange}
            value={certificate._id}
            
          />
        </span>
      ),
    },
    { label: "name", path: "name", content: (certificate) => (
        <span className="icon-img sm-r-5">        
          {certificate.name}
        </span>
      ),
    },
    { label: "certificateValidTill", path: "certificateValidTill", content: (certificate) => (
        <span className="icon-img sm-r-5">      
          {certificate.certificateValidTill}
        </span>
      ),
    },
	
    { label: "certificateValidFrom", path: "certificateValidFrom", content: (certificate) => (
        <span className="icon-img sm-r-5">      
          {certificate.certificateValidFrom}
        </span>
      ),
    },
  
    { label: "certificateNo",path: "certificateNo", content: (certificate) => (
        <div className="w-100 h-100" >
          {certificate.certificateNo}
        </div>
      ),
    },
    { label: "description", path: "note", content: (certificate) => ( 
        <span className="icon-img sm-r-5">      
          {certificate.description}
        </span>
      ),
    },
	
    { label: "note", path: "note", content: (certificate) => ( 
        <span className="icon-img sm-r-5">      
          {certificate.note}
        </span>
      ),
    },
	
  ];

  render() {
    console.log(this.columns) ;
    const { Certificates, onSort, sortColumn } = this.props;
    // console.log(Certificates);
    return (
 
    <Table columns={this.columns} sortColumn={sortColumn} onSort={onSort} data={Certificates} />
)

  }
}

export default CertificatesTable;
