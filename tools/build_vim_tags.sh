#!/bin/sh

#
# tools/build_vim_tags.sh
#
# Developed by Tingkun <tingkun@playcrab.com>
# Copyright (c) 2012 Playcrab Corp.
# Licensed under terms of GNU General Public License.
# All rights reserved.
#
# Changelog:
# 2012-08-14 - created
#

DIR=`dirname $0`
cd $DIR/../vendor/estr 
node estr.js tags ./src/
cp tags ../../
