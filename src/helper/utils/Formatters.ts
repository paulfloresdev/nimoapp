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

    static extractMonthYear(dateString: string | null): { month: number; year: number } {
        if (!dateString) {
            return { month: 0, year: 0 }; // Puedes usar null u otro valor si prefieres
        }

        const date = new Date(dateString);
        const month = date.getMonth() + 1; // getMonth() devuelve 0–11
        const year = date.getFullYear();

        return { month, year };
    }



    static shortSpanishMonth(month: number | undefined) {
        const date = new Date(`2001/${month}/01`);

        const esDate = date.toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const parts = esDate.split(" de ");

        return parts[1].slice(0, 3).toUpperCase();
    }

    static spanishMonth(month: number | undefined) {
        if (!month) return "";

        const date = new Date(`2001/${month}/01`);

        const esDate = date.toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        const parts = esDate.split(" de ");
        const rawMonth = parts[1];

        return rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1).toLowerCase();
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

    static getEndOfMonth(dateString: string): Date {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = date.getMonth(); // 0-based

        // Día 0 del mes siguiente = último día del mes actual
        return new Date(year, month + 1, 0);
    }

    static percentage(numerator: number, denominator: number): string {
        if (denominator === 0) {
            return "0%"; // Evitar división por cero
        }
        const percentage = (numerator / denominator) * 100;
        return `${percentage.toFixed(2)}%`;
    }

}