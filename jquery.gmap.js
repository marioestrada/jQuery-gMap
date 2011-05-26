/**
 * jQuery gMap - Google Maps API V3
 *
 * @url		http://github.com/marioestrada/jQuery-gMap
 * @author	Cedric Kastner <cedric@nur-text.de> and Mario Estrada <me@mario.ec>
 * @version	2.1
 */
(function($)
{
	// Main plugin function
	$.fn.gMap = function(options, methods_options)
	{
		// Optional methods
		switch(options)
		{
		case 'addMarker':
			return $(this).trigger('gMap.addMarker', [methods_options.latitude, methods_options.longitude, methods_options.content, methods_options.marker, methods_options.popup]);
		case 'centerAt':
			return $(this).trigger('gMap.centerAt', [methods_options.latitude, methods_options.longitude, methods_options.zoom]);
		}
		
		// Build main options before element iteration
		opts = $.extend({}, $.fn.gMap.defaults, options);
    	
		// Iterate through each element
		return this.each(function()
		{
			// Create map and set initial options
			var $gmap = new google.maps.Map(this);
			
			// Create new object to geocode addresses
			$geocoder = new google.maps.Geocoder();
			
			// Check for address to center on
			if (opts.address)
			{ 
				// Get coordinates for given address and center the map
				$geocoder.geocode(
					{
						address: opts.address
					}, function(gresult, status)
					{
						if(gresult.length > 0)
							$gmap.setCenter(gresult[0].geometry.location);
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
								}, function(gresult, status)
								{
									if(gresult.length > 0)
										$gmap.setCenter(gresult[0].geometry.location);
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
			}	
			$gmap.setZoom(opts.zoom);
			
			// Set the preferred map type
			$gmap.setMapTypeId(google.maps.MapTypeId[opts.maptype]);
			
			// Set scrollwheel option
			map_options = { scrollwheel: opts.scrollwheel };
			// Check for map controls
			if(opts.controls === false){
				$.extend(map_options, { disableDefaultUI: true });
			}else if (opts.controls.length != 0){
				$.extend(map_options, opts.controls, { disableDefaultUI: true });
			}
			
			$gmap.setOptions(map_options);
									
			// Create new icon
			var gicon = new google.maps.Marker();
			
			// Set icon properties from global options
			marker_icon = new google.maps.MarkerImage(opts.icon.image);
			marker_icon.size = new google.maps.Size(opts.icon.iconsize[0], opts.icon.iconsize[1]);
			marker_icon.anchor = new google.maps.Point(opts.icon.iconanchor[0], opts.icon.iconanchor[1]);
			gicon.setIcon(marker_icon);
			
			if(opts.icon.shadow)
			{
				marker_shadow = new google.maps.MarkerImage(opts.icon.shadow);
				marker_shadow.size = new google.maps.Size(opts.icon.shadowsize[0], opts.icon.shadowsize[1]);
				marker_shadow.anchor = new google.maps.Point(opts.icon.shadowanchor[0], opts.icon.shadowanchor[1]);
				gicon.setShadow(marker_shadow);
			}
			
			// Bind actions
			$(this).bind('gMap.centerAt', function(e, latitude, longitude, zoom)
			{
				if(zoom)
					$gmap.setZoom(zoom);

				$gmap.panTo(new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude)));
			});
			
			var last_infowindow;
			$(this).bind('gMap.addMarker', function(e, latitude, longitude, content, marker, popup)
			{
				var glatlng = new google.maps.LatLng(parseFloat(latitude), parseFloat(longitude));
				var gmarker = new google.maps.Marker({
					icon: marker.getIcon(),
					shadow: marker.getShadow(),
					position: glatlng
				});
				
				if(content)
				{
					if(content == '_latlng')
						content = latitude + ', ' + longitude;
					
					var infowindow = new google.maps.InfoWindow({
						content: opts.html_prepend + content + opts.html_append
					});
					
					google.maps.event.addListener(gmarker, 'click', function()
					{
						last_infowindow.close();
						infowindow.open($gmap, gmarker);
						last_infowindow = infowindow;
					});

					popup && infowindow.open($gmap, gmarker);
				}
				gmarker.setMap($gmap);
			});
			
			// Loop through marker array
			var gmarker = [];
			var infowindows = [];
			for (var j = 0; j < opts.markers.length; j++)
			{
				// Get the options from current marker
				marker = opts.markers[j];
				
				gmarker[j] = new google.maps.Marker({
					icon: gicon.getIcon(),
					shadow: gicon.getShadow()
				});
				
				if (marker.icon)
				{
					// Overwrite global options
					marker_icon = new google.maps.MarkerImage(marker.icon.image);
					marker_icon.size = new google.maps.Size(marker.icon.iconsize[0], marker.icon.iconsize[1]);
					marker_icon.anchor = new google.maps.Point(marker.icon.iconanchor[0], marker.icon.iconanchor[1]);
					gmarker[j].setIcon(marker_icon);
					
					if(marker.icon.shadow)
					{
						marker_shadow = new google.maps.MarkerImage(marker.icon.shadow);
						marker_shadow.size = new google.maps.Size(marker.icon.shadowsize[0], marker.icon.shadowsize[1]);
						marker_shadow.anchor = new google.maps.Point(marker.icon.shadowanchor[0], marker.icon.shadowanchor[1]);
						gmarker[j].setShadow(marker_shadow);
					}	
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
					}, (function(j){
						return function(gresult, status)
						{
							// Create marker
							if(gresult.length > 0)
							{
								$(this).trigger('gMap.addMarker', [gresult[0].geometry.location.latitude, gresult[0].geometry.location.longitude, marker.html, gmarker[j]]);
							}
						};
					})(j)
					);
				}else{
					$(this).trigger('gMap.addMarker', [marker.latitude, marker.longitude, marker.html, gmarker[j]]);
				}
			}
		});
		
	}
		
	// Default settings
	$.fn.gMap.defaults = {
		address: '',
		latitude: 0,
		longitude: 0,
		zoom: 1,
		markers: [],
		controls: [],
		scrollwheel: true,
		maptype: 'ROADMAP',
		html_prepend: '<div class="gmap_marker">',
		html_append: '</div>',
		icon: {
			image: "http://www.google.com/mapfiles/marker.png",
			shadow: "http://www.google.com/mapfiles/shadow50.png",
			iconsize: [20, 34],
			shadowsize: [37, 34],
			iconanchor: [9, 34],
			shadowanchor: [6, 34]
		}
	}
	
})(jQuery);