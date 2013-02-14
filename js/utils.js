var Utils = {
	// get the size that will fit into the minWidth and minHeight
	getConstrainedSize: function(width,height,maxWidth,maxHeight) {
		var ratio = maxWidth / width;   // get ratio for scaling image
		height = height * ratio;    // Reset height to match scaled image
		width = width * ratio;    // Reset width to match scaled image
		
		// Check if current height is larger than max
		if(height > maxHeight){
			ratio = maxHeight / height; // get ratio for scaling image
			width = width * ratio;    // Reset width to match scaled image
			height = height * ratio;    // Reset height to match scaled image
		}
		return [width,height];
	},
	// get the size that will fill up the minWidth and minHeight
	getFilledSize: function(width,height,minWidth,minHeight) {
		var ratio = minWidth / width;   // get ratio for scaling image
		height = height * ratio;    // Reset height to match scaled image
		width = width * ratio;    // Reset width to match scaled image
		
		// Check if current height is larger than max
		if(height < minHeight){
			ratio = minHeight / height; // get ratio for scaling image
			width = width * ratio;    // Reset width to match scaled image
			height = height * ratio;    // Reset height to match scaled image
		}
		return [width,height];
	},
	
	getUrlVars: function () {
	  var vars = [], hash;
	  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	  for(var i = 0; i < hashes.length; i++)
	  {
	      hash = hashes[i].split('=');
	      vars.push(hash[0]);
	      vars[hash[0]] = hash[1];
	  }
	  return vars;
	},
	
	parseRSSData: function(rssData) {
		rssData = $(rssData);
		var images = [];
    $(rssData).find('item').each(function(){
			images.push({
				image: $(this).children('media\\:group').children('media\\:content').first().attr('url'),
				thumb: $(this).children('media\\:thumbnail').attr('url'),
				big: $(this).children('media\\:group').children('media\\:content').last().attr('url'),
				width: $(this).children('media\\:group').children('media\\:content').last().attr('width'),
				height: $(this).children('media\\:group').children('media\\:content').last().attr('height'),
				title: $(this).children('title').text(),
				description: $(this).children('description').text(),
				link: $(this).children('link').text()
			});
    });
    return images;
	}	
}