export const getNextRunDate = (cadence, fromDate) => {
    const date = new Date(fromDate);

    if (cadence === "WEEKLY") {
        date.setDate(date.getDate() + 7);
    } else {
        date.setMonth(date.getMonth() + 1);
    }

    return date;
};