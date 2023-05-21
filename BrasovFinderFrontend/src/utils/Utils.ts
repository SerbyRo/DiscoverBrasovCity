import dateFormat from "dateformat";

const libraryDateFormat = "yyyy-mm-dd HH:mm";
export function dateToString(date: Date | undefined): string {
    if (typeof date !== "undefined")
    {
        return dateFormat(date, libraryDateFormat);
    }
    return "";
}