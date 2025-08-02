// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterMm0",
    products: [
        .library(name: "TreeSitterMm0", targets: ["TreeSitterMm0"]),
    ],
    dependencies: [
        .package(name: "SwiftTreeSitter", url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.9.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterMm0",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterMm0Tests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterMm0",
            ],
            path: "bindings/swift/TreeSitterMm0Tests"
        )
    ],
    cLanguageStandard: .c11
)
