import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useAuth } from "../context/authContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Event from "../components/Event";
import Grid from "@mui/material/Grid";

const Home = (props) => {
  const { userLog, getEvents } = useAuth();
  const { setOpen, open } = props;
  const [event, setEvent] = useState([]);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getEvents().then((data) => {
      setEvent(data.docs.map((doc) => doc.data()));

      console.log(event);
    });
  }, []);

  return (
    <>
      <Header />
      {userLog && (
        <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {`Login user: ${userLog.email}`}
          </Alert>
        </Snackbar>
      )}

      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-start"
        mt={2}
        gap={1}
        className="eventBox"
      >
        <Event event={event} />
      </Grid>
    </>
  );
};

export default Home;
