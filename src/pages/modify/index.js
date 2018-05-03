import React from "react";
import { connect } from "react-redux";
import styles from "./styles.scss";
import { showStatus } from "../../action.js";
class From extends React.Component {
  _onSubmit() {
    fetch(`/groups/${this.props.match.params.index}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(JSON.parse(this.textarea.value))
    });
    this.props.dispatch(showStatus("存檔中"));
  }
  _onKeyDown(e) {
    if (e.keyCode == 9) {
      e.preventDefault();
      let { target } = e;
      let selectionEnd = target.selectionEnd;
      console.log(selectionEnd);
      target.value =
        target.value.substring(0, selectionEnd) +
        "\t" +
        target.value.substring(selectionEnd);
      target.selectionEnd = selectionEnd + 1;
    }
    if (e.ctrlKey && e.keyCode == 83) {
      e.preventDefault();
      this._onSubmit();
    }
  }
  componentDidUpdate() {
    let { groups, match } = this.props;
    let group = groups[match.params.index - 1];
    this.textarea.value = JSON.stringify(group, null, "\t");
  }
  componentDidMount() {
    let { groups, match } = this.props;
    let group = groups[match.params.index - 1];
    this.textarea.value = JSON.stringify(group, null, "\t");
  }
  _onClick(e) {
    //`${window.location.origin}/modify/${e.target.innerHTML}`
    this.props.history.push(`/modify/${e.target.innerHTML}`);
  }
  render() {
    let as = this.props.groups.map((el, i) => (
      <a key={i + 1} onClick={this._onClick.bind(this)}>
        {i + 1}
      </a>
    ));
    return (
      <div className={styles.container}>
        <div>{as}</div>
        <textarea
          contentEditable={true}
          spellCheck={false}
          onKeyDown={this._onKeyDown.bind(this)}
          ref={r => (this.textarea = r)}
        >
          {}{" "}
        </textarea>
        <button type="button" onClick={this._onSubmit.bind(this)}>
          提交
        </button>
      </div>
    );
  }
}

const mapToStore = store => {
  return { groups: store.groups };
};

export default connect(mapToStore)(From);
