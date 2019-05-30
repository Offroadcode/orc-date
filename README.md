# Orc-Date

[![npm version](https://badge.fury.io/js/orc-date.svg)](https://badge.fury.io/js/orc-date) 
[![Download Count](https://img.shields.io/npm/dm/orc-date.svg?style=flat)](http://www.npmjs.com/package/orc-date)


> A small date converter tool for converting to and from JS Date() and different format strings.

## Install

```bash
npm i orc-date --save
```

## Usage

```javascript
import OrcDate from 'orc-date';

var formatted = OrcDate.convert('May 25, 1977', 'MMMM DD, YYYY', 'DD/MM/YYYY');

console.info(formatted); // outputs '25/05/1977'
```

## API

### OrcDate.convert(date, originalFormatString, newFormatString, correctToZulu)

Converts a date represented as a string or a `Date()` object into a newly formatted string or `Date()` object.

#### Parameters

_string_ | _Date_ **date**: Either a `Date()` object or a string representation of a date that follows the pattern listed in `originalFormatString`.

_string_ **originalFormatString**: The format that `date` corresponds to. If it's a `Date()` this must be "Date". The format needs to match the pattern used by `date`.

* 'DD' represents the date of the month.
* 'MM' represents the month, displayed as a number.
* 'MMM' represents the month, displayed as its short name in English. (e.g. December is 'Dec').
* 'MMMM' represents the month, displayed as its long name in English. (e.g. 'December').
* 'YYYY' represents the year with its full four digits.

    For a format to be valid it must include 'DD', 'YYYY', and one of the month options (and only one). All other content inside the format is treated as separators. Month names are case sensitive.

    If a `date` of 'May 25, 1977' was passed in, the expected `originalFormat' should be 'MMMM DD, YYYY'.


_string_ **newFormatString**: The format that the date should be returned as. Uses the same rules as the format of `oldFormatString`. If May 25, 1977 was used and the `newFormatString` is set to 'DD/MM/YYYY' the function will return '25/05/1977'. If `newFormatString`'s value is 'Date', it will return the date as a new `Date()` object.

_boolean?_ **correctToZulu**: Optional, and defaults to `true`. If set to `true`, then OrcDate will compensate for timezone offsets on the user's machine to prevent it from converting a `Date()` object into the wrong day based on timezone. Only used when converting to/from a `Date()` object.

#### Examples

```javascript
var date = new Date(); // pretend this is done 01 June, 2019.
var formatted = OrcDate.convert(date, 'Date', 'YYYY-MM-DD');
console.info(formatted); // returns '2019-06-01'.
```

```javascript
var date = OrcDate.convert('June 01, 2016', 'MMMM DD, YYYY', 'Date');
console.info(date); // returns '> Date 2019-06-01T00:00:00Z'.
```

### OrcDate.convertMonth(month, key)

Converts a month's number (using 1-based index), short name in English (such as 'Dec'), or long name in English (such as 'December') into one of those representations for a month as desired per `key`.

#### Params

_number_ | _string_ **month**: Either a number from 1 - 12, or a short or long name for a month (such as 'Dec' or 'December'). Case sensitive.

_string_ **key:** The desired format to return for the month. 'MM' for number, 'MMM' for short name, and 'MMMM' for long name.

#### Examples

```javascript
var month = OrcDate.convertMonth(2, 'MMM');
console.info(month); // returns 'Feb'.
```

```javascript
var month = OrcDate.convertMonth('August', 'MM');
console.info(month); // returns 8.
```

### OrcDate.correctDateToZulu(date)

Returns a `Date()` object that has been corrected to Zulu time to avoid the date displaying wrong due to local timezone offsets.

#### Params

_Date_ **date:** A `Date()` object to correct.

#### Examples

```javascript
var uncorrectedDate = new Date();
var correctedDate = OrcDate.correctDateToZulu(uncorrectedDate);
// correctedDate will adjust for the timezone offset, preventing Date() from possibly showing wrong due to timezone.
```
