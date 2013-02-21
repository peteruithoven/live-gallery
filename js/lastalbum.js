var SLIDESHOW_TYPE_RANDOM = 'nextrandom';
var SLIDESHOW_TYPE_LAST_ALBUM = 'lastalbum';

function SlideShowLastAlbum(simple) {
	this.slideInterval = 2; //seconds
	this.reloadImagesDataInterval = 60; // seconds 
	this.timeoutTime = 10; // make sure we try loading again when it takes this long to load (seconds)
		
	this.images; //json images data
	this.slideIndex = 0;
	this.firstTimeDataLoaded = true;
	this.simple = simple; //used to disable transitions on for example Raspberry Pi's
	this.nextDelay; 
	this.reloadDelay; 
	this.enabled = true;

	this.enable = function() {
		//console.log("slideshow.enable");
		this.enabled = true;
		this.loadImagesData();
		this.loadNextImage();
	}
	this.disable = function() {
		//console.log("slideshow.disable");
		this.enabled = false;
		$('#slideshow').empty();
		//clearInterval(this.interval);
		clearTimeout(this.nextDelay);
		clearTimeout(this.reloadDelay);
	}
	this.loadImagesData = function() {
		//console.log("slideshow.loadImagesData");
		var self = this;
		$.ajax({
		  url: 'lastalbum.php',
		  dataType: 'json',
		  timeout: this.timeoutTime*1000,
		  success: function(data){
		  	self.images = data;
				if(self.slideIndex >= self.images.length) self.slideIndex = self.images.length;
				//console.log('self.firstTimeDataLoaded: ',self.firstTimeDataLoaded);
				
				self.reloadDelay = setTimeout(function() { self.loadImagesData() },self.reloadImagesDataInterval*1000);
			},
			error: function(jqXHR, status, errorThrown){   //the status returned will be "timeout" 
	 			//console.log("lastalbum reload error. Status: ",status,' errorThrown: ',errorThrown);
	 			switch(status) {
	 				case 'timeout':
		 				self.loadImagesData(); 
	 					break;
	 			} 			
			}
		});
	}
	this.loadNextImage = function() {
		if(this.images){ 
			var imageData = this.images[this.slideIndex];
			this.displayImage(imageData);
			this.slideIndex++;
			if(this.slideIndex >= this.images.length) this.slideIndex = 0;
		}
		var self = this;
		this.nextDelay = setTimeout(function() { self.loadNextImage() },this.slideInterval*1000);
	}
	this.displayImage = function(imageData) {
		var size = Utils.getConstrainedSize(	imageData.width,
																					imageData.height,
																					$(window).width(),
																					$(window).height());	

		var image = $("<div class='image'><a target='_blank' href='" + imageData.url +"'>"+
										"<img src='" + imageData.src +"' width='" + size[0] + "' height='" + size[1] + "'/>"+
									"</a></div>");
		
		// when the new image is loaded we add the new and slowly hide the old
		var self = this;
		$(image).find('img').load(function() {
			if(self.simple) {
				$('#slideshow').empty();
			} else {
				$("#slideshow div").animate({
			    opacity: 0
			  	}, 1000, function() {
			  		$(this).remove();
			  	}
			  );
			}
			$("#slideshow").prepend(image);
		});
	}
}