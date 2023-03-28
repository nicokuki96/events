import { React, useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Stack from "@mui/material/Stack";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

const Register = (props) => {
  const { setError, error } = props;
  const [category, setCategory] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [adress, setAdress] = useState("");
  const [email, setEmail] = useState("");
  const [imageUser, setImageUser] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { signUp, saveUser } = useAuth();

  useEffect(() => {
    setError("");
  }, []);

  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      await saveUser(
        email,
        password,
        name,
        adress,
        imageUser,
        category,
        imageUser.name
      );
      navigate("/");
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        setError("Invalid email");
      }
      if (error.code === "auth/weak-password") {
        setError("Weak password");
      }
      if (error.code === "auth/internal-error") {
        setError("Password empty");
      }
      if (error.code === "auth/email-already-in-use") {
        setError("Email already in use");
      }
      if (error.code === "auth/missing-email") {
        setError("Missing email");
      }
    }
  };

  const onChangeImage = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImageUser(undefined);
      return;
    }
    setImageUser(e.target.files[0]);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const theme = createTheme();

  const Copyright = (props) => {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            onSubmit={handleOnSubmit}
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
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="family-name"
                  onChange={(e) => setName(e.target.value)}
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
                  autoFocus
                  onChange={(e) => setAdress(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl sx={{ minWidth: 190 }}>
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
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ width: "100%" }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    id="password"
                    required
                    type={showPassword ? "text" : "password"}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" mt={1} spacing={2}>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    value={imageUser.name}
                  >
                    <input
                      onChange={onChangeImage}
                      hidden
                      accept="image/*"
                      type="file"
                    />
                    <PhotoCamera />
                  </IconButton>

                  <Typography component="p" variant="overline">
                    {!imageUser ? "Choose image" : imageUser.name}
                  </Typography>
                  {imageUser && (
                    <Button onClick={() => setImageUser("")} size="small">
                      <ClearIcon fontSize="small" />
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
};

export default Register;
