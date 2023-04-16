import { React, useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { userLog, logOut, getUserData } = useAuth();
  const navigate = useNavigate();
  const [imageIcon, setImageIcon] = useState("");
  const [userDesc, setUserDesc] = useState("");
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogOut = async () => {
    await logOut();
    navigate("/");
  };

  useEffect(() => {
    getUserData().then((data) => {
      setImageIcon(data?.image);
      setUserDesc(data?.name);
    });
  }, [userLog]);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem href="/" onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Events</Typography>
              </MenuItem>
              <MenuItem href="/users" onClick={handleCloseNavMenu}>
                <Typography textAlign="center">Users</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              href="/"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Events
            </Button>
            <Button
              href="/users"
              onClick={handleCloseNavMenu}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Users
            </Button>
          </Box>
          {userLog && (
            <Box mr={3} sx={{ flexGrow: 0 }}>
              <Link className="linksLog" to={"/create_event"}>
                <div className="btnNewEvent">
                  <div className="bttn-create">Create event</div>
                </div>
              </Link>
            </Box>
          )}
          {!userLog ? (
            <>
              <MenuItem>
                <Link className="linksLog" to={"/login"}>
                  <Typography textAlign="center">Login</Typography>
                </Link>
              </MenuItem>
              <MenuItem>
                <Link className="linksLog" to={"/register"}>
                  <Typography textAlign="center">Sign up</Typography>
                </Link>
              </MenuItem>
            </>
          ) : (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={userDesc}>
                <IconButton
                  className="btnLog"
                  onClick={handleOpenUserMenu}
                  sx={{ p: 0 }}
                >
                  {userLog && imageIcon ? (
                    <Avatar
                      sx={{
                        bgcolor: "white",
                        width: 40,
                        height: 40,
                        padding: 0.5,
                      }}
                      aria-label="recipe"
                      className="imgIcon"
                      src={imageIcon}
                    />
                  ) : (
                    <AccountCircleIcon
                      sx={{
                        width: 50,
                        height: 50,
                      }}
                    />
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Link className="links" to={"/my_profile"}>
                    <Typography textAlign="center">My profile</Typography>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Link className="links" to={"/my_events"}>
                    <Typography textAlign="center">My events</Typography>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Link className="links" onClick={handleLogOut}>
                    <Typography textAlign="center">Logout</Typography>
                  </Link>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
