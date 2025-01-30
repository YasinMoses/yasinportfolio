import React, { Component } from "react";
import Table from "./../newcommon/table";

class SkillsTable extends Component {
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
            content: (user) => (
                <span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
                    {/* {console.log(user)} */}
                    <input
                        type="checkbox"
                        style={{
                            width: "15px",
                            height: "15px",
                            marginTop: "0.4rem",
                            borderRadius: 0,
                        }}
                        onChange={this.props.handleCheckboxChange}
                        value={user._id}
                    />
                </span>
            ),
        },
        {
            label: "name",
            path: "name",
            content: (user) => (
                <span className="icon-img sm-r-5">{user.name}</span>
            ),
        },
        {
            label: "user",
            content: (user) => (
                <span className="icon-img sm-r-5">{user.userNo?.username}</span>
            ),
        },
        {
            label: "department",
            path: "department",
            content: (user) => (
                <span className="icon-img sm-r-5">{user.department}</span>
            ),
        },

        {
            label: "Description",
            content: (user) => (
                <span className="icon-img sm-r-5">{user?.description}</span>
            ),
        },
        {
            label: "Reference",
            content: (user) => (
                <span className="icon-img sm-r-5">{user.reference}</span>
            ),
        },
        {
            label: "Note",
            content: (user) => (
                <span className="icon-img sm-r-5">{user.note}</span>
            ),
        },
    ];

    render() {
        console.log(this.columns);
        const { Skills, onSort, sortColumn } = this.props;
        // console.log(Skills);
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

export default SkillsTable;
