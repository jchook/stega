#!/bin/bash

# Temp dir
rm -rf tmp
mkdir tmp
trap "rm -rf tmp" EXIT INT TERM HUP QUIT ABRT

# Command to run stega
stega="tsx ./src/index.ts"

# Test runner function
# Blow up on errors
set -e

# Test help
test_help() {
  $stega -h | grep -q "Usage:"
}

# Embed
test_embed() {
  $stega embed x/small.png < x/small.txt > tmp/embedded.png
  [ -s tmp/embedded.png ]
}

# Extract
test_extract() {
  $stega extract tmp/embedded.png > tmp/extracted.txt
  [ -s tmp/extracted.txt ]
  diff tmp/extracted.txt x/small.txt
}

# Run the tests
source ./spec/harness.sh
