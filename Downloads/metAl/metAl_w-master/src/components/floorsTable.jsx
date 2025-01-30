import React, { Component } from "react";
import Table from "./../common/table";
import { apiUrl } from "./../config/config.json";

class FloorsTable extends Component {
    columns = [
        {
            key: "checkbox",
            label: (
                <input
                    type="checkbox"
                    style={checkboxStyles}
                    onChange={this.props.toggle}
                />
            ),
            content: (listFloor) => (
                <span className="icon-img sm-r-5" style={{ marginTop: "15px" }}>
                    <input
                        type="checkbox"
                        style={checkboxStyles}
                        onChange={this.props.handleCheckboxChange}
                        value={listFloor._id}
                    />
                </span>
            ),
        },
        {
            label: "Map",
            content: (floors) => (
                <img
                    style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "100%",
                    }}
                    src={`${apiUrl}/${floors?.map?.filePath}`}
                    alt="mapImage"
                />
            ),
        },
        { label: "Name", path: "name" },
        {
            label: "Area",
            path: "area",
            content: (floors) => <span>{floors.areaId?.name}</span>,
        },
        { label: "Level", path: "level" },
    ];
    render() {
        const { Floors, onSort, sortColumn } = this.props;
        return (
            <Table
                columns={this.columns}
                sortColumn={sortColumn}
                onSort={onSort}
                data={Floors}
            />
        );
    }
}

const checkboxStyles = {
    width: "15px",
    height: "15px",
    marginTop: "0.4rem",
    borderRadius: 0,
};

export default FloorsTable;
