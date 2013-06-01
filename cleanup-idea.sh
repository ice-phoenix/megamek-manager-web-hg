#/!bin/bash

FILES=`hg st -a | cut -d " " -f 2 | grep ".*2\.xml"`

for F in $FILES; do
  if [ -f ${F/%2.xml/.xml} ]; then
    echo "Deleting: $F"
    hg forget $F
    rm $F
  else
    echo "Keeping: $F"
  fi
done
