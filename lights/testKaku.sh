#!/bin/bash
if [ $# -eq 0 ]
  then
  echo "Usage: testKaku A P 1 16"
  echo "First two parameters can be any between A and P"
  echo "Second two parameters can be any between 1 and 16"
else
  for x in $(eval echo {$1..$2})
  do
    for y in $(eval echo {$3..$4})
    do
      echo "$x $y on"
      ./kaku.o $x $y on
    done
  done
fi
