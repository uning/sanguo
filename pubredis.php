<?php
/**
 * pubredis.php
 *
 * Developed by Tingkun <tingkun@playcrab.com>
 * Copyright (c) 2012 Playcrab Corp.
 *
 * Changelog:
 * 2012-10-13 - created
 *
 */

$con = new  Redis();
$con->pconnect($host,$port);
$con->publish('fromphp','hello from php');
