import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/configStore/store";
import { indexBanksRequest } from "../../../store/features/banks/banksSlice";
import { Button, Input, Select, SelectItem, Skeleton, addToast } from "@heroui/react";
import { cardTypes, networks } from "../../../types/combos";
import { StoreCardsParams } from "../../../types/cards";
import { storeCardsRequest } from "../../../store/features/cards/cardsSlice";
import { useNavigate } from "react-router-dom";
const baseStorageUrl = import.meta.env.VITE_SITE_BASE_STORAGE_URL_BACKEND;

const AddCard: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const banksState = useSelector((state: RootState) => state.banks);
    const cardsState = useSelector((state: RootState) => state.cards);

    const [bankId, setBankId] = useState<number | undefined>(undefined);
    const [bankAlert, setBankAlert] = useState<boolean | undefined>(undefined);
    const [cardColor, setCardColor] = useState<string | undefined>(undefined);
    const [typeId, setTypeId] = useState<number | undefined>(undefined);
    const [typeAlert, setTypeAlert] = useState<boolean | undefined>(undefined);
    const [networkId, setNetworkId] = useState<number | undefined>(undefined);
    const [networkAlert, setNetworkAlert] = useState<boolean | undefined>(undefined);
    const [cardNumber, setCardNumber] = useState<string | undefined>(undefined);

    useEffect(() => {
        dispatch(indexBanksRequest());
    }, [dispatch]);

    useEffect(() => {
        if (cardsState.storeSuccess == false) {
            addToast({
                variant: "flat",
                color: "danger",
                title: "Error",
                description: cardsState.error
            });
        } else if (cardsState.storeSuccess == true) {
            addToast({
                variant: "flat",
                color: "success",
                title: "Registro exitoso",
                timeout: 3000,
            });

            navigate("/dashboard/cards");
        }
    }, [cardsState.storeSuccess]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setTypeAlert(typeId === undefined);
        setBankAlert(bankId === undefined);
        setNetworkAlert(networkId === undefined);

        if (typeAlert || bankAlert || networkAlert) {
            return;
        }

        var payload: StoreCardsParams = {
            numbers: cardNumber ?? "",
            color: cardColor ?? "",
            type_id: typeId ?? 0,
            bank_id: bankId ?? 0,
            network_id: networkId ?? 0,
        }

        dispatch(storeCardsRequest(payload));
    }

    return (
        <form onSubmit={handleSubmit} className="w-full lg:h-dscreen flex flex-col gap-y-6 pb-12">
            <span className="font-semibold">Agregar tarjeta</span>
            <div className="w-full flex flex-col lg:flex-row gap-6">
                <Select
                    required
                    size="lg"
                    variant="flat"
                    label="Tipo de tarjeta"
                    labelPlacement="outside"
                    placeholder="Tipo de tarjeta"
                    value={typeId}
                    color={typeAlert ? 'danger' : undefined}
                    className="w-full lg:w-1/4"
                    onChange={(e) => {
                        setTypeId(parseInt(e.target.value));
                        setTypeAlert(e.target.value === undefined);
                    }}
                >
                    {
                        cardTypes && cardTypes.map((item) => (
                            <SelectItem
                                key={item.key}
                            >
                                {item.label}
                            </SelectItem>
                        ))
                    }

                </Select>
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
                        <Select
                            required
                            size="lg"
                            variant="flat"
                            label="Tarjeta"
                            labelPlacement="outside"
                            placeholder="Tarjeta"
                            value={bankId}
                            color={bankAlert ? 'danger' : undefined}
                            className="w-full lg:w-1/4"
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
                    )}
                </>
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
            <Button
                size='lg'
                type="submit"
                variant="solid"
                color='primary'
                radius='lg'
                className="w-full lg:w-1/6"
                isLoading={cardsState.loading}
            >
                Agregar
            </Button>

        </form>
    );
}

export default AddCard;