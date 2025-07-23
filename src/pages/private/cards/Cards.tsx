import React, { MouseEventHandler, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store/configStore/store";
import { indexCardsRequest } from "../../../store/features/cards/cardsSlice";
import { Card } from "../../../types/cards";
import { Button } from "@heroui/react";
const baseStorageUrl = import.meta.env.VITE_SITE_BASE_STORAGE_URL_BACKEND;

interface BankCardProps {
    card: Card | null;
    onClick?: MouseEventHandler<HTMLDivElement>
}

export const BankCard: React.FC<BankCardProps> = ({ card, onClick }) => {
    if (card === null) return <></>

    return (
        <div
            onClick={onClick}
            key={card.id}
            style={{ backgroundColor: `${card.color}` }}
            className="w-full lg:w-full aspect-[1.5858] rounded-xl p-4 flex flex-col gap-y-2 justify-between"
        >
            <div><img className="h-5" src={`${baseStorageUrl}${card.bank?.img_path}`} alt="" /></div>
            <div className="w-12 h-8 rounded-lg bg-stone-200 ml-4 p-2">
                <div className="w-5 h-4 rounded-sm bg-stone-300"></div>
            </div>
            <span className="text-white tracking-widest">{`************${card.numbers}`}</span>
            <div className="w-full flex flex-row justify-end"><img className="h-5" src={`${baseStorageUrl}${card.network?.img_path}`} alt="" /></div>
        </div>
    );
}

const Cards: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cardsState = useSelector((state: RootState) => state.cards);

    useEffect(() => {
        dispatch(indexCardsRequest());
    }, [dispatch]);

    if (cardsState.loading) {
        return (
            <div className="w-full lg:h-dscreen flex flex-col gap-y-6">
                Loading...
            </div>
        );
    }

    return (
        <div className="w-full lg:h-dscreen flex flex-col gap-y-6 pb-12">
            <div className="w-full flex flex-row justify-between items-center gap-6">
                <span className="font-semibold">Cuentas y tarjetas</span>
                <Button
                    color="primary"
                    className=""
                    onPress={() => navigate("add")}
                >
                    Agregar
                </Button>
            </div>
            <span className="font-normal">{`Tarjetas de débito (${cardsState.debit?.length})`}</span>
            <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
                {
                    cardsState.debit?.map((card) => (
                        <BankCard
                            card={card}
                            key={card.id}
                            onClick={
                                () => navigate("update", {
                                    state: {
                                        card: card
                                    }
                                })
                            }
                        />
                    ))
                }
            </div>
            <span className="font-medium">{`Tarjetas de crédito (${cardsState.credit?.length})`}</span>
            <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
                {
                    cardsState.credit?.map((card) => (
                        <BankCard
                            card={card}
                            key={card.id}
                            onClick={
                                () => navigate("/dashboard/cards/update", {
                                    state: {
                                        card: card
                                    }
                                })
                            }
                        />
                    ))
                }
            </div>
        </div>
    );
}

export default Cards;