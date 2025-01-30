import Typography from "@material-ui/core/Typography"
import React from "react"

function SwitchToAgenda(props) {
    const state = props.state
    const None = { display: "none" }
    return (
        <div className="flex">
            <div onClick={()=> props.handleClick(!props.state)}>
                <div className="wrg-toggle">
                
                    <div className="wrg-toggle-container">
                    </div>

                    <div className="wrg-toggle-circle" style={ state ? {left:"30px"}: null }></div>

                    <input className="wrg-toggle-input" 
                        type="checkbox" 
                        checked={ state } 
                        />
                </div>
            </div>
            <Typography 
                variant="h6" 
                style={ state ? None : null }>
                
                Switch To List View
            </Typography>

            <Typography 
                variant="h6" 
                style={ state ? null : None }>
                
                Switch To Agenda
            </Typography>
        </div>
    )
}

export default SwitchToAgenda