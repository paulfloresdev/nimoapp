import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IndexIncomeRelationData } from "../../../types/incomeRelations";
import { indexIncomeRelationsRequest } from "../../../store/features/incomeRelations/incomeRelationsSlice";
import { RootState } from "../../../store/configStore/store";
import { Button, Pagination, Progress, Select, SelectItem, Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, addToast } from "@heroui/react";
import { Formatters } from "../../../helper/utils/Formatters";
import { indexContactRequest } from "../../../store/features/contacts/contactsSlice";
import TransactionCard from "../../../components/TransactionCard";
import DynamicFaIcon from "../../../components/DynamicFaIcon";
import { useNavigate } from "react-router-dom";

const baseStorageUrl = import.meta.env.VITE_SITE_BASE_STORAGE_URL_BACKEND;

interface MonthRelationsProps {
    year: number | undefined;
    month: number | undefined;
}

const MonthRelations: React.FC<MonthRelationsProps> = ({ year, month }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const relationsState = useSelector((state: RootState) => state.income_relations);
    const contactsState = useSelector((state: RootState) => state.contacts);

    const [page, setPage] = useState<number>(1);
    const [contactId, setContactId] = useState<number | undefined>(undefined);
    const shouldFetchRelations = useRef(false); // 🔐 Evita dispatch al montar

    useEffect(() => {
        dispatch(indexContactRequest());
    }, [dispatch]);

    useEffect(() => {
        if (!shouldFetchRelations.current) return;

        const body: IndexIncomeRelationData = {
            year: year,
            month: month,
            contact_id: Number.isNaN(contactId) ? undefined : contactId,
            exclude_payments: true,
            page: page.toString(),
        };

        dispatch(indexIncomeRelationsRequest(body));
    }, [page]);

    const handleSearch = () => {
        if (Number.isNaN(contactId) || contactId == undefined) {
            addToast({
                variant: "flat",
                color: "danger",
                title: "Error",
                description: "El campo contacto es requerido."
            });
        } else {
            shouldFetchRelations.current = true; // ✅ Marca que ya se puede ejecutar la petición
            setPage(1);

            const body: IndexIncomeRelationData = {
                year: year,
                month: month,
                contact_id: Number.isNaN(contactId) ? undefined : contactId,
                exclude_payments: true,
                page: "1",
            };

            dispatch(indexIncomeRelationsRequest(body));
        }
    };

    return (
        <div className="w-full h-full flex flex-col gap-2">
            <div className="w-full flex lg:hidden flex-col gap-4">
                <div className="w-full flex flex-col gap-4">
                    <div className="w-full flex flex-row justify-end items-end gap-4">
                        <>
                            {
                                contactsState.loading ? (
                                    <div className="w-full lg:w-2/12 h-12 flex flex-col justify-between">
                                        <Skeleton className="w-12 h-3 rounded-xl" />
                                        <Skeleton className="w-full h-8 rounded-xl" />
                                    </div>
                                ) : (
                                    <Select
                                        size="sm"
                                        variant="flat"
                                        label="Contacto"
                                        labelPlacement="outside"
                                        placeholder="Contacto"
                                        value={contactId}
                                        className="w-full"
                                        onChange={(e) => {
                                            setContactId(parseInt(e.target.value));
                                        }}
                                    >
                                        {
                                            (contactsState.collection?.data ?? []).map((item) => (
                                                <SelectItem key={item.id}>
                                                    {item.alias}
                                                </SelectItem>
                                            ))
                                        }
                                    </Select>
                                )
                            }
                        </>
                        <Button
                            size="sm"
                            variant="solid"
                            color="primary"
                            onPress={handleSearch}
                        >
                            <DynamicFaIcon name={"FaSearch"} className="text-white" size={18} />
                        </Button>
                        <Button
                            size="sm"
                            variant="solid"
                            className="bg-emerald-500"
                            onPress={() => {
                                if (contactId === undefined || Number.isNaN(contactId)) {
                                    addToast({
                                        variant: "flat",
                                        color: "danger",
                                        title: "Error",
                                        description: "El campo contacto es requerido."
                                    });
                                    return;
                                }
                                window.open(`${baseStorageUrl}/income-relations/export?contact_id=${contactId}&month=${month}&year=${year}`, '_blank');
                            }}
                        >
                            <DynamicFaIcon name={"FaFileExcel"} className="text-white" size={18} />
                        </Button>
                    </div>
                    <div className="w-full flex flex-row justify-end items-end gap-4">
                        <>
                            {relationsState.loading ? (
                                <>
                                    <Skeleton className="w-24 h-4 rounded-xl" />
                                    <Skeleton className="w-24 h-8 rounded-xl" />
                                </>
                            ) : (
                                !relationsState.collection || relationsState.collection?.data?.length === 0 ? (
                                    <div></div>
                                ) : (
                                    <>
                                        <span className="text-sm text-neutral-500">{`${relationsState.collection?.from} - ${relationsState.collection?.to} de ${relationsState.collection?.total}`}</span>
                                        <Pagination
                                            total={relationsState.collection?.last_page ?? 1}
                                            showControls
                                            page={page}
                                            size="sm"
                                            onChange={(p) => setPage(p)}
                                        />
                                    </>
                                )
                            )}
                        </>
                    </div>

                    <>
                        {
                            relationsState.loading ? (
                                <div className="w-full flex flex-row justify-center pt-12">
                                    <Progress isIndeterminate aria-label="Loading..." className="w-1/3" size="lg" />
                                </div>
                            ) : (
                                <>
                                    {
                                        !relationsState.collection || relationsState.collection?.data?.length === 0 ? (
                                            <div className="w-full text-center">
                                                <span className="text-neutral-500">No hay datos</span>
                                            </div>
                                        ) : (
                                            <div className="w-full flex flex-col gap-6">
                                                {
                                                    relationsState.collection.data?.map((relation) => {
                                                        const item = relation.from_transaction;
                                                        return <TransactionCard
                                                            key={item?.id} item={item} contact={relation.contact?.alias ?? 'Sin alias'} />
                                                    })
                                                }
                                            </div>
                                        )
                                    }
                                </>
                            )
                        }


                    </>
                </div>
            </div>

            <div className="w-full hidden lg:flex flex-col gap-4">
                <div className="w-full flex flex-row justify-end items-end gap-4">
                    <>
                        {relationsState.loading ? (
                            <>
                                <Skeleton className="w-24 h-4 rounded-xl" />
                                <Skeleton className="w-24 h-8 rounded-xl" />
                            </>
                        ) : (
                            !relationsState.collection || relationsState.collection?.data?.length === 0 ? (
                                <div></div>
                            ) : (
                                <>
                                    <span className="text-sm text-neutral-500">{`${relationsState.collection?.from} - ${relationsState.collection?.to} de ${relationsState.collection?.total}`}</span>
                                    <Pagination
                                        total={relationsState.collection?.last_page ?? 1}
                                        showControls
                                        page={page}
                                        size="sm"
                                        onChange={(p) => setPage(p)}
                                    />
                                </>
                            )
                        )}
                    </>
                    <>
                        {
                            contactsState.loading ? (
                                <div className="w-full lg:w-2/12 h-12 flex flex-col justify-between">
                                    <Skeleton className="w-12 h-3 rounded-xl" />
                                    <Skeleton className="w-full h-8 rounded-xl" />
                                </div>
                            ) : (
                                <Select
                                    size="sm"
                                    variant="flat"
                                    label="Contacto"
                                    labelPlacement="outside"
                                    placeholder="Contacto"
                                    value={contactId}
                                    className="w-full lg:w-2/12"
                                    onChange={(e) => {
                                        setContactId(parseInt(e.target.value));
                                    }}
                                >
                                    {
                                        (contactsState.collection?.data ?? []).map((item) => (
                                            <SelectItem key={item.id}>
                                                {item.alias}
                                            </SelectItem>
                                        ))
                                    }
                                </Select>
                            )
                        }
                    </>
                    <Button
                        size="sm"
                        variant="solid"
                        color="primary"
                        onPress={handleSearch}
                    >
                        Buscar
                    </Button>
                    <Button
                        size="sm"
                        variant="solid"
                        className="bg-emerald-500"
                        onPress={() => {
                            if (contactId === undefined || Number.isNaN(contactId)) {
                                addToast({
                                    variant: "flat",
                                    color: "danger",
                                    title: "Error",
                                    description: "El campo contacto es requerido."
                                });
                                return;
                            }
                            window.open(`${baseStorageUrl}/income-relations/export?contact_id=${contactId}&month=${month}&year=${year}`, '_blank');
                        }}
                    >
                        <DynamicFaIcon name={"FaFileExcel"} className="text-white" size={18} />
                    </Button>
                </div>
                <div className="w-full hidden lg:flex pb-12">
                    {
                        relationsState.loading ? (
                            <div className="w-full flex flex-row justify-center pt-12">
                                <Progress isIndeterminate aria-label="Loading..." className="w-1/3" size="lg" />
                            </div>
                        ) :
                            <>
                                {
                                    !relationsState.collection || relationsState.collection?.data?.length === 0 ? (
                                        <div className="w-full text-center">
                                            <span className="text-neutral-500">No hay datos</span>
                                        </div>
                                    ) : (
                                        <Table hideHeader>
                                            <TableHeader>
                                                <TableColumn>FROM</TableColumn>
                                                <TableColumn>CONCEPTO</TableColumn>
                                                <TableColumn>MONTO</TableColumn>
                                                <TableColumn>FECHA</TableColumn>
                                                <TableColumn>BANCO</TableColumn>
                                            </TableHeader>
                                            <TableBody>
                                                {
                                                    relationsState.collection?.data?.map((relation) => {
                                                        const item = relation.from_transaction;
                                                        const item2 = relation.to_transaction;
                                                        return (
                                                            <TableRow key={item?.id} className="hover:bg-neutral-100 rounded-xl cursor-pointer">
                                                                <TableCell className="w-1/12">
                                                                    <span className="text-sm px-1.5 py-1 rounded-lg bg-gray-100 text-neutral-400">{relation.contact?.alias}</span>
                                                                </TableCell>
                                                                <TableCell className="w-3/12 items-center">
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="line-clamp-1 leading-snug break-words">{item?.concept}</span>
                                                                        <span className="line-clamp-1 text-neutral-400 text-xs">{item?.category?.name}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className={`w-2/12`}>
                                                                    <div className="flex flex-row gap-2 items-center">
                                                                        <div className="w-full">
                                                                            <span className="font-medium text-base text-emerald-500">{Formatters.currency(item?.amount ?? 0)}</span>
                                                                        </div>
                                                                        <div className="w-full">
                                                                            <span className="font-medium text-base text-rose-500">{Formatters.currency(item2?.amount ?? 0)}</span>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="w-2/12">
                                                                    <div className="flex flex-col gap-1 items-center">
                                                                        <span>{Formatters.spanishDate(item?.transaction_date ?? '')}</span>
                                                                        <span className="text-neutral-400 text-xs">{Formatters.spanishDate(item?.accounting_date ?? '')}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="w-3/12">
                                                                    <div className="flex flex-row items-center gap-6 justify-center">
                                                                        <div className="flex flex-col gap-3">
                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-emerald-500">{item?.card?.bank?.name}</span>
                                                                                <span className="text-neutral-400 text-xs">{item?.card?.type?.id === 1 ? 'Débito' : 'Crédito'}</span>
                                                                            </div>
                                                                            <div className="w-full flex flex-row gap-1">
                                                                                <div className={`p-2 w-10 max-h-6 flex flex-col justify-center items-center rounded-md ${item?.card?.network?.name === 'Visa' ? 'bg-blue-700' : 'bg-gray-100'}`}>
                                                                                    <img src={`${baseStorageUrl}${item?.card?.network?.img_path}`} alt="" />
                                                                                </div>
                                                                                <span className="">{item?.card?.numbers}</span>
                                                                            </div>
                                                                        </div>
                                                                        <DynamicFaIcon name="FaArrowRight" className="text-neutral-500" size={12} />
                                                                        <div className="flex flex-col gap-3">

                                                                            <div className="flex flex-col gap-1">
                                                                                <span className="text-rose-500">{item2?.card?.bank?.name}</span>
                                                                                <span className="text-neutral-400 text-xs">{item2?.card?.type?.id === 1 ? 'Débito' : 'Crédito'}</span>
                                                                            </div>
                                                                            <div className="w-full flex flex-row gap-1">
                                                                                <div className={`p-2 w-10 max-h-6 flex flex-col justify-center items-center rounded-md ${item2?.card?.network?.name === 'Visa' ? 'bg-blue-700' : 'bg-gray-100'}`}>
                                                                                    <img src={`${baseStorageUrl}${item2?.card?.network?.img_path}`} alt="" />
                                                                                </div>
                                                                                <span className="">{item2?.card?.numbers}</span>
                                                                            </div>
                                                                        </div>

                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    }) ?? []
                                                }
                                            </TableBody>
                                        </Table>
                                    )
                                }
                            </>

                    }
                </div>
            </div>
        </div >
    );
};

export default MonthRelations;
