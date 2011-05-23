/**
 * jQuery gMap
 *
 * @url		http://gmap.nurtext.de/
 * @author	Cedric Kastner <cedric@nur-text.de>
 * @version	1.1.0
 */
(function($)
{
	$.gMap = {};
	
	// Main plugin function
	$.fn.gMap = function(options)
	{
		// Build main options before element iteration
		var opts = $.extend({}, $.fn.gMap.defaults, options);
    	
		// Iterate through each element
		return this.each(function()
		{
			// Create map and set initial options
			$gmap = new google.maps.Map(this);
			
			// Create new object to geocode addresses
			$geocoder = new google.maps.Geocoder();
			
			// Check for address to center on
			if (opts.address)
			{ 
				// Get coordinates for given address and center the map
				$geocoder.geocode(
					{
						address: opts.address
					}, function(gresult)
					{
						$gmap.setCenter(gresult.geometry.location);
					}
				);
			}else{
				// Check for coordinates to center on
				if (opts.latitude && opts.longitude)
				{
					// Center map to coordinates given by option
					$gmap.setCenter(new google.maps.LatLng(opts.latitude, opts.longitude));
				}
				else
				{
					// Check for a marker to center on (if no coordinates given)
					if ($.isArray(opts.markers) && opts.markers.length > 0)
					{
						// Check if the marker has an address
						if (opts.markers[0].address)
						{
							// Get the coordinates for given marker address and center
							$geocoder.geocode(
								{
									address: opts.markers[0].address
								}, function(gresult)
								{
									$gmap.setCenter(gresult.geometry.location);
								}
							);
						}else{
							// Center the map to coordinates given by marker
							$gmap.setCenter(new google.maps.LatLng(opts.markers[0].latitude, opts.markers[0].longitude));
						}
						
						
					}else{
						// Revert back to world view
						$gmap.setCenter(new google.maps.LatLng(34.885931, 9.84375));
					}
				}
				$gmap.setZoom(opts.zoom);
			}
						
			// Set the preferred map type
			$gmap.setMapTypeId(google.maps.MapTypeId[opts.maptype]);
			
			// Check for map controls
			if (opts.controls.length != 0)
			{
				// Add custom map controls
				for (var i = 0; i < opts.controls.length; i++)
				{
					// Eval is evil
					eval('$gmap.addControl(new ' + opts.controls[i] + '());');
				}
			}
						
			// Check if scrollwheel should be enabled
			$gmap.setOptions({ scrollwheel: opts.scrollwheel });
									
			// Create new icon
			gicon = new google.maps.Marker();
			
			// Set icon properties from global options
			marker_icon = new google.maps.MarkerImage(opts.icon.image);
			marker_icon.size = new google.maps.Size(opts.icon.iconsize[0], opts.icon.iconsize[1]);
			marker_icon.anchor = new google.maps.Point(opts.icon.iconanchor[0], opts.icon.iconanchor[1]);
			gicon.setIcon(marker_icon);
			
			marker_shadow = new google.maps.MarkerImage(opts.icon.shadow);
			marker_shadow.size = new google.maps.Size(opts.icon.shadowsize[0], opts.icon.shadowsize[1]);
			gicon.setShadow(marker_shadow);
			$.gMap.gIcon = gicon;
			
			infowindows = [];
			// Loop through marker array
			for (var j = 0; j < opts.markers.length; j++)
			{
				// Get the options from current marker
				marker = opts.markers[j];
				
				if (marker.icon)
				{
					// Overwrite global options
					marker_icon = new google.maps.MarkerImage(marker.icon.image);
					marker_icon.size = new google.maps.Size(marker.icon.iconsize[0], marker.icon.iconsize[1]);
					marker_icon.anchor = new google.maps.Point(marker.icon.iconanchor[0], marker.icon.iconanchor[1]);
					
					marker_shadow = new google.maps.MarkerImage(marker.icon.shadow);
					marker_shadow.size = new google.maps.Size(marker.icon.shadowsize[0], marker.icon.shadowsize[1]);
					
					gicon.setIcon(marker_icon);
					gicon.setShow(marker_shadow);
				}
				
				// Check if address is available
				if (marker.address)
				{
					// Check for reference to the marker's address
					if (marker.html == '_address')
						marker.html = marker.address;
					
					// Get the point for given address
					$geocoder.geocode({
						address: marker.address
					}, function(gicon, marker)
					{
						// Since we're in a loop, we need a closure when dealing with event handlers, return functions, etc.
						// See <http://www.mennovanslooten.nl/blog/post/62> for more information about closures
						return function(gresult)
						{
							// Create marker
							gmarker = new google.maps.Marker(gresult.geometry.location, gicon);
							
							// Set HTML and check if info window should be opened
							if (marker.html)
								gmarker.bindInfoWindowHtml(opts.html_prepend + marker.html + opts.html_append);
							if (marker.html && marker.popup)
								gmarker.openInfoWindowHtml(opts.html_prepend + marker.html + opts.html_append);
							
							// Add marker to map
							if (gmarker)
								gmarker.setMap($gmap);
						}
						
					}(gicon, marker));
				}else{
					// Check for reference to the marker's latitude/longitude
					if (marker.html == '_latlng') { marker.html = marker.latitude + ', ' + marker.longitude; }
					
					// Create marker
					gmarker = new GMarker(new GPoint(marker.longitude, marker.latitude), gicon);
					
					// Set HTML and check if info window should be opened
					if (marker.html)
						gmarker.bindInfoWindowHtml(opts.html_prepend + marker.html + opts.html_append);
					if (marker.html && marker.popup)
						gmarker.openInfoWindowHtml(opts.html_prepend + marker.html + opts.html_append);
						
					// Add marker to map
					if(gmarker)
						gmarper.setMap($gmap);
				}
				
				if(marker.html)
				{
					infowindows[j] = new google.maps.InfoWindow({
						content: opts.html_prepend + marker.html + opts.html_append
					});
					google.maps.event.addListener(gmarker, 'click', function()
					{
						infowindows[j].open($gmap, gmarker);
					});
				}
				if(marker.html && marker.popup)
				{
					infowindows[j].open($gmap, gmarker);
				}
			}
			
			$.gMap.gMap = $gmap;
		});
		
	}
		
	// Default settings
	$.fn.gMap.defaults =
	{
		address:				'',
		latitude:				0,
		longitude:				0,
		zoom:					1,
		markers:				[],
		controls:				[],
		scrollwheel:			true,
		maptype:				'ROADMAP',
		html_prepend:			'<div class="gmap_marker">',
		html_append:			'</div>',
		icon:
		{
			image:				"http://www.google.com/mapfiles/marker.png",
			shadow:				"http://www.google.com/mapfiles/shadow50.png",
			iconsize:			[20, 34],
			shadowsize:			[37, 34],
			iconanchor:			[9, 34]
		}
		
	}
	
	
	$.gMap.addMarker = function(lat, lng, content)
	{
		var gmap = $.gMap.gMap;
		var glatlng = new google.maps.LatLng(parseFloat(lat), parseFloat(lng));
		var gmarker = new google.maps.Marker(glatlng, {icon: $.gMap.gIcon, draggable: false});
		
		infowindows[j] = new google.maps.InfoWindow({
			content: gmap.opts.html_prepend + content + gmap.opts.html_append
		});
		google.maps.event.addListener(gmarker, 'click', function()
		{
			infowindows[j].open($gmap, gmarker);
		});
		gmarker.setMap(gmap);
		
		return gmarker;
	}
	
	$.gMap.centerAt = function(lat, lng, zoom)
	{
		var gmap = $.gMap.gMap;
		if(zoom)
			gmap.setZoom(zoom);
		
		gmap.panTo(new google.maps.LatLng(parseFloat(lat), parseFloat(lng)));
		
		return gmap;
	}
	
})(jQuery);