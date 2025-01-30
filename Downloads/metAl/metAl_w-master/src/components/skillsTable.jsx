import moment from "moment";
import React, { Component } from "react";
import Table from "./../common/table";

class AdminSkillsTable extends Component {
    columns = [
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
            content: (clinicsolo) => (
                <span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
                    <input
                        type="checkbox"
                        style={{
                            width: "15px",
                            height: "15px",
                            marginTop: "0.4rem",
                            borderRadius: 0,
                        }}
                        onChange={this.props.handleCheckboxChange}
                        value={clinicsolo._id}
                    />
                </span>
            ),
        },

        {
            label: "User",
            path: "username",
            content: (skill) => (
                <span className="icon-img sm-r-5">
                    <img
                        style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                        }}
                        src={skill?.userNo?.imageSrc}
                        alt=""
                    />{" "}
                    {skill?.userNo?.username}
                </span>
            ),
        },

        { label: "Name", path: "name" },
        { label: "Level", path: "level" },
        { label: "Description", path: "description" },
        { label: "Department", path: "department" },
        { label: "Reference", path: "reference" },
        { label: "EducationAt", path: "educationAt" },
        {
            label: "ValidTill",
            content: (certificate) => (
                <span className="icon-img sm-r-5">
                    {moment(certificate?.validTill).format("MMMM Do YYYY")}
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
        { label: "Note", path: "note" },
    ];

    render() {
        //console.log(this.columns) ;
        const { Skills, onSort, sortColumn } = this.props;
        return (
            <Table
                columns={this.columns}
                sortColumn={sortColumn}
                onSort={onSort}
                data={Skills}
            />
        );
    }
}

export default AdminSkillsTable;
