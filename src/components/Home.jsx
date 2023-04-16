import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useAuth } from "../context/authContext";
import Events from "../components/Events";
import Grid from "@mui/material/Grid";
import { Container } from "@mui/material";
import Popup from "./Popup";

const Home = (props) => {
  const { userLog, getEvents, getUsers } = useAuth();
  const { setOpen, open, setEvent, event, setUserPics, userPics } = props;

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
      {userLog && <Popup setOpen={setOpen} open={open} />}
      <Container>
        <Grid
          className="eventBox"
          sx={{ display: "flex", justifyContent: "center" }}
          mt={5}
          mb={5}
          gap={2}
          container
        >
          <Events userPics={userPics} event={event} />
        </Grid>
      </Container>
    </>
  );
};

export default Home;
