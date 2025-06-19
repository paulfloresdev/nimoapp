import React, { Suspense } from "react";
import { Route, Routes } from 'react-router-dom';
import NotFound from '../components/NotFound'; // Componente 404
import Login from "../pages/public/Login.tsx";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";

const Home = React.lazy(() => import("../pages/private/home/Home.tsx"));
const TransactionDetail = React.lazy(() => import("../pages/private/transaction/TransactionDetail.tsx"));
const AddIncomeRelation = React.lazy(() => import("../pages/private/transaction/AddIncomeRelation.tsx"));


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
            <Route path="transaction" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <TransactionDetail />
                </Suspense>
            } />
            <Route path="transaction/add-relation" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <AddIncomeRelation />
                </Suspense>
            } />
        </Route>
        
    </Routes>
);

export default AppRoutes;