import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Transaction, UpdateTransactionParams, UpdateTransactionPayload } from "../../../types/transactions";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Radio, RadioGroup, Select, SelectItem, Skeleton, Textarea } from "@heroui/react";
import { cardTypes, categories } from "../../../types/combos";
import { indexCardsRequest } from "../../../store/features/cards/cardsSlice";
import { RootState } from "../../../store/configStore/store";
import { IncomeRelation } from "../../../types/incomeRelations";
import DynamicFaIcon from "../../../components/DynamicFaIcon";
import TransactionDetail, { TransactionField } from "./TransactionDetail";
import { updateTransactionsRequest } from "../../../store/features/transactions/transactionsSlice";
const baseStorageUrl = import.meta.env.VITE_SITE_BASE_STORAGE_URL_BACKEND;

const UpdateTransaction: React.FC = () => {
    const location = useLocation();
    const { transaction, incomeRelation } = location.state as { transaction: Transaction, incomeRelation: IncomeRelation };
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [categoryId, setCategoryId] = useState<number | undefined>(transaction.category?.id);
    const [categoryAlert, setCategoryAlert] = useState<boolean | undefined>(undefined);
    const [updateCategoryId, setUpdateCategoryId] = useState<boolean>(false);
    const [categoryIsOpen, setCategoryIsOpen] = useState<boolean>(false);

    const [cardTypeId, setCardTypeId] = useState<number | undefined>(transaction.card?.type?.id);

    const [cardId, setCardId] = useState<number | undefined>(transaction.card?.id);
    const [cardAlert, setCardAlert] = useState<boolean | undefined>(undefined);
    const [updateCardId, setUpdateCardId] = useState<boolean>(false);
    const [cardIsOpen, setCardIsOpen] = useState<boolean>(false);

    const [concept, setConcept] = useState<string | undefined>(transaction?.concept ?? '');
    const [amount, setAmount] = useState<string | undefined>(`${(transaction.amount ?? 0) < 0 ? ((transaction.amount ?? 0) * -1) : (transaction.amount)}` ?? '');
    const [transactionDate, setTransactionDate] = useState<string | undefined>(transaction.transaction_date?.slice(0, 10) ?? '');
    const [accountingDate, setAccountingDate] = useState<string | undefined>(transaction.accounting_date?.slice(0, 10) ?? '');
    const [notes, setNotes] = useState<string | undefined>(transaction.notes ?? '');

    const [fromCardId, setFromCardId] = useState<number | undefined>(incomeRelation ? incomeRelation.from_transaction?.card?.id : undefined);
    const [toCardId, setToCardId] = useState<number | undefined>(incomeRelation ? incomeRelation.to_transaction?.card?.id : undefined);
    const [fromCardAlert, setFromCardAlert] = useState<boolean | undefined>(undefined);
    const [toCardAlert, setToCardAlert] = useState<boolean | undefined>(undefined);
    const [updateFromCardId, setUpdateFromCardId] = useState<boolean>(false);
    const [updateToCardId, setUpdateToCardId] = useState<boolean>(false);
    const [fromIsOpen, setFromIsOpen] = useState<boolean>(false);
    const [toIsOpen, setToIsOpen] = useState<boolean>(false);



    const cardsState = useSelector((state: RootState) => state.cards);

    useEffect(() => {
        dispatch(indexCardsRequest());
    }, [dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        //  Ingresos y gastos
        if (transaction.type?.id !== 3) {
            setCategoryAlert(categoryId === undefined);
            setCardAlert(cardId === undefined);
            if (categoryAlert || cardAlert) {
                return;
            }

            const updateTransactionParams: UpdateTransactionParams = {
                concept: concept ?? "",
                amount: parseFloat(amount ?? "0"),
                transaction_date: transactionDate ?? "",
                accounting_date: cardTypeId === 1 ? (transactionDate ?? '') : (accountingDate ?? ''),
                place: "",
                notes: notes ?? "",
                category_id: categoryId ?? 0,
                card_id: cardId ?? 0,
                second_card_id: undefined,
            }

            const updateTransactionPayload: UpdateTransactionPayload = {
                id: transaction.id.toString(),
                data: updateTransactionParams
            }

            dispatch(updateTransactionsRequest(updateTransactionPayload));
        } else {
            setFromCardAlert(fromCardId === undefined);
            setToCardAlert(toCardId === undefined);
            if (fromCardAlert || toCardAlert) {
                return;
            }

            const updateTransactionParams: UpdateTransactionParams = {
                concept: concept ?? "",
                amount: parseFloat(amount ?? "0"),
                transaction_date: transactionDate ?? "",
                accounting_date: transactionDate ?? '',
                place: "",
                notes: notes ?? "",
                category_id: categoryId ?? 0,
                card_id: cardId ?? 0,
                second_card_id: undefined,
            }

            const updateTransactionPayload: UpdateTransactionPayload = {
                id: transaction.id.toString(),
                data: updateTransactionParams
            }

            dispatch(updateTransactionsRequest(updateTransactionPayload));
        }
    }

    //  Pago de tarjeta    
    if ((transaction.type?.id === 1 && transaction.card?.type?.id === 2) || (transaction.type?.id === 3)) {
        return (
            <form
                className="w-full flex flex-col gap-y-6"
            >
                <div className="w-full flex flex-col gap-y-6">
                    <span className="font-semibold text-center">Editar movimiento</span>
                    <div className="w-full lg:w-1/3">
                        <TransactionField
                            classname="!justify-start gap-x-2"
                            name="Tipo de movimiento:"
                            value={transaction.type?.type == 'INCOME' ? 'Ingreso' : transaction.type?.type == 'EXPENSE' ? 'Gasto' : 'Pago de TDC'}
                        />
                    </div>
                    <div className="w-full flex flex-col lg:flex-row gap-y-6 gap-x-4">
                        <div className="w-full flex flex-row gap-x-4 justify-between items-end">
                            {
                                updateFromCardId ? (
                                    <Select
                                        required
                                        size="md"
                                        variant="flat"
                                        label="Tarjeta origen"
                                        labelPlacement="outside"
                                        placeholder="Tarjeta"
                                        value={fromCardId}
                                        color={fromCardAlert ? 'danger' : undefined}
                                        className="w-full"
                                        isOpen={fromIsOpen}
                                        onOpenChange={(open) => open !== fromIsOpen && setFromIsOpen(open)}
                                        onChange={(e) => {
                                            setFromCardId(parseInt(e.target.value));
                                            setFromCardAlert(e.target.value === undefined);
                                        }}
                                    >
                                        {cardsState.debit && cardsState.debit.map((item) => (
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
                                ) : (
                                    <div className="w-full flex-col space-y-1">
                                        <span className="text-sm">Tarjeta origen</span>
                                        <div
                                            onClick={() => {
                                                setUpdateFromCardId(true);
                                                setFromIsOpen(!fromIsOpen);
                                            }}
                                            className="w-full h-10 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl text-slate-600 flex flex-row justify-between items-center cursor-pointer"
                                        >
                                            <span className="text-sm">{`${incomeRelation.from_transaction?.card?.bank?.name} ${incomeRelation.from_transaction?.card?.numbers}`}</span>
                                            <DynamicFaIcon name={'FaChevronDown'} size={11} />
                                        </div>

                                    </div>
                                )
                            }
                        </div>
                        <div className="w-full flex flex-row gap-x-4 justify-between items-end">
                            {
                                updateToCardId ? (
                                    <Select
                                        required
                                        size="md"
                                        variant="flat"
                                        label="Tarjeta destino"
                                        labelPlacement="outside"
                                        placeholder="Tarjeta"
                                        value={toCardId}
                                        color={toCardAlert ? 'danger' : undefined}
                                        className="w-full"
                                        isOpen={toIsOpen}
                                        onOpenChange={(open) => open !== toIsOpen && setToIsOpen(open)}
                                        onChange={(e) => {
                                            setToCardId(parseInt(e.target.value));
                                            setToCardAlert(e.target.value === undefined);
                                        }}
                                    >
                                        {cardsState.credit && cardsState.credit.map((item) => (
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
                                ) : (
                                    <div className="w-full flex-col space-y-1">
                                        <span className="text-sm">Tarjeta destino</span>
                                        <div
                                            onClick={() => {
                                                setUpdateToCardId(true);
                                                setToIsOpen(!fromIsOpen);
                                            }}
                                            className="w-full h-10 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl text-slate-600 flex flex-row justify-between items-center cursor-pointer"
                                        >
                                            <span className="text-sm">{`${incomeRelation.to_transaction?.card?.bank?.name} ${incomeRelation.to_transaction?.card?.numbers}`}</span>
                                            <DynamicFaIcon name={'FaChevronDown'} size={11} />
                                        </div>

                                    </div>
                                )
                            }
                        </div>
                    </div>
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
                            className="w-full"
                        />
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
                            className={`min-w-1 w-full`}
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
                        className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 mt-6 text-medium"
                    //isLoading={transactionsState.loading}
                    >
                        Registrar
                    </Button>

                </div>
            </form>
        );
    }

    // Otros tipos
    return (
        <form
            className="w-full flex flex-col gap-y-6"
        >
            <div className="w-full flex flex-col gap-y-6">
                <span className="font-semibold text-center">Editar movimiento</span>
                <span className="font-medium text-center">Información general</span>
                <div className="w-full flex flex-col lg:flex-row gap-y-6 gap-x-4 items-end">
                    <div className="w-full lg:w-1/3">
                        {
                            updateCategoryId ? (
                                <Select
                                    required
                                    size="md"
                                    variant="flat"
                                    label="Categoría"
                                    labelPlacement="outside"
                                    placeholder="Categoría"
                                    value={categoryId}
                                    color={categoryAlert ? 'danger' : undefined}
                                    className="w-full"
                                    isOpen={categoryIsOpen}
                                    onOpenChange={(open) => open !== categoryIsOpen && setCategoryIsOpen(open)}
                                    onChange={(e) => {
                                        setCategoryId(parseInt(e.target.value));
                                        setCategoryAlert(e.target.value === undefined);
                                    }}
                                >
                                    {categories.map((item) => (
                                        <SelectItem key={item.key}>{item.label}</SelectItem>
                                    ))}
                                </Select>
                            ) : (
                                <div className="w-full flex-col space-y-1">
                                    <span className="text-sm">Categoría</span>
                                    <div
                                        onClick={() => {
                                            setUpdateCategoryId(true);
                                            setCategoryIsOpen(!fromIsOpen);
                                        }}
                                        className="w-full h-10 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl text-slate-600 flex flex-row justify-between items-center cursor-pointer"
                                    >
                                        <span className="text-sm">{transaction.category?.name}</span>
                                        <DynamicFaIcon name={'FaChevronDown'} size={11} />
                                    </div>

                                </div>
                            )
                        }
                    </div>
                    <div className="w-full lg:w-8/12 flex flex-col lg:flex-row gap-y-6 gap-x-4">
                        <RadioGroup
                            size="md"
                            label="Tipo de tarjeta"
                            orientation="horizontal"
                            value={cardTypeId?.toString()}
                            onChange={(e) => {
                                const parsed = parseInt(e.target.value);
                                setCardTypeId(parsed);
                                setCardId(undefined);
                                if (parsed === 1) { setAccountingDate(transactionDate); }
                                setUpdateCardId(true);

                            }}
                            className="text-sm w-full"
                        >
                            <div className="flex w-full justify-start lg:justify-between space-x-6 lg:space-x-0">
                                {transaction.type?.id !== 1 && cardTypes.map((type) => (
                                    <Radio key={type.key} value={type.key.toString()}>
                                        {type.label}
                                    </Radio>
                                ))}
                                {transaction.type?.id === 1 && (
                                    <Radio key={1} value={"1"}>
                                        Débito
                                    </Radio>
                                )}
                            </div>
                        </RadioGroup>
                        <div className="w-full">
                            {cardsState.loading ? (
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
                                    {cardsState.error !== null ? (
                                        <div>{cardsState.error}</div>
                                    ) : (

                                        <>
                                            {
                                                updateCardId ? (
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
                                                        isOpen={cardIsOpen}
                                                        onOpenChange={(open) => open !== cardIsOpen && setCardIsOpen(open)}
                                                        onChange={(e) => {
                                                            setCardId(parseInt(e.target.value));
                                                            setCardAlert(e.target.value === undefined);
                                                        }}
                                                    >
                                                        {
                                                            (cardTypeId === 1 && Array.isArray(cardsState.debit))
                                                                ? (cardsState.debit.map((item) => (
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
                                                                : ((cardTypeId === 2 && Array.isArray(cardsState.credit)) ?
                                                                    (cardsState.credit.map((item) => (
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
                                                    <div className="w-full flex-col space-y-1">
                                                        <span className="text-sm">Tarjeta</span>
                                                        <div
                                                            onClick={() => {
                                                                setUpdateCardId(true);
                                                                setCardIsOpen(!fromIsOpen);
                                                            }}
                                                            className="w-full h-10 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl text-slate-600 flex flex-row justify-between items-center cursor-pointer"
                                                        >
                                                            <span className="text-sm">{`${transaction.card?.bank?.name} ${transaction.card?.numbers}`}</span>
                                                            <DynamicFaIcon name={'FaChevronDown'} size={11} />
                                                        </div>

                                                    </div>
                                                )
                                            }
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-y-6">
                    <span className="font-medium text-center">Detalle</span>
                    <div className="w-full flex flex-col lg:flex-row gap-y-6 gap-x-4">
                        {transaction.type?.id !== 3 && (<Input
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
                    //isLoading={transactionsState.loading}
                    >
                        Actualizar
                    </Button>
                </div>
            </div>
        </form>
    );
}

export default UpdateTransaction;