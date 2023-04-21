import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../context/authContext";

const Modalreview = (props) => {
  const { setOpen, open, stars, setStars, userName } = props;
  const { addReview } = useAuth();
  const [review, setReview] = useState("");
  const handleClose = () => {
    setOpen(false);
    setReview("");
    setStars(0);
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const sendReview = async (review, stars) => {
    try {
      await addReview(review, stars, userName);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Write a review
        </Typography>
        <Rating
          name="read-only"
          sx={{ mt: 1 }}
          value={stars}
          onChange={(e) => setStars(e.target.value)}
        />
        <TextField
          id="outlined-multiline-static"
          label="Review"
          multiline
          rows={4}
          sx={{ width: "100%", mt: 2 }}
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={() => sendReview(review, stars)}
          endIcon={<SendIcon />}
          sx={{ mt: 2 }}
        >
          Send
        </Button>
      </Box>
    </Modal>
  );
};

export default Modalreview;
