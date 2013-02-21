function LiveGallery(simple, newImagesCallback) {
	this.maxWidthBigImage = 0.75; // max percentage of screen width
	this.numSideImages = 3;
	this.reloadTime = 5; //seconds
	this.timeoutTime = 10; // make sure we try reloading again when it takes this long to load (seconds)
	
	this.prevLink = '';
	this.simple = simple; //used to disable big flash effect on for example Raspberry Pi's
	this.newImagesCallback = newImagesCallback; 
	this.reloadDelay;
	
	this.init = function() {
		this.loadLatestImages();
		
		var self = this;
	  $(document).click(function() { self.loadLatestImages });
	}
	this.loadLatestImages = function() {
		var self = this;
		$.ajax({
		  url: '../index.php/rss/feed/rss_extra/latest',
		  dataType: 'xml',
		  timeout: self.timeoutTime*1000,
		  success: function(data){
		  
		  	var items = Utils.parseRSSData(data);
		  	var firstImage = items[0];
			  var link = firstImage.link;
			  if(link != self.prevLink) {
				  self.prevLink = link;
				  //console.log("new images");
				  self.newImagesCallback();
				  
				  $("#latest").empty();
					$("#images").empty();
					
					//var mediaItem = self.getMediaItem(firstImage,true);
					
				  var firstSize = Utils.getConstrainedSize(	firstImage.width,
				  																					firstImage.height,
				  																					$(window).width()*self.maxWidthBigImage,
				  																					$((window)).height());		  																			
		  		$("#latest").append("<div class='image'><a target='_blank' href='" + link +"'>"+
		  													"<img src='" + firstImage.big +"' width='" + firstSize[0] + "' height='" + firstSize[1] + "'/>"+
		  												"</a></div>");
				  
				  var numImages = Math.min(items.length,self.numSideImages+1);
				  for (var i = 1; i < numImages; i++) {
				  	var item = items[i];
				  	var size = Utils.getConstrainedSize(	item.width,
																									item.height,
																									$(window).width()-firstSize[0],
																									firstSize[1]/self.numSideImages);
						$("#images").append("<div class='image'><a target='_blank' href='" + item.link +"'>"+
																	"<img src='" + item.image +"' width='" + size[0] + "' height='" + size[1] + "' />"+
																"</a></div>");
					}
					/*self.flash();*/
				}
				self.reloadDelay = setTimeout(function() { self.loadLatestImages() },self.reloadTime*1000);
			},
			error: function(jqXHR, status, errorThrown){   //the status returned will be "timeout" 
   			//if(console) console.log("livegallery reload error. Status: ",status,' errorThrown: ',errorThrown);
   			switch(status) {
   				case 'timeout':
	   				self.loadLatestImages(); 
   					break;
   			} 			
			} 
		});
	}
	this.flash = function() {
		// flash sound
		if(!simple) this.playSound();
		// flash effect
		$("#flash").append('<div></div>');
		
		var self =  this;
		setTimeout(self.hideFlash,100);
	}
	this.hideFlash = function() {
		if(this.simple) {
	  	$('#flash').empty();	  
	  } else {
			$('#flash div').animate({
		    opacity: 0
		  	}, 500, function() {
		  		$('#flash').empty();
		  	}
		  );
	  }
	}
	this.playSound = function() {
	  soundHandle = document.getElementById('sound');
	  soundHandle.src = 'flash.wav';
	  if(soundHandle.play) { soundHandle.play() };
	}
}