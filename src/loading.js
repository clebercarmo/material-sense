import PacmanLoader from "react-spinners/PacmanLoader";
import React from "react";

const Spinner = props => {
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  };
  return (
    <div style={style}>
      < PacmanLoader color = {props.color}
      size='40'
      loading = {
        props.isFetching
      }
      />
    </div>
  );
};

export default Spinner;
