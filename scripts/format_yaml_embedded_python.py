#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

import black
from ruamel.yaml import YAML
from ruamel.yaml.comments import CommentedMap, CommentedSeq
from ruamel.yaml.scalarstring import DoubleQuotedScalarString, FoldedScalarString, LiteralScalarString, SingleQuotedScalarString


ROOT = Path("assets/workflows")
YAML_RT = YAML()
YAML_RT.preserve_quotes = True
YAML_RT.indent(mapping=2, sequence=4, offset=2)
YAML_RT.width = 4096
EXPR_PATHS = {
    ("units", "*", "config", "value"),
    ("units", "*", "config", "statement"),
    ("units", "*", "config", "input", "*", "endpoint_options", "params", "query"),
    ("units", "*", "config", "input", "*", "endpoint_options", "params", "projection"),
    ("units", "*", "unitConfigs", "*", "config", "attributes", "input", "*", "endpoint_options", "params", "query"),
    ("units", "*", "unitConfigs", "*", "config", "attributes", "input", "*", "endpoint_options", "params", "projection"),
}


def format_expr(text: str) -> str:
    return black.format_str(text, mode=black.Mode()).rstrip()


def coerce_like(original: str, formatted: str):
    if "\n" in formatted:
        return FoldedScalarString(formatted)
    if isinstance(original, FoldedScalarString):
        return FoldedScalarString(formatted)
    if isinstance(original, LiteralScalarString):
        return LiteralScalarString(formatted)
    if isinstance(original, DoubleQuotedScalarString):
        return SingleQuotedScalarString(formatted)
    if isinstance(original, SingleQuotedScalarString):
        return SingleQuotedScalarString(formatted)
    return formatted


def matches(path: tuple[object, ...]) -> bool:
    for pattern in EXPR_PATHS:
        if len(path) != len(pattern):
            continue
        if all(part == "*" or part == token for part, token in zip(pattern, path)):
            return True
    return False


def visit(node, path: tuple[object, ...] = ()) -> bool:
    changed = False
    if isinstance(node, CommentedMap):
        for key, value in node.items():
            next_path = path + (key,)
            if matches(next_path) and isinstance(value, str):
                formatted = format_expr(str(value))
                rendered = coerce_like(value, formatted)
                if formatted != str(value) or type(rendered) is not type(value):
                    node[key] = rendered
                    changed = True
            changed |= visit(value, next_path)
    elif isinstance(node, CommentedSeq):
        for index, item in enumerate(node):
            changed |= visit(item, path + (index,))
    return changed


def main() -> int:
    changed = []
    for path in sorted(ROOT.rglob("*.yml")):
        data = YAML_RT.load(path)
        if not visit(data):
            continue
        with path.open("w", encoding="utf-8") as handle:
            YAML_RT.dump(data, handle)
        changed.append(str(path))
    if changed:
        print(*changed, sep="\n")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
