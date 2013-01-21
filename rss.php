<?php
header('Content-type: application/xml');

$url = currentURL();
$url = explode('/',$url);
$url = array_slice($url,0,count($url)-2);
$url = implode('/',$url);
$url .= '/index.php/rss/feed/gallery/latest'; // gallery3 feed of latest images

$fileContents = file_get_contents($url);
$json = xml2json($fileContents);
echo $json;

function xml2json($xml) {
	$xml = str_replace(array("\n", "\r", "\t"), '', $xml);
	$xml = str_replace(array("media:"), '', $xml); // remove namespace simplexml can't handle
	$xml = trim(str_replace('"', "'", $xml));
	$simpleXml = simplexml_load_string($xml);
	$json = json_encode($simpleXml);
	return $json;
}

function currentURL() {
	$pageURL = 'http';
	if ($_SERVER["HTTPS"] == "on") { $pageURL .= "s"; }
	$pageURL .= "://";
	if ($_SERVER["SERVER_PORT"] != "80") {
		$pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
	} else {
		$pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
	}
	return $pageURL;
}

?>
