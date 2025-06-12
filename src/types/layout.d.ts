import { ReactNode } from "react";

export interface SideBarProps {
    page: number
}

export interface SideBarOptionProps {
    page: number,
    index: number,
    label: string,
    icon: string,
    href: string
}

export interface BottomNavProps {
    page: number
}

export interface BottomNavOptionsProps {
    page: number,
    index: number,
    icon: string,
    href: string
}

export interface LayoutProps {
    children: ReactNode
}

