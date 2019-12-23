import SyncLoader from "react-spinners/SyncLoader";
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
      < SyncLoader color = {
        props.color
      }
      size='25'
      loading = {
        props.isFetching
      }
      />
    </div>
  );
};

export default Spinner;
