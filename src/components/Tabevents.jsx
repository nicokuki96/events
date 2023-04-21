import React, { useEffect } from "react";
import uuid from "react-uuid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Tabevents = (props) => {
  const { getEventsFilter, getUserEvents, handleEdit, handleDelete } = props;

  return getEventsFilter().map((event) => {
    return (
      <Grid key={uuid()} item sm={12} md={3}>
        <Card className="myEvent" sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt="green iguana"
            height="150"
            image={event?.image}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {event?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {`${event?.date} - ${event?.hour}`}
            </Typography>
            <Typography variant="body2" color="text.primary">
              {event?.adress}
            </Typography>
          </CardContent>
          <CardContent sx={{ bgcolor: "info.main" }} className="priceBox">
            <Typography variant="body2" color="white">
              {event?.free ? "Free" : `$ ${event?.amount}`}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => handleEdit("bottom", event.id)}
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(event.id, event.image, event.title)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  });
};

export default Tabevents;
