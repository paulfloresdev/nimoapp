import React, { useEffect, useCallback, memo, useState } from 'react';
import SideBarOption from './SidebarOption';
import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Skeleton } from '@heroui/react';
import DynamicFaIcon from '../DynamicFaIcon';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useNavigate } from 'react-router';
import { SideBarProps } from '../../types/layout';
import { RootState } from '../../store/configStore/store';
import { logOutRequest, meRequest } from '../../store/features/auth/authSlice';

const options = [
    { index: 0, label: 'Registrar movimientos', icon: 'FaPlusCircle', href: '/dashboard' },
    { index: 1, label: 'Movimientos recurrentes', icon: 'FaCalendarCheck', href: '/dashboard/recurrents' },
    { index: 2, label: 'Presupuestos mensuales', icon: 'FaCalendar', href: '/dashboard/months' },
    { index: 3, label: 'Cuentas y tarjetas', icon: 'FaMoneyCheckAlt', href: '/dashboard/cards' },
    { index: 4, label: 'Contactos', icon: 'FaUserFriends', href: '/dashboard/contacts' },
];

const SideBar: React.FC<SideBarProps> = ({ page }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    // Selector específico con shallowEqual para evitar renders por cambios irrelevantes
    const { user, loading } = useSelector(
        (state: RootState) => ({
            user: state.auth.user,
            loading: state.auth.loading,
        }),
        shallowEqual
    );

    const didRequestRef = React.useRef(false);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token && !user && !didRequestRef.current) {
            dispatch(meRequest());
            didRequestRef.current = true;
        }
    }, [dispatch, user]);


    const handleLogout = useCallback(() => {
        dispatch(logOutRequest());
        navigate('/login');
    }, [dispatch, navigate]);

    const initials = (name: string, lastname: string) => {
        if (name === "" || lastname === "") return "";
        return `${name[0].toLocaleUpperCase()}${lastname[0].toLocaleUpperCase()}`;
    }

    return (
        <aside
            className={`
            flex-col bg-neutral-50 border-r
            transition-all duration-300 ease-in-out
            hidden lg:flex py-6
            h-screen overflow-hidden
            ${isCollapsed ? 'max-w-72' : 'w-1/4'}
        `}
        >
            <nav className="flex flex-col px-3 h-full overflow-hidden">
                {/* Logo */}
                <div className="w-full flex justify-between items-end mb-8 shrink-0 gap-x-4">

                    <div>
                        <img src="/assets/favicon.png" alt="Logo" className="w-16" />
                    </div>
                    <div className='w-8'>
                        <Button
                            variant='flat'
                            className='min-w-8 w-8 p-0'
                            onPress={() => setIsCollapsed(!isCollapsed)}
                        >
                            <DynamicFaIcon
                                name={isCollapsed ? 'FaAngleDoubleRight' : 'FaAngleDoubleLeft'}
                                className='text-slate-600 w-3'
                            />
                        </Button>
                    </div>
                </div>
                <Divider className='mb-4'></Divider>

                {/* Menu options with scroll */}
                <div className="flex-1 overflow-y-auto pr-1">
                    <ul className="space-y-4">
                        {options.map(({ index, label, icon, href }) => (
                            <SideBarOption
                                key={index}
                                page={page}
                                index={index}
                                label={label}
                                icon={icon}
                                href={href}
                                isCollapsed={isCollapsed}
                            />
                        ))}
                    </ul>
                </div>

                {/* User profile or skeleton */}
                <div className="shrink-0 mt-4">
                    {loading ? (
                        <div>
                            <Divider className="mb-4" />
                            <div className="w-full h-10 flex flex-row items-center justify-start space-x-1 px-3">
                                <Skeleton className="rounded-full">
                                    <div className="h-10 w-12" />
                                </Skeleton>
                                <DynamicFaIcon name="FaAngleUp" className="text-gray-400 ml-auto" />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Divider className="mb-3" />
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button
                                        variant="light"
                                        className="w-full min-w-24 h-12 flex flex-row items-center justify-between gap-x-2"
                                    >
                                        <div className='flex flex-row gap-x-2 items-center'>
                                            <div className="bg-neutral-100 w-10 h-10 rounded-full flex justify-center items-center border border-neutral-300">
                                                <span className="font-semibold text-base text-neutral-950">
                                                    {user && initials(user?.name ?? "", user?.lastname ?? "")}
                                                </span>
                                            </div>
                                            {!isCollapsed && (
                                                <div className='flex flex-col gap-y-1 text-start justify-center'>
                                                    <span className='text-sm font-medium line-clamp-1'>{`${user?.name} ${user?.lastname}`}</span>
                                                    <span className='text-xs text-gray-500 line-clamp-1'>{user?.email}</span>
                                                </div>
                                            )}
                                        </div>

                                        <DynamicFaIcon name="FaAngleUp" className="text-gray-400 ml-auto" />
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
                    )}
                </div>
            </nav>
        </aside>
    );
};

export default memo(SideBar);
