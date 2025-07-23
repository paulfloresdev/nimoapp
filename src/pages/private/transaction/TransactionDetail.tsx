import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Transaction } from "../../../types/transactions";
import { Formatters } from "../../../helper/utils/Formatters";
import DynamicFaIcon from "../../../components/DynamicFaIcon";
import { Button, Card, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Progress, Skeleton, addToast, useDisclosure } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/configStore/store";
import { indexIncomeRelationsRequest, resetIncomeRelationsRequest } from "../../../store/features/incomeRelations/incomeRelationsSlice";
import { destroyTransactionsRequest, resetTransactionsState } from "../../../store/features/transactions/transactionsSlice";
import { tr } from "framer-motion/client";
import { IndexIncomeRelationData } from "../../../types/incomeRelations";
import TransactionCard from "../../../components/TransactionCard";
const baseStorageUrl = import.meta.env.VITE_SITE_BASE_STORAGE_URL_BACKEND;

interface TransactionFieldProps {
    name: string;
    value: string | number | React.ReactNode;
    classname?: string;
}

export const TransactionField: React.FC<TransactionFieldProps> = ({ name, value, classname }) => {
    return (
        <div className={`${classname} w-full flex flex-row justify-between `}>
            <span className="">{name}</span>
            <span className="font-medium">{value}</span>
        </div>
    );
}

