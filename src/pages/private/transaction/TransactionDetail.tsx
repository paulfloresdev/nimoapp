import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Transaction } from "../../../types/transactions";
import { Formatters } from "../../../helper/utils/Formatters";
import DynamicFaIcon from "../../../components/DynamicFaIcon";
import { Button, Card } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/configStore/store";
import { indexIncomeRelationsRequest } from "../../../store/features/incomeRelations/incomeRelationsSlice";
const baseStorageUrl = import.meta.env.VITE_SITE_BASE_STORAGE_URL_BACKEND;

interface TransactionFieldProps {
    name: string;
    value: string | number | React.ReactNode;
}

const TransactionField: React.FC<TransactionFieldProps> = ({ name, value }) => {
    return (
        <div className="w-full flex flex-row justify-between">
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

    const {collection, totalIncomes, message, item, error, loading: loadingRelations} = useSelector((state: RootState) => state.income_relations);

    useEffect(() => {
        if (transaction) {
            dispatch(indexIncomeRelationsRequest({
                contact_id: undefined,
                from_id: transaction?.type?.type === 'INCOME' ? transaction.id : undefined,
                to_id: transaction?.type?.type === 'EXPENSE' ? transaction.id : undefined
            }))
        }
    }, [dispatch]);

    return (
        <div className="flex flex-col items-center justify-center gap-y-6">
            <span className="font-semibold">Detalle de movimiento</span>
            <span className="text-sm">{Formatters.spanishDate(transaction.transaction_date)}</span>
            <div className="w-14 h-14 flex flex-col items-center justify-center bg-neutral-50 rounded-full border-1">
                <DynamicFaIcon name={transaction.category?.icon ?? ''} size={24}/>
            </div>
            <span className="font-medium">{transaction.concept}</span>
            <span className={`font-semibold text-lg `}>{Formatters.currency(transaction.amount ?? 0)}</span>
            <div className="w-full flex flex-row justify-center items-center gap-x-4">
                <Button 
                    variant="flat" 
                    color="primary"
                    startContent={<DynamicFaIcon name={'FaPen'} className="text-blue-500"/>}
                >Editar</Button>
                <Button
                    variant="flat" 
                    color="danger"
                    startContent={<DynamicFaIcon name={'FaTrash'} className="text-rose-600"/>}
                >Eliminar</Button>
            </div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                        name="Tarjeta"
                        value={
                            <div className="flex flex-row items-center gap-x-2">
                                <img className="w-9" src={`${baseStorageUrl}${transaction?.card?.network?.img_path}`} alt="" />
                                <span>{transaction.card?.numbers ?? 'No especificado'}</span>
                            </div>
                        }
                    />
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
            <div className="w-full flex flex-col gap-y-6">
                {loadingRelations ? <>
                    <span className="text-sm text-gray-500">Cargando relaciones...</span>
                </> : <>
                    <div className="w-full flex flex-row justify-between items-center">
                        <span className="font-semibold">{(transaction?.type?.type === 'INCOME') ? 'Gasto vinculado' : 'Ingresos vinculados'}{` (${collection?.data?.length})`}</span>
                            {
                                ((transaction?.type?.type === 'EXPENSE' && (totalIncomes ?? 0) <= Formatters.toPositive(transaction?.amount ?? 0))) && (
                                    <Button
                                        variant="flat"
                                        color="default"
                                        startContent={<DynamicFaIcon name={'FaPlus'} className="text-slate-600 w-3"/>}
                                        onPress={() => {
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
                                            const itemTransaction = (transaction?.type?.type === 'EXPENSE') ?  item.from_transaction : item.to_transaction
                                            return (
                                                <Card 
                                                    key={item.id} 
                                                    className="w-full p-3 flex flex-col gap-y-4"
                                                    isPressable
                                                >
                                                    {/* Encabezado con ícono y texto principal */}
                                                    <div className="w-full flex flex-row gap-x-3">
                                                        {/* Icono categoría */}
                                                        <div className="w-10 h-10 flex items-center justify-center bg-neutral-50 rounded-full border">
                                                            <DynamicFaIcon name={itemTransaction?.category?.icon ?? ''} className="w-5 h-5" />
                                                        </div>

                                                        {/* Info principal */}
                                                        <div className="w-full flex-1 min-w-0 flex flex-col gap-y-2">
                                                        {/* Concepto y monto */}
                                                            <div className="w-full flex justify-between items-start gap-x-2">
                                                                <span className="font-medium line-clamp-2 text-sm leading-snug break-words text-left">{itemTransaction?.concept}</span>
                                                                <span className={`font-semibold whitespace-nowrap ${(itemTransaction?.amount ?? 0) < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                                {Formatters.currency(itemTransaction?.amount ?? 0)}
                                                                </span>
                                                            </div>

                                                            {/* Info de tarjeta */}
                                                            <div className="w-full flex justify-between items-center text-sm text-slate-600">
                                                                <div className="flex items-center gap-x-1 min-w-0 truncate">
                                                                <img className="h-3 shrink-0" src={`${baseStorageUrl}${itemTransaction?.card?.network?.img_path}`} alt="" />
                                                                <span className="truncate">{itemTransaction?.card?.numbers}</span>
                                                                </div>
                                                                <div className="flex items-center gap-x-2">
                                                                <span className="text-xs bg-neutral-100 rounded-md px-1 py-0.5">
                                                                    {itemTransaction?.card?.type?.type === 'DEBIT' ? 'Débito' : 'Crédito'}
                                                                </span>
                                                                <span className="truncate">{itemTransaction?.card?.bank?.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Pie: Fecha y contacto */}
                                                    <div className="w-full flex justify-between items-end text-sm text-slate-500">
                                                        <span>{Formatters.spanishDate(itemTransaction?.transaction_date ?? '')}</span>
                                                        {item.contact?.alias && (
                                                        <span className="text-xs font-semibold bg-neutral-100 px-1 py-0.5 rounded-md">
                                                            {item.contact?.alias}
                                                        </span>
                                                        )}
                                                    </div>
                                                </Card>

                                            );
                                        })
                                    }
                                    </>
                                )
                            }
                    </div>
                </>}
            </div>
        </div>
    );
}

export default TransactionDetail;