// slideshow of all images randomly

function SlideShowRandom(simple) {
	this.slideInterval = 2; //seconds
	this.timeoutTime = 10; // make sure we try loading a next random image again when it takes this long to load (seconds)
		
	this.images = new Array(); // images data
	this.slideIndex = 0;
	this.firstTimeDataLoaded = true;
	this.simple = simple; //used to disable transitions on for example Raspberry Pi's
	this.nextDelay; 
	this.enabled = true;
	this.slideshowImg;
	
	this.enable = function() {
		this.enabled = true;
		
		if(this.images.length == 0) this.loadImagesData();
		else this.loadNextImage();
 	}
	this.disable = function() {
		//console.log("slideshow.disable");
		this.enabled = false;
		$('#slideshow').empty();
		clearTimeout(this.nextDelay);
	}
	this.loadImagesData = function() {
		//console.log("random.loadImagesData");
		var self = this;
	  $.ajax({
		  url: '../index.php/rss/feed/rss_extra/random/photo',
		  dataType: 'xml',
		  timeout: self.timeoutTime*1000,
		  success: function(data) {
			  if(self.enabled) {
				
					self.images = Utils.parseRSSData(data);
					if(self.slideIndex >= self.images.length) self.slideIndex = self.images.length;
					self.loadNextImage();
					
				}
			},
			error: function(jqXHR, status, errorThrown){   //the status returned will be "timeout" 
   			//console.log("random load image data error. status: ",status);
   			switch(status) {
   				case 'timeout':
	   				self.loadImagesData(); 
   					break;
   			}
			} 
		});
	}
	this.loadNextImage = function() {
		//console.log('loadNextImage');
		
		if(this.images.length == 0) return; 
		var imageData = this.images[this.slideIndex];
		
		this.displayImage(imageData);
		
		this.slideIndex++;
		if(this.slideIndex >= this.images.length) {
			this.slideIndex = 0;
			this.loadImagesData();
		} else {		
			var self = this;
			this.nextDelay = setTimeout(function() { self.loadNextImage() },this.slideInterval*1000);
		}
	}
	this.displayImage = function(imageData) {
		var src = (this.simple)? imageData.image : imageData.big;
		var size = Utils.getConstrainedSize(	imageData.width,
																					imageData.height,
																					$(window).width(),
																					$(window).height());	
		
		var image = $("<div class='image'><a target='_blank' href='" + imageData.link +"'>"+
										"<img src='" + src +"' width='" + size[0] + "' height='" + size[1] + "'/>"+
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