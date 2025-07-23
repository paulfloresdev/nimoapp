import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/configStore/store";
import { CardBalanceParams, CreditCardBalance, DebitCardBalance } from "../../../types/cardBalance";
import { getCardBalanceRequest } from "../../../store/features/cardBalance/cardBalanceSlice";
import { Card, Divider, Select, SelectItem } from "@heroui/react";
import { BankCard } from "../cards/Cards";
import TransactionDetail, { TransactionField } from "../transaction/TransactionDetail";
import { Formatters } from "../../../helper/utils/Formatters";
import { MonthBalanceDetail } from "./MonthBalances";
const baseStorageUrl = import.meta.env.VITE_SITE_BASE_STORAGE_URL_BACKEND;

interface CardBalancesParams {
    year: number | undefined;
    month: number | undefined;
}

const CardBalances: React.FC<CardBalancesParams> = ({ year, month }) => {
    const dispatch = useDispatch();

    const cardBalanceState = useSelector((state: RootState) => state.card_balance);

    const [creditCard, setCreditCard] = useState<CreditCardBalance | null>(null);
    const [debitCard, setDebitCard] = useState<DebitCardBalance | null>(null);


    useEffect(() => {
        const cardBalanceParams: CardBalanceParams = {
            year: year,
            month: month,
        }

        dispatch(getCardBalanceRequest(cardBalanceParams));
    }, [dispatch]);

    return (
        <div className="w-full h-full flex flex-col gap-y-6">
            {
                cardBalanceState.loading ? (
                    <div>Cargando...</div>
                ) : (
                    <div className="w-full flex flex-col lg:flex-row gap-6 pb-24">
                        <div className="w-full flex flex-col gap-6">
                            <Select
                                required
                                size="md"
                                variant="flat"
                                label="Débito"
                                labelPlacement="outside"
                                placeholder="Débito"
                                className="w-full"
                                onChange={(e) => {
                                    const selectedCard = cardBalanceState.data?.debit?.find(item => item.card.id.toString() === e.target.value);
                                    console.log(`Target value: ${e.target.value}`)
                                    console.log(`Selected card: ${selectedCard}`);
                                    setDebitCard(selectedCard ?? null);
                                }}
                            >
                                {
                                    cardBalanceState.data?.debit?.length
                                        ? cardBalanceState.data.debit.map((item: DebitCardBalance) => (
                                            <SelectItem
                                                key={item.card.id}
                                                textValue={`${item.card.bank.name} ${item.card.numbers}`}
                                                endContent={
                                                    <div className={`p-2 w-10 max-h-6 flex flex-col justify-center items-center rounded-md ${item.card.network?.name === 'Visa' ? 'bg-blue-700' : 'bg-gray-200'}`}>
                                                        <img src={`${baseStorageUrl}${item.card.network?.img_path}`} alt="" />
                                                    </div>
                                                }
                                            >
                                                {`${item.card.bank.name} ${item.card.numbers}`}
                                            </SelectItem>
                                        ))
                                        : []
                                }
                            </Select>
                            {debitCard && <>
                                <div className="w-full flex flex-col lg:flex-row gap-6">
                                    <div className="w-full lg:w-2/3"><BankCard card={debitCard?.card} /></div>
                                    <Card className="w-full lg:w-1/3 p-4 flex flex-row lg:flex-col items-center justify-center gap-6">
                                        <MonthBalanceDetail
                                            amount={debitCard?.initial_balance}
                                            label="Inicial"
                                        />
                                        <MonthBalanceDetail
                                            amount={debitCard?.final_balance}
                                            label="Final"
                                            difference={debitCard?.difference}
                                            isColoredDifference
                                        />
                                    </Card>
                                </div>
                                <div className="w-full flex flex-col lg:flex-row gap-6">
                                    <div className="w-full lg:w-8/12 flex flex-row gap-6">
                                        <Card className="w-full p-4 items-center justify-center">
                                            <MonthBalanceDetail
                                                amount={debitCard?.incomes}
                                                label="Ingresos"
                                            />
                                        </Card>
                                        <Card className="w-full p-4 items-center justify-center">
                                            <MonthBalanceDetail
                                                amount={debitCard?.expenses}
                                                label="Gatos"
                                            />
                                        </Card>
                                    </div>
                                    <Card className="w-full lg:w-4/12 p-4 items-center justify-center">
                                        <MonthBalanceDetail
                                            amount={debitCard?.payments}
                                            label="Pago de TDC"
                                        />
                                    </Card>
                                </div>
                            </>}
                        </div>
                        <Divider orientation="vertical" className="hidden lg:flex" />
                        <Divider className="lg:hidden flex" />
                        <div className="w-full flex flex-col gap-6">
                            <Select
                                required
                                size="md"
                                variant="flat"
                                label="Crédito"
                                labelPlacement="outside"
                                placeholder="Crédito"
                                className="w-full"
                                onChange={(e) => {
                                    const selectedCard = cardBalanceState.data?.credit?.find(item => item.card.id.toString() === e.target.value);
                                    console.log(`Target value: ${e.target.value}`)
                                    console.log(`Selected card: ${selectedCard}`);
                                    setCreditCard(selectedCard ?? null);
                                }}
                            >
                                {
                                    cardBalanceState.data?.credit?.length
                                        ? cardBalanceState.data.credit.map((item: CreditCardBalance) => (
                                            <SelectItem
                                                key={item.card.id}
                                                textValue={`${item.card.bank.name} ${item.card.numbers}`}
                                                endContent={
                                                    <div className={`p-2 w-10 max-h-6 flex flex-col justify-center items-center rounded-md ${item.card.network?.name === 'Visa' ? 'bg-blue-700' : 'bg-gray-200'}`}>
                                                        <img src={`${baseStorageUrl}${item.card.network?.img_path}`} alt="" />
                                                    </div>
                                                }
                                            >
                                                {`${item.card.bank.name} ${item.card.numbers}`}
                                            </SelectItem>
                                        ))
                                        : []
                                }
                            </Select>
                            {creditCard && <>
                                <div className="w-full flex flex-col lg:flex-row gap-6">
                                    <div className="w-full lg:w-2/3"><BankCard card={creditCard?.card} /></div>
                                    <Card className="w-full lg:w-1/3 h-full p-4 flex flex-row lg:flex-col items-center justify-center gap-6">
                                        <MonthBalanceDetail
                                            amount={creditCard.initial_balance}
                                            label="Adeudo inicial"
                                            isColored
                                        />
                                    </Card>
                                </div>
                                <div className="w-full flex flex-row gap-6">
                                    <Card className="w-full p-4 items-center justify-center">
                                        <MonthBalanceDetail
                                            amount={creditCard.bills}
                                            label="Deudas del mes"
                                            isColored
                                        />
                                    </Card>
                                    <Card className="w-full p-4 items-center justify-center">
                                        <MonthBalanceDetail
                                            amount={creditCard.payments}
                                            label="Pagos del mes"
                                            isColored
                                        />
                                    </Card>
                                </div>
                                <Card className="w-full h-full p-4 flex flex-row lg:flex-col items-center justify-center gap-6">
                                    <MonthBalanceDetail
                                        amount={creditCard.final_balance}
                                        label="Adeudo final"
                                        isColored
                                    />
                                </Card>
                            </>}
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default CardBalances;