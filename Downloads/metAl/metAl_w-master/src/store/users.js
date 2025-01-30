import { createSlice } from "@reduxjs/toolkit";
//import { createSelector } from "reselect";
import { apiCallBegan } from "./api";
import moment from "moment";



const slice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    currentUser: [],
    loading: false,
    lastFetch: null,
  },
  reducers: {
    usersRequested: (users, action) => {
      users.loading = true;
    },
    usersReceived: (users, action) => {
      users.list = action.payload;
      users.loading = false;
      users.lastFetch = Date.now();
    },
    currentUserLoaded: (users, action) => {
      users.currentUser = action.payload;
      users.loading = false;
    },
    usersRequestedFailed: (users, action) => {
      users.loading = false;
    },
    userAdded: (users, action) => {
      users.list.push(action.payload);
    },
  },
});

export const {
  userAdded,
  usersReceived,
  usersRequested,
  currentUserLoaded,
  usersRequestedFailed,
} = slice.actions;
export default slice.reducer;

// Action creators
const url = "/users";

export const loadUsers = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.users;

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");

  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: usersRequested.type,
      onSuccess: usersReceived.type,
      onError: usersRequestedFailed.type,
    })
  );
};

export const loadCurrentUser = (id) => (dispatch,getState) => {
  const { lastFetch } = getState().entities.users;

  const diffInSeconds = moment().diff(moment(lastFetch), "seconds");

  if (diffInSeconds < 20) return;
  return dispatch(
    apiCallBegan({
      url: url + "/" + id,
      onStart: usersRequested.type,
      onSuccess: currentUserLoaded.type,
      onError: usersRequestedFailed.type,
    })
  );
};



export const addUser = (user) =>
  apiCallBegan({
    url,
    method: "post",
    data: user,
    onSuccess: userAdded.type,
  });