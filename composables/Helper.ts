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

export const getHourMinute = (date: Date) => {
    try {
        if (!date) throw date;

        const newDate = new Date(date);

        const timeOptions: any = {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Jakarta",
        };

        const result = new Intl.DateTimeFormat("en-US", timeOptions).format(
            newDate
        );
        return result;
    } catch (error) {
        console.log(error);
        return date;
    }
};

export const formatDefaultDateTime = (date: Date) => {
    try {
        if (!date) throw date;
        let p = new Intl.DateTimeFormat("en", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
            .formatToParts(date)
            .reduce((acc, part) => {
                acc[part.type] = part.value;
                return acc;
            }, {});

        return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`; //p.period
    } catch (error) {
        return date;
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
