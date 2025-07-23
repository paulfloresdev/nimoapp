import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/configStore/store";
import { MonthBalanceParams } from "../../../types/monthBalance";
import { getMonthBalanceRequest } from "../../../store/features/monthBalance/monthBalanceSlice";
import { Card, Divider } from "@heroui/react";
import { Formatters } from "../../../helper/utils/Formatters";
import { BarChart, Gauge, gaugeClasses, PieChart, pieArcLabelClasses } from "@mui/x-charts";

interface MonthBalanceDetail {
    amount: number | undefined | null;
    label: string;
    difference?: number | undefined | null;
    isColored?: boolean;
    isColoredDifference?: boolean;
    className?: string;
}

export const MonthBalanceDetail: React.FC<MonthBalanceDetail> = ({ amount, label, isColored, className, difference, isColoredDifference }) => {
    return (
        <div className={`w-full flex flex-col items-center ${className}`}>
            <div className="flex flex-col justify-center items-center gap-1">
                <span className={`text-lg font-semibold ${!isColored ? '' : ((amount ?? 0) < 0 ? 'text-rose-500' : (amount ?? 0) > 0 ? 'text-emerald-500' : '')}`}>{Formatters.currency(amount ?? 0)}</span>
                {difference && <span className={`text-sm font-medium ${!isColoredDifference ? '' : ((difference ?? 0) < 0 ? 'text-rose-500' : (difference ?? 0) > 0 ? 'text-emerald-500' : '')}`}>({Formatters.currency(difference ?? 0)})</span>}
            </div>
            <span className="text-xs text-gray-500 px-2 py-1 bg-neutral-100 rounded-md font-medium mt-2 text-center">{label}</span>
        </div>
    );
}

interface MonthBalancesParams {
    year: number | undefined;
    month: number | undefined;
}

