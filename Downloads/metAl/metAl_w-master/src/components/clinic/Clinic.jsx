import React,{useState} from 'react'
import Calendar from "./Calendar"
import "../../assets/css/mycss.css"
import SwitchToAgenda from "./SwitchToAgenda"

export default function Clinic() {
    const [ isToggle, setisToggle ] = useState(true)
    return (
        <div>
            
            <SwitchToAgenda 
                state={isToggle}  
                handleClick={(event)=> setisToggle(event)}/>
            
            <Calendar />
        </div>
    )
}