#!/bin/bash

# Test context
source ./spec/context.sh

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
