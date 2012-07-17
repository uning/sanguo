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
$m = $argv[2];
if(method_exists(PL_Tool_IdGen,$m))
	echo PL_Tool_IdGen::$m($argv[1]);
else
	echo 'error';

