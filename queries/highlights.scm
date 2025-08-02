"(" @punctuation.bracket
")" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket

"." @punctuation.delimiter
":" @punctuation.delimiter
";" @punctuation.delimiter

"axiom" @keyword
"coercion"  @keyword
"def" @keyword
"delimiter" @keyword
"free" @keyword
"infixl" @keyword
"infixr" @keyword
"input" @keyword
"max" @keyword
"notation" @keyword
"output" @keyword
"prec" @keyword
"prefix" @keyword
"provable" @keyword
"pure" @keyword
"sort" @keyword
"strict" @keyword
"term" @keyword
"theorem" @keyword


(identifier) @variable
(comment) @comment
(number) @number
(type) @type
(math_string) @string
