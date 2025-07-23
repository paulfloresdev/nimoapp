import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/configStore/store";
import { MonthTransactionsBody } from "../../../types/monthTransactions";
import { getMonthTransactionsRequest } from "../../../store/features/monthTransactions/monthTransactionsSlice";
import { Button, Card, Input, Pagination, Progress, Radio, RadioGroup, Select, SelectItem, Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { cardTypes, categories, orderByOptions, transactionTypes } from "../../../types/combos";
import { indexCardsRequest } from "../../../store/features/cards/cardsSlice";
import DynamicFaIcon from "../../../components/DynamicFaIcon";
import { Formatters } from "../../../helper/utils/Formatters";
import TransactionCard from "../../../components/TransactionCard";
import { useNavigate } from "react-router-dom";
const baseStorageUrl = import.meta.env.VITE_SITE_BASE_STORAGE_URL_BACKEND;

interface MonthTransactionsParams {
    year: number | undefined;
    month: number | undefined;
}

const MonthTransactions: React.FC<MonthTransactionsParams> = ({ year, month }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

    const transactionsState = useSelector((state: RootState) => state.month_transactions);
    const { debit, credit, loading, error } = useSelector((state: RootState) => state.cards);
    const [cardTypeId, setCardTypeId] = useState<number | undefined>(1);
    const [concept, setConcept] = useState<string | undefined>(undefined);
    const [amount, setAmount] = useState<string | undefined>(undefined);
    const [transactionTypeId, setTransactionTypeId] = useState<number | undefined>(undefined);
    const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
    const [cardId, setCardId] = useState<number | undefined>(undefined);
    const [orderBy, setOrderBy] = useState<number | undefined>(1);
    const [orderByIcon, setOrderByIcon] = useState<string | undefined>(undefined);

    const [page, setPage] = useState<number>(1);
    const [dontEffectPage, setDontEffectPage] = useState<boolean>(true);

    useEffect(() => {
        const body: MonthTransactionsBody = {
            order_by: 3,
            per_page: 10,
        }

        const params = {
            year: year,
            month: month,
            body: body,
        };

        dispatch(indexCardsRequest());
        dispatch(getMonthTransactionsRequest(params));
    }, [dispatch]);

    useEffect(() => {
        if (dontEffectPage) {
            const body: MonthTransactionsBody = {
                order_by: orderBy ?? 1,
                per_page: 10,
                concept: concept === '' ? undefined : concept,
                amount: amount ? parseFloat(amount) : undefined,
                category_id: Number.isNaN(categoryId) ? undefined : categoryId,
                type_id: Number.isNaN(transactionTypeId) ? undefined : transactionTypeId,
                card_id: Number.isNaN(cardId) ? undefined : cardId,

            }

            const params = {
                year: year,
                month: month,
                page: page,
                body: body,
            };

            dispatch(getMonthTransactionsRequest(params));
        } else {
            setDontEffectPage(true);
        }
    }, [page]);

    useEffect(() => {
        setDontEffectPage(false);
        setPage(1);

        const body: MonthTransactionsBody = {
            order_by: orderBy ?? 1,
            per_page: 10,
            concept: concept === '' ? undefined : concept,
            amount: amount ? parseFloat(amount) : undefined,
            category_id: Number.isNaN(categoryId) ? undefined : categoryId,
            type_id: Number.isNaN(transactionTypeId) ? undefined : transactionTypeId,
            card_id: Number.isNaN(cardId) ? undefined : cardId,

        }

        const params = {
            year: year,
            month: month,
            body: body,
        };

        dispatch(getMonthTransactionsRequest(params));
    }, [orderBy]);

    const applyFilters = () => {
        setDontEffectPage(false);
        setPage(1);

        const body: MonthTransactionsBody = {
            order_by: orderBy ?? 1,
            per_page: 10,
            concept: concept === '' ? undefined : concept,
            amount: amount ? parseFloat(amount) : undefined,
            category_id: Number.isNaN(categoryId) ? undefined : categoryId,
            type_id: Number.isNaN(transactionTypeId) ? undefined : transactionTypeId,
            card_id: Number.isNaN(cardId) ? undefined : cardId,

        }

        const params = {
            year: year,
            month: month,
            body: body,
        };

        dispatch(getMonthTransactionsRequest(params));
    }

    return (
        <div className="w-full h-full">
            <div className="w-full h-full flex flex-col gap-2">
                <div className={`w-full flex flex-col gap-4 items-center justify-between ${filtersOpen ? 'flex' : 'hidden'}`}>
                    <div className="w-full flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <Input
                            size='sm'
                            variant='bordered'
                            label='Concepto'
                            labelPlacement="outside"
                            placeholder="Pago de Nómina"
                            type="text"
                            value={concept}
                            onChange={(e) => setConcept(e.target.value)}
                            className="w-full lg:w-6/12"
                        />
                        <div className="w-full lg:w-4/12 flex flex-row gap-4 items-center">
                            <Input
                                size='sm'
                                variant='bordered'
                                label='Monto'
                                labelPlacement="outside"
                                placeholder="20000"
                                type="number"
                                inputMode="decimal"
                                startContent="$"
                                value={amount}
                                className="w-full"
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <Select
                                size="sm"
                                variant="flat"
                                label="Tipo"
                                placeholder="Tipo"
                                labelPlacement="outside"
                                value={transactionTypeId}
                                className="w-full"
                                onChange={(e) => {
                                    setTransactionTypeId(parseInt(e.target.value));
                                }}
                            >
                                {transactionTypes.map((item) => (
                                    <SelectItem key={item.key}>{item.label}</SelectItem>
                                ))}
                            </Select>
                        </div>
                        <Select
                            size="sm"
                            variant="flat"
                            label="Categoría"
                            labelPlacement="outside"
                            placeholder="Categoría"
                            value={categoryId}
                            onChange={(e) => {
                                setCategoryId(parseInt(e.target.value));
                            }}
                            className="w-full lg:w-2/12"
                        >
                            {categories.map((item) => (
                                <SelectItem key={item.key}>{item.label}</SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div className="w-full flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-start">
                        <RadioGroup
                            size="sm"
                            label="Tipo de tarjeta"
                            orientation="horizontal"
                            value={cardTypeId?.toString()}
                            onChange={(e) => {
                                const parsed = parseInt(e.target.value);
                                setCardTypeId(parsed);
                                setCardId(undefined);
                            }}
                            className="w-full lg:w-2/12"
                        >
                            <div className="flex w-full justify-start lg:justify-between space-x-6 lg:space-x-0">
                                {cardTypes.map((type) => (
                                    <Radio key={type.key} value={type.key.toString()}>
                                        {type.label}
                                    </Radio>
                                ))}
                            </div>
                        </RadioGroup>
                        {
                            loading ? (
                                <div className="w-full lg:w-2/12 h-12 flex flex-col justify-between">
                                    <Skeleton className="w-12 h-3 rounded-xl">
                                        a
                                    </Skeleton>
                                    <Skeleton className="w-full h-8 rounded-xl">
                                        a
                                    </Skeleton>
                                </div>
                            ) : (
                                <Select
                                    size="sm"
                                    variant="flat"
                                    label="Tarjeta"
                                    labelPlacement="outside"
                                    placeholder="Tarjeta"
                                    value={cardId}
                                    className="w-full lg:w-2/12"
                                    onChange={(e) => {
                                        setCardId(parseInt(e.target.value));
                                    }}
                                >
                                    {
                                        (cardTypeId === 1 && Array.isArray(debit))
                                            ? (debit.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    endContent={
                                                        <div className={`p-2 w-10 max-h-6 flex flex-col justify-center items-center rounded-md ${item.network?.name === 'Visa' ? 'bg-blue-700' : 'bg-gray-100'}`}>
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
                                                            <div className={`p-2 w-10 max-h-6 flex flex-col justify-center items-center rounded-md ${item.network?.name === 'Visa' ? 'bg-blue-700' : 'bg-gray-100'}`}>
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
                            )
                        }
                        <Button
                            size="sm"
                            variant="solid"
                            color="primary"
                            onPress={() => {
                                applyFilters();
                            }}
                        >
                            Aplicar filtros
                        </Button>
                    </div>
                </div>
                <div className="w-full flex flex-col gap-4">
                    <div className="w-full flex lg:hidden flex-col gap-4 pb-24 mt-2 lg:mt-0">
                        <div className="w-full flex flex-row gap-4 justify-end items-end">
                            <Select
                                size="sm"
                                variant="flat"
                                label="Ordenar por"
                                labelPlacement="outside"
                                placeholder="Ordenar por"
                                value={orderBy}
                                onChange={(e) => {
                                    var index = parseInt(e.target.value);

                                    setOrderBy(index);

                                    if (index % 2 == 0) {
                                        setOrderByIcon("FaAngleDown");
                                    } else {
                                        setOrderByIcon("FaAngleUp");
                                    }
                                }}
                                className="w-full"
                            >
                                {orderByOptions.map((item) => (
                                    <SelectItem
                                        key={item.key}
                                    >{item.label}</SelectItem>
                                ))}
                            </Select>
                            <Button
                                size="sm"
                                variant="flat"
                                onPress={() => setFiltersOpen(!filtersOpen)}
                            >
                                <DynamicFaIcon name={"FaFilter"} className="text-gray-400" size={14} />
                                <span className={filtersOpen ? 'block text-gray-500 font-medium' : 'hidden'}>X</span>
                            </Button>
                        </div>
                        <div className="w-full flex flex-row gap-4 justify-end items-center">
                            {transactionsState.loading ? (
                                <>
                                    <Skeleton className="w-24 h-4 rounded-xl" />
                                    <Skeleton className="w-24 h-8 rounded-xl" />
                                </>
                            ) : (
                                transactionsState.data?.data?.length === 0 ? (
                                    <div></div>
                                ) : (
                                    <>
                                        <span className="text-sm text-neutral-500">{`${transactionsState.data?.from} - ${transactionsState.data?.to} de ${transactionsState.data?.total}`}</span>
                                        <Pagination
                                            total={transactionsState.data?.last_page ?? 1}
                                            showControls
                                            page={page}
                                            size="sm"
                                            onChange={(p) => {
                                                setDontEffectPage(true);
                                                setPage(p);
                                            }}
                                        />
                                    </>
                                )
                            )
                            }
                        </div>

                        <div className="w-full flex flex-col gap-6 pt-2">
                            {transactionsState.loading ? (
                                <div className="w-full flex flex-row justify-center pt-12">
                                    <Progress isIndeterminate aria-label="Loading..." className="w-1/3" size="lg" />
                                </div>
                            ) : (
                                <>{
                                    transactionsState?.data?.data?.length === 0 ? (
                                        <div></div>
                                    ) : (
                                        transactionsState?.data?.data?.map((item) => (
                                            <TransactionCard key={item.id} item={item} />
                                        ))
                                    )
                                }</>
                            )
                            }
                        </div>

                        <div className="w-full flex flex-row gap-4 justify-end items-center">
                            {transactionsState.loading ? (
                                <>

                                </>
                            ) : (
                                transactionsState.data?.data?.length === 0 ? (
                                    <div></div>
                                ) : (
                                    <>
                                        <span className="text-sm text-neutral-500">{`${transactionsState.data?.from} - ${transactionsState.data?.to} de ${transactionsState.data?.total}`}</span>
                                        <Pagination
                                            total={transactionsState.data?.last_page ?? 1}
                                            showControls
                                            page={page}
                                            size="sm"
                                            onChange={(p) => {
                                                setDontEffectPage(true);
                                                setPage(p);
                                            }}
                                        />
                                    </>
                                )
                            )
                            }
                        </div>
                    </div>

                    <div className="w-full hidden lg:flex flex-row gap-4 justify-end items-end">
                        <div className="w-full flex flex-row gap-4 justify-end items-center">
                            {transactionsState.loading ? (
                                <>
                                    <Skeleton className="w-24 h-4 rounded-xl" />
                                    <Skeleton className="w-24 h-8 rounded-xl" />
                                </>
                            ) : (
                                transactionsState.data?.data?.length === 0 ? (
                                    <div></div>
                                ) : (
                                    <>
                                        <span className="text-sm text-neutral-500">{`${transactionsState.data?.from} - ${transactionsState.data?.to} de ${transactionsState.data?.total}`}</span>
                                        <Pagination
                                            total={transactionsState.data?.last_page ?? 1}
                                            showControls
                                            page={page}
                                            size="sm"
                                            onChange={(p) => {
                                                setDontEffectPage(true);
                                                setPage(p);
                                            }}
                                        />
                                    </>
                                )
                            )
                            }
                        </div>
                        <Select
                            size="sm"
                            variant="flat"
                            label="Ordenar por"
                            labelPlacement="outside"
                            placeholder="Ordenar por"
                            value={orderBy}
                            onChange={(e) => {
                                var index = parseInt(e.target.value);

                                setOrderBy(index);

                                if (index % 2 == 0) {
                                    setOrderByIcon("FaAngleDown");
                                } else {
                                    setOrderByIcon("FaAngleUp");
                                }
                            }}
                            className="w-full lg:w-4/12"
                            startContent={orderByIcon && <DynamicFaIcon name={orderByIcon} className="text-slate-800" size={14} />}
                        >
                            {orderByOptions.map((item) => (
                                <SelectItem
                                    key={item.key}
                                >{item.label}</SelectItem>
                            ))}
                        </Select>
                        <Button
                            size="sm"
                            variant="flat"
                            onPress={() => setFiltersOpen(!filtersOpen)}
                        >
                            <DynamicFaIcon name={"FaFilter"} className="text-gray-400" size={14} />
                            <span className={filtersOpen ? 'block text-gray-500 font-medium' : 'hidden'}>X</span>
                        </Button>
                    </div>

                    <div className="hidden lg:flex pb-12">
                        {
                            transactionsState.loading ? (
                                <div className="w-full flex flex-row justify-center pt-12">
                                    <Progress isIndeterminate aria-label="Loading..." className="w-1/3" size="lg" />
                                </div>
                            ) : (
                                <>
                                    {transactionsState?.data?.data?.length === 0 ? (
                                        <div className="w-full text-center">
                                            <span className="text-neutral-500">No hay datos</span>
                                        </div>
                                    ) : (
                                        < Table
                                            topContentPlacement="outside"
                                            hideHeader
                                        >
                                            <TableHeader>
                                                <TableColumn>TIPO</TableColumn>
                                                <TableColumn>CONCEPTO</TableColumn>
                                                <TableColumn>MONTO</TableColumn>
                                                <TableColumn>FECHA</TableColumn>
                                                <TableColumn>BANCO</TableColumn>
                                                <TableColumn>TARJETA</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {
                                                    transactionsState?.data?.data?.map((item) => (
                                                        <TableRow
                                                            key={item.id}
                                                            className="hover:bg-neutral-100 rounded-xl cursor-pointer"
                                                            onClick={() => {
                                                                navigate(
                                                                    '/dashboard/transaction',
                                                                    {
                                                                        state: {
                                                                            transaction: item
                                                                        }
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            <TableCell className="w-1/12">
                                                                <span className="line-clamp-1 text-center text-sm px-1.5 py-1 rounded-lg bg-gray-100 text-neutral-400">{item.type?.id === 1 ? 'Ingreso' : item.type?.id === 2 ? 'Egreso' : item.type?.id === 3 ? 'Pago TDC' : '-'}</span>
                                                            </TableCell>
                                                            <TableCell className="w-4/12">
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="line-clamp-1 leading-snug break-words ">
                                                                        {item.concept}
                                                                    </span>
                                                                    <span className="line-clamp-1 leading-snug break-words  text-neutral-400 text-xs">
                                                                        {item.category?.name}
                                                                    </span>
                                                                </div>
                                                            </TableCell>

                                                            <TableCell className={`font-medium text-base w-2/12 ${(item.amount ?? 0) < 0 ? 'text-rose-500' : (item.amount ?? 0) > 0 ? 'text-emerald-500' : ''}`}>{Formatters.currency(item.amount ?? 0)}</TableCell>
                                                            <TableCell className="w-2/12">
                                                                <div className="flex flex-col gap-1">
                                                                    <span>{Formatters.spanishDate(item.transaction_date)}</span>
                                                                    <span className="text-neutral-400 text-xs">{Formatters.spanishDate(item.accounting_date)}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="w-2/12">
                                                                <div className="flex flex-col gap-1">
                                                                    <span>{item.card?.bank?.name}</span>
                                                                    <span className="text-neutral-400 text-xs">{item.card?.type?.id === 1 ? 'Débito' : 'Crédito'}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="w-1/12">
                                                                <div className="w-full flex flex-row gap-1">
                                                                    <div className={`p-2 w-10 max-h-6 flex flex-col justify-center items-center rounded-md ${item.card?.network?.name === 'Visa' ? 'bg-blue-700' : 'bg-gray-100'}`}>
                                                                        <img src={`${baseStorageUrl}${item.card?.network?.img_path}`} alt="" />
                                                                    </div>
                                                                    <span>{item.card?.numbers}</span>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )) ?? [] // Fallback to empty array if null/undefined
                                                }
                                            </TableBody>
                                        </Table>
                                    )

                                    }
                                </>

                            )
                        }
                    </div>

                </div>
            </div >

        </div >
    );
}

export default MonthTransactions;