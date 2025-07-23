import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StoreTransactionParams, Transaction } from "../../../types/transactions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/configStore/store";
import { indexCardsRequest } from "../../../store/features/cards/cardsSlice";
import { addToast, Button, Input, Select, SelectItem, Skeleton, Textarea } from "@heroui/react";
import { resetIncomeRelationsRequest, storeIncomeRelationsRequest, verifyIncomeRelationsRequest } from "../../../store/features/incomeRelations/incomeRelationsSlice";
import { StoreIncomeRelationParams, VerifyIncomeRelationParams } from "../../../types/incomeRelations";
import { storeTransactionsRequest } from "../../../store/features/transactions/transactionsSlice";
import { indexContactRequest } from "../../../store/features/contacts/contactsSlice";
import { Formatters } from "../../../helper/utils/Formatters";
const baseStorageUrl = import.meta.env.VITE_SITE_BASE_STORAGE_URL_BACKEND;

const AddIncomeRelation: React.FC = () => {
    const location = useLocation();
    const { transaction } = location.state as { transaction: Transaction };
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { message, verified, stored, item, error, loading } = useSelector((state: RootState) => state.income_relations);
    const { debit, loading: loadingCards, error: errorCards } = useSelector((state: RootState) => state.cards);
    const transactionsState = useSelector((state: RootState) => state.transactions);
    const contactsState = useSelector((state: RootState) => state.contacts);

    const [contactId, setContactId] = useState<number | undefined>(undefined);
    const [cardId, setCardId] = useState<number | undefined>(undefined);
    const [concept, setConcept] = useState<string | undefined>(transaction.concept ?? undefined);
    const [amount, setAmount] = useState<string | undefined>(undefined);
    const [transactionDate, setTransactionDate] = useState<string | undefined>(transaction.accounting_date?.slice(0, 10));
    const [notes, setNotes] = useState<string | undefined>(undefined);

    const [cardAlert, setCardAlert] = useState<boolean | undefined>(undefined);
    const [contactAlert, setContactAlert] = useState<boolean | undefined>(undefined);

    const [globalLoaging, setGlobalLoading] = useState<boolean>(false);

    useEffect(() => {
        dispatch(resetIncomeRelationsRequest());
        dispatch(indexCardsRequest());
        dispatch(indexContactRequest());
    }, [dispatch]);

    //  Detecta cuando responde la Verificacion API
    useEffect(() => {
        if (verified !== null) {
            if (globalLoaging) {
                if (verified) {
                    //  Lanza el StoreTransaction si es true
                    const storeTransactionParams: StoreTransactionParams = {
                        concept: concept ?? "",
                        amount: parseFloat(amount ?? "0"),
                        transaction_date: transactionDate ?? "",
                        accounting_date: transactionDate ?? "",
                        place: "",
                        notes: notes ?? "",
                        category_id: 12,
                        type_id: 1,
                        card_id: cardId ?? 0,
                        second_card_id: undefined
                    };

                    dispatch(storeTransactionsRequest(storeTransactionParams));
                } else {
                    // Lanza toast si es false
                    addToast({
                        variant: "flat",
                        color: "danger",
                        title: "Error",
                        description: error
                    });
                    setGlobalLoading(false);
                    dispatch(resetIncomeRelationsRequest());
                }
            }
        }
    }, [verified]);

    //  Detecta cambios en el transactionState
    useEffect(() => {
        if (globalLoaging) {
            if (transactionsState.error) {
                //  Lanaza toast si hubo error al hacer el Store
                addToast({
                    variant: "flat",
                    color: "danger",
                    title: "Error",
                    description: transactionsState.error
                });
                setGlobalLoading(false);
                dispatch(resetIncomeRelationsRequest());
            } else if (transactionsState.message) {
                // Lanza Store de IncomeRelation
                const storedTransaction: Transaction | null = transactionsState.data;

                const storeIncomeRelationParams: StoreIncomeRelationParams = {
                    amount: parseFloat(amount ?? '0'),
                    contact_id: contactId,
                    from_id: storedTransaction?.id,
                    to_id: transaction.id
                }

                dispatch(storeIncomeRelationsRequest(storeIncomeRelationParams));

                /**/
            }
        }
    }, [transactionsState]);

    useEffect(() => {
        if (globalLoaging) {
            if (stored !== null) {
                console.log("entre aqui null");
                dispatch(resetIncomeRelationsRequest());
                if (stored) {
                    addToast({
                        variant: "flat",
                        color: "success",
                        title: "Registro exitoso",
                        timeout: 5000,
                    });

                    navigate(
                        '/dashboard/transaction',
                        {
                            state: {
                                transaction: transaction
                            }
                        }
                    );
                } else {
                    // Lanza toast si es false
                    addToast({
                        variant: "flat",
                        color: "danger",
                        title: "Error",
                        description: error
                    });
                }
            }
            setGlobalLoading(false);
        }
    }, [stored]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setGlobalLoading(true);

        //  Validacion formulario
        setCardAlert(cardId === undefined);
        setContactAlert(contactId === undefined);
        if (cardAlert && contactAlert) {
            setGlobalLoading(false);
            return;
        }

        //  Verificacion API
        const verifyIncomeRelationParams: VerifyIncomeRelationParams = {
            amount: parseFloat(amount ?? '0'),
            to_id: transaction.id
        }
        dispatch(verifyIncomeRelationsRequest(verifyIncomeRelationParams));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-y-6 pb-12">
            <div className="w-full">
                <span className="font-medium">Agregar ingreso vinculado</span>
            </div>
            <div className="w-full flex flex-col lg:flex-row gap-6">
                {
                    contactsState.loading ? (
                        <div className="w-full h-16 flex flex-col justify-between">
                            <Skeleton className="w-28 h-4 rounded-xl">
                                a
                            </Skeleton>
                            <Skeleton className="w-full h-10 rounded-xl">
                                a
                            </Skeleton>
                        </div>
                    ) : (
                        <>
                            {contactsState.error !== null ? (
                                <div>{contactsState.error}</div>
                            ) : (
                                <>
                                    {contactsState.collection?.data ? (
                                        <Select
                                            required
                                            size="lg"
                                            variant="flat"
                                            label="Contacto"
                                            labelPlacement="outside"
                                            placeholder="Contacto"
                                            value={contactId?.toString()}
                                            color={contactAlert ? 'danger' : undefined}
                                            className="w-full"
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value);
                                                setContactId(value);
                                                setContactAlert(isNaN(value));
                                            }}
                                        >
                                            {contactsState.collection.data.map((item) => (
                                                <SelectItem key={item.id}>
                                                    {item.alias}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                    ) : null}

                                </>


                            )
                            }
                        </>
                    )
                }
                {
                    loadingCards ? (
                        <div className="w-full h-16 flex flex-col justify-between">
                            <Skeleton className="w-28 h-4 rounded-xl">
                                a
                            </Skeleton>
                            <Skeleton className="w-full h-10 rounded-xl">
                                a
                            </Skeleton>
                        </div>
                    ) : (
                        <>
                            {errorCards !== null ? (
                                <div>{errorCards}</div>
                            ) : (
                                <Select
                                    required
                                    size="lg"
                                    variant="flat"
                                    label="Tarjeta de débito"
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
                                        debit && debit.map((item) => (
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
                                        )
                                        )
                                    }

                                </Select>
                            )
                            }
                        </>
                    )
                }
            </div>
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
            <div className="w-full">
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
                    }}
                    className={`min-w-1 w-1/2`}
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
                isLoading={globalLoaging}
            >
                Registrar
            </Button>
        </form>
    );
}

export default AddIncomeRelation;