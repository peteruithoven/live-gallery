var slideInterval = 3; //seconds
var timeoutTime = 10; // make sure we try loading a next random image again when it takes this long to load (seconds)
		
var imagesData; //rss images data
var slideIndex = 0;
var nextDelay; 

//$(function() {
	loadImagesData();
//});
function loadImagesData() {

	$.ajax({
	  url: '../index.php/rss/feed/rss_extra/latest',
	  dataType: 'xml',
	  timeout: timeoutTime*1000,
	  success: function(data){
	  	imagesData = Utils.parseRSSData(data);
			loadNextImage();
		}
	});
}
function loadNextImage() {
	var imageData = imagesData[slideIndex];
	
	displayImage(imageData);

	slideIndex++;
	if(slideIndex >= imagesData.length) slideIndex = 0;
	
	nextDelay = setTimeout(function() { loadNextImage() },slideInterval*1000);
}
function displayImage(imageData) {
	var size = Utils.getFilledSize(	imageData.width,
																	imageData.height,
																	$(window).width(),
																	$(window).height());
	var image = $("<a target='_blank' href='" + imageData.link +"'>"+
									"<img src='" + imageData.image +"' width='" + size[0] + "' height='" + size[1] + "'/>"+
								"</a>");
	image.css('top',	($(window).height()-size[1])/2);
	image.css('left',	($(window).width()-size[0])/2);
	
	// when the new image is loaded we add the new and slowly hide the old
	$(image).find('img').load(function() {
		$("#slideshow a").animate({
	    opacity: 0
	  	}, 1000, function() {
	  		$(this).remove();
	  	}
	  );
		$("#slideshow").prepend(image);
	});
}
