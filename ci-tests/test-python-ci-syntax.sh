#!/bin/sh
set -eu
# ast.parse validates syntax without writing __pycache__ (py_compile always does).
python -c "import ast,sys;ast.parse(open(sys.argv[1],encoding='utf-8').read(),sys.argv[1])" ci-tests/test-browser-release-smoke.py
echo "PYTHON CI SYNTAX: PASS"
