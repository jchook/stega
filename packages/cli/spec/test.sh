#!/bin/bash

# Clean-up temp dir on exit
trap "rm -rf tmp" EXIT INT TERM HUP QUIT ABRT

# Command to run stega
basedir=$(pwd)
stega="tsx $basedir/src/index.ts"

# Test runner function
# Blow up on errors
set -e

# Create temp dir & test data
rm -rf tmp
mkdir -p tmp tmp/tree
cd tmp
$stega genpng 2048 2048 > large.png
$stega genpng 512 512 > small.png
echo "Hello, world!" > small.txt
cp small.png small.txt tree


# Test help
test_help() {
  $stega -h | grep -q "Usage:"
}

test_embed_extract() {
  $stega embed small.png < small.txt > embedded.png
  [ -s embedded.png ]
  ! diff embedded.png small.png >/dev/null
  $stega extract embedded.png > extracted.txt
  [ -s extracted.txt ]
  diff extracted.txt small.txt
  rm extracted.txt embedded.png
}

test_tree_extract() {
  tar cz tree | $stega embed large.png > embedded-tree.png
  [ -s embedded-tree.png ]
  mkdir -p output
  $stega extract embedded-tree.png | tar xz -C output
  diff -r tree output/tree
  rm -rf output embedded-tree.png
}

test_tree_encrypted_with_symmetric_AES256() {
  tar cz tree \
    | gpg --quiet --symmetric --cipher-algo AES256 --batch --passphrase 'stegapass' \
    | $stega embed large.png \
    > encrypted-tree.png
  [ -s encrypted-tree.png ]
  ! diff encrypted-tree.png large.png >/dev/null
  mkdir -p output
  $stega extract encrypted-tree.png \
    | gpg --quiet --decrypt --batch --passphrase 'stegapass' \
    | tar xz -C output
  diff -r tree output/tree
  rm -rf output encrypted-tree.png
}

# Run the tests
source ../spec/harness.sh

# Clean-up
cd "$basedir"
rm -rf tmp
