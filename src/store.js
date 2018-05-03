import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

const groups = (state = [], action) => {
  switch (action.type) {
    case "getGroupsData":
      return action.data;
    case "addCommit":
      let r = state.concat();
      r[action.index].commits.push(action.commit);
      return r;
    default:
      return state;
  }
};
const guest = (state = localStorage.getItem("guest") || "", action) => {
  switch (action.type) {
    case "setGuest":
      return action.name;
    default:
      return state;
  }
};

const status = (
  state = {
    text: "",
    backgroundColor: "rgba(0,0,0,.87)"
  },
  action
) => {
  switch (action.type) {
    case "clearStatus":
      return { text: "", backgroundColor: state.backgroundColor };
    case "setStatus":
      return { text: action.text, backgroundColor: action.backgroundColor };
    default:
      return state;
  }
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(
  combineReducers({ groups, status, guest }),
  composeEnhancers(applyMiddleware(thunk))
);

export default store;
