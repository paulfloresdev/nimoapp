import React, { useCallback, useEffect } from "react";
import SideBar from "./SideBar";
import BottomNav from "./BottomNav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import DynamicFaIcon from "../DynamicFaIcon";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { useDispatch } from "react-redux";
import { logOutRequest } from "../../store/features/auth/authSlice";

const Layout: React.FC = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        dispatch(logOutRequest());
        navigate('/login');
    }, [dispatch, navigate]);

    // Determinar el valor de `page` en base a la URL
    const path = location.pathname;
    let page = 0;

    if (path.includes("/dashboard/recurrents")) page = 1;
    else if (path.includes("/dashboard/months")) page = 2;
    else if (path.includes("/dashboard/cards")) page = 3;
    else if (path.includes("/dashboard/contacts")) page = 4;

    return (
        <div className="flex min-h-dscreen bg-white">
            <SideBar page={page} />
            <div className="w-full p-6 lg:max-h-screen">
                <div className="h-full">
                    <div className="w-full flex flex-row justify-between items-center mb-6 lg:hidden">
                        <div className="w-12 h-2"></div>
                        <img src="/assets/favicon.png" alt="Logo" className="h-8" />
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="light" className="min-w-2 w-12">
                                    <DynamicFaIcon name={"FaEllipsisV"} className="text-neutral-950" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                <DropdownItem key="edit">Editar datos de usuario</DropdownItem>
                                <DropdownItem key="delete" className="text-danger" color="danger" onClick={handleLogout}>
                                    Cerrar sesión
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                    </div>
                    <div className="w-full h-full pb-12">
                        <Outlet />
                    </div>
                </div>
            </div>
            <BottomNav page={page} />
        </div>
    );
};

export default Layout;
