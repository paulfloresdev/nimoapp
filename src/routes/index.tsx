import React, { Suspense } from "react";
import { Route, Routes } from 'react-router-dom';
import NotFound from '../components/NotFound'; // Componente 404
import Login from "../pages/public/Login.tsx";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";

const Home = React.lazy(() => import("../pages/Home.tsx"));


const AppRoutes = () => (
    <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={
            <Suspense fallback={<div>Loading...</div>}>
                <Login />
            </Suspense>
        } />

        <Route
            path="/"
            element={
                <React.Suspense fallback={<div>Loading...</div>}>
                    <Home></Home>
                </React.Suspense>
            }
        />

        <Route path="/dashboard/*" element={<DashboardLayout />} key={"layout"}>
            <Route index element={
                <Suspense fallback={<div>Loading...</div>}>
                <Home />
                </Suspense>
            } />
            <Route path="months" element={
                <Suspense fallback={<div>Loading...</div>}>
                <Home />
                </Suspense>
            } />
        </Route>
        
    </Routes>
);

export default AppRoutes;