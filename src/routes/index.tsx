import React, { Suspense } from "react";
import { Route, Routes } from 'react-router-dom';
import NotFound from '../components/NotFound'; // Componente 404
import Login from "../pages/public/Login.tsx";
import DashboardLayout from "../components/layout/DashboardLayout.tsx";

const Home = React.lazy(() => import("../pages/private/home/Home.tsx"));
const TransactionDetail = React.lazy(() => import("../pages/private/transaction/TransactionDetail.tsx"));
const UpdateTransaction = React.lazy(() => import("../pages/private/transaction/UpdateTransaction.tsx"));
const AddIncomeRelation = React.lazy(() => import("../pages/private/transaction/AddIncomeRelation.tsx"));
const Cards = React.lazy(() => import("../pages/private/cards/Cards.tsx"));
const AddCard = React.lazy(() => import("../pages/private/cards/AddCard.tsx"));
const UpdateCard = React.lazy(() => import("../pages/private/cards/UpdateCard.tsx"));
const MonthList = React.lazy(() => import("../pages/private/months/MonthList.tsx"));
const MonthPage = React.lazy(() => import("../pages/private/months/MonthPage.tsx"));
const Contacts = React.lazy(() => import("../pages/private/contacts/Contacts.tsx"));

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
            <Route path="transaction/update" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <UpdateTransaction />
                </Suspense>
            } />
            <Route path="transaction/add-relation" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <AddIncomeRelation />
                </Suspense>
            } />
            <Route path="cards" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <Cards />
                </Suspense>
            } />
            <Route path="cards/add" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <AddCard />
                </Suspense>
            } />
            <Route path="cards/update" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <UpdateCard />
                </Suspense>
            } />
            <Route path="months" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <MonthList />
                </Suspense>
            } />
            <Route path="month" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <MonthPage />
                </Suspense>
            } />
            <Route path="contacts" element={
                <Suspense fallback={<div>Loading...</div>}>
                    <Contacts />
                </Suspense>
            } />
        </Route>

    </Routes>
);

export default AppRoutes;