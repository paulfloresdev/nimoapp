import React from "react";
import { Transaction } from "../types/transactions";
import { Card } from "@heroui/react";
import { Formatters } from "../helper/utils/Formatters";
import DynamicFaIcon from "./DynamicFaIcon";
import { useNavigate } from "react-router-dom";
const baseStorageUrl = import.meta.env.VITE_SITE_BASE_STORAGE_URL_BACKEND;

interface TransactionCardProps {
    item?: Transaction | null;
    contact?: string;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ item, contact }) => {
    const navigate = useNavigate();

    if (!item) {
        return <></>
    }

    return (
        <Card
            key={item.id}
            className="w-full lg:min-w-96 p-4 flex flex-col gap-y-4"
            isPressable
            onPress={() => {
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
            {/* Info principal */}
            <div className="w-full flex-1 min-w-0 flex flex-col gap-2">
                {/* Icono categoría */}
                <div className="w-full flex flex-row gap-4 items-center justify-between">
                    <div><div className="w-10 h-10 flex items-center justify-center bg-neutral-50 rounded-full border">
                        <DynamicFaIcon name={item?.category?.icon ?? ''} className="w-5 h-5" />
                    </div></div>
                    <div className="w-full flex flex-col items-start gap-1">
                        <span className="font-medium line-clamp-1 text-sm leading-snug break-words text-left">{item?.concept}</span>
                        <span className={`font-semibold whitespace-nowrap ${(item?.amount ?? 0) < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {Formatters.currency(item?.amount ?? 0)}
                        </span>
                    </div>
                </div>



                {/* Concepto y monto */}
                <div className="w-full flex flex-row justify-start">

                </div>

                {/* Info de tarjeta */}
                <div className="w-full flex justify-between items-center text-sm text-slate-600">
                    <div className="flex items-center gap-x-1 min-w-0 truncate">
                        <div className={`p-2 w-12 max-h-8 rounded-md ${item?.card?.network?.name === 'Visa' ? 'bg-blue-700' : 'bg-gray-200'}`}>
                            <img src={`${baseStorageUrl}${item?.card?.network?.img_path}`} alt="" />
                        </div>
                        <span className="truncate">{item?.card?.numbers}</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <span className="text-xs bg-neutral-100 rounded-md px-1 py-0.5">
                            {item?.card?.type?.type === 'DEBIT' ? 'Débito' : 'Crédito'}
                        </span>
                        <span className="truncate">{item?.card?.bank?.name}</span>
                    </div>
                </div>
            </div>

            {/* Pie: Fecha y contacto */}
            <div className="w-full flex justify-between items-end text-sm text-slate-500">
                <span>{Formatters.spanishDate(item?.transaction_date ?? '')}</span>
                {contact && (
                    <span className="text-xs font-semibold bg-neutral-100 px-1 py-0.5 rounded-md">
                        {contact}
                    </span>
                )}
            </div>
        </Card >
    );
}

export default TransactionCard;