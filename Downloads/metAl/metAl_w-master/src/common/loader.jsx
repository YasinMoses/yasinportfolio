import React from "react";
import { Spinner } from 'react-bootstrap';

function Loader() {
    return (
        <Spinner
            animation="border"
            style={{ width: "6rem", height: "6rem", border: "1px solid", position: "fixed", top: "50%", left: "50%" }}
        />
    )
}

export default Loader;