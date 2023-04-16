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
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import FormEvent from "./FormEvent";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import CircularProgress from "@mui/material/CircularProgress";
import Popup from "./Popup";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const MyEvents = (props) => {
  const {
    userEvents,
    setUserEvents,
    setError,
    error,
    setEvent,
    event,
    setEditEvent,
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
    setIsLoading,
    isLoading,
    setOpen,
    open,
    handleClick,
  } = props;
  const { eventsCurrentUser, userLog, deleteEvent, saveEditEvent } = useAuth();
  const [stateEditView, setStateEditView] = useState({ bottom: false });
  const [editEventSelected, setEditEventSelected] = useState([]);
  const [titleDelete, setTitleDelete] = useState();

  const handleEdit = (anchor, id) => {
    setEditEvent(true);
    setStateEditView({ ...stateEditView, [anchor]: true });
    getEventData(id);
    setEditEventSelected(id);
  };

  const saveEdit = async () => {
    setTitleDelete();
    // no llega a verse el loader
    setIsLoading(true);

    await saveEditEvent(
      editEventSelected,
      title,
      adress,
      category,
      date,
      description,
      price,
      checked,
      image.name
    );
    const eventsUpdated = await eventsCurrentUser();
    // const updatedList = userEvents.map((item) => {
    //   if (item.id === editEventSelected) {
    //     return updatedEvent;
    //   }
    //   return item;
    // });
    // console.log(updatedList);
    setUserEvents(eventsUpdated.map((doc) => doc.data()));
    handleEditOnClose("bottom", false);
    setEditEvent(false);
    setIsLoading(false);
    handleClick();
  };

  const getEventData = async (id) => {
    const eventSelected = userEvents.find((event) => event.id === id);
    const {
      title,
      adress,
      amount,
      category,
      date,
      description,
      hour,
      image,
      image_name,
    } = eventSelected;
    const dayjsDate = dayjs(date, "DD/MM/YYYY", "es")
      .set("hour", dayjs(hour, "h:mm a").hour())
      .set("minute", dayjs(hour, "h:mm a").minute());
    const formattedDate = dayjsDate.format("LLL");
    setTitle(title);
    setCategory(category);
    setDescription(description);
    // no funciona
    setImage(image_name);
    setAdress(adress);
    setDate(dayjs(formattedDate));
    setPrice(amount);
    setChecked(checked);
  };

  const handleEditOnClose = (anchor) => {
    setEditEvent(false);
    setStateEditView({ [anchor]: false });
  };

  const handleDelete = async (id, image, title) => {
    setIsLoading(true);
    await deleteEvent(id, image);
    const updatedList = userEvents.filter((item) => item.id !== id);
    setUserEvents(updatedList);
    setIsLoading(false);
    setTitleDelete(title);
    handleClick();
  };

  useEffect(() => {
    eventsCurrentUser().then((data) => {
      setUserEvents(data?.map((doc) => doc.data()));
    });
  }, [userLog]);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography component={"span"}>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  const a11yProps = (index) => {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`,
    };
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
    >
      <Button onClick={() => handleEditOnClose("bottom", false)}>
        <CloseIcon />
      </Button>
      <Container>
        <FormEvent
          setError={setError}
          error={error}
          setEvent={setEvent}
          event={event}
          editEvent={editEvent}
          date={date}
          setDate={setDate}
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
          onChangeImage={onChangeImage}
          saveEdit={saveEdit}
        />
      </Container>
    </Box>
  );
  return (
    <>
      <Header />
      <Popup
        editEventSelected={editEventSelected}
        titleDelete={titleDelete}
        setTitleDelete={setTitleDelete}
        titleAdd={title}
        setOpen={setOpen}
        open={open}
      />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          height: "100%",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{
            borderRight: 1,
            borderColor: "divider",
            mt: "10px",
            width: "150px",
          }}
        >
          <Tab label={`Soon (${userEvents?.length})`} {...a11yProps(0)} />
          <Tab label="All" {...a11yProps(1)} />
          <Tab label="Last" {...a11yProps(2)} />
        </Tabs>
        <TabPanel className="tabContent" value={value} index={0}>
          <Grid
            className="eventBox"
            sx={{ display: "flex" }}
            mt={5}
            mb={5}
            gap={2}
            container
          >
            {userEvents && !isLoading ? (
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
                          onClick={() =>
                            handleDelete(event.id, event.image, event.title)
                          }
                        >
                          Delete
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Grid
                className="eventBox"
                sx={{ display: "flex", justifyContent: "center" }}
                mt={5}
                mb={5}
                container
              >
                <CircularProgress />
              </Grid>
            )}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </Box>

      <Drawer anchor={"bottom"} open={stateEditView["bottom"]}>
        {list("bottom")}
      </Drawer>
    </>
  );
};

export default MyEvents;
