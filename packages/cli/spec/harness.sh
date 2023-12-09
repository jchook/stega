#!/bin/bash

x() {
  local test_fn=$1
  local test_desc=$(echo "$test_fn" | sed 's/test_//' | sed 's/_/ /g')

  echo -n "+ $test_desc "
  if "$test_fn"; then
    echo "✓"
  else
    echo "✗"
    exit 1
  fi
}

# Run all the tests
for fn in $(declare -F | awk '/declare -f test_/ {print $NF}'); do
  x "$fn"
done
