import { Outlet, Navigate } from "react-router-dom"
import CustomError from "./CustomError";

const ProtectedRoute = () => {
    const user = localStorage.getItem('user');

    return user ? <Outlet /> : <CustomError msg={'Unauthorized'}  />
}

export default ProtectedRoute