import moment from "moment";
import React, { Component } from "react";
import Table from "./../newcommon/table";

class AdminCertificatesTable extends Component {
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
                    onChange={this.props.toggle}
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
        {
            label: "name",
            path: "name",
            content: (certificate) => (
                <span className="icon-img sm-r-5">{certificate?.name}</span>
            ),
        },

        {
            label: "user",
            content: (certificate) => (
                <span className="icon-img sm-r-5">
                    {certificate?.userNo?.username}
                </span>
            ),
        },

        {
            label: "ValidFrom",
            content: (certificate) => (
                <span className="icon-img sm-r-5">
                    {moment(certificate?.validFrom).format("MMMM Do YYYY")}
                </span>
            ),
        },
            
        {
            label: "ValidTill",
            content: (certificate) => (
                <span className="icon-img sm-r-5">
                    {moment(certificate?.validTill).format("MMMM Do YYYY")}
                </span>
            ),
        },

        {
            label: "note",
            path: "note",
            content: (certificate) => (
                <span className="icon-img sm-r-5">{certificate?.note}</span>
            ),
        },
    ];

    render() {
        const { AdminCertificates, onSort, sortColumn } = this.props;
        console.log(AdminCertificates);
        return (
            <Table
                columns={this.columns}
                sortColumn={sortColumn}
                onSort={onSort}
                data={AdminCertificates}
            />
        );
    }
}

export default AdminCertificatesTable;
