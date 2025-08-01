export const stringToColour = (str = "") => {
    if (loadData.value && !str) return { backgroundColor: "lightgray" };

    let hash = 0;
    str.split("").forEach((char) => {
        hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });

    let colour = "#";
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        colour += value.toString(16).padStart(2, "0");
    }

    return { backgroundColor: colour };
};

export const formatDefaultDate = (date: Date) => {
    try {
        if (!date) throw date;

        return new Intl.DateTimeFormat("fr-CA").format(date);
    } catch (error) {
        return date;
    }
};

export const formatDefaultDateTime = (date: Date) => {
    try {
        if (!date) throw date;
        date = new Date(date);

        const dateTime: any = new Intl.DateTimeFormat("en", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
            .formatToParts(date)
            .reduce((acc, part) => {
                acc[part.type] = part.value;
                return acc;
            }, {});

        return `${dateTime.year}-${dateTime.month}-${dateTime.day} ${dateTime.hour}:${dateTime.minute}`;
    } catch (error) {
        return date;
    }
};

export const getDateLocale = (date: any) => {
    try {
        const resultDate: any = new Date(date);

        if (isNaN(resultDate)) throw resultDate;

        return resultDate.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    } catch (error) {
        return null;
    }
};

export const getTimeLocale = (date: any) => {
    try {
        const resultDate: any = new Date(date);

        if (isNaN(resultDate)) throw resultDate;

        return resultDate.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch (error) {
        return null;
    }
};

export const formatRupiah = (number: number = 0) => {
    try {
        const result = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(number);

        return result;
    } catch (error) {
        return number;
    }
};

export const formatLocaleNumber = (number: number = 0) => {
    try {
        const result = Number(number).toLocaleString("id-ID");

        return result;
    } catch (error) {
        return number;
    }
};

export const round = (value: number, precision = 0) => {
    try {
        const decimals = precision ? 10 ** precision : 1;
        const result = Math.round(value * decimals) / decimals;

        return result;
    } catch (error) {
        return value;
    }
};

export const formatInputCurrency = (
    angka: any,
    prefix: any,
    accept = "comma"
) => {
    try {
        const regex = accept == "comma" ? /[^,\d]/g : /[^.\d]/g;
        const comma = accept == "comma" ? "," : ".";

        let number_string = String(angka).replace(regex, "").toString(),
            split = number_string.split(comma),
            sisa = split[0].length % 3,
            rupiah = split[0].substr(0, sisa),
            ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (rupiah.match(/^0{2}/)) return 0;
        if (rupiah.match(/^0[\d]/)) {
            rupiah = rupiah.substr(1);
        }
        if (ribuan) {
            let separator = sisa ? "." : "";
            rupiah += separator + ribuan.join(".");
        }

        rupiah = split[1] != undefined ? rupiah + "," + split[1] : rupiah;
        const result =
            prefix == undefined ? rupiah : rupiah ? "Rp. " + rupiah : "";
        return result;
    } catch (error) {
        console.log(error);
        return angka;
    }
};

export const formatNumberToCurrency = (angka: any) => {
    try {
        const regex = /[^.\d]/g;
        const comma = ".";

        let number_string = String(angka).replace(regex, "").toString(),
            split = number_string.split(comma),
            sisa = split[0].length % 3,
            result = split[0].substr(0, sisa),
            ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        if (result.match(/^0{2}/)) return 0;
        if (result.match(/^0[\d]/)) {
            result = result.substr(1);
        }
        if (ribuan) {
            let separator = sisa ? "." : "";
            result += separator + ribuan.join(".");
        }

        result = split[1] != undefined ? result + "," + split[1] : result;

        return result;
    } catch (error) {
        console.log(error);
        return angka;
    }
};

export const formatCurrencyToNumber = (rupiahFormat: any) => {
    try {
        if (!rupiahFormat) return null;

        const numberFormat = String(rupiahFormat)
            .replace(/[^\d,]+/g, "")
            .replace(/[,]+/g, ".");

        return Number(numberFormat);
    } catch (error) {
        console.log(error);
        return rupiahFormat;
    }
};

export const getFileFromUrl = async (url: string, name: string) => {
    try {
        if (!url) return null;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const blob = await response.blob();

        const file = new File([blob], name);

        return file;
    } catch (error) {
        console.log(error);
        return null;
    }
};
