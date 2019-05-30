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

var formatted = OrcDate.convert('August 24, 1977', 'MMMM DD, YYYY', 'DD/MM/YYYY');

console.info(formatted); // outputs '24/08/1977'
```
