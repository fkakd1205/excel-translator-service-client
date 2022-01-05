import moment from 'moment';

function getStartDate(date) {
    var d = new Date(date);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    return d;
}

function getEndDate(date) {
    var d = new Date(date);
    d.setHours(23);
    d.setMinutes(59);
    d.setSeconds(59);
    return d;
}

function dateToYYYYMMDD(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function dateToYYYYMMDDhhmmss(idate) {
    var date = new Date(idate);
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
}

function dateToYYYYMMDDhhmmssFile(idate){
    var date = new Date(idate);
    return moment(date).format("YYYYMMDDHHmmss");
}

function dateToYYMMDDhhmmss(idate) {
    var date = new Date(idate);
    return moment(date).format("YY/MM/DD HH:mm:ss");
}

function dateToYYMMDD(idate){
    var date = new Date(idate);
    return moment(date).format("YY.MM.DD");
}

export {
    getStartDate,
    getEndDate,
    dateToYYYYMMDD,
    dateToYYYYMMDDhhmmss,
    dateToYYYYMMDDhhmmssFile,
    dateToYYMMDDhhmmss,
    dateToYYMMDD
}