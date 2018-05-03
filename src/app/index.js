require("../sass/reset.scss");
require("babel-polyfill");
import React from "react";
import styles from "./styles.scss";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../store.js";
import Modify from "../pages/modify";
import Login from "../pages/login";
import List from "../pages/main";
import Slide from "../pages/slide";
import StatusBar from "../components/statusBar";
import { showStatus } from "../action.js";
import Konami from "../konami.js";
import fetchPolyfill from "whatwg-fetch";

let io = require("socket.io-client")();

io
  .on("addCommit", msg => {
    store.dispatch(Object.assign(JSON.parse(msg), { type: "addCommit" }));
  })
  .on("forceUpdate", msg => {
    window.location = window.location.href;
  })
  .on("modifyGroups", msg => {
    store.dispatch({ type: "getGroupsData", data: JSON.parse(msg) });
  })
  .on("broadcast", msg => {
    store.dispatch(showStatus(msg, "", 5000));
  });
let easter_egg = new Konami(() => {
  let index = prompt("想去哪？");
  if (index) {
    window.location = `${window.location.origin}/modify/${index}`;
  }
});
easter_egg.pattern = "67678577738313";

window.broadcast = msg => {
  fetch(`/broadcast/${msg}`);
};
window.forceUpdate = msg => {
  fetch(`/forceUpdate`);
};
export default class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    function getInternetExplorerVersion() {
      var rv = -1;
      if (navigator.appName == "Microsoft Internet Explorer") {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
        if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
      } else if (navigator.appName == "Netscape") {
        var ua = navigator.userAgent;
        var re = new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})");
        if (re.exec(ua) != null) rv = parseFloat(RegExp.$1);
      }
      return rv;
    }
    window.getInternetExplorerVersion = getInternetExplorerVersion;
    if (getInternetExplorerVersion() != -1) {
      alert("IE瀏覽器可能無法正常使用部份功能，推薦您使用chrome或是firefox");
      window.location.href =
        "https://www.google.com.tw/chrome/browser/desktop/";
    }

    if (!fetch) {
      fetch = fetchPolyfill;
    }

    let guest = localStorage.getItem("guest");
    if (guest) {
      store.dispatch({ type: "setGuest", name: guest });
    }
    fetch("/groups")
      .then(res => res.json())
      .then(json => {
        store.dispatch({ type: "getGroupsData", data: json });
      });
  }
  render() {
    return (
      <Router>
        <Provider store={store}>
          <div>
            <Route exact path="/" component={Login} />
            <Route path="/list" component={List} />
            <Route path="/slide/:index" component={Slide} />
            <Route path="/modify/:index" component={Modify} />
            <StatusBar />
          </div>
        </Provider>
      </Router>
    );
  }
}
