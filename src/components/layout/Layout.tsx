import React, { useEffect } from "react";
import SideBar from "./SideBar";
import BottomNav from "./BottomNav";
import { Outlet, useLocation } from "react-router-dom";

const Layout: React.FC = () => {
    const location = useLocation();

    // Determinar el valor de `page` en base a la URL
    const path = location.pathname;
    let page = 0;

    if (path.includes("/dashboard/months")) page = 1;
    else if (path.includes("/dashboard/incomes")) page = 2;
    else if (path.includes("/dashboard/contacts")) page = 3;
    // Añade más condiciones según sea necesario

    console.log("Layout renderizado con page =", page);

    useEffect(() => {
        console.log('Componente montado: Layout');
        return () => {
            console.log('Componente desmontado : Layout');
        };
    }, []);

    return (
        <div className="flex min-h-screen bg-neutral-50">
            <SideBar page={page} />
            <div className="w-full p-6 max-h-screen">
                <div className="h-full">
                    <div className="w-full flex flex-row justify-between mb-8 md:hidden">
                        <img src="/assets/favicon.png" alt="Logo" className="w-16" />
                    </div>
                    <div className="w-full h-full">
                        <Outlet />
                    </div>
                </div>
            </div>
            <BottomNav page={page} />
        </div>
    );
};

export default Layout;
