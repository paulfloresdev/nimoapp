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

const RegisterTransaction: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [transactionTypeId, setTransactionTypeId] = useState<number|undefined>(undefined);
    const [categoryId, setCategoryId] = useState<number|undefined>(undefined);
    const [cardTypeId, setCardTypeId] = useState<number|undefined>(1);
    const [cardId, setCardId] = useState<number|undefined>(undefined);
    const [concept, setConcept] = useState<string|undefined>(undefined);
    const [amount, setAmount] = useState<string|undefined>(undefined);
    const [transactionDate, setTransactionDate] = useState<string|undefined>(undefined);
    const [accountingDate, setAccountingDate] = useState<string|undefined>(undefined);
    const [notes, setNotes] = useState<string|undefined>(undefined);
    const [transactionTypeAlert, setTransactionTypeAlert] = useState<boolean|undefined>(undefined);
    const [cateogoryAlert, setCategoryAlert] = useState<boolean|undefined>(undefined);
    const [cardAlert, setCardAlert] = useState<boolean|undefined>(undefined);

    const { debit, credit, loading, error } = useSelector((state: RootState) => state.cards);
    const transactionsState = useSelector((state: RootState) => state.transactions);

    useEffect(() => {
        dispatch(indexCardsRequest());
    }, [dispatch]);

    useEffect(() => {
        if (transactionsState.error) {
            addToast({
                variant: "flat",
                color: "danger",
                title: "Error",
                description: transactionsState.error
            });
        }
        if (transactionsState.message) {
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
        }
    }, [transactionsState]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTransactionTypeAlert(transactionTypeId === undefined);
        setCategoryAlert(categoryId === undefined);
        setCardAlert(cardId === undefined);
        if (transactionTypeAlert || cateogoryAlert || cardAlert) {
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
        };

        dispatch(storeTransactionsRequest(storeTransactionParams));
    };

    
    return (
        <form 
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-y-6"
        >
            <div className="w-full flex flex-col gap-y-6">
                <span className="font-medium text-center">Información general</span>
                <Select
                    required={true}
                    size="md"
                    variant="flat"
                    label="Tipo de movimiento"
                    placeholder="Tipo de movimiento"
                    labelPlacement="outside"
                    value={transactionTypeId}
                    color={transactionTypeAlert ? 'danger' : 'default'}
                    onChange={(e) => {
                        setTransactionTypeId(parseInt(e.target.value));
                        setTransactionTypeAlert(e.target.value === undefined);
                        if(parseInt(e.target.value) !== 2){
                            setCategoryId(12);
                        }else{
                            setCategoryId(undefined);
                        }
                        if(e.target.value === '1'){
                            if(cardTypeId !== 1){
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
                    color={cateogoryAlert ? 'danger' : undefined}
                    onChange={(e) => {
                        setCategoryId(parseInt(e.target.value));
                        setCategoryAlert(e.target.value === undefined);
                    }}
                    className={transactionTypeId !== 2 ? 'hidden' : ''}
                >
                    {categories.map((item) => (
                        <SelectItem key={item.key}>{item.label}</SelectItem>
                    ))}
                </Select>
                <RadioGroup
                    size="md"
                    label="Tipo de tarjeta"
                    orientation="horizontal"
                    value={cardTypeId?.toString()}
                    onChange={(e) => {
                        const parsed = parseInt(e.target.value);
                        setCardTypeId(parsed);
                        setCardId(undefined);
                        if(parsed === 1) {setAccountingDate(transactionDate);}
                        
                    }}
                    className="text-sm"
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
                </RadioGroup>
                <div>
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
                            ) : (
                                <Select
                                    required
                                    size="md"
                                    variant="flat"
                                    label="Tarjeta"
                                    labelPlacement="outside"
                                    placeholder="Tarjeta"
                                    value={cardId}
                                    color={cardAlert ? 'danger' : undefined}
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
                                                    <img className="w-9" src={`${baseStorageUrl}${item.network?.img_path}`} alt="" />
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
                                                    <img className="w-9" src={`${baseStorageUrl}${item.network?.img_path}`} alt="" />
                                                }
                                            >
                                                {`${item.bank?.name} ${item.numbers}`}
                                            </SelectItem>
                                            )))
                                            : null
                                        )
                                    }
                                    
                                </Select>

                            )}
                        </>
                    )}
                </div>
            </div>
            <div className="w-full flex flex-col gap-y-6">
                <span className="font-medium text-center">Detalle</span>
                <Input
                    required
                    size='lg'
                    variant='bordered'
                    label='Concepto'
                    labelPlacement="outside"
                    placeholder="Pago de Nómina"
                    type="text"
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                />
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
                />
                <div className="w-full flex flex-row gap-x-6 justify-between">
                    
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
                            if(cardTypeId === 1){
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
                    className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 mt-6"
                    isLoading={transactionsState.loading}
                >
                    Registrar
                </Button>
            </div>
            
        </form>
    );
}

export default RegisterTransaction;