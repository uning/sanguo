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
 usage: $0 <rolef|allrestart> {start|stop|restart|log} 
     allrestart --重启所有运行的node 
 
HELP
  exit 0
}

#更新代码，重启node
restart_all(){
	git pull   
	ps aux | grep node 
	for pidfile in $(ls $myabdir/pids/)
	do
		rolef=$myabdir/roleconf/$(basename $pidfile .pid).js
		echo restart $rolef
		$myabdir/ctrl.sh $rolef restart
	done
	ps aux | grep node 
}
if [ "$1" == 'allrestart' ] ; then
	    restart_all
		exit ; 
fi


rolef=$1
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
			nohup  node $DEBUG $mydir/index.js  $rolef >$logf &
			#nohup  supervisor -n exit -w $mydir/src -- $mydir/index.js -p $pidf  >$logf &
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
			rm -f $pidf
		fi

}


case "$2" in
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
	dstart)
		DEBUG='--debug-brk'
		stop
		killall node-inspector 2>/dev/null
		start
		sleep 2
		echo Waiting server to start
		nohup node-inspector &

		;;
	dstop)
		stop
		killall node-inspector

		;;
	log)
		shift
		shift 
		tail $logf $*
		;;
	*)
		usage
		exit 1
		;;
esac


#NODE_ENV=$env nohup  node $mydir/server.js  > t.log &
#NODE_ENV=$env   node  $mydir/server.js  
