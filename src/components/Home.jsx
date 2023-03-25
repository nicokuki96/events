import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useAuth } from "../context/authContext";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Event from "../components/Event";
import Grid from "@mui/material/Grid";
import { storage } from "../firebase";
import { Container } from "@mui/material";

const Home = (props) => {
  const { userLog, getEvents, imageEvent } = useAuth();
  const { setOpen, open } = props;
  const [event, setEvent] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [imageFile, setImageFile] = useState([]);
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // const convertUrlsToBlobs = async (imageUrls) => {
  //   const imageBlobs = [];
  //   for (const imageUrl of imageUrls) {
  //     const response = await fetch(imageUrl);
  //     const blob = await response.blob();
  //     imageBlobs.push(blob);
  //   }
  //   return imageBlobs;
  // };

  useEffect(() => {
    getEvents()
      .then((data) => {
        setEvent(data.docs.map((doc) => doc.data()));
      })
      .then(() => {
        const images = event.map(async (item) => {
          const imageRef = storage.child(item.image);
          return imageRef
            .getDownloadURL()
            .then((url) => ({ id: item.id, url }))
            .catch(() => ({ id: item.id, url: null }));
        });
        Promise.all(images).then((result) => {
          setImageUrls(result);
        });
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
        <Grid className="eventBox" mt={5} gap={2} container>
          <Event event={event} imageUrls={imageUrls} />
        </Grid>
      </Container>
    </>
  );
};

export default Home;
