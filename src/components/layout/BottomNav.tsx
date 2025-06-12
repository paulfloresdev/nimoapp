import React from "react";

import BottomNavOptions from "./BottomNavOptions";
import { BottomNavProps } from "../../types/layout";

const BottomNav: React.FC<BottomNavProps> = ({ page }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-neutral-100 border-t p-2 flex justify-around lg:hidden z-50">
      <ul className="w-full flex flex-row justify-between space-x-2">
        <BottomNavOptions page={page} index={0} icon="FaHome" href="/dashboard/" />
        <BottomNavOptions page={page} index={1} icon="FaClipboardList" href="/dashboard/months" />
        <BottomNavOptions page={page} index={2} icon="FaExchangeAlt" href="/" />
        <BottomNavOptions page={page} index={3} icon="FaMoneyCheckAlt" href="/" />
        <BottomNavOptions page={page} index={4} icon="FaUserFriends" href="/" />
      </ul>
    </nav>
  );
}

export default BottomNav;
