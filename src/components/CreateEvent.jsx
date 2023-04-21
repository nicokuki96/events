import { React } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Header from "./Header";
import FormEvent from "./FormEvent";

const CreateEvent = (props) => {
  const {
    setError,
    error,
    setEvent,
    event,
    onChangeImage,
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
    currentDate,
    setDate,
    date,
    setEditEvent,
    editEvent,
    setIsLoading,
    isLoading,
    handleClick,
  } = props;

  return (
    <>
      <Header />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Create new date
          </Typography>
        </Box>
        <FormEvent
          onChangeImage={onChangeImage}
          setError={setError}
          error={error}
          setEvent={setEvent}
          event={event}
          checked={checked}
          setChecked={setChecked}
          price={price}
          setPrice={setPrice}
          description={description}
          setDescription={setDescription}
          setAdress={setAdress}
          adress={adress}
          setTitle={setTitle}
          title={title}
          setImage={setImage}
          image={image}
          category={category}
          setCategory={setCategory}
          currentDate={currentDate}
          setDate={setDate}
          date={date}
          setEditEvent={setEditEvent}
          editEvent={editEvent}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          handleClick={handleClick}
        />
      </Container>
    </>
  );
};

export default CreateEvent;
