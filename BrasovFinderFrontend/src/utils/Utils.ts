import dateFormat from "dateformat";

const libraryDateFormat = "yyyy-mm-dd HH:mm";
export function dateToString(date: Date | undefined): string {
    if (typeof date !== "undefined")
    {
        return dateFormat(date, libraryDateFormat);
    }
    return "";
}

export function getRankString(rank: number): string{
    switch (rank){
        case 11: return "11th";
        case 12: return "12th";
        case 13: return "13th";
        default:
            switch (rank % 10) {
                case 1: return rank + "st";
                case 2: return rank + "nd";
                case 3: return rank + "rd";
                default: return rank + "th";
            }
    }
}