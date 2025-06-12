import { Button } from "@heroui/react";
import React from "react";
import { Link } from "react-router-dom";
import DynamicFaIcon from "../DynamicFaIcon";
import { BottomNavOptionsProps } from "../../types/layout";

const BottomNavOptions: React.FC<BottomNavOptionsProps> = ({page, index, icon, href}) => {
    return (
        <li className="flex-1 w-10">
            <Button
                variant="light"
                className={`pl-2 w-full flex items-center justify-center ${page === index ? 'text-gray-600' : ''}`}
                as={Link}
                to={href}
            >
                <DynamicFaIcon name={icon} className={`w-10 ${page === index ? 'text-gray-600' : ''}`}/>
            </Button>
        </li>

    );
}

export default BottomNavOptions;