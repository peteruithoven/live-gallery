<?php
header('Content-type: application/json');

//////////// find base url ////////////
$baseURL = currentURL();
$baseURL = explode('/',$baseURL);
$baseURL = array_slice($baseURL,0,count($baseURL)-2);
$baseURL = implode('/',$baseURL);
$baseURL .= '/index.php/rest/'; // gallery3 rest interface

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

//////////// Create a stream, set gallery3 rest headers ////////////
$opts = array(
  'http'=>array(
    'method'=>"GET",
    'header'=>"X-Gallery-Request-Method: get\r\n" .
              "X-Gallery-Request-Key: 11705d62eab88b97d26280ebceccd064"
  )
);
$context = stream_context_create($opts);

switch($_GET["q"]) {
	case 'lastalbum': 
		
		//////////// retrieve albums ////////////
		$url = $baseURL."item/1?type=album";
		$albumsData = file_get_contents($url, false, $context);
		$albumsData = json_decode($albumsData,false);
		$albums = $albumsData->members;
		natsort($albums);
		$latestAlbum = $albums[0];
		//$latestAlbum = "http://fablabamersfoort.nl/fotos/index.php/rest/item/370";
		
		//////////// retrieve latest album ////////////
		$url = $latestAlbum;
		$url .= "?type=photo";
		$latestAlbumData = file_get_contents($url, false, $context);
		$latestAlbumData = json_decode($latestAlbumData,false);
		$albumImages = $latestAlbumData->members;
		
		//////////// retrieve images data ////////////
		$url = $baseURL."items";
		$url .= "?urls=".str_replace('\/','/',json_encode($albumImages));
		$imagesData = file_get_contents($url, false, $context);
		$imagesData = json_decode($imagesData,false);
		
		//////////// filter data ////////////
		$filteredImagesData = array();
		foreach ($imagesData as $imageData) {
			$filteredImageData = new Image();
			//echo "\nentity: ".print_r($imageData->entity,true);
			$filteredImageData->width = $imageData->entity->width;
			$filteredImageData->height = $imageData->entity->height;
			$filteredImageData->url = $imageData->entity->web_url;
			$filteredImageData->src = $imageData->entity->resize_url_public;
			$filteredImagesData[] = $filteredImageData;
		}
		
		//////////// output data ////////////
		echo str_replace('\/','/',json_encode($filteredImagesData));

		break;
	case 'nextrandom': 
	
		//////////// retrieve random image ////////////
		$url = $baseURL."item/1?scope=all&random=true&type=photo";
		$albumsData = file_get_contents($url, false, $context);
		$albumsData = json_decode($albumsData,false);
		if(count($albumsData->members) == 0) return;
		$randomPhoto = $albumsData->members[0];

		//////////// retrieve random image data ////////////
		$imageData = file_get_contents($randomPhoto, false, $context);
		$imageData = json_decode($imageData,false);
		//print_r($imageData);
		
		$filteredImageData = new Image();
		//echo "\nentity: ".print_r($imageData->entity,true);
		$filteredImageData->width = $imageData->entity->width;
		$filteredImageData->height = $imageData->entity->height;
		$filteredImageData->url = $imageData->entity->web_url;
		$filteredImageData->src = $imageData->entity->resize_url_public;
		$filteredImageData->debug = $imageData->entity;
		
		//////////// output data ////////////
		echo str_replace('\/','/',json_encode($filteredImageData));
		
		break;
}

class Image {
	public $width = "";
	public $height  = "";
	public $url = "";
	public $src = "";
}


?>