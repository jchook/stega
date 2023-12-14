#!/bin/bash

# Clean-up temp dir on exit
trap "rm -rf tmp" EXIT INT TERM HUP QUIT ABRT

# Command to run stega
stega="tsx ./src/index.ts"

# Test runner function
# Blow up on errors
set -e

# Create temp dir & image
rm -rf tmp
mkdir tmp
$stega genpng 2048 2048 > tmp/large.png

# Test help
test_help() {
  $stega -h | grep -q "Usage:"
}

test_embed() {
  $stega embed x/small.png < x/small.txt > tmp/embedded.png
  [ -s tmp/embedded.png ]
  ! diff tmp/embedded.png x/small.png >/dev/null
}

test_extract() {
  $stega extract tmp/embedded.png > tmp/extracted.txt
  [ -s tmp/extracted.txt ]
  diff tmp/extracted.txt x/small.txt
}

test_tree_extract() {
  tar cz x | $stega embed tmp/large.png > tmp/embedded-tree.png
  [ -s tmp/embedded-tree.png ]
  $stega extract tmp/embedded-tree.png | tar xz -C tmp
  diff -r tmp/x x
  rm -rf tmp/x
}

test_tree_encrypted_with_symmetric_AES256() {
  tar cz x \
    | gpg --quiet --symmetric --cipher-algo AES256 --batch --passphrase 'stegapass' \
    | $stega embed tmp/large.png \
    > tmp/encrypted-tree.png
  [ -s tmp/encrypted-tree.png ]
  ! diff tmp/encrypted-tree.png tmp/large.png >/dev/null
  $stega extract tmp/encrypted-tree.png \
    | gpg --quiet --decrypt --batch --passphrase 'stegapass' \
    | tar xz -C tmp
  diff -r tmp/x x
  rm -rf tmp/x
}

# Run the tests
source ./spec/harness.sh
