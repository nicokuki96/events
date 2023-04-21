import React, { useEffect, useState } from "react";
import Header from "./Header";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Container } from "@mui/material";
import { useAuth } from "../context/authContext";
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
import Search from "./Search";
import moment from "moment/moment";
import Tabevents from "./Tabevents";

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
    search,
    setSearch,
  } = props;
  const { eventsCurrentUser, userLog, deleteEvent, saveEditEvent } = useAuth();
  const [stateEditView, setStateEditView] = useState({ bottom: false });
  const [editEventSelected, setEditEventSelected] = useState([]);
  const [titleDelete, setTitleDelete] = useState();
  const [tabPanel, setTabPanel] = useState(0);

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
      setUserEvents(data?.docs.map((doc) => doc.data()));
    });
  }, [userLog]);

  const getEventsFilter = (filter = "soon") => {
    console.log(filter);
    const dateTime = new Date();
    const currentDate = moment(
      dateTime,
      "DD [de] MMMM [de] YYYY, HH:mm:ss z"
    ).toDate();
    if (filter === "soon") {
      const eventsUser = userEvents?.filter((event) => {
        const objectDate = event.objectDate?.toDate();
        return objectDate > currentDate;
      });
      return eventsUser;
    }
    if (!filter || filter === "all") {
      setUserEvents(userEvents);
      return userEvents;
    }
    if (filter === "last") {
      const eventsUser = userEvents?.filter((event) => {
        const objectDate = event.objectDate?.toDate();
        return objectDate < currentDate;
      });
      return eventsUser;
    }
  };

  const getUserEvents = () => {
    if (!search) return userEvents;
    const searchMap = userEvents.filter((event) => {
      if (event?.title?.includes(search)) {
        return event;
      }
    });
    return searchMap;
  };

  const handleChange = (event, newValue) => {
    setTabPanel(newValue);
  };

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={tabPanel !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {tabPanel === index && (
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
    tabPanel: PropTypes.number,
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
          value={tabPanel}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{
            borderRight: 1,
            borderColor: "divider",
            mt: "10px",
            width: "150px",
          }}
        >
          <Tab
            onClick={() => getEventsFilter("soon")}
            label={`Soon (${userEvents?.length})`}
            {...a11yProps(0)}
          />
          <Tab
            onClick={() => getEventsFilter("all")}
            label="All"
            {...a11yProps(1)}
          />
          <Tab
            onClick={() => getEventsFilter("last")}
            label="Last"
            {...a11yProps(2)}
          />
        </Tabs>
        <TabPanel className="tabContent" value={tabPanel} index={0}>
          <Search setSearch={setSearch} search={search} />
          <Grid
            className="eventBox"
            sx={{ display: "flex" }}
            mt={5}
            mb={5}
            gap={2}
            container
          >
            {userEvents && !isLoading ? (
              <Tabevents
                getEventsFilter={getEventsFilter}
                getUserEvents={getUserEvents}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
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
        <TabPanel value={tabPanel} index={1}>
          <Search setSearch={setSearch} search={search} />
          <Grid
            className="eventBox"
            sx={{ display: "flex" }}
            mt={5}
            mb={5}
            gap={2}
            container
          >
            {userEvents && !isLoading ? (
              <Tabevents
                getEventsFilter={getEventsFilter}
                getUserEvents={getUserEvents}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
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
        <TabPanel value={tabPanel} index={2}>
          <Search setSearch={setSearch} search={search} />
          <Grid
            className="eventBox"
            sx={{ display: "flex" }}
            mt={5}
            mb={5}
            gap={2}
            container
          >
            {userEvents && !isLoading ? (
              <Tabevents
                getEventsFilter={getEventsFilter}
                getUserEvents={getUserEvents}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
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
      </Box>

      <Drawer anchor={"bottom"} open={stateEditView["bottom"]}>
        {list("bottom")}
      </Drawer>
    </>
  );
};

export default MyEvents;
