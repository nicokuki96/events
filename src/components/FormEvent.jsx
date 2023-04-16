import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const FormEvent = (props) => {
  const {
    setError,
    error,
    setEvent,
    event,
    editEvent,
    category,
    setCategory,
    setImage,
    image,
    setTitle,
    title,
    setAdress,
    adress,
    setDescription,
    description,
    setPrice,
    price,
    setChecked,
    checked,
    setDate,
    date,
    currentDate,
    onChangeImage,
    saveEdit,
    setIsLoading,
    isLoading,
    handleClick,
  } = props;
  const { addEvent, getUserData } = useAuth();

  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if ((!checked && !price) || !title) {
      setError("Complete all the fields!");
    } else {
      setIsLoading(true);
      const addedEvent = await addEvent(
        title,
        adress,
        category,
        date,
        description,
        price,
        checked,
        image
      );
      event && (await setEvent([addedEvent, ...event]));
      setIsLoading(false);
      navigate("/my_events");
      handleClick();
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if ((!checked && !price) || !title) {
      setError("Complete all the fields!");
    } else {
      saveEdit();
    }
  };

  const resetInputs = () => {
    setTitle("");
    setDate(currentDate);
    setDescription("");
    setPrice(0);
    setChecked(false);
    setImage("");
  };

  useEffect(() => {
    setError("");
    !editEvent && resetInputs();
    getUserData().then((data) => {
      setAdress(data?.adress);
      setCategory(data?.category);
    });
  }, []);

  const checkFreeCheck = () => {
    if ((price === 0 || checked) && editEvent) {
      return setPrice(0);
    } else {
      return price;
    }
  };

  return (
    <Box
      onSubmit={editEvent ? handleSave : handleOnSubmit}
      component="form"
      noValidate
      sx={{ mt: 3 }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      <Grid {...(error ? { mt: 1 } : {})} container spacing={2}>
        <Grid item xs={12} sm={12}>
          <TextField
            required
            fullWidth
            autoFocus
            id="title"
            label="Title"
            name="title"
            autoComplete="family-name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="given-name"
            name="adress"
            required
            fullWidth
            id="adress"
            label="Adress"
            value={adress || ""}
            onChange={(e) => setAdress(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-helper-label">
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              label={!category && "Category"}
              name="category"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <MenuItem value="music">Music</MenuItem>
              <MenuItem value="museum">Museum</MenuItem>
              <MenuItem value="party">Party</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DateTimePicker"]}>
              <DateTimePicker
                label={date >= currentDate ? "Event date" : "Wrong date"}
                value={date}
                minDate={currentDate}
                onChange={(newValue) => setDate(newValue)}
                format="LLL"
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            id="outlined-multiline-static"
            label="Description"
            multiline
            rows={5}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <FormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
            <OutlinedInput
              required
              id="outlined-adornment-amount"
              type="number"
              disabled={checked && true}
              value={checkFreeCheck()}
              onChange={(e) => setPrice(e.target.value)}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              label="Amount"
            />
          </FormControl>
          <FormControlLabel
            onClick={() => setChecked(!checked)}
            control={<Checkbox checked={checked ? true : false} />}
            label="Free"
          />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
              value={image?.name}
            >
              <input
                onChange={onChangeImage}
                hidden
                accept="image/*"
                type="file"
              />
              <PhotoCamera />
              <Typography ml={1} component="p" variant="overline">
                {!image ? "Choose image" : image.name}
              </Typography>
            </IconButton>
            {image && (
              <Button onClick={() => setImage("")} size="small">
                <ClearIcon fontSize="small" />
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {editEvent ? "Save" : "Create"}
      </Button>
    </Box>
  );
};

export default FormEvent;
