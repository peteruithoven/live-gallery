var maxWidthBigImage = 0.75; // max percentage of screen width
var prevLink = '';
var numSideImages = 3;
var reloadTime = 2; //seconds
var supportsHTML5 = false;

$(function() {
  loadLatestImages();
  $(document).click(loadLatestImages);
  
	// a little html5 audio support check. 
	// used to disable big flash effect on Raspberry Pi's Midori browser
  supportsHTML5 = !!(document.createElement('audio').canPlayType);
});
function loadLatestImages() {
	$.getJSON('rss.php',function(data){
		var items = data.channel.item;
  	var firstImage = items[0];
	  var link = firstImage.link;
	  if(link != prevLink) {
		  prevLink = link;
		  
		  $("#latest").empty();
			$("#images").empty();
			
			var mediaItem = getMediaItem(firstImage,false);
			
		  var mediaSrc = mediaItem.url;
		  var firstSize = getConstrainedSize(	mediaItem.width,
		  																				mediaItem.height,
		  																				$(document).width()*maxWidthBigImage,
		  																				$(document).height());		  																			
  		$("#latest").append("<div class='image'><a target='_blank' href='" + link +"'><img src='" + mediaSrc +"' width='" + firstSize[0] + "' height='" + firstSize[1] + "'/></a></div>");
		  
		  var numImages = Math.min(items.length,numSideImages+1);
		  for (var i = 1; i < numImages; i++) {
		  	var item = items[i];
				var link = item.link;
				var mediaItem = getMediaItem(item,false);
			  var mediaSrc = mediaItem.url;
		  	var size = getConstrainedSize(	mediaItem.width,
																				mediaItem.height,
																				$(document).width()-firstSize[0],
																				firstSize[1]/numSideImages);
				$("#images").append("<div class='image'><a target='_blank' href='" + link +"'><img src='" + mediaSrc +"' width='" + size[0] + "' height='" + size[1] + "' /></a></div>");
				
				
			}
			flash();
		}
	});
	setTimeout(loadLatestImages,reloadTime*1000);
}
function flash() {
	// flash sound
	playSound();
	// flash effect
	$("#flash").append('<div></div>');
	
	setTimeout(hideFlash,100);
}
function hideFlash() {
  if(supportsHTML5) {
		$('#flash div').animate({
	    opacity: 0
	  	}, 500, function() {
	  		$('#flash').empty();
	  	});
  } else {
  	$('#flash').empty();
  }
}
function getMediaItem(imageData,fullSize) {
  var mediaItem;
	var mediaItems = imageData.group.content;
	for (var i in mediaItems) {
    var item = mediaItems[i]['@attributes'];
  	if(fullSize && item.isDefault) { 
  		mediaItem = item;
  	} else if(!fullSize && !item.isDefault) { 
  		mediaItem = item;
  	}
  }
  
  if(!mediaItem.width && !fullSize) { // sometimes the width and height isn't set
		var fullMediaItem = getMediaItem(imageData,true);
	  mediaItem.width = fullMediaItem.width;
	  mediaItem.height = fullMediaItem.height;
	}
	return mediaItem;
}
function getConstrainedSize(width,height,maxWidth,maxHeight) {
	var ratio = 0;  // Used for aspect ratio
	
	// Check if the current width is larger than the max
	//if(width > maxWidth){
		ratio = maxWidth / width;   // get ratio for scaling image
		$(this).css("width", maxWidth); // Set new width
		$(this).css("height", height * ratio);  // Scale height based on ratio
		height = height * ratio;    // Reset height to match scaled image
		width = width * ratio;    // Reset width to match scaled image
	//}
	
	// Check if current height is larger than max
	if(height > maxHeight){
		ratio = maxHeight / height; // get ratio for scaling image
		$(this).css("height", maxHeight);   // Set new height
		$(this).css("width", width * ratio);    // Scale width based on ratio
		width = width * ratio;    // Reset width to match scaled image
		height = height * ratio;    // Reset height to match scaled image
	}
	return [width,height];
}
function playSound() {
  soundHandle = document.getElementById('sound');
  soundHandle.src = 'flash.wav';
  if(soundHandle.play) { soundHandle.play() };
}