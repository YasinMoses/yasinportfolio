import { moment } from 'moment';
let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: todayStr
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: todayStr + 'T12:00:00'
  }
]

export function createEventId() {
  return String(eventGuid++)
}



export function getRandomColor() {
  // const letters = '0123456789ABCDEF';
  // let color = '#';
  // for (let i = 0; i < 7; i++) 
  //   color += letters[Math.floor(Math.random() * 16)];
  // return color;
  // let random = function() {
  //   return Math.floor(Math.random() * (255 - 10)) + 10;
  // }
  
  // let color = `rgb(${random()}, ${random()}, ${random()})`;
  // return color;
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}

// export 	function dateCheck(startSlot,endSlot,start,end) {
//   const fDate = new Date(start); 
//   const startDate = new Date(startSlot);
//   const endDate = new Date(endSlot);
//   const lDate = new Date(end);
  
//   if(Date.parse(startDate) <= Date.parse(lDate) && Date.parse(startDate) >= Date.parse(fDate)){
//     alert("true");
//     return true;
//   }
//   if(Date.parse(endDate) <= Date.parse(lDate) && Date.parse(endDate) >= Date.parse(fDate)){
//     alert("true");
//     return true;
//   }
//   //alert("false");
//   return false;
// }

export 	function dateCheck(startSlot,endSlot,start,end) {
  const savedStart = moment(new Date(start),"h:mm a"); 
  const savedEnd = moment(new Date(end),"h:mm a");
  

  const startDate = moment(new Date(startSlot),"h:mm a");
  const endDate = moment(new Date(endSlot),"h:mm a");
  
  
 // if ($beginDateForCurrenAppointment->between($beginDate, $endDate,false) ||
  // $endDateForCurrenAppointment->between($beginDate, $endDate,false) ||
  //  $beginDate->between($beginDateForCurrenAppointment, $endDateForCurrenAppointment,false) ||
    // $endDate->between($beginDateForCurrenAppointment, $endDateForCurrenAppointment,false) || 
     //$beginDate->eq($beginDateForCurrenAppointment) || $endDate->eq($endDateForCurrenAppointment)) {
  //  if (dateCheck(data.start, data.end, event.start, event.end))

  // if(startDate.isBetween(moment(savedStart), moment(savedEnd),undefined, '()') ||
  // endDate.isBetween(moment(savedStart), moment(savedEnd),undefined, '()') ||
  // startDate.isSame(moment(savedStart),undefined, '()') ||
  // endDate.isSame(moment(savedEnd)),undefined, '()'){
  //   //alert("true");
  //   console.log("true");
  //   return true;
  // }
  
  if(startDate.isBetween(moment(savedStart), moment(savedEnd),undefined, '()') ||
  endDate.isBetween(moment(savedStart), moment(savedEnd),undefined, '()') ){
    //alert("true");
    console.log("true");
    return true;
  }
  console.log("false");
  return false;
}
