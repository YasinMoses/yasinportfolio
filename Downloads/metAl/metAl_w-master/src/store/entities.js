import { combineReducers } from '@reduxjs/toolkit';

import usersReducer from './users';
//import doctorsReducer from './doctors';
//import patientsReducer from './patients';
//import clinicsReducer from './clinics';
import appointmentsReducer from './appointments';

export default combineReducers({
  users: usersReducer,
  ///doctors: doctorsReducer,
  //patients: patientsReducer,
  //clinics: clinicsReducer,
  appointments: appointmentsReducer,
  
 
});