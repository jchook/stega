#!/bin/sh

for package in core cli web; do
  echo "Running $@ in $package"
  cd packages/$package
  pnpm "$@"
  cd -
done