const MonthBalances: React.FC<MonthBalancesParams> = ({ year, month }) => {
    const dispatch = useDispatch();

    const monthBalanceState = useSelector((state: RootState) => state.month_balance);

    useEffect(() => {
        const monthBalanceParams: MonthBalanceParams = {
            year: year,
            month: month,
        };

        dispatch(getMonthBalanceRequest(monthBalanceParams));
    }, [dispatch]);

    return (
        <div className="w-full h-full flex flex-col gap-y-6">
            {
                monthBalanceState.loading ? (
                    <div>Cargando...</div>
                ) : (
                    <div className="w-full flex flex-col lg:flex-row gap-6 pb-24">

                        <div className="w-full flex flex-col gap-6 items-center">
                            <span className="font-semibold">Saldos</span>
                            <div className="w-full flex flex-col lg:flex-row gap-6">
                                <Card className="w-full lg:w-1/3 flex flex-col gap-6 p-4 justify-center">
                                    <MonthBalanceDetail
                                        amount={monthBalanceState.data?.debit?.initial_balance}
                                        label="Inicial"
                                    />
                                </Card>
                                <Card className="w-full lg:w-2/3 flex flex-row gap-6 p-4">
                                    <MonthBalanceDetail
                                        amount={monthBalanceState.data?.debit?.final_balance}
                                        label="Final real"
                                        difference={monthBalanceState.data?.debit?.difference}
                                        isColoredDifference
                                    />
                                    <MonthBalanceDetail
                                        amount={monthBalanceState.data?.debit?.projected_final_balance}
                                        label="Final proyectado"
                                        difference={monthBalanceState.data?.debit?.projected_difference}
                                        isColoredDifference
                                    />
                                </Card>
                            </div>
                            <div className="w-full flex flex-col lg:flex-row gap-6">
                                <Card className={`flex flex-row lg:flex-col gap-6 p-4 items-center justify-center ${((((monthBalanceState.data?.debit?.expenses ?? 0) * -1) > 0) && ((monthBalanceState.data?.debit?.incomes ?? 0) > 0)) ? 'w-full' : 'w-full lg:w-1/2 mr-0 lg:mr-6'}`}>
                                    <MonthBalanceDetail
                                        amount={monthBalanceState.data?.debit?.incomes}
                                        label="Ingresos"
                                        isColored
                                    />
                                    <MonthBalanceDetail
                                        amount={monthBalanceState.data?.debit?.expenses}
                                        label="Gastos"
                                        isColored
                                    />
                                </Card>
                                {(((monthBalanceState.data?.debit?.expenses ?? 0) * -1) > 0) && ((monthBalanceState.data?.debit?.incomes ?? 0) > 0) && <Card className="w-full flex flex-row gap-6 p-4">
                                    < PieChart
                                        sx={{
                                            [`& .${pieArcLabelClasses.root}`]: {
                                                fontWeight: 'medium',
                                                fontSize: '0.75rem',
                                                fill: '#fff', // Esto hace que el texto sea blanco
                                            },
                                        }}
                                        series={[
                                            {
                                                arcLabel: (item) => `${Formatters.percentage(item.value, ((monthBalanceState.data?.debit?.expenses ?? 0) * -1) + (monthBalanceState.data?.debit?.incomes ?? 0))}`,
                                                data: [
                                                    { id: 0, value: (monthBalanceState.data?.debit?.expenses ?? 0) * -1, label: 'Gastos' },
                                                    { id: 1, value: monthBalanceState.data?.debit?.incomes ?? 0, label: 'Ingresos' },
                                                ],
                                                cornerRadius: 8,
                                                innerRadius: 24,
                                                paddingAngle: 4,
                                            },
                                        ]}
                                        colors={['#f43f5e', '#10b981']}
                                        width={150}
                                        height={150}
                                    />
                                </Card>}
                            </div>
                        </div>
                        <Divider orientation="vertical" className="hidden lg:flex" />
                        <Divider className="lg:hidden flex" />
                        <div className="w-full flex flex-col gap-6 items-center">
                            <span className="font-semibold">Deudas</span>
                            <div className="w-full flex flex-col lg:flex-row gap-6">
                                <Card className="w-full flex flex-row lg:flex-col gap-6 p-4 items-center justify-center">
                                    <MonthBalanceDetail
                                        amount={monthBalanceState.data?.credit?.expenses}
                                        label="Gastos"
                                        isColored
                                    />
                                    <MonthBalanceDetail
                                        amount={monthBalanceState.data?.credit?.payments}
                                        label="Pagos"
                                        isColored
                                    />
                                </Card>
                                <Card className="w-full flex flex-row lg:flex-col gap-6 p-4 items-center justify-center">
                                    <MonthBalanceDetail
                                        amount={monthBalanceState.data?.credit?.initial_bills}
                                        label="Deudas iniciales"
                                        isColored
                                    />
                                    <MonthBalanceDetail
                                        amount={monthBalanceState.data?.credit?.final_bills}
                                        label="Deudas finales"
                                        isColored
                                    />
                                </Card>
                            </div>
                            <div className="w-full flex flex-col lg:flex-row gap-6">
                                <Card className="w-full flex flex-row lg:flex-col gap-6 p-4 items-center justify-center">
                                    <MonthBalanceDetail
                                        amount={(monthBalanceState.data?.credit?.initial_bills ?? 0) + (monthBalanceState.data?.credit?.expenses ?? 0)}
                                        label="Deudas acumuladas"
                                        isColored
                                    />
                                </Card>
                                <Card className="w-full p-4 items-center">
                                    <Gauge
                                        value={monthBalanceState.data?.credit?.payments}
                                        valueMax={((monthBalanceState.data?.credit?.initial_bills ?? 0) * -1) + ((monthBalanceState.data?.credit?.expenses ?? 0) * -1)}
                                        startAngle={-110}
                                        endAngle={110}
                                        cornerRadius={16}
                                        height={160}
                                        sx={(theme) => ({
                                            [`& .${gaugeClasses.valueText}`]: {
                                                fontSize: 12,
                                            },
                                            [`& .${gaugeClasses.valueArc}`]: {
                                                fill: '#10b981',
                                            },
                                            [`& .${gaugeClasses.referenceArc}`]: {
                                                fill: '#e5e5e5',
                                            },
                                        })}
                                        text={({ value, valueMax }) => `${Formatters.currency(value ?? 0)} / ${Formatters.currency(valueMax)}`}
                                    />
                                    <span className="text-xs text-gray-500 px-2 py-1 bg-neutral-100 rounded-md font-medium mt-2 text-center">Avance de pago</span>
                                </Card>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default MonthBalances;