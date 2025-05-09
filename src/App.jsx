import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import EventScreen from './screens/event/EventScreen';
import UpdateScreenE from './screens/event/UpdateScreenE';
import UpdateScreenU from './screens/user/UpdateScreenU';
import NoPage from './screens/NoPage';
import PrivateRoute from './components/ProtectedRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // This includes Popper.js

import ServiceManager from './screens/NewScreens/ServiceManager';
import Marquees from './screens/NewScreens/Marquees';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

import UserScreen from './screens/user/UserScreen';
import UserProfileScreen from './screens/user/UserProfileScreen';


import AdminLayout from './components/AdminLayout';

import EventProfile from './screens/event/EventProfileScreen';


function App() {
  return (
   
    <BrowserRouter>
      <ToastContainer />
      <Routes>

        <Route path="/" element={<AdminLayout><HomeScreen/></AdminLayout>} />

        {/* Main Event route with nested routes */}

        {/* Event routes */}
        <Route path="/events/*" element={<AdminLayout><EventScreen /></AdminLayout>} />
        <Route path="/events/update/:eventId" element={<UpdateScreenE />} />

        <Route path="/marquees/*" element={<AdminLayout><Marquees /></AdminLayout>} />
        <Route path="/marquees/update/:marqueeId" element={<UpdateScreenE />} />
        <Route path="/marquees/:marqueeId" element={<AdminLayout><Marquees /></AdminLayout>} />

        <Route path="/services/*" element={<AdminLayout><ServiceManager /></AdminLayout>} />
        <Route path="/services/update/:serviceId" element={<UpdateScreenU />} />
        <Route path="/services/:serviceId" element={<AdminLayout><ServiceManager /></AdminLayout>} />

       
        {/* Protected User routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/users/*" element={<AdminLayout><UserScreen /></AdminLayout>} />
          <Route path="/users/:userId" element={<AdminLayout><UserProfileScreen /></AdminLayout>} />
          <Route path="/users/update/:userId" element={<AdminLayout><UpdateScreenU /></AdminLayout>} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/events/:id" element={<EventProfile />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
