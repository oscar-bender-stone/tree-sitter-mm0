/**
 * @file Grammar for the MM0 and MM1 proof languages.
 * @author Oscar Bender-Stone <oscar-bender-stone@protonmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

// Adapted from:
// mm0-md
// [https://github.com/digama0/mm0/blob/master/mm0.md#grammar-for-the-mm0-file-format]

module.exports = grammar({
  name: "mm0",

  rules: {
    source_file: ($) => repeat($._statement),

    _statement: ($) =>
      choice(
        $._sort_stmt,
        // $.term_stmt
      ),
    // TODO: decide if
    // pseudo-keywords need separate nodes
    _sort_stmt: ($) =>
      seq(
        optional("pure"),
        optional("strict"),
        optional("provable"),
        optional("free"),
        "sort",
        $.identifier,
      ),

    // Lexical structure
    // [https://github.com/digama0/mm0/blob/master/mm0.md#lexical-structure]
    identifier: ($) => /[a-zA-Z][a-zA-Z]*/,
  },
});
