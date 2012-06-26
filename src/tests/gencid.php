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
require '/home/hotel/wuxia/sg_backend/plframework/bootstrap.php';
$uid = 5;
if($argv[2]){
	$uid = $argv[1];
	echo PL_Session::genCid($uid);
}else{
	$_REQUEST['cid'] = $argv[1];
	$ss = PL_Session::getInstance();
	$ret =  $ss->getId();
	if($ret)
		echo $ret;
	else
		echo 'error';
	
}
