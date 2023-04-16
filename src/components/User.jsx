import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Grid from "@mui/material/Grid";
import uuid from "react-uuid";
import { useAuth } from "../context/authContext";

const User = (props) => {
  const { userPics } = props;
  const { userLog } = useAuth();
  const [stars, setStars] = useState(2);
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
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                >
                  {user.adress}
                </Typography>
              </CardContent>
              <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
                <Rating
                  name="read-only"
                  value={stars}
                  readOnly={userLog ? true : false}
                />
              </Box>
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
