import { addToast, Button, Input, Radio, RadioGroup, Select, SelectItem, Skeleton, Textarea } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { cardTypes, categories, transactionTypes } from "../../../types/combos";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/configStore/store";
import { indexCardsRequest } from "../../../store/features/cards/cardsSlice";
import { StoreTransactionParams, Transaction } from "../../../types/transactions";
import { storeTransactionsRequest } from "../../../store/features/transactions/transactionsSlice";
const baseStorageUrl = import.meta.env.VITE_SITE_BASE_STORAGE_URL_BACKEND;
import { useNavigate } from "react-router-dom";
import { resetTransactionsState } from "../../../store/features/transactions/transactionsSlice"

const RegisterTransaction: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [transactionTypeId, setTransactionTypeId] = useState<number | undefined>(undefined);
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
    const [cardTypeId, setCardTypeId] = useState<number | undefined>(1);
    const [cardId, setCardId] = useState<number | undefined>(undefined);
    const [concept, setConcept] = useState<string | undefined>(undefined);
    const [amount, setAmount] = useState<string | undefined>(undefined);
    const [transactionDate, setTransactionDate] = useState<string | undefined>(undefined);
    const [accountingDate, setAccountingDate] = useState<string | undefined>(undefined);
    const [notes, setNotes] = useState<string | undefined>(undefined);
    const [transactionTypeAlert, setTransactionTypeAlert] = useState<boolean | undefined>(undefined);
    const [categoryAlert, setCategoryAlert] = useState<boolean | undefined>(undefined);
    const [cardAlert, setCardAlert] = useState<boolean | undefined>(undefined);
    const [cardAlertA, setCardAlertA] = useState<boolean | undefined>(undefined);
    const [cardAlertB, setCardAlertB] = useState<boolean | undefined>(undefined);

    const { debit, credit, loading, error } = useSelector((state: RootState) => state.cards);
    const transactionsState = useSelector((state: RootState) => state.transactions);

    const [cardAId, setCardAId] = useState<number | undefined>(undefined);
    const [cardBId, setCardBId] = useState<number | undefined>(undefined);

    useEffect(() => {
        dispatch(indexCardsRequest());
    }, [dispatch]);

    // Handle Store Response
    useEffect(() => {
        if (transactionsState.storeSuccess === false) {
            addToast({
                variant: "flat",
                color: "danger",
                title: "Error",
                description: transactionsState.error
            });
            dispatch(resetTransactionsState());
        } else if (transactionsState.storeSuccess === true) {
            const storedTransaction: Transaction | null = transactionsState.data;

            addToast({
                variant: "flat",
                color: "success",
                title: "Registro exitoso",
                timeout: 10000,
                //description: transactionsState.message,
                endContent: <Button
                    onPress={() => {
                        if (storedTransaction) {
                            navigate(
                                '/dashboard/transaction',
                                {
                                    state: {
                                        transaction: storedTransaction
                                    }
                                }
                            );
                        }
                    }}
                    size="md" variant="flat"
                >
                    Detalle
                </Button>,
            });
            dispatch(resetTransactionsState());
        }
    }, [transactionsState]);

    //  Submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        //  Ingresos y gastos
        if (transactionTypeId !== 3) {
            setTransactionTypeAlert(transactionTypeId === undefined);
            setCategoryAlert(categoryId === undefined);
            setCardAlert(cardId === undefined);
            if (transactionTypeAlert || categoryAlert || cardAlert) {
                return;
            }

            const storeTransactionParams: StoreTransactionParams = {
                concept: concept ?? "",
                amount: parseFloat(amount ?? "0"),
                transaction_date: transactionDate ?? "",
                accounting_date: accountingDate ?? "",
                place: "",
                notes: notes ?? "",
                category_id: categoryId ?? 0,
                type_id: transactionTypeId ?? 0,
                card_id: cardId ?? 0,
                second_card_id: undefined
            };

            dispatch(storeTransactionsRequest(storeTransactionParams));
        } else {
            setCardAlertA(cardAId === undefined);
            setCardAlertB(cardBId === undefined);
            if (cardAlertA || cardAlertB) {
                return;
            }

            const storeTransactionParams: StoreTransactionParams = {
                concept: `Pago de TDC`,
                amount: parseFloat(amount ?? "0"),
                transaction_date: transactionDate ?? "",
                accounting_date: transactionDate ?? "",
                place: "",
                notes: notes ?? "",
                category_id: 10,
                type_id: 3,
                card_id: cardAId ?? 0,
                second_card_id: cardBId ?? 0
            };

            dispatch(storeTransactionsRequest(storeTransactionParams));
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-y-6"
        >
            <div className="w-full flex flex-col gap-y-6">
                <span className="font-semibold text-center">Registrar movimiento</span>
                <span className="font-medium text-center">Información general</span>
                <div className="w-full flex flex-col lg:flex-row gap-x-4 gap-y-6">
                    <Select
                        required={true}
                        size="md"
                        variant="flat"
                        label="Tipo de movimiento"
                        placeholder="Tipo de movimiento"
                        labelPlacement="outside"
                        value={transactionTypeId}
                        color={transactionTypeAlert ? 'danger' : 'default'}
                        className="w-full"
                        onChange={(e) => {
                            setTransactionTypeId(parseInt(e.target.value));
                            setTransactionTypeAlert(e.target.value === undefined);
                            if (parseInt(e.target.value) !== 2) {
                                if (e.target.value === '3') {
                                    setCategoryId(10);
                                } else {
                                    setCategoryId(12);
                                }
                            } else {
                                setCategoryId(undefined);
                            }
                            if (e.target.value === '1') {
                                if (cardTypeId !== 1) {
                                    setCardTypeId(1);
                                    setCardAlert(undefined);
                                }
                            }
                        }}
                    >
                        {transactionTypes.map((item) => (
                            <SelectItem key={item.key}>{item.label}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        required
                        size="md"
                        variant="flat"
                        label="Categoría"
                        labelPlacement="outside"
                        placeholder="Categoría"
                        value={categoryId}
                        color={categoryAlert ? 'danger' : undefined}
                        onChange={(e) => {
                            setCategoryId(parseInt(e.target.value));
                            setCategoryAlert(e.target.value === undefined);
                        }}
                        className={transactionTypeId !== 2 ? 'hidden' : 'w-full'}
                    >
                        {categories.map((item) => (
                            <SelectItem key={item.key}>{item.label}</SelectItem>
                        ))}
                    </Select>
                    {transactionTypeId !== 3 && (<RadioGroup
                        size="md"
                        label="Tipo de tarjeta"
                        orientation="horizontal"
                        value={cardTypeId?.toString()}
                        onChange={(e) => {
                            const parsed = parseInt(e.target.value);
                            setCardTypeId(parsed);
                            setCardId(undefined);
                            if (parsed === 1) { setAccountingDate(transactionDate); }

                        }}
                        className="text-sm w-full"
                    >
                        <div className="flex w-full justify-start lg:justify-between space-x-6 lg:space-x-0">
                            {transactionTypeId !== 1 && cardTypes.map((type) => (
                                <Radio key={type.key} value={type.key.toString()}>
                                    {type.label}
                                </Radio>
                            ))}
                            {transactionTypeId === 1 && (
                                <Radio key={1} value={"1"}>
                                    Débito
                                </Radio>
                            )}
                        </div>
                    </RadioGroup>)}
                    <div className="w-full">
                        {loading ? (
                            <div className="w-full h-16 flex flex-col justify-between">
                                <Skeleton className="w-12 h-4 rounded-xl">
                                    a
                                </Skeleton>
                                <Skeleton className="w-full h-10 rounded-xl">
                                    a
                                </Skeleton>
                            </div>

                        ) : (
                            <>
                                {error !== null ? (
                                    <div>{error}</div>
                                ) : (transactionTypeId !== 3) ? (
                                    <Select
                                        required
                                        size="md"
                                        variant="flat"
                                        label="Tarjeta"
                                        labelPlacement="outside"
                                        placeholder="Tarjeta"
                                        value={cardId}
                                        color={cardAlert ? 'danger' : undefined}
                                        className="w-full"
                                        onChange={(e) => {
                                            setCardId(parseInt(e.target.value));
                                            setCardAlert(e.target.value === undefined);
                                        }}
                                    >
                                        {
                                            (cardTypeId === 1 && Array.isArray(debit))
                                                ? (debit.map((item) => (
                                                    <SelectItem
                                                        key={item.id}
                                                        endContent={
                                                            <div className={`p-2 w-10 max-h-6 flex flex-col justify-center items-center rounded-md ${item.network?.name === 'Visa' ? 'bg-blue-700' : 'bg-gray-200'}`}>
                                                                <img src={`${baseStorageUrl}${item.network?.img_path}`} alt="" />
                                                            </div>
                                                        }
                                                    >
                                                        {`${item.bank?.name} ${item.numbers}`}
                                                    </SelectItem>
                                                )))
                                                : ((cardTypeId === 2 && Array.isArray(credit)) ?
                                                    (credit.map((item) => (
                                                        <SelectItem
                                                            key={item.id}
                                                            endContent={
                                                                <div className={`p-2 w-10 max-h-6 flex flex-col justify-center items-center rounded-md ${item.network?.name === 'Visa' ? 'bg-blue-700' : 'bg-gray-200'}`}>
                                                                    <img src={`${baseStorageUrl}${item.network?.img_path}`} alt="" />
                                                                </div>
                                                            }
                                                        >
                                                            {`${item.bank?.name} ${item.numbers}`}
                                                        </SelectItem>
                                                    )))
                                                    : null
                                                )
                                        }

                                    </Select>

                                ) : (
                                    <div className="w-full flex flex-col lg:flex-row gap-y-6 gap-x-4">
                                        <Select
                                            required
                                            size="md"
                                            variant="flat"
                                            label="Tarjeta origen"
                                            labelPlacement="outside"
                                            placeholder="Tarjeta"
                                            value={cardAId}
                                            color={cardAlertA ? 'danger' : undefined}
                                            className="w-full"
                                            onChange={(e) => {
                                                setCardAId(parseInt(e.target.value));
                                                setCardAlertA(e.target.value === undefined);
                                            }}
                                        >
                                            {debit && debit.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    endContent={
                                                        <div className={`p-2 w-10 max-h-6 flex flex-col justify-center items-center rounded-md ${item.network?.name === 'Visa' ? 'bg-blue-700' : 'bg-gray-200'}`}>
                                                            <img src={`${baseStorageUrl}${item.network?.img_path}`} alt="" />
                                                        </div>
                                                    }
                                                >
                                                    {`${item.bank?.name} ${item.numbers}`}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                        <Select
                                            required
                                            size="md"
                                            variant="flat"
                                            label="Tarjeta destino"
                                            labelPlacement="outside"
                                            placeholder="Tarjeta"
                                            value={cardBId}
                                            color={cardAlertB ? 'danger' : undefined}
                                            className="w-full"
                                            onChange={(e) => {
                                                setCardBId(parseInt(e.target.value));
                                                setCardAlertB(e.target.value === undefined);
                                            }}
                                        >
                                            {credit && credit.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    endContent={
                                                        <div className={`p-2 w-10 max-h-6 flex flex-col justify-center items-center rounded-md ${item.network?.name === 'Visa' ? 'bg-blue-700' : 'bg-gray-200'}`}>
                                                            <img src={`${baseStorageUrl}${item.network?.img_path}`} alt="" />
                                                        </div>
                                                    }
                                                >
                                                    {`${item.bank?.name} ${item.numbers}`}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col gap-y-6">
                <span className="font-medium text-center">Detalle</span>
                <div className="w-full flex flex-col lg:flex-row gap-y-6 gap-x-4">
                    {transactionTypeId !== 3 && (<Input
                        required
                        size='lg'
                        variant='bordered'
                        label='Concepto'
                        labelPlacement="outside"
                        placeholder="Pago de Nómina"
                        type="text"
                        value={concept}
                        onChange={(e) => setConcept(e.target.value)}
                    />)}
                    <div className="w-full flex flex-col lg:flex-row gap-y-6 gap-x-4">
                        <Input
                            required
                            size='lg'
                            variant='bordered'
                            label='Monto'
                            labelPlacement="outside"
                            placeholder="20000"
                            type="number"
                            inputMode="decimal"
                            startContent="$"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full lg:w-5/12"
                        />
                        <div className="w-full flex flex-row gap-x-4 justify-between">
                            <Input
                                required
                                size='lg'
                                variant='bordered'
                                label='Fec. movimiento'
                                labelPlacement="outside"
                                type="date"
                                value={transactionDate}
                                onChange={(e) => {
                                    setTransactionDate(e.target.value);
                                    if (cardTypeId === 1) {
                                        setAccountingDate(e.target.value);
                                    }
                                }}
                                className={`min-w-1 w-1/2 ${cardTypeId === 1 ? 'pr-3' : 'pr-0'}`}
                            />
                            <Input
                                required
                                disabled={cardTypeId === 1}
                                size='lg'
                                variant='bordered'
                                label='Fec. contabilidad'
                                labelPlacement="outside"
                                type="date"
                                value={accountingDate}
                                onChange={(e) => setAccountingDate(e.target.value)}
                                className={`min-w-1 w-1/2 ${cardTypeId === 1 ? 'text-neutral-300 hidden' : ''}`}
                            />
                        </div>
                    </div>
                </div>


                <Textarea
                    size='lg'
                    variant='bordered'
                    label='Notas'
                    labelPlacement="outside"
                    placeholder="Notas"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <Button
                    size='lg'
                    type="submit"
                    variant="solid"
                    color='primary'
                    radius='lg'
                    className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 mt-6 text-medium"
                    isLoading={transactionsState.loading}
                >
                    Registrar
                </Button>
            </div>

        </form>
    );
}

export default RegisterTransaction;