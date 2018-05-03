import React from "react";
import styles from "./styles.scss";
import { connect } from "react-redux";
import { showStatus } from "../../action.js";
import InformationCard from "./informationCard";
import backIcon from "./reply.png";
import "reveal.js/css/reveal.css";
import ImageWithPreview from "../../components/ImageWithPreview";

class Slide extends React.Component {
  constructor(props) {
    super(props);
  }
  _toggleInformationCard() {
    if (window.location.search.match(/show=\d/) !== null) {
      this.props.history.goBack();
    } else {
      this.props.history.push(`./${this.props.match.params.index}?show=1`);
    }
  }
  _onButtonClick() {
    this.props.history.push("/list");
  }
  render() {
    let { groups, dispatch, guest } = this.props;
    let index = parseInt(this.props.match.params.index);

    let group = groups[index - 1];
    if (group == undefined) {
      return null;
    }
    let { ppt } = group;

    return (
      <div className={styles.container}>
        <button
          onClick={this._onButtonClick.bind(this)}
          className={styles.backButton}
          type="button"
        >
          <img src={backIcon} />
        </button>
        <PPT group={index} dispatch={dispatch} length={group.numberOfPages} />
        {window.location.search.match(/show=\d/) !== null && (
          <div
            className={styles.block}
            onClick={this._toggleInformationCard.bind(this)}
          />
        )}
        <InformationCard
          group={group}
          index={index}
          show={window.location.search.match(/show=\d/) !== null}
          toggle={this._toggleInformationCard.bind(this)}
          guest={guest}
        />
      </div>
    );
  }
}

class PPT extends React.Component {
  componentDidMount() {
    Reveal().initialize();
  }

  render() {
    let { group, dispatch, length } = this.props;
    const ppt = Array.from({ length }, (_, i) => i + 1)
      .map(i => ({
        src: `https://s3-ap-northeast-1.amazonaws.com/mis-ppt/ppt/${group}/pages/${i}.jpg`,
        preview: `https://s3-ap-northeast-1.amazonaws.com/mis-ppt/ppt/${group}/previews/${i}.jpg`
      }))
      .map((props, index) => (
        <section>
          <ImageWithPreview
            {...props}
            style={{
              width: "960px",
              height: "540px",
              backgroundSize: "contain",
              boxShadow:
                "0 16px 24px 2px rgba(0,0,0,.14), 0 6px 30px 5px rgba(0,0,0,.12), 0 8px 10px -5px rgba(0,0,0,.2)"
            }}
          />
        </section>
      ));
    return (
      <div className="reveal">
        <div className="slides">{ppt}</div>
      </div>
    );
  }
}

const mapToStore = store => {
  return { groups: store.groups, guest: store.guest };
};
export default connect(mapToStore)(Slide);
