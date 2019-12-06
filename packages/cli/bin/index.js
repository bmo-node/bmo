#!/bin/sh
":" //# comment; exec /usr/bin/env node -r esm "$0" "$@"
require('./cli')
// DO NOT LINT THIS FILE! THE SHEBANG WILL BREAK!