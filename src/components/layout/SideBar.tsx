import React, { useEffect, useCallback, memo } from 'react';
import SideBarOption from './SidebarOption';
import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Skeleton } from '@heroui/react';
import DynamicFaIcon from '../DynamicFaIcon';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useNavigate } from 'react-router';
import { SideBarProps } from '../../types/layout';
import { RootState } from '../../store/configStore/store';
import { logOutRequest, meRequest } from '../../store/features/auth/authSlice';

const options = [
    { index: 0, label: 'Inicio', icon: 'FaHome', href: '/dashboard' },
    { index: 1, label: 'Presupuestos mensuales', icon: 'FaClipboardList', href: '/dashboard/months' },
    { index: 2, label: 'Movimientos', icon: 'FaExchangeAlt', href: '/dashboard/transactions' },
    { index: 3, label: 'Cuentas y tarjetas', icon: 'FaMoneyCheckAlt', href: '/' },
    { index: 4, label: 'Contactos', icon: 'FaUserFriends', href: '/' },
];

const SideBar: React.FC<SideBarProps> = ({ page }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

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


    useEffect(() => {
        console.log('Componente montado: SideBar');

        return () => {
        console.log('Componente desmontado: SideBar');
        };
    }, []);


    const handleLogout = useCallback(() => {
        dispatch(logOutRequest());
        navigate('/login');
    }, [dispatch, navigate]);

    const initials = (name:string, lastname:string) => {
        if(name === "" || lastname === "") return "";

        return `${name[0].toLocaleUpperCase()}${lastname[0].toLocaleUpperCase()}`;
    }

    return (
        <aside
        className={`
            flex flex-col bg-neutral-100 border-r
            transition-all duration-300 ease-in-out
            hidden lg:flex py-6
            h-screen overflow-hidden
            max-w-72
        `}
        >
        <nav className="flex flex-col px-3 h-full overflow-hidden">
            {/* Logo */}
            <div className="w-full flex justify-center mb-8 shrink-0">
            <img src="/assets/favicon.png" alt="Logo" className="w-14" />
            </div>

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
                <Divider className="mb-4" />
                <Dropdown>
                    <DropdownTrigger>
                    <Button
                        variant="light"
                        className="w-full h-10 flex flex-row items-center justify-start space-x-1"
                    >
                        <div className="bg-neutral-200 w-12 h-10 rounded-full flex justify-center items-center border border-neutral-300">
                        <span className="font-semibold text-base text-neutral-950">
                            {user && initials(user?.name ?? "", user?.lastname ?? "")}
                            {/*user
                            ? `${user.name[0]?.toUpperCase()}${user.lastname[0].toUpperCase()}`
                            : ''*/}
                        </span>
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
