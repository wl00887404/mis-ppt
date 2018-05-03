import React from "react";
import styles from "./styles.scss";

export default class extends React.PureComponent {
  state = {
    loaded: false
  };

  componentDidMount() {
    const img = document.createElement("img");
    img.src = this.props.src;
    img.onload = () => this.setState({ loaded: true });
  }

  render() {
    const { src, preview, style, children, ...props } = this.props;
    const { loaded } = this.state;
    return (
      <div
        className={styles.img}
        style={{
          ...style,
          backgroundImage: `url(${loaded ? src : preview})`
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
}
