import React, { useEffect, useState } from "react";
import Header from "./Header";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { Container } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "../context/authContext";
import uuid from "react-uuid";

const MyEvents = () => {
  const [userEvents, setUserEvent] = useState([]);
  const { eventsCurrentUser, userLog, deleteEvent } = useAuth();

  useEffect(() => {
    eventsCurrentUser().then((data) => {
      setUserEvent(data?.map((doc) => doc.data()));
    });
  }, [userLog]);

  const handleDelete = (id) => {
    deleteEvent(id);
  };

  return (
    <>
      <Header />
      <Container>
        <Grid className="eventBox" mt={5} mb={5} gap={2} container>
          {userEvents &&
            userEvents.map((event) => {
              return (
                <Grid key={uuid()} item sm={12} md={3}>
                  <Card className="myEvent" sx={{ maxWidth: 345 }}>
                    <CardMedia
                      component="img"
                      alt="green iguana"
                      height="150"
                      image={event.image}
                    />

                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {`${event.date} - ${event.hour}`}
                      </Typography>
                      <Typography variant="body2" color="text.primary">
                        {event.adress}
                      </Typography>
                    </CardContent>
                    <CardContent
                      sx={{ bgcolor: "info.main" }}
                      className="priceBox"
                    >
                      <Typography variant="body2" color="white">
                        {event.free ? "Free" : `$ ${event.amount}`}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </>
  );
};

export default MyEvents;
