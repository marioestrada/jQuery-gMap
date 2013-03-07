# What is gMap?

gMap is a lightweight [jQuery](http://www.jquery.com) plugin that helps you embed Google Maps into your website. With less than 2 KB in size (minified and gzipped) it is very flexible and highly customizable.

## What's different from the original?

This fork of the original gMap plugin works with the [Google Maps API V3](http://code.google.com/apis/maps/documentation/javascript/) which is faster and has better support for mobile devices as well as traditional browsers. This version of the API also has the benefit that it doesn't require an API key, so no more generating keys for development and production.

This version also adds additional methods (See below) for manipulating the generated maps.

## Example

This tiny line of code is being used to embed the map below. Simple, isn't it?

```javascript
$("#map").gMap();
```

## Different Usage

You need to use the Maps API V3 Javascript from Google, you can set the `sensor` parameter to `true` or `false` to detect the user's location, **there's no need to generate an API key**:

```html
<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
<script type="text/javascript" src="http://code.jquery.com/jquery-1.6.1.min.js"></script>
<script type="text/javascript" src="jquery.gmap.min.js"></script>
```

This version uses the same documentation as the [original version](http://gmap.nurtext.de/documentation.html) with the following differences:

The `maptype` has to be set as an **string** and can be set to any of these values: `'HYBRID'`, `'TERRAIN'`, `'SATELLITE'` or `'ROADMAP'`.

Added the `shadowanchor` setting to position the shadow properly.

This version no longer uses the `infowindowanchor` setting.

The `control` setting now can be set to `false` for no control or as an Javascript object containing each individual control as a property.

The `useCustomStyle` setting turns on or off the use of custom styling information. 

The `styleList` setting takes a JSON encoded array which can be very easily obtained using Google's [Styled Map Wizard](http://gmaps-samples-v3.googlecode.com/svn/trunk/styledmaps/wizard/index.html)

A whole set of options can be set as follows:

```javascript
var options = {
	controls: {
           panControl: true,
           zoomControl: true,
           mapTypeControl: true,
           scaleControl: true,
           streetViewControl: true,
           overviewMapControl: true
       },
	scrollwheel: false,
    useCustomStyle: true,
	styleList: [
		{
			"featureType": "landscape.natural.landcover",
			"elementType": "geometry.fill",
			"stylers": [
				{
					"color": "#808080"
				}
			]
		},
		{
			"featureType": "water",
			"stylers": [
				{
					"color": "#383880"
				}
			]
		}
	],
	maptype: 'TERRAIN',
	markers: [
		{
			latitude: -2.2014,
			longitude: -80.9763,
		},
        {
			address: "Guayaquil, Ecuador",
			html: "My Hometown",
			icon: {
				image: "images/gmap_pin_grey.png",
				iconsize: [26, 46],
				iconanchor: [12,46]
			}
		}
	],
	icon: {
		image: "http://www.google.com/mapfiles/marker.png",
		shadow: "http://www.google.com/mapfiles/shadow50.png",
		iconsize: [20, 34],
		shadowsize: [37, 34],
		iconanchor: [9, 34],
		shadowanchor: [19, 34]
	},
	latitude: -2.282,
	longitude: -80.272,
	zoom: 10
}
```

## Aditional Methods

This methods should be called on elements with initialized maps.

* `centerAt`, usage:

```javascript
$('#map').gMap('centerAt', { latitude: 0, longitude: 0, zoom: 10 });
```
* `addMarker`, usage:

```javascript
$('#map').gMap('addMarker', { latitude: 0, longitude: 0, content: 'Some HTML content' });
```

## Original License

gMap is licensed under [Creative Commons BY-SA 3.0](http://creativecommons.org/licenses/by-sa/3.0/) license. In short: You're allowed to copy, distribute, transmit and to adapt – as long as you attribute the work. If you alter, modify or build upon this sourcecode, you may distribute the resulting work only under the same, similar or compatible license.

## Authors

This plugin was originally developed by [Cedric Kastner](http://gmap.nurtext.de/).

Refactoring to use the Google Maps API V3 was done by [Mario Estrada](http://mario.ec).
