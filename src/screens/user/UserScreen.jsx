import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import CreateUser from '../../components/user/CreateUser.jsx';
import Users from '../../components/user/Users.jsx';
import UpdateScreenU from './UpdateScreenU';
import SearchUser from '../../components/user/SearchUser.jsx';
import DummyData from '../../components/user/DummyDataUser.jsx';
import {deleteUserById} from '../../api/userApi.js';
import './UserScreen.css';

const UserScreen = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();
    

    const handleRefresh = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteUserById(userId);
            console.log('User deleted successfully:', userId);
            handleRefresh(); // Refresh the list
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleUpdateUser = (userId) => {
        navigate(`/users/update/${userId}`);
    };

   
    return (
        <div className="user-manager-container">
         
            <DummyData onUserCreated={handleRefresh}/>
            
            <Routes>
                <Route
                    path="/"
                    element={
                 <>
                    <section className="user-manager-section">
                        <h2>Create User</h2>
                        <CreateUser onUserCreated={handleRefresh} />
                    </section>

                    <hr className="divider" />

                    <section className="user-manager-section">
                        <SearchUser
                            onUpdateUser={handleUpdateUser}
                            onDeleteUser={handleDeleteUser} 
                        />
                    </section>

                    <hr className="divider" />

                    <section className="user-manager-section">
                        <h2>User List</h2>
                        <Users refreshKey={refreshKey} onUpdateUser={handleUpdateUser} />
                    </section>
                </>
           
                }

            />
            <Route path="/users/update/:userId" element={<UpdateScreenU onUpdateSuccess={handleRefresh} />} />
            
            </Routes>
        </div>
    );
};

export default UserScreen;
