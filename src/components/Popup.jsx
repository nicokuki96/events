import React, { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useAuth } from "../context/authContext";

const Popup = (props) => {
  const {
    setOpen,
    open,
    editEventSelected,
    titleDelete,
    setTitleDelete,
    titleAdd,
  } = props;
  const { userLog } = useAuth();

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const popupText = () => {
    if (editEventSelected && !titleDelete) {
      return `Event saved`;
    } else if (titleDelete) {
      return `Event "${titleDelete}" deleted`;
    } else {
      return `Login user: ${userLog?.email}`;
    }
  };

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity={titleDelete ? "error" : "success"}
        sx={{ width: "100%" }}
      >
        {/* como hago para renderizar esto sin el warning, lo trate de poner en un useEffect */}
        {popupText()}
      </Alert>
    </Snackbar>
  );
};

export default Popup;
