import React from "react";
import styles from "./styles.scss";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ImageWithPreview from "../../components/ImageWithPreview";

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    sessionStorage.setItem("animation", "false");
    document.body.style.overflow = "auto";
  }

  render() {
    let { groups } = this.props;
    let noAnimation = false;
    if (sessionStorage.getItem("animation") == "false") {
      noAnimation = true;
    }

    groups = groups.map((g, i) => (
      <Group group={g} key={i} index={i + 1} noAnimation={noAnimation} />
    ));
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>分組名單</h1>
        <div className={styles.list}>{groups}</div>
      </div>
    );
  }
}

const Group = ({ group, index, noAnimation }) => {
  let { name } = group;
  return (
    <Link
      to={`/slide/${index}`}
      className={noAnimation ? "" : styles.firstTimes}
    >
      <ImageWithPreview
        src={`https://s3-ap-northeast-1.amazonaws.com/mis-ppt/ppt/${index}/cover.jpg`}
        preview={`https://s3-ap-northeast-1.amazonaws.com/mis-ppt/ppt/${index}/preview.jpg`}
      >
        <h3>{index}</h3>
        <h2>{name}</h2>
      </ImageWithPreview>
    </Link>
  );
};

const mapToStore = Store => {
  return {
    groups: Store.groups
  };
};
export default connect(mapToStore)(Main);
