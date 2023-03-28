import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import uuid from "react-uuid";
import Grid from "@mui/material/Unstable_Grid2";

const Event = (props) => {
  const { event, users } = props;

  const mapeoUserImages = (item) => {
    const user = users.find((user) => user.name === item.userName);
    return user.image;
  };

  return (
    event &&
    event.map((item) => {
      return (
        <Grid key={uuid()} item sm={12} md={3}>
          <Card sx={{ maxWidth: 300, textTransform: "capitalize" }}>
            <CardHeader
              avatar={
                <Avatar className="imgIcon" src={mapeoUserImages(item)} />
              }
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
              title={item.title}
              subheader={`${item.date} - ${item.hour}`}
            />
            <CardMedia
              component="img"
              height="194"
              image={item.image}
              alt={item.image}
              className="imageEvent"
            />
            <CardContent sx={{ bgcolor: "info.main" }} className="priceBox">
              <Typography variant="body2" color="white">
                {item.free ? "Free" : `$ ${item.amount}`}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="add to favorites">
                <FavoriteIcon />
              </IconButton>
              <IconButton aria-label="share">
                <ShareIcon />
              </IconButton>
              <Grid xs display="flex" justifyContent="end" alignItems="center">
                <Typography variant="body2" mr={1} color="text.secondary">
                  {item.userName}
                </Typography>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      );
    })
  );
};

export default Event;
