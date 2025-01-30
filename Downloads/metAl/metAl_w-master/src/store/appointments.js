import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";

const slice = createSlice({
  name: "appointments",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    appointmentsRequested: (appointments, action) => {
      appointments.loading = true;
    },
    appointmentsReceived: (appointments, action) => {
      appointments.list = action.payload;
      appointments.loading = false;
      appointments.lastFetch = Date.now();
    },
    appointmentsRequestedFailed: (appointments, action) => {
      appointments.loading = false;
    },
    appointmentAdded: (appointments, action) => {
      appointments.list.push(action.payload);
    },

  },
});

export const {
  appointmentAdded,
  appointmentsReceived,
  appointmentsRequested,
  appointmentsRequestedFailed,
} = slice.actions;
export default slice.reducer;

// Action creators
const url = "/appointments";

export const loadAppointments = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.appointments;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");

  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: appointmentsRequested.type,
      onSuccess: appointmentsReceived.type,
      onError: appointmentsRequestedFailed.type,
    })
  );
};

export const addAppointment = (appointment) =>
  apiCallBegan({
    url,
    method: "post",
    data: appointment,
    onSuccess: appointmentAdded.type,
  });

