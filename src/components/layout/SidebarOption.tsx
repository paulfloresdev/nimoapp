import { Button } from "@heroui/react";
import React from "react";
import { Link } from "react-router-dom";
import DynamicFaIcon from "../DynamicFaIcon";
import { SideBarOptionProps } from "../../interfaces/layoutInterfaces";

const SideBarOption: React.FC<SideBarOptionProps> = ({ page, index, label, icon, href }) => {
    return (
        <li>
            <Link 
                to={href}
                className={`w-full flex items-center justify-center ${page === index ? 'bg-gray-300 text-red-500' : ''} h-14 rounded-lg transition-colors duration-200 hover:bg-gray-200`}
            >
                <DynamicFaIcon name={icon} className={`${page === index ? 'text-gray-600' : ''} w-14`} />
                {/*<span className={`ml-2 text-gray-700 ${page === index ? 'text-slate-950 font-semibold' : ''}`}>{label}</span>*/}
            </Link>
        </li>
    );
}

export default SideBarOption;