import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getYearsWithRequest } from "../../../store/features/yearsWith/yearsWithSlice";
import { RootState } from "../../../store/configStore/store";
import { Card, Pagination, Select, SelectItem, Skeleton } from "@heroui/react";
import { getMonthsWithRequest } from "../../../store/features/monthsWith/monthsWithSlice";
import { MonthsWithParams } from "../../../types/transactions";
import { Formatters } from "../../../helper/utils/Formatters";

const MonthList: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const yearsWithState = useSelector((state: RootState) => state.years_with);
    const [year, setYear] = useState<number | undefined>(undefined);

    const monthsWithState = useSelector((state: RootState) => state.months_with);

    const [page, setPage] = useState<number>(1);

    useEffect(() => {
        dispatch(getYearsWithRequest());

        const monthsWithParams: MonthsWithParams = {
            page: undefined,
            year: 2025
        };

        dispatch(getMonthsWithRequest(monthsWithParams))
    }, [dispatch]);

    useEffect(() => {
        setPage(1);

        const monthsWithParams: MonthsWithParams = {
            page: page.toString(),
            year: year,
        };

        dispatch(getMonthsWithRequest(monthsWithParams))
    }, [year]);

    useEffect(() => {

        const monthsWithParams: MonthsWithParams = {
            page: page.toString(),
            year: year,
        };

        dispatch(getMonthsWithRequest(monthsWithParams))
    }, [page]);

    return (
        <div className="w-full lg:h-dscreen flex flex-col gap-y-6">
            <span className="font-semibold">Presupuestos mensuales</span>
            {
                yearsWithState.loading ? (
                    <div className="w-full flex flex-row justify-start">
                        <div className="w-full lg:w-1/6 space-y-2">
                            <Skeleton className="w-10 h-4 rounded-xl" />
                            <Skeleton className="w-full h-10 rounded-xl" />
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex flex-row justify-start">
                        <Select
                            size="md"
                            variant="flat"
                            label="Año"
                            placeholder="Año"
                            labelPlacement="outside"
                            value={year}
                            className="w-full lg:w-1/6"
                            onChange={(e) => {
                                const value = e.target.value;
                                setYear(value === "" ? undefined : parseInt(value));
                            }}
                        >
                            {
                                yearsWithState.data && yearsWithState?.data.map((item) => (
                                    <SelectItem key={item} textValue={item.toString()}>
                                        {item}
                                    </SelectItem>
                                ))
                            }
                        </Select>
                    </div>
                )
            }
            {
                monthsWithState.loading ? (
                    <div className="w-full grid grid-cols-3 lg:grid-cols-12 gap-4">
                        {[...Array(12)].map((_, index) => (
                            <Skeleton
                                key={index}
                                className="aspect-[1] w-full h-full rounded-xl"
                            />
                        ))}
                    </div>

                ) : (
                    <div className="flex flex-col gap-y-6">
                        <div className="w-full grid grid-cols-3 lg:grid-cols-12 gap-4">
                            {
                                monthsWithState.data && monthsWithState.data.data?.map((item) => (
                                    <Card
                                        key={`${item.year}${item.month}`}
                                        className="aspect-[1] p-4 lg:p-3 flex flex-col justify-between hover:border-neutral-400 hover:border-1"
                                        isPressable
                                        onPress={() => {
                                            navigate(`/dashboard/month`, {
                                                state: {
                                                    year: item.year,
                                                    month: item.month,
                                                }
                                            });
                                        }}
                                    >
                                        <span className="font-medium">
                                            {Formatters.shortSpanishMonth(item.month)}
                                        </span>
                                        <span className="text-sm">
                                            {item.year}
                                        </span>
                                    </Card>
                                ))
                            }
                        </div>
                        <div>
                            <Pagination
                                showControls
                                initialPage={1}
                                page={page}
                                total={monthsWithState.data?.last_page ?? 1}
                                className={(monthsWithState.data?.last_page ?? 1) < 2 ? 'hidden' : ''}
                                onChange={(page) => {
                                    setPage(page);
                                }}
                            />
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default MonthList;