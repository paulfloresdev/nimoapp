export class Formatters {
    static spanishDate(dateString: string | null): string {
        if (!dateString) {
            return "Undefined";
        }

        const date = new Date(dateString);

        const esDate = date.toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const parts = esDate.split(" de ");

        return `${parts[0]} ${parts[1].slice(0, 3)} ${parts[2]}`;
    }

    static currency(amount: number): string {
        if (isNaN(amount)) {
            return "0.00";
        }

        return amount.toLocaleString("es-MX", {
            style: "currency",
            currency: "MXN",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    static toPositive(value: number): number {
        return Math.abs(value);
    }

}