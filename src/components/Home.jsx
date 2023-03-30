import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useAuth } from "../context/authContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Event from "../components/Event";
import Grid from "@mui/material/Grid";
import { Container } from "@mui/material";

const Home = (props) => {
  const { userLog, getEvents, getUsers } = useAuth();
  const { setOpen, open, setEvent, event, setUserPics, userPics } = props;

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
    });
    getUsers().then((data) => {
      setUserPics(data.docs.map((doc) => doc.data()));
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
      <Container>
        <Grid className="eventBox" mt={5} mb={5} gap={2} container>
          <Event userPics={userPics} event={event} />
        </Grid>
      </Container>
    </>
  );
};

export default Home;
