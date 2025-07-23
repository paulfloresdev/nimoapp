import React from "react";
import { useLocation } from "react-router-dom";
import { Formatters } from "../../../helper/utils/Formatters";
import { Tab, Tabs } from "@heroui/react";
import MonthBalances from "./MonthBalances";
import CardBalances from "./CardBalances";
import MonthTransactions from "./MonthTransactions";
import MonthRelations from "./MonthRelations";
const MonthPage: React.FC = () => {
    const location = useLocation();
    const { year, month } = location.state as { year: number, month: number };

    return (
        <div className="w-full h-full flex flex-col gap-y-6">
            <span className="font-semibold">{`${Formatters.spanishMonth(month)} ${year}`}</span>
            <Tabs size="md">
                <Tab title="Balances" className="h-full">
                    <MonthBalances year={year} month={month} />
                </Tab>
                <Tab title="Tarjetas" className="h-full">
                    <CardBalances year={year} month={month} />
                </Tab>
                <Tab title="Movimientos" className="h-full">
                    <MonthTransactions year={year} month={month} />
                </Tab>
                <Tab title="Vinculados" className="h-full">
                    <MonthRelations year={year} month={month} />
                </Tab>
            </Tabs>
        </div >
    );
}

export default MonthPage;