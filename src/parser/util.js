// THIS MODULE IS A LITTLE BIT MODDED.

/* Copyright (c) 2012-2018 Aseem Kishore, and others.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */

const unicode = require('./unicode')

module.exports = {
    isSpaceSeparator (c) {
        return typeof c === 'string' && unicode.Space_Separator.test(c)
    },

    isIdStartChar (c) {
        return typeof c === 'string' && (
            (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        (c === '$') || (c === '_') ||
        unicode.ID_Start.test(c)
        )
    },

    isIdContinueChar (c) {
        return typeof c === 'string' && (
            (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        (c >= '0' && c <= '9') ||
        (c === '$') || (c === '_') ||
        (c === '\u200C') || (c === '\u200D') ||
        unicode.ID_Continue.test(c)
        )
    },

    // MODDED ->
    isDigit (c) {
        return isDigitOf[16](c)
    },
    // isDigitOf[base of numeral system]
    isDigitOf: {
        ['2'](c) {
            return typeof c === 'string' && /[0-1]/.test(c)
        },

        ['8'](c) {
            return typeof c === 'string' && /[0-7]/.test(c)
        },

        ['10'](c) {
            return typeof c === 'string' && /[0-9]/.test(c)
        },

        ['16'](c) {
            return typeof c === 'string' && /[0-9A-Fa-f]/.test(c)
        }
    }
    // <- MODDED
}
