export const showStatus = (
  text,
  backgroundColor = "rgba(0,0,0,0.87)",
  time = 2000
) => {
  return dispatch => {
    dispatch({ type: "setStatus", text, backgroundColor });

    setTimeout(() => {
      dispatch({ type: "clearStatus" });
    }, time);
  };
};
