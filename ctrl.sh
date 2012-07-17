#!/bin/bash 

#
#
# Developed by Tingkun <tingkun@playcrab.com>
# Copyright (c) 2012 Playcrab Corp.
# Licensed under terms of GNU General Public License.
# All rights reserved.
#
# Changelog:
# 2012-01-11 - created
#

mydir=$(dirname $0)
myabdir=$(cd $mydir && pwd)





usage(){
cat <<HELP
 ctrl prog of sanguo
 usage: $0 {start|stop|restart} <rolef> 
HELP
  exit 0
}

rolef=$2
if [ ! -f  "$rolef" ] ; then
	echo "rolef '$rolef'  not exists. exit"
	usage
fi

basename $rolef .js
pidf=$myabdir/pids/$(basename $rolef .js).pid
logf=$myabdir/logs/$(basename $rolef .js).log
echo rolef   =  $rolef
echo pidf    =  $pidf



start(){
		if [  -f $pidf ] ; then  
			pid=$(cat $pidf)
			echo "$rolef is running  $pid process"
		else
			echo "Start $rolef ..."
			#nohup  supervisor -n exit -w $mydir/src -- $mydir/index.js -p $pidf  >$logf &
			nohup node $mydir/index.js  $rolef >$logf &
			sleep 1
			tail $logf
		fi
}


stop(){
		if [ ! -f $pidf ] ; then  
			echo pidfile not exists
		else
			pid=$(cat $pidf)
			echo "Stop chat  $pid process"
			kill  $pid
			sleep 0.1
			tail $logf
		fi

}

case "$1" in
	start)
	    start
	    ;;
	stop)
	    stop
		;;
	restart)
		stop
		start
		;;
	log)
		tail $logf
		;;
	*)
		usage
		exit 1
		;;
esac


#NODE_ENV=$env nohup  node $mydir/server.js  > t.log &
#NODE_ENV=$env   node  $mydir/server.js  
