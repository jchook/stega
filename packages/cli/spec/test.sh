#!/bin/bash
#
# Unit tests for the Stega CLI
# Run this script from the root of the CLI package.
#
# Requires: bash, tsx, gpg, tar, diff
# Optional: openssl (for faster AES256 encryption)
#
# This script expects set -e and will exit on the first failure.
# To debug a failing test, add set -x somewhere inside the test function.
# To run a single test, pass part of the test description as the first argument.
#

# Base directory
basedir=$(pwd)
if [ ! -f "$basedir/src/index.ts" ]; then
  echo "Run this script from the root of the CLI package"
  exit 1
fi

# Command to run the CLI
stega="tsx $basedir/src/index.ts"

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


# ---


test_help() {
  $stega -h | grep -q "Usage:"
}

test_embed_extract() {
  mkdir -p output
  $stega embed small.png < small.txt > output/a.png
  [ -s output/a.png ]
  ! diff output/a.png small.png >/dev/null
  $stega extract output/a.png > output/a.txt
  [ -s output/a.txt ]
  diff output/a.txt small.txt
  rm -rf output
}

test_embed_extract_hello_world() {
  mkdir -p output
  OUT="$(echo "Hello, World" | $stega embed small.png | $stega extract | cat)"
  [ "$OUT" = "Hello, World" ]
}

test_embed_extract_with_seed() {
  mkdir -p output
  $stega embed --seed 123 small.png < small.txt > output/a.png
  $stega embed --seed 234 small.png < small.txt > output/b.png
  [ -s output/a.png ] && [ -s output/b.png ]
  ! diff output/a.png output/b.png >/dev/null
  $stega extract --seed 123 output/a.png > output/a.txt
  $stega extract --seed 234 output/b.png > output/b.txt
  [ -s output/a.txt ] && [ -s output/b.txt ]
  rm -rf output
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

test_tree_extract() {
  tar cz tree | $stega embed large.png > embedded-tree.png
  [ -s embedded-tree.png ]
  mkdir -p output
  $stega extract embedded-tree.png | tar xz -C output
  diff -r tree output/tree
  rm -rf output embedded-tree.png
}

test_split_embed_extract() {
  mkdir -p output
  split -b 32k large.png chunk.
  for chunk in chunk.*; do
    $stega genpng 512 512 > temp.png
    $stega embed temp.png < "$chunk" > "output/$chunk.png"
  done
  $stega extract output/*.png > decoded.png
  diff large.png decoded.png
  rm -rf output chunk.* decoded.png temp.png
}


# ---

# Colorful output
if [ -t 1 ]; then IS_TTY=1; else IS_TTY=; fi
ttput() {
  if [ "$IS_TTY" = 1 ]; then
    tput "$@" 2>/dev/null
  fi
}
NONE="$(ttput sgr0)"
GREEN="$(ttput setaf 2)"
GRAY="$(ttput setaf 8)"

# Run the tests
# Note, this expects set -e and will exit on the first failure
for test_fn in $(declare -F | awk '/declare -f test_/ {print $NF}'); do
  test_desc=$(echo "$test_fn" | sed 's/test_//' | sed 's/_/ /g')
  if [ -n "$1" ] && grep -qviE "$1" <<< "$test_desc"; then
    continue
  fi
  printf "%s" "${GRAY}+${NONE} $test_desc"
  $test_fn
  printf "\r%s\n" "${GREEN}✓${NONE}"
done

# Clean-up
cd "$basedir"
rm -rf tmp
