import React from "react";
import styles from "./styles.scss";
import { connect } from "react-redux";

const StatusBar = ({ text, backgroundColor }) => {
  return (
    <div
      className={styles.container}
      style={
        text !== ""
          ? {
              transform: "translateY(0%)",
              backgroundColor
            }
          : {
              transform: "translateY(100%)",
              backgroundColor
            }
      }
    >
      <div className={styles.statusBar}>{text}</div>
    </div>
  );
};

const mapToStore = store => {
  return store.status;
};
export default connect(mapToStore)(StatusBar);
