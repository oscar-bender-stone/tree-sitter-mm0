package tree_sitter_mm0_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_mm0 "github.com/tree-sitter/tree-sitter-mm0/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_mm0.Language())
	if language == nil {
		t.Errorf("Error loading MM0/MM1 grammar")
	}
}
