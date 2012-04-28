<?php
/**
 * src/tests/gencid.php
 *
 * Developed by Tingkun <tingkun@playcrab.com>
 * Copyright (c) 2012 Platon Group, http://platon.sk/
 * All rights reserved.
 *
 * Changelog:
 * 2012-04-19 - created
 *
 */
require '/home/hotel/mywork/plframework/autoload.php';
$uid = 5;
if($argv[2]){
	$uid = $argv[1];
	echo PL_Tool_IdGen::genCid($uid);
}else{
	$ret =  PL_Tool_IdGen::parseCid($argv[1]);
	if($ret)
		echo $ret['u'];
	else
		echo 'error';
	
}
