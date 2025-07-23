import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/configStore/store";
import { indexBanksRequest } from "../../../store/features/banks/banksSlice";
import { Button, Input, Select, SelectItem, Skeleton, addToast } from "@heroui/react";
import { cardTypes, networks } from "../../../types/combos";
import { Card, StoreCardsParams, UpdateCardsParams } from "../../../types/cards";
import { destroyCardsRequest, resetCardsRequest, updateCardsRequest } from "../../../store/features/cards/cardsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import DynamicFaIcon from "../../../components/DynamicFaIcon";
const baseStorageUrl = import.meta.env.VITE_SITE_BASE_STORAGE_URL_BACKEND;

const UpdateCard: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { card } = location.state as { card: Card };

    const banksState = useSelector((state: RootState) => state.banks);
    const cardsState = useSelector((state: RootState) => state.cards);

    const [typeId, setTypeId] = useState<number | undefined>(card.type?.id);

    const [bankId, setBankId] = useState<number | undefined>(card.bank?.id);
    const [bankAlert, setBankAlert] = useState<boolean | undefined>(undefined);
    const [updateBankId, setUpdateBankId] = useState<boolean>(false);
    const [bankIsOpen, setBankIsOpen] = useState<boolean>(false);

    const [networkAlert, setNetworkAlert] = useState<boolean | undefined>(undefined);
    const [cardNumber, setCardNumber] = useState<string | undefined>(card.numbers ?? '');
    const [updateNetworkId, setUpdateNetworkId] = useState<boolean>(false);
    const [networkIsOpen, setNetworkIsOpen] = useState<boolean>(false);

    const [cardColor, setCardColor] = useState<string | undefined>(card?.color ?? '');
    const [networkId, setNetworkId] = useState<number | undefined>(card.network?.id);

    useEffect(() => {
        dispatch(indexBanksRequest());
    }, [dispatch]);

    useEffect(() => {
        if (cardsState.updateSuccess == false) {
            addToast({
                variant: "flat",
                color: "danger",
                title: "Error",
                description: cardsState.error
            });
        } else if (cardsState.updateSuccess == true) {
            addToast({
                variant: "flat",
                color: "success",
                title: "Actualización exitosa",
                timeout: 3000,
            });

            navigate("/dashboard/cards");
        }
        dispatch(resetCardsRequest());
    }, [cardsState.updateSuccess]);

    useEffect(() => {
        if (cardsState.destroySuccess == false) {
            addToast({
                variant: "flat",
                color: "danger",
                title: "Error",
                description: cardsState.error
            });
        } else if (cardsState.destroySuccess == true) {
            addToast({
                variant: "flat",
                color: "success",
                title: "Eliminación exitosa",
                timeout: 3000,
            });

            navigate("/dashboard/cards");
        }
        dispatch(resetCardsRequest());
    }, [cardsState.destroySuccess]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setBankAlert(bankId === undefined);
        setNetworkAlert(networkId === undefined);

        if (bankAlert || networkAlert) {
            return;
        }

        var data: StoreCardsParams = {
            numbers: cardNumber ?? "",
            color: cardColor ?? "",
            type_id: typeId ?? 0,
            bank_id: bankId ?? 0,
            network_id: networkId ?? 0,
        }

        var payload: UpdateCardsParams = {
            id: card.id.toString(),
            data: data,
        }

        dispatch(updateCardsRequest(payload));
    }

    return (
        <form onSubmit={handleSubmit} className="w-full lg:h-dscreen flex flex-col gap-y-6 pb-12">
            <span className="font-semibold">Actualizar tarjeta</span>
            <div className="w-full flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/4 flex-col space-y-2">
                    <span className="text">Tipo de tarjeta</span>
                    <div
                        className="w-full h-12 bg-neutral-100 px-3 py-2 rounded-xl text-slate-600 flex flex-row justify-between items-center"
                    >
                        <span className="">{card.type?.type === "DEBIT" ? "Débito" : "Crédito"}</span>
                    </div>

                </div>
                <>
                    {banksState.loading ? (
                        <div className="w-full lg:w-1/4 h-16 flex flex-col justify-between">
                            <Skeleton className="w-12 h-4 rounded-xl">
                                a
                            </Skeleton>
                            <Skeleton className="w-full h-10 rounded-xl">
                                a
                            </Skeleton>
                        </div>
                    ) : (
                        <>
                            {
                                updateBankId ? (
                                    <Select
                                        required
                                        size="lg"
                                        variant="flat"
                                        label="Banco"
                                        labelPlacement="outside"
                                        placeholder="Banco"
                                        value={bankId}
                                        color={bankAlert ? 'danger' : undefined}
                                        className="w-full lg:w-1/4"
                                        isOpen={bankIsOpen}
                                        onOpenChange={(open) => open !== bankIsOpen && setBankIsOpen(open)}
                                        onChange={(e) => {
                                            setBankId(parseInt(e.target.value));
                                            setBankAlert(e.target.value === undefined);
                                        }}
                                    >
                                        {
                                            banksState.data && banksState.data?.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    startContent={
                                                        <div className="w-12 max-h-6 flex flex-col justify-center items-center rounded-md ">
                                                            <img
                                                                src={`${baseStorageUrl}${item.img_path}`}
                                                                alt=""
                                                                className="invert"
                                                            />

                                                        </div>

                                                    }
                                                >
                                                    {item.name}
                                                </SelectItem>
                                            ))
                                        }

                                    </Select>
                                ) : (
                                    <div className="w-full lg:w-1/4 flex-col space-y-2">
                                        <span className="text">Banco</span>
                                        <div
                                            onClick={() => {
                                                setUpdateBankId(true);
                                                setBankIsOpen(!bankIsOpen);
                                            }}
                                            className="w-full h-12 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl text-slate-600 flex flex-row justify-between items-center cursor-pointer"
                                        >
                                            <span className="">{card.bank?.name}</span>
                                            <DynamicFaIcon name={'FaChevronDown'} size={11} />
                                        </div>

                                    </div>
                                )
                            }
                        </>
                    )}
                </>
                {
                    updateNetworkId ? (
                        <Select
                            required
                            size="lg"
                            variant="flat"
                            label="Network"
                            labelPlacement="outside"
                            placeholder="Network"
                            value={networkId}
                            color={networkAlert ? 'danger' : undefined}
                            className="w-full lg:w-1/4"
                            isOpen={networkIsOpen}
                            onOpenChange={(open) => open !== networkIsOpen && setNetworkIsOpen(open)}
                            onChange={(e) => {
                                setNetworkId(parseInt(e.target.value));
                                setNetworkAlert(e.target.value === undefined);
                            }}
                        >
                            {
                                networks && networks.map((item) => (
                                    <SelectItem
                                        key={item.key}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))
                            }

                        </Select>
                    ) : (
                        <div className="w-full lg:w-1/4 flex-col space-y-2">
                            <span className="text">Network</span>
                            <div
                                onClick={() => {
                                    setUpdateNetworkId(true);
                                    setNetworkIsOpen(!networkIsOpen);
                                }}
                                className="w-full h-12 bg-neutral-100 hover:bg-neutral-200 px-3 py-2 rounded-xl text-slate-600 flex flex-row justify-between items-center cursor-pointer"
                            >
                                <span className="">{card.network?.name}</span>
                                <DynamicFaIcon name={'FaChevronDown'} size={11} />
                            </div>

                        </div>
                    )
                }
                <div className="w-full lg:w-1/4 flex flex-row gap-6">
                    <Input
                        required
                        size="lg"
                        variant="flat"
                        label="4 últimos dígitos"
                        labelPlacement="outside"
                        placeholder="1234"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-2/3"
                    />
                    <Input
                        required
                        size="lg"
                        variant="flat"
                        type="color"
                        label="Color"
                        labelPlacement="outside"
                        value={cardColor}
                        onChange={(e) => setCardColor(e.target.value)}
                        className="w-1/3"
                    />
                </div>
            </div>
            <div className="w-full lg:w-1/3 flex flex-row gap-6 justify-center items-center">
                <Button
                    size='lg'
                    type="submit"
                    variant="solid"
                    color='primary'
                    radius='lg'
                    className="w-full"
                    isLoading={cardsState.loading}
                >
                    Actualizar
                </Button>
                <Button
                    size='lg'
                    variant="solid"
                    color='danger'
                    radius='lg'
                    className="w-full"
                    isLoading={cardsState.loading}
                    onPress={() => dispatch(destroyCardsRequest(card.id.toString()))}
                >
                    Eliminar
                </Button>
            </div>
        </form>
    );
}

export default UpdateCard;