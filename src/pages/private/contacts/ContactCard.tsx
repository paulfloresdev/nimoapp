import React, { useEffect, useState } from "react";
import { Contact, StoreAndUpdateContactPayload, UpdateContactParams } from "../../../types/contacts";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/configStore/store";
import { Button, Card, Input, addToast } from "@heroui/react";
import DynamicFaIcon from "../../../components/DynamicFaIcon";
import { destroyContactRequest, indexContactRequest, resetContactsState, updateContactRequest } from "../../../store/features/contacts/contactsSlice";

interface ContactCardProps {
    contact: Contact;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
    const dispatch = useDispatch();

    const contactsState = useSelector((state: RootState) => state.contacts);

    const [alias, setAlias] = useState<string | undefined>(contact.alias ?? undefined);
    const [status, setStatus] = useState<number>(0);

    useEffect(() => {
        if (contactsState.successUpdate == false) {
            addToast({
                variant: "flat",
                color: "danger",
                title: "Error",
                description: contactsState.error
            });
        } else if (contactsState.successUpdate == true) {
            addToast({
                variant: "flat",
                color: "success",
                title: "Actualización exitosa",
                timeout: 3000,
            });

            dispatch(indexContactRequest());
        }
        dispatch(resetContactsState());
    }, [contactsState.successUpdate]);

    useEffect(() => {
        if (contactsState.successDelete == false) {
            addToast({
                variant: "flat",
                color: "danger",
                title: "Error",
                description: contactsState.error
            });
        } else if (contactsState.successDelete == true) {
            addToast({
                variant: "flat",
                color: "success",
                title: "Eliminación exitosa",
                timeout: 3000,
            });

            dispatch(indexContactRequest());
        }
        dispatch(resetContactsState());
    }, [contactsState.successDelete]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!alias || alias.trim() === "") {
            return;
        }

        var payload: StoreAndUpdateContactPayload = {
            alias: alias.trim(),
        };

        var updateParams: UpdateContactParams = {
            id: contact.id,
            body: payload,
        }

        dispatch(updateContactRequest(updateParams));

        setStatus(0);
    }

    if (status === 0) {
        return (
            <Card
                isPressable
                key={contact.id}
                className="w-full px-2 py-3 flex flex-row justify-center items-center gap-3 hover:border-neutral-400 hover:border-1"
                onPress={() => setStatus(1)}
            >
                <DynamicFaIcon name={"FaUser"} className="text-slate-800" size={16} />
                <span>{contact.alias}</span>
            </Card>
        );
    }

    if (status === 1) {
        return (
            <div className="w-full h-12 flex flex-row gap-2">
                <Button
                    variant="flat"
                    color="primary"
                    className="w-full min-w-12 h-full"
                    onPress={() => {
                        setStatus(2);
                    }}
                >
                    <DynamicFaIcon name={"FaPen"} className="text-primary-500" size={16} />
                </Button>
                <Button
                    variant="flat"
                    color="danger"
                    className="w-full min-w-12 h-full"
                    onPress={() => {
                        dispatch(destroyContactRequest(contact.id.toString()));
                    }}
                >
                    <DynamicFaIcon name={"FaTrash"} className="text-rose-600" size={16} />
                </Button>
                <Button
                    variant="flat"
                    color="default"
                    className="w-full min-w-12 h-full"
                    onPress={() => {
                        setStatus(0);
                    }}
                >
                    <span className="text-lg font-medium">X</span>
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="w-full h-12 flex flex-row gap-2">
            <Input
                required
                size="lg"
                className="w-5/6"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
            />
            <Button
                type="submit"
                variant="flat"
                color="primary"
                className="w-1/6 min-w-12 h-full"
            >
                <DynamicFaIcon name={"FaCheck"} className="text-primary-500" size={16} />
            </Button>
        </form>
    )
}

export default ContactCard;