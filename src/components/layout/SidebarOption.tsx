import React from "react";
import { Link } from "react-router-dom";
import DynamicFaIcon from "../DynamicFaIcon";
import { SideBarOptionProps } from "../../types/layout";

const SideBarOption: React.FC<SideBarOptionProps> = ({ page, index, label, icon, href, isCollapsed }) => {
    return (
        <li>
            <Link
                to={href}
                className={`w-full flex flex-row items-center ${isCollapsed ? 'justify-center' : 'justify-start '} ${page === index ? 'bg-gray-200' : ''} h-10 rounded-lg transition-colors duration-200 hover:bg-gray-200`}
            >
                <DynamicFaIcon name={icon} className={`${page === index ? 'text-gray-700' : ''} w-14`} />
                {!isCollapsed && <span className={`ml-2 text-gray-600 text-sm ${page === index ? 'text-gray-700 font-semibold' : ''}`}>{label}</span>}
            </Link>
        </li>
    );
}

export default SideBarOption;