#!/bin/bash

# Test context
source ./spec/context.sh

# Test help
test_help() {
  $stega -h | grep -q "Usage:"
}

# Embed
test_embed() {
  $stega embed x/small.txt x/small.png tmp/embedded.png
  [ -s tmp/embedded.png ]
}

# Run the tests
source ./spec/harness.sh