const TransactionDetail: React.FC = () => {
    const location = useLocation();
    const { transaction } = location.state as { transaction: Transaction };
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { collection, totalIncomes, message, item, error, loading: loadingRelations } = useSelector((state: RootState) => state.income_relations);
    const transactionsState = useSelector((state: RootState) => state.transactions);

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [page, setPage] = useState<number>(1);

    const [year, setYear] = useState<number | undefined>(undefined);
    const [month, setMonth] = useState<number | undefined>(undefined);


    useEffect(() => {
        if (transaction) {
            var data: IndexIncomeRelationData = {
                contact_id: undefined,
                from_id: undefined,
                to_id: undefined,
                page: undefined
            };

            if (transaction.type?.id === 1 && transaction.card?.type?.id === 2) {
                data.contact_id = 3;
                data.from_id = undefined;
                data.to_id = transaction.id;
            } else if (transaction.type?.id === 3) {
                data.contact_id = 3;
                data.from_id = transaction.id;
                data.to_id = undefined;
            } else {
                data.contact_id = undefined;
                data.from_id = transaction?.type?.type === 'INCOME' ? transaction.id : undefined;
                data.to_id = transaction?.type?.type === 'EXPENSE' ? transaction.id : undefined;
            }

            dispatch(indexIncomeRelationsRequest(data));
        }
    }, [dispatch]);

    useEffect(() => {
        if (transaction) {
            var data: IndexIncomeRelationData = {
                contact_id: undefined,
                from_id: undefined,
                to_id: undefined,
                page: page.toString()
            };

            if (transaction.type?.id === 1 && transaction.card?.type?.id === 2) {
                data.contact_id = 3;
                data.from_id = undefined;
                data.to_id = transaction.id;
            } else if (transaction.type?.id === 3) {
                data.contact_id = 3;
                data.from_id = transaction.id;
                data.to_id = undefined;
            } else {
                data.contact_id = undefined;
                data.from_id = transaction?.type?.type === 'INCOME' ? transaction.id : undefined;
                data.to_id = transaction?.type?.type === 'EXPENSE' ? transaction.id : undefined;
            }

            dispatch(indexIncomeRelationsRequest(data));
        }
    }, [page]);

    useEffect(() => {
        if (transactionsState.destroySuccess !== null) {
            if (transactionsState.destroySuccess) {
                navigate(`/dashboard/month`, {
                    state: {
                        year: year,
                        month: month,
                    }
                });
                addToast({
                    variant: "flat",
                    color: "success",
                    title: `Eliminación exitosa`,
                    timeout: 3000,
                    description: transactionsState.message,
                });
                dispatch(resetTransactionsState());
            } else {
                addToast({
                    variant: "flat",
                    color: "danger",
                    title: "Error",
                    description: transactionsState.error
                });
                dispatch(resetTransactionsState());
            }
        }
    }, [transactionsState]);

    const handleDelete = () => {
        console.log("handle");
        var result = Formatters.extractMonthYear(transaction.accounting_date);
        setYear(result.year);
        setMonth(result.month);

        dispatch(destroyTransactionsRequest(`${transaction.id}`));
    }

    if (transactionsState.loading) {
        return (
            <div className="w-full h-dscreen flex flex-col items-center justify-center gap-y-6">
                Eliminando...
                <Progress isIndeterminate aria-label="Loading..." className="max-w-md" size="lg" color="danger" />
            </div>
        )
    }

    return (
        <div className="w-full lg:h-full flex flex-col lg:flex-row gap-6">
            <div className="w-full h-full flex flex-col items-center justify-start gap-y-6">
                <Modal
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    size="lg"
                    placement="center"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">¿Estás seguro que deseas eliminar este movimiento?</ModalHeader>
                                <ModalBody>
                                    <p>
                                        Esto también eliminará la información relacionada a él.
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="default" variant="light" onPress={onClose}>
                                        Cancelar
                                    </Button>
                                    <Button
                                        color="danger"
                                        onPress={() => {
                                            onClose();
                                            handleDelete();
                                        }}

                                    >
                                        Eliminar
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                <div className="w-full flex flex-row justify-between items-center">
                    <span className="font-semibold">Detalle de movimiento</span>
                    <Button
                        variant="flat"
                        onPress={() => {
                            var result = Formatters.extractMonthYear(transaction.accounting_date);

                            navigate(`/dashboard/month`, {
                                state: {
                                    year: result.year,
                                    month: result.month,
                                }
                            });
                        }}
                    >
                        <DynamicFaIcon name="FaCalendar" />
                    </Button>
                </div>
                <span className="text-sm">{Formatters.spanishDate(transaction.transaction_date)}</span>
                <div className="w-14 h-14 flex flex-col items-center justify-center bg-neutral-50 rounded-full border-1">
                    <DynamicFaIcon name={transaction.category?.icon ?? ''} size={24} />
                </div>
                <span className="font-medium">{transaction.concept}</span>
                <span className={`font-semibold text-lg `}>{Formatters.currency(transaction.amount ?? 0)}</span>
                <div className="w-full flex flex-row justify-center items-center gap-x-4">
                    {
                        loadingRelations && ((transaction.type?.id === 1 && transaction.card?.type?.id === 2) || (transaction.type?.id === 3)) ? <>
                            <Skeleton className="w-24 h-9 rounded-lg"></Skeleton>
                            <Skeleton className="w-28 h-9 rounded-lg"></Skeleton>
                        </> : <>
                            <Button
                                variant="flat"
                                color="primary"
                                startContent={<DynamicFaIcon name={'FaPen'} className="text-primary-500" />}
                                onPress={() => {
                                    navigate(
                                        '/dashboard/transaction/update',
                                        {
                                            state: {
                                                transaction: transaction,
                                                incomeRelation: collection?.data?.at(0)
                                            }
                                        }
                                    );
                                }}
                            >Editar</Button>
                            <Button
                                variant="flat"
                                color="danger"
                                startContent={<DynamicFaIcon name={'FaTrash'} className="text-rose-600" />}
                                onPress={onOpen}
                            >Eliminar</Button>
                        </>
                    }

                </div>
                <div className="w-full grid grid-cols-1 gap-4">
                    <TransactionField
                        name="Fecha de transacción"
                        value={Formatters.spanishDate(transaction.transaction_date)}
                    />
                    <TransactionField
                        name="Fecha de contabilidad"
                        value={Formatters.spanishDate(transaction.accounting_date)}
                    />
                    <TransactionField
                        name="Banco"
                        value={transaction.card?.bank?.name ?? 'No especificado'}
                    />
                    <TransactionField
                        name={(transaction.type?.id === 1 && transaction.card?.type?.id === 2) ? 'Tarjeta destino' : (transaction.type?.id === 3) ? 'Tarjeta origen' : 'Tarjeta'}
                        value={
                            <div className="flex flex-row items-center gap-x-2">
                                <div className={`p-2 w-12 max-h-8 rounded-md ${transaction?.card?.network?.name === 'Visa' ? 'bg-blue-700' : 'bg-gray-200'}`}>
                                    <img src={`${baseStorageUrl}${transaction?.card?.network?.img_path}`} alt="" />
                                </div>
                                <span>{transaction.card?.numbers ?? 'No especificado'}</span>
                            </div>
                        }
                    />
                    {((transaction.type?.id === 1 && transaction.card?.type?.id === 2) || (transaction.type?.id === 3)) && (
                        <TransactionField
                            name={(transaction.type?.id === 1 && transaction.card?.type?.id === 2) ? 'Tarjeta origen' : (transaction.type?.id === 3) ? 'Tarjeta destino' : 'Tarjeta'}
                            value={
                                loadingRelations ? <div className="flex flex-row items-center gap-x-2">
                                    <Skeleton className="w-14 h-7 rounded-lg"></Skeleton>
                                </div> :
                                    transaction.type?.id === 3 ?
                                        (
                                            <div className="flex flex-row items-center gap-x-2">
                                                <div className={`p-2 w-10 max-h-6 flex flex-col justify-center items-center rounded-md ${collection?.data?.at(0)?.to_transaction?.card?.network?.name === 'Visa' ? 'bg-blue-700' : 'bg-gray-50'}`}>
                                                    <img src={`${baseStorageUrl}${collection?.data?.at(0)?.to_transaction?.card?.network?.img_path}`} alt="" />
                                                </div>
                                                <span>{collection?.data?.at(0)?.to_transaction?.card?.numbers ?? 'No especificado'}</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-row items-center gap-x-2">
                                                <div className={`p-2 w-10 max-h-6 flex flex-col justify-center items-center rounded-md ${collection?.data?.at(0)?.from_transaction?.card?.network?.name === 'Visa' ? 'bg-blue-700' : 'bg-gray-50'}`}>
                                                    <img src={`${baseStorageUrl}${collection?.data?.at(0)?.from_transaction?.card?.network?.img_path}`} alt="" />
                                                </div>
                                                <span>{collection?.data?.at(0)?.to_transaction?.card?.numbers ?? 'No especificado'}</span>
                                            </div>
                                        )

                            }
                        />
                    )}
                    <TransactionField
                        name="Tipo de tarjeta"
                        value={(transaction.card?.type?.type == 'CREDIT') ? 'Crédito' : 'Débito'}
                    />
                    <TransactionField
                        name="Tipo de movimiento"
                        value={transaction.type?.type == 'INCOME' ? 'Ingreso' : transaction.type?.type == 'EXPENSE' ? 'Gasto' : 'Pago de TDC'}
                    />
                    <div className="w-full flex flex-col justify-between">
                        <span className="">Notas</span>
                        <span className="text-sm text-gray-500">{transaction?.notes ?? 'Sin notas'}</span>
                    </div>
                </div>
            </div>
            <Divider
                orientation="vertical"
                className="hidden lg:block h-dscreen "
            />
            <div className="w-full lg:w-auto lg:min-w-96">
                {
                    transaction.type?.id !== 3 && !(transaction.type?.id === 1 && transaction.card?.type?.id === 2) && (<div className="w-full flex flex-col gap-y-6">
                        {loadingRelations ? <>
                            <div className="w-full flex flex-col gap-y-6 ">
                                <div className="w-full flex flex-row justify-between items-center">
                                    <Skeleton className="w-48 h-6 rounded-xl" />
                                    <Skeleton
                                        className="rounded-xl"
                                    >
                                        <Button
                                        >Agregar</Button>
                                    </Skeleton>
                                </div>
                                <Skeleton className="w-36 h-6 rounded-xl" />
                                {[...Array(4)].map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        className="w-full h-24 rounded-xl"
                                    />
                                ))}
                            </div>
                        </> : <>
                            <div className="w-full h-full flex flex-row justify-between items-center">
                                <span className="font-semibold">{(transaction?.type?.type === 'INCOME') ? 'Gasto vinculado' : 'Ingresos vinculados'}{` (${collection?.data?.length})`}</span>
                                {
                                    ((transaction?.type?.type === 'EXPENSE' && (totalIncomes ?? 0) <= Formatters.toPositive(transaction?.amount ?? 0))) && (
                                        <Button
                                            variant="flat"
                                            color="default"
                                            onPress={() => {
                                                dispatch(resetIncomeRelationsRequest());
                                                navigate(
                                                    '/dashboard/transaction/add-relation',
                                                    {
                                                        state: {
                                                            transaction: transaction
                                                        }
                                                    }
                                                );
                                            }}
                                        >
                                            Agregar
                                        </Button>
                                    )
                                }
                            </div>
                            <span>{`Acumulado: ${Formatters.currency(totalIncomes ?? 0)}`}</span>
                            <div className="w-full flex flex-col gap-y-6">
                                {
                                    (collection?.data?.length === 0) ? (
                                        <div></div>
                                    ) : (
                                        <>
                                            {
                                                collection?.data?.map((item) => {
                                                    const itemTransaction = (transaction?.type?.type === 'EXPENSE') ? item.from_transaction : item.to_transaction
                                                    return (
                                                        <TransactionCard key={item.id} item={itemTransaction} contact={item.contact?.alias ?? 'Sin alias'} />

                                                    );
                                                })
                                            }
                                        </>
                                    )
                                }
                            </div>
                            <div>
                                <Pagination
                                    showControls
                                    initialPage={1}
                                    page={page}
                                    total={collection?.last_page ?? 1}
                                    className={(collection?.last_page ?? 1) < 2 ? 'hidden' : ''}
                                    onChange={(page) => {
                                        setPage(page);
                                    }}
                                />
                            </div>
                        </>}
                    </div>)
                }
            </div>
        </div >
    );
}

export default TransactionDetail;