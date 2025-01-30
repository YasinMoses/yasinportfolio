import React, { Component } from "react";
import Table from "./../newcommon/table";

class LeavesTable extends Component {
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
            content: (user) => (
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
                        value={user._id}
                    />
                </span>
            ),
        },

        {
            label: "Name",
            path: "name",
            content: (user) => (
                <span className="icon-img sm-r-5">{user.name}</span>
            ),
        },
        {
            label: "User",
            path: "user",
            content: (user) => (
                <span className="icon-img sm-r-5">{user.userNo?.username}</span>
            ),
        },
        {
            label: "note",
            path: "note",
            content: (user) => (
                <span className="icon-img sm-r-5">{user.note}</span>
            ),
        },
    ];

    render() {
        const { leaverReasons, onSort, sortColumn } = this.props;
        return (
            <Table
                columns={this.columns}
                sortColumn={sortColumn}
                onSort={onSort}
                data={leaverReasons}
            />
        );
    }
}

export default LeavesTable;
