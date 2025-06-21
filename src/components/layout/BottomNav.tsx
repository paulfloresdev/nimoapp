import React, { useCallback } from "react";

import BottomNavOptions from "./BottomNavOptions";
import { BottomNavProps } from "../../types/layout";

const BottomNav: React.FC<BottomNavProps> = ({ page }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-neutral-50 border-t p-2 flex justify-around lg:hidden z-50">
      <ul className="w-full flex flex-row justify-between space-x-2">
        <BottomNavOptions page={page} index={0} icon="FaPlusCircle" href="/dashboard/" />
        <BottomNavOptions page={page} index={1} icon="FaCalendarCheck" href="/dashboard/recurrents" />
        <BottomNavOptions page={page} index={2} icon="FaCalendar" href="/dashboard/months" />
        <BottomNavOptions page={page} index={3} icon="FaMoneyCheckAlt" href="/dashboard/cards" />
        <BottomNavOptions page={page} index={4} icon="FaUserFriends" href="/dashboard/contacts" />

      </ul>
    </nav>
  );
}

export default BottomNav;
