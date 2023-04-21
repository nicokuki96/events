import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Grid from "@mui/material/Grid";
import uuid from "react-uuid";
import { useAuth } from "../context/authContext";
import Button from "@mui/material/Button";
import Modalreview from "./Modalreview";

const User = (props) => {
  const { userPics, setTitle, title } = props;
  const { userLog, getReviews } = useAuth();
  const [stars, setStars] = useState(0);
  const [colectionStars, setColectionStars] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = (user) => {
    setOpen(true);
    setTitle(user);
  };

  useEffect(() => {
    getReviews().then((data) => {
      setColectionStars(data.docs.map((doc) => doc.data()));
    });
  }, []);

  useEffect(() => {
    const usersNames = userPics?.map((user) => user.name);
    // const starsUser = colectionStars?.filter((review) => {
    //   if (review.qualifiedUser === usersNames) {
    //     console.log(review.starNumber);
    //   }
    //   console.log(review.starNumber, usersNames);
    // });
  }, [userPics]);

  return (
    <>
      {userPics?.map((user) => (
        <Grid key={uuid()} item sm={12} md={3}>
          <Card className="userCard" key={uuid()} sx={{ display: "flex" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto" }}>
                <Typography component="div" variant="body">
                  {user.name}
                </Typography>
                {/* <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                >
                  {user.adress}
                </Typography> */}
              </CardContent>
              <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
                <Rating name="read-only" value={stars} readOnly />
              </Box>
              {userLog && (
                <Button onClick={() => handleOpen(user.name)}>
                  Add review
                </Button>
              )}
              <Modalreview
                setOpen={setOpen}
                open={open}
                stars={stars}
                setStars={setStars}
                userName={title}
              />
            </Box>
            <CardMedia
              component="img"
              sx={{ width: 150 }}
              image={user.image}
              alt="Live from space album cover"
              className="imgUserCard"
            />
          </Card>
        </Grid>
      ))}
    </>
  );
};

export default User;
