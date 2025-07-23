import { Button, Card, Input, addToast } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/configStore/store";
import { indexContactRequest, resetContactsState, storeContactRequest } from "../../../store/features/contacts/contactsSlice";
import DynamicFaIcon from "../../../components/DynamicFaIcon";
import { StoreAndUpdateContactPayload } from "../../../types/contacts";
import ContactCard from "./ContactCard";

const Contacts: React.FC = () => {
    const dispatch = useDispatch();

    const contactsState = useSelector((state: RootState) => state.contacts);

    const [alias, setAlias] = useState<string | undefined>(undefined);

    useEffect(() => {
        dispatch(indexContactRequest());
    }, [dispatch]);

    useEffect(() => {
        if (contactsState.successStore == false) {
            addToast({
                variant: "flat",
                color: "danger",
                title: "Error",
                description: contactsState.error
            });
        } else if (contactsState.successStore == true) {
            addToast({
                variant: "flat",
                color: "success",
                title: "Registro exitoso",
                timeout: 3000,
            });

            dispatch(indexContactRequest());
        }
        dispatch(resetContactsState());
    }, [contactsState.successStore])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!alias || alias.trim() === "") {
            return;
        }

        var payload: StoreAndUpdateContactPayload = {
            alias: alias.trim(),
        }
        dispatch(storeContactRequest(payload));

        setAlias("");
    };

    if (contactsState.loading) {
        return (
            <div className="w-full lg:h-dscreen flex flex-col gap-y-6">
                Loading...
            </div>
        );
    }

    return (
        <div className="w-full lg:h-dscreen flex flex-col gap-y-6 pb-12">
            <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-6">
                <span className="font-semibold">Cuentas y tarjetas</span>
                <form onSubmit={handleSubmit} className="w-full lg:w-auto flex flex-row gap-6">
                    <Input
                        required
                        className="w-full lg:w-48"
                        label="Alias"
                        labelPlacement="outside-left"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                    />
                    <Button
                        type="submit"
                        color="primary"
                        className=""
                        isLoading={contactsState.loading}
                    >
                        Agregar
                    </Button>
                </form>
            </div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-6 gap-6">
                {
                    contactsState.collection?.data && contactsState.collection?.data.map((contact) => (
                        <ContactCard key={contact.id} contact={contact} />
                    ))
                }
            </div>
        </div>
    );
}

export default Contacts;