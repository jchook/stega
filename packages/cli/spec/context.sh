#!/bin/bash

# Temp dir
rm -rf tmp
mkdir tmp
trap "rm -rf tmp" EXIT INT TERM HUP QUIT ABRT

# Command to run stega
stega="tsx ./src/run.ts"

# Test runner function
# Blow up on errors and echo commands
set -ex

