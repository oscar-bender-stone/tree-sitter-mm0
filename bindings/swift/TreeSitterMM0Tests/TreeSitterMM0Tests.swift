import XCTest
import SwiftTreeSitter
import TreeSitterMm0

final class TreeSitterMm0Tests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_mm0())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading MM0/MM1 grammar")
    }
}
