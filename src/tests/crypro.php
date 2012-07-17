<?php
/**
 * src/tests/crypto.php
 *
 * Developed by Tingkun <tingkun@playcrab.com>
 * Copyright (c) 2012 Playcrab Corp.
 *
 * Changelog:
 * 2012-06-26 - created
 *
 */

    $key = 'xx';
    $plain_text = 'very important';

	if($argv[1]){
		$key = $argv[1];
		$plain_text = $argv[2];
	}



	$PWS='plss';
	$iv_size = mcrypt_get_iv_size('des','ecb');
	$iv = "\0\0\0\0\0\0\0\0";

	//echo $iv_size," ".strlen($iv);return;

	$ct = mcrypt_encrypt('des',$key,$plain_text,'ecb');
	echo strlen($ct)." len \n";
	for($i = 0 ; $i < strlen($ct) ; ++$i){
		echo ord($ct[$i])."\n";
	}

	//print_r($argv);return;
	//echo $ct;return;
	echo base64_encode($ct)." enc\n";
	$dct =  mcrypt_decrypt('des',$key,$ct,'ecb');
	echo $dct."\n$plain_text\n";


	$ct = mcrypt_encrypt('des',$key,$plain_text,'ecb');

	//print_r($argv);return;
	//echo $ct;return;
	echo base64_encode($ct)." enc\n";
	$dct =  mcrypt_decrypt('des',$key,$ct,'ecb');
	echo $dct."\n$plain_text\n";

