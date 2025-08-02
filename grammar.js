/**
 * @file Grammar for the MM0 and MM1 proof languages.
 * @author Oscar Bender-Stone <oscar-bender-stone@protonmail.com>
 * @license MIT
 */

/// <reference types='tree-sitter-cli/dsl' />
// @ts-check

// Adapted from:
// mm0-md
// [https://github.com/digama0/mm0/blob/master/mm0.md#grammar-for-the-mm0-file-format]

module.exports = grammar({
  name: 'mm0',

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $._sort_stmt,
        // $.term_stmt
      ),

    // Sorts:
    // [https://github.com/digama0/mm0/blob/master/mm0.md#sorts]
    _sort_stmt: ($) =>
      seq(
        optional('pure'),
        optional('strict'),
        optional('provable'),
        optional('free'),
        'sort',
        $.identifier,
      ),

    // Term constructors
    //  [https://github.com/digama0/mm0/blob/master/mm0.md#term-constructors]

    // Lexical structure
    // [https://github.com/digama0/mm0/blob/master/mm0.md#lexical-structure]
    _lexeme: ($) => choice($._symbol, $.identifier, $.number, $._math_string),
    _symbol: ($) =>
      choice('*', '>', '.', ':', ';', '(', ')', '{', '}', '=', '_'),

    // Adds math-string from secondary parsing:
    // [https://github.com/digama0/mm0/blob/master/mm0.md#secondary-parsing]
    _math_string: ($) => choice($.math_lexeme, $._math_whitespace),
    _math_whitespace: ($) => /( |\n)*/,
    math_lexeme: ($) => choice($.math_lexeme, $.identifier, '(', ')'),

    number: ($) => /0|[1-9][0-9]*/,
    identifier: ($) => /[a-zA-Z][a-zA-Z]*/,

    _whitestuff: ($) => choice($._whitechar, $.comment),
    _whitechar: ($) => choice(' ', '\n'),
    comment: ($) => $._line_comment,
    _line_comment: ($) => seq('--', /[^\n]*\n/),
  },
});
