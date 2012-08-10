#!/bin/sh

#
# tools/jsdoc.sh
#
# Developed by Tingkun <tingkun@playcrab.com>
# Copyright (c) 2012 Playcrab Corp.
# Licensed under terms of GNU General Public License.
# All rights reserved.
#
# Changelog:
# 2012-07-19 - created
#

#!/bin/sh
DIR=`dirname $0`
JSDOC_HOME=$DIR/../vendor/jsdoc-toolkit/

java -jar "$JSDOC_HOME/jsrun.jar" "$JSDOC_HOME/app/run.js" \
	-t="$JSDOC_HOME/templates/jsdoc" \
	-r=10 \
	-v \
	-D="copyright:2012-2015 Tingkun" \
	-d="$DIR/../jsdocs" \
	"$DIR/../src/"
