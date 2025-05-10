import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import UserIcon from '@mui/icons-material/AccountCircle';
import EventIcon from '@mui/icons-material/Event';
import { apiRequest } from '../utils/apiUtils';
import { toast } from 'react-toastify';
import './Navbar.css'; // Custom CSS for navbar if any

const drawerWidth = 240;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSignOut = async () => {
    try {
      await apiRequest(`${import.meta.env.VITE_API_URL}/users/logout`, 'GET');
      localStorage.removeItem('user');
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  

  const handleLogin = () => navigate('/login');
  const handleRegister = () => navigate('/register');

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* AppBar with Navbar functionality */}
      <AppBar 
        position="fixed"
        sx={{  backgroundColor: '#4c714f' ,width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          {/* Navbar Dropdown Menu */}
          <div className="navbar-nav ms-auto">
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user.image ? ( user.image ) : ( <UserIcon /> )}
                  <span className="ms-2">{user.name}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <a className="dropdown-item" href="#">
                      Settings
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleSignOut}>
                      Sign Out
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogin}>
                    Login
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleRegister}>
                    Register
                  </button>
                </li>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>


      {/* Side Drawer */}
      
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        
        <Toolbar />
        <Divider />
        {user && (
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <Divider />
          {user && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/events">
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="Events" />
            </ListItemButton>
          </ListItem>
          )}
          <Divider />
          {user && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/users">
                <ListItemIcon>
                  <UserIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton>
            </ListItem>
          )}<Divider />
          {user && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/Services">
                <ListItemIcon>
                  <UserIcon />
                </ListItemIcon>
                <ListItemText primary="Services" />
              </ListItemButton>
            </ListItem>
          )}
         {user && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/marquees">
                <ListItemIcon>
                  <UserIcon />
                </ListItemIcon>
                <ListItemText primary="Marquees" />
              </ListItemButton>
            </ListItem>
          )}{user && (
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/Artists">
                <ListItemIcon>
                  <UserIcon />
                </ListItemIcon>
                <ListItemText primary="Artists" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
        )}
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
