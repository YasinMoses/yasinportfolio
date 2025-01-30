import React from "react";
import { Link } from "react-router-dom";

function Icon({ icon, title, btnStyle, iconStyle, to, handleClick }) {
	return (
		<button className="btn btn-default active m-r-5 m-b-5" title={title} style={btnStyle} onClick={handleClick}>
			{" "}
			<Link to={to}>
				<img style={iconStyle} src={icon} alt="" />
			</Link>
		</button>
	);
}

export default Icon;
