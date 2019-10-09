/**
 * A library for converting date formats. `convert()` and 
 * `correctDateToZulu()` are the only methods intended to be used by 
 * outside code.
 * @author Kyle Weems of Offroadcode
 * @version v1.0.3
 * @copyright 2019 Kyle Weems
 * @license MIT
 */
var OrcDate = {

    //* The following methods are public *//////////////////////////////////////

    /**
     * Converts a date from a Date object or string with a format matching 
     * the `originalFormat` into a new Date object or string matching the 
     * `newFormat`. Corrected to Zulu by default to avoid timezone headaches.
     * @param {string | Date} date The original date, either a string or a 
     * Date object.
     * @param {string} originalFormatString The format of the date provided. If it is 
     * `"Date"` then it is a Date object. Expects "YYYY", "DD", and either "MM", 
     * "MMM", or "MMMM" somewhere inside it.
     * @param {string} newFormatString The new format of the date to output. Same rules 
     * as `originalFormat`.
     * @param {boolean=} correctToZulu - Defaults to true. If true, corrects 
     * the Date object (if one is used) to Zulu time to avoid display issues 
     * caused by time zones.
     * @returns {string | Date} Either a string or Date object.
     */
    convert: function(date, originalFormatString, newFormatString, correctToZulu) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        if (typeof correctToZulu == 'undefined') {
            correctToZulu = true;
        }
        var components = false;
        if (originalFormatString !== 'Date') {
            var oldFormat = OrcDate._interpretFormat(originalFormatString);
            components = OrcDate._getComponentsPerFormatRules(date, oldFormat);
        } else {
            components = OrcDate._getComponentsFromDate(date, correctToZulu);
        }
        var reformatted = newFormatString;
        if (newFormatString !== 'Date') {
            reformatted = reformatted.split('YYYY').join(components.year);
            reformatted = reformatted.split('DD').join(pad(components.date));
            let monthSymbol = '';
            if (reformatted.indexOf('MMMM') > -1) {
                monthSymbol = 'MMMM';
            } else if (reformatted.indexOf('MMM') > -1) {
                monthSymbol = 'MMM';
            } else if (reformatted.indexOf('MM')) {
                monthSymbol = 'MM';
            }
            var newMonth = OrcDate.convertMonth(components.month, monthSymbol);
            reformatted = reformatted.split(monthSymbol).join(isNaN(newMonth) ? newMonth : pad(newMonth));
        } else {
            reformatted = new Date(components.year + '-' + pad(components.month) + '-' + pad(components.date));
            if (correctToZulu) {
                reformatted = OrcDate.correctDateToZulu(reformatted);
            }
        }
        return reformatted;
    },

    /**
     * Converts the month to a 1-based index number, short name, or long name 
     * from any one of those three and returns updated value.
     * @param {number | string} month String representation of month as English 
     * long name or shortname, or number for 1-based index (e.g. "January", 
     * "Jan" or 1 all represent January). 
     * @param {string=} key "MM" to output as 1-based index number, "MMM" to output 
     * as short name, "MMMM" to output as long name. "MM" by default;
     * @returns {number | string}
     */
    convertMonth: function(month, key) {
        if (!key) {
            key = 'MM';
        }
        var output = -1;
        var fullNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var shortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (var i = 0; i < fullNames.length; i++) {
            if (fullNames[i] == month) {
                output = i;
            }
        }
        for (var i = 0; i < shortNames.length; i++) {
            if (shortNames[i] == month) {
                output = i;
            }
        }
        if (output == -1) {
            output = Number(month) - 1;
        }
        return key == 'MM' ? (output + 1) : key == 'MMM' ? shortNames[output] : fullNames[output];
    },    

    /**
     * Compensates for timezone offsets and forces date into UTC Zulu.
     * @param {Date} date 
     * @returns {Date}
     */
    correctDateToZulu: function(date) {
        var offset = date.getTimezoneOffset();
        if (offset != 0) {
            var originalUtc = date.getTime();
            var modifier = offset * 60000;
            var correctedUtc = originalUtc - modifier;
            return new Date(correctedUtc);
        }
        return date;
    },      

    //* The following methods are private. *////////////////////////////////////

    /**
     * Due to how months can be represented as numbers, short names, or long 
     * names in the date formatting, this function helps other functions inserting 
     * the applicable symbol key them into an array of component symbols against 
     * a year symbol for use in understanding provided formats.
     * @param {string[]} order The order object to be updated.
     * @param {string} monthSymbol The symbol representing the format being used 
     * for the month.
     * @param {number} monthIndex The index of the month symbol in the format 
     * string that is being used to create the order object.
     * @param {number} yearIndex The index of the year symbol in the format 
     * string that is being used to create the order object.
     * @returns {string[]} The updated order object
     */
    _addMonthToOrder: function(order, monthSymbol, monthIndex, yearIndex) {
        if (monthIndex > yearIndex) {
        order.push(monthSymbol);
        } else {
            order.unshift(monthSymbol);
        }
        return order;
    },    

    /**
     * Returns an object with the year, month, and date parsed from the `date`
     * object, correcting for timezone (aka to Zulu) if requested.
     * @param {Date} date
     * @param {boolean=} forceZulu If `true` correct for timezone.
     * @returns {{year: number, month: number, date: number}}
     */
    _getComponentsFromDate: function(date, forceZulu) {
        if (forceZulu) {
            date = OrcDate.correctDateToZulu(date);
        }
        var components = date.toISOString().split('T')[0].split('-');
        return {
            year: Number(components[0]),
            month: Number(components[1]),
            date: Number(components[2])
        };
    },

    /**
     * Returns an object with the year, month, and date parsed from the `date` 
     * string per the rules of the `format` object.
     * @param {string} date
     * @param {JSON} format
     * @returns {{year: number, month: number, date: number}}
     */
    _getComponentsPerFormatRules: function(date, format) {
        var components = [];
        if (format.prefix) {
            date.split(format.prefix)[1];
        }
        if (format.suffix) {
            date.split(format.suffix)[2];
        }
        components.push(date.split(format.separators[0])[0]);
        components.push(date.split(components[0] + format.separators[0])[1].split(format.separators[1])[0]);
        components.push(date.split(components[1] + format.separators[1])[1]);
        var monthIndex = -1;
        for (var i = 0; i < format.order.length; i++) {
            if (format.order[i] !== 'YYYY' && format.order[i] !== 'DD') {
                monthIndex = i;
            }
        }
        return {
            year: Number(components[format.order.indexOf('YYYY')]),
            month: OrcDate.convertMonth(components[monthIndex]),
            date: Number(components[format.order.indexOf('DD')])
        }
    },

    /**
     * Creates an object that describes the format rules for a provided date 
     * format string, such as 'MM DD YYYY' or 'DD/MM/YYYY' for use in converting
     * a provided date string.
     * @param {string} format The format of the date as a string to interpret. 
     * Years are only valid as YYYY, months as MM, MMM, or MMMM, and dates as 
     * DD.
     * @returns {{order: string[], prefix: string | false, suffix: string | false, separators: string[]}}
     */
    _interpretFormat: function(format)  {
        var order = ['YYYY'];
        var monthSymbol = (format.indexOf('MMMM') > -1) ? 'MMMM' : (format.indexOf('MMM') > -1) ? 'MMM' : 'MM';
        var yearIndex = format.indexOf('YYYY'); 
        var monthIndex = format.indexOf(monthSymbol);
        var dayIndex = format.indexOf('DD');
        order = OrcDate._addMonthToOrder(order, monthSymbol, monthIndex, yearIndex);
        if (dayIndex < monthIndex && dayIndex < yearIndex) {
            order.unshift('DD');
        } else if (dayIndex > monthIndex && dayIndex > yearIndex) {
            order.push('DD');
        } else {
            order.splice(1, 0, 'DD');
        }
        return {
            order: order,
            prefix: format.split(order[0])[0] ? format.split(order[0])[0] : false,
            suffix: format.split(order[2])[1] ? format.split(order[2])[1] : false,
            separators: [format.split(order[0])[1].split(order[1])[0], format.split(order[1])[1].split(order[2])[0]]
        };
    }
};

module.exports = {
    convert: OrcDate.convert,
    convertMonth: OrcDate.convertMonth,
    correctDateToZulu: OrcDate.correctDateToZulu
};
