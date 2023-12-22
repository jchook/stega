#!/bin/sh

for package in core cli; do
  echo "Running $@ in $package"
  cd packages/$package
  "$@"
  cd -
done

