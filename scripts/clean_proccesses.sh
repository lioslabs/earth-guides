#!/bin/sh
dfx stop
kill -9 \$\(ps aux | grep dfx | cut -d   -f 6\)


