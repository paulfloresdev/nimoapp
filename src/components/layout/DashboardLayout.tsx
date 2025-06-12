// DashboardLayout.tsx
import React from "react";
import PrivateRoute from "../PrivateRoute";
import Layout from "./Layout";

const DashboardLayout: React.FC = () => {
    const layout = <Layout />;
    return <PrivateRoute>{layout}</PrivateRoute>;
};

export default React.memo(DashboardLayout);
