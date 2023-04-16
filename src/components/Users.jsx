import React, { useEffect } from "react";
import Header from "./Header";
import Container from "@mui/material/Container";
import { useAuth } from "../context/authContext";
import User from "./User";
import { Grid } from "@mui/material";

const Users = (props) => {
  const { getUsers } = useAuth();
  const { setUserPics, userPics } = props;

  useEffect(() => {
    getUsers().then((data) => {
      setUserPics(data.docs.map((doc) => doc.data()));
    });
    console.log(userPics);
  }, []);

  return (
    <>
      <Header />
      <Container sx={{ marginTop: "30px" }}>
        <Grid
          className="eventBox"
          sx={{ display: "flex" }}
          mt={5}
          mb={5}
          gap={2}
          container
        >
          <User userPics={userPics} />
        </Grid>
      </Container>
    </>
  );
};

export default Users;
