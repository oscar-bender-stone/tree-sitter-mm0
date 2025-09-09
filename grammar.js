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

  extras: ($) => [$.comment],

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $._sort_stmt,
        $._term_stmt,
        $._assert_stmt,
        $._def_stmt,
        $._notation_stmt,
        $._inout_stmt,
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
    _term_stmt: ($) =>
      seq('term', $.term, repeat($._type_binder), ':', $._arrow_type, ';'),
    term: ($) => $.identifier,
    _type_binder: ($) =>
      choice(
        seq('{', repeat($.term), ':', $.type, '}'),
        seq('(', repeat($._term_), ':', $.type, ')'),
      ),
    _arrow_type: ($) => choice($.type, seq($.type, '>', $._arrow_type)),
    type: ($) => seq($.identifier, repeat($.identifier)),

    _term_: ($) => choice($.term, '_'),
    _identifier_: ($) => choice($.identifier, '_'),

    // Axiom and theorems:
    // [https://github.com/digama0/mm0/blob/master/mm0.md#axioms-and-theorems]
    _assert_stmt: ($) =>
      seq(
        choice('axiom', 'theorem'),
        $.identifier,
        repeat($._formula_type_binder),
        ':',
        $._formula_arrow_type,
        ';',
      ),
    _formula_type_binder: ($) =>
      choice(
        seq('{', repeat($.identifier), ':', $.type, '}'),
        seq('(', repeat($._identifier_), ':', choice($.type, $._formula), ')'),
      ),
    _formula_arrow_type: ($) =>
      choice(
        $._formula,
        seq(choice($.type, $._formula), '>', $._formula_arrow_type),
      ),
    _formula: ($) => $._math_string,

    // Definitions
    // [https://github.com/digama0/mm0/blob/master/mm0.md#definitions]
    _def_stmt: ($) =>
      seq(
        'def',
        $.identifier,
        repeat($._dummy_binder),
        ':',
        $.type,
        optional(seq('=', $._formula)),
        ';',
      ),
    _dummy_binder: ($) =>
      choice(
        seq('{', repeat($._dummy_identifier), ':', $.type, '}'),
        seq('(', repeat($._dummy_identifier), ':', $.type, ')'),
      ),
    // To fix precedence, need to inline _identifier_ here
    _dummy_identifier: ($) =>
      choice('.', $.identifier, choice($.identifier, '_')),

    // Notations
    // [https://github.com/digama0/mm0/blob/master/mm0.md#notations]
    // TODO: determine how to add a second tokenizer
    _notation_stmt: ($) =>
      choice(
        $._delimiter_stmt,
        $._simple_notation_stmt,
        $._coercion_stmt,
        $._gen_notation_stmt,
      ),
    _delimiter_stmt: ($) =>
      seq('delimiter', $._math_string, optional($._math_string), ';'),
    _simple_notation_stmt: ($) =>
      seq(
        choice('infixl', 'infixr', 'prefix'),
        $.identifier,
        ':',
        $._constant,
        'prec',
        $._precedence_lvl,
        ';',
      ),
    _constant: ($) => $._math_string,
    _precedence_lvl: ($) => choice($.number, 'max'),
    _coercion_stmt: ($) =>
      seq('coercion', $.identifier, ':', $.identifier, '>', $.identifier, ';'),
    _gen_notation_stmt: ($) =>
      seq('notation', $.identifier, repeat($._type_binder), ';'),
    _notation_literal: ($) => choice($._prec_constant, $.identifier),
    _prec_constant: ($) => seq('(', $._constant, ':', $._precedence_lvl, ')'),

    // Input and Output
    // [https://github.com/digama0/mm0/blob/master/mm0.md#sorts]
    _inout_stmt: ($) => choice($._input_stmt, $._output_stmt),
    _input_stmt: ($) =>
      seq(
        'input',
        $._input_kind,
        ':',
        repeat(choice($.identifier, $._math_string)),
        ';',
      ),
    _output_stmt: ($) =>
      seq(
        'output',
        $._output_kind,
        ':',
        repeat(choice($.identifier, $._math_string)),
        ';',
      ),
    _input_kind: ($) => $.identifier,
    _output_kind: ($) => $.identifier,

    // Lexical structure
    // [https://github.com/digama0/mm0/blob/master/mm0.md#lexical-structure]
    _lexeme: ($) => choice($._symbol, $.identifier, $.number, $._math_string),
    _symbol: ($) =>
      choice('*', '>', '.', ':', ';', '(', ')', '{', '}', '=', '_'),

    _math_string: ($) => $.math_string,
    math_string: ($) => /\$[^\$]*\$/,

    // Adds math-string from secondary parsing:
    // [https://github.com/digama0/mm0/blob/master/mm0.md#secondary-parsing]
    // Tree-sitter doesn't allow matching the empty string
    // (except for the start symbol).
    // _math_string: ($) => seq(repeat(choice($.math_lexeme, $._math_whitespace))),
    // _math_whitespace: ($) => /( |\n)*/,
    // math_lexeme: ($) => choice($.math_lexeme, $.identifier, '(', ')'),

    number: ($) => token(/0|[1-9][0-9]*/),
    identifier: ($) => token(/[a-zA-Z][a-zA-Z0-9_]*/),

    _whitestuff: ($) => choice($._whitechar, $.comment),
    _whitechar: ($) => choice(' ', '\n'),
    comment: ($) => token(seq('--', /[^\n]*\n/)),

    // Additional highlights
    keyword: choice('axiom', 'coercion', 'def', 'delimiter', 'free', 'infixl', 'infixlr', 'input', 'max', 'notation', 'output', 'prec', 'prefix', 'provable', 'pure', 'sort', 'strict', 'term', 'theorem')
    
  },
});
