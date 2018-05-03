import React from "react";
import styles from "./styles.scss";
import logo from "./logo.png";
import bannerMp4 from "./We-Work-We-Wait.mp4";
import bannerWebm from "./We-Work-We-Wait.webm";
import enter from "./enter-arrow.png";
import { connect } from "react-redux";
import { showStatus } from "../../action.js";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guest: props.guest,
      focusLock: false
    };
  }

  componentDidMount() {
    this.resizeEventListener = this.resizeBanner.bind(this);
    window.addEventListener("resize", this.resizeEventListener);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeEventListener);
  }

  resizeBanner() {
    if (window.innerWidth > window.innerHeight) {
      this.setState({
        bannerStyle: {
          width: "100vw"
        }
      });
    } else {
      this.setState({
        bannerStyle: {
          height: "100vh"
        }
      });
    }
  }

  changeGuestName(e) {
    this.setState({ guest: e.target.value });
  }

  _onClick() {
    if (this.state.guest == "") {
      this.props.dispatch(showStatus("你必須輸入名子", "rgba(255,0,0,0.4)"));
      return;
    }
    this.props.dispatch({ type: "setGuest", name: this.state.guest });
    localStorage.setItem("guest", this.state.guest);
    this.props.history.push("/list");
  }

  _onFocus() {
    this.setState({ focusLock: true });
  }

  _onBlur() {
    this.setState({ focusLock: false });
  }

  _onKeyUp({ keyCode }) {
    if (keyCode == 13) {
      this._onClick();
    }
  }

  _placeHolder() {
    if (this.state.guest === "" && !this.state.focusLock) {
      return "你的名子";
    } else {
      return this.state.guest;
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.banner}>
          <div />
          <video autoPlay loop muted>
            <source src={bannerMp4} type="video/mp4" />
            <source src={bannerWebm} type="video/webm" />
          </video>
        </div>
        <div className={styles.title}>
          <div>
            <img src={logo} className={styles.logo} />
          </div>
          <div className={styles.letterSpacing}>
            <span>中</span>
            <span>正</span>
            <span>大</span>
            <span>學</span>
            <span>資</span>
            <span>管</span>
            <span>系</span>
          </div>
          <div className={styles.letterSpacing}>
            <span>107</span>
            <span>年</span>
            <span>專</span>
            <span>題</span>
            <span>展</span>
            <span>簡</span>
            <span>報</span>
          </div>
        </div>
        <div className={styles.guest}>
          <input
            type="text"
            value={this._placeHolder()}
            onKeyUp={this._onKeyUp.bind(this)}
            onChange={this.changeGuestName.bind(this)}
            onFocus={this._onFocus.bind(this)}
            onBlur={this._onBlur.bind(this)}
          />
          <button type="button" onClick={this._onClick.bind(this)}>
            <img src={enter} />
          </button>
        </div>
      </div>
    );
  }
}

const mapToStore = store => {
  return {
    guest: store.guest
  };
};
export default connect(mapToStore)(Login);
