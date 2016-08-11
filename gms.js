/* Google Maps Snippet.

:Author: A.C. Vultur
:Licence: MIT
:Version: 0.1.0
:Date: 2016-08-01
*/

Array.prototype.contains = function (value) {
    /* Contains method for built-in Array.

    Check if ``value`` exists

    :param value: a value to check
    :returns: ``true`` if exists, ``false`` else
    */

    for(var i = 0; i < this.length; ++i)
        if(value === this[i])
            return true;

    return false;
};

function concatObjects() {
    /* Concat objects function.

    Concat all the objects given as arguments, require at least 2 objects

    :returns: an object with all propertys
    */

    var result = {};
    var n = arguments.length;

    if(n < 2)
        throw "concatObjects() require at least 2 objects";

    for(var i = 0; i < n; ++i)
        for(property in arguments[i])
            if(arguments[i].hasOwnProperty(property))
                result[property] = arguments[i][property];

    return result;
};

function Map(config) {
    /* Map constructor.

    :param config: an object with the configuration
    */

    // Map container and default settings {

    this.target = document.querySelector(config.target);
    this.target.style.height = config.height || config.width || "25em";
    this.target.style.width = config.width || config.height || "100%";

    this.zoom = config.zoom || 5;
    this.readonly = config.readonly || false;
    this.current = config.current || false;
    config.center = config.current || config.center;

    if(config.center) {
        if(config.center.lat)
            this.center = config.center;

        else {
            var latlng = utm2latlng(config.center.zone, config.center.hemisphere, config.center.easting, config.center.northing);

            this.center = {lat: latlng[0], lng: latlng[1]};
        }
    }

    else
        this.center = {lat: 6.42375, lng: -66.58973000000003};

    // }

    // Markers and Searchbox {

    this.markers = [];
    this.searchbox = config.searchbox || false;

    // }

    // Coordinates system {

    this.coords = config.coords || new Array("latlng");

        // Fields config {

    if(this.coords.contains("latlng")) {
        this.lat = document.querySelector(config.lat) || false;
        this.lng = document.querySelector(config.lng) || false;
    }

    if(this.coords.contains("utm")) {
        this.zone = document.querySelector(config.zone) || false;
        this.hemisphere = document.querySelector(config.hemisphere) || false;
        this.easting = document.querySelector(config.easting) || false;
        this.northing = document.querySelector(config.northing) || false;
    }

        // }
    // }
}

Map.prototype.init = function () {
    var obj = this;

    obj.map = new google.maps.Map(obj.target, {
        center: obj.center,
        zoom: obj.zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Set current place {

    if(obj.current) {
        obj.addMarker(obj.current);
        obj.showCoords(obj.current);
    }

    // }

    if(! obj.readonly) {
        google.maps.event.addListener(obj.map, "click", function (event) {
            obj.addMarker(event.latLng);
        });

        // Search box {

        if(obj.searchbox) {
            var input = document.createElement("input");
            input.type = "text";
            input.className = "searchbox controls";
            input.placeholder = obj.searchbox.placeholder || "Search..";
            input.value = obj.searchbox.value || "";

            obj.searchbox = new google.maps.places.SearchBox(input);
            obj.map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

            obj.map.addListener("bounds_changed", function () {
                obj.searchbox.setBounds(obj.map.getBounds());
            });

            // Founded places {

            obj.sbMarkers = [];
            obj.searchbox.addListener("places_changed", function () {
                var places = obj.searchbox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                // Delete old markers {

                obj.sbMarkers.forEach(function (marker) {
                    marker.setMap(null);
                });
                obj.sbMarkers = [];

                // }

                // Show places {

                var bounds = new google.maps.LatLngBounds();

                places.forEach(function (place) {

                    // Create markers {

                    obj.sbMarkers.push(obj.addMarker(place.geometry.location));

                    if (place.geometry.viewport)
                        bounds.union(place.geometry.viewport);

                    else
                        bounds.extend(place.geometry.location);

                    // }

                });

                obj.map.fitBounds(bounds);

                // }

            });

            // }

        }

        // }
    }
};

Map.prototype.addMarker = function (location) {
    var obj = this;

    // UTM to Geographics {

    if((! location.lat) || (! location.lng)) {
        if(location.zone && location.hemisphere && location.easting && location.northing) {
            var result = utm2latlng(location.zone, location.hemisphere, location.easting, location.northing);

            location.lat = result[0];
            location.lng = result[1];
        }
    }

    // }

    var marker = new google.maps.Marker({
        map: obj.map,
        position: location
    });

    obj.markers.push(marker);

    // Events for markers {

    if(! obj.readonly) {
        google.maps.event.addListener(marker, "click", function (event) {
            obj.showCoords({
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
            });
        });

        google.maps.event.addListener(marker, "dblclick", function (event) {
            obj.delMarker(marker);
        });
    }

    // }

    return marker;
};

Map.prototype.delMarker = function (marker) {
    this.markers.splice(this.markers.indexOf(marker), 1);
    marker.setMap(null);
};

Map.prototype.showCoords = function (coords) {
    if(this.coords.contains("latlng")) {
        if(coords.zone && coords.hemisphere && coords.easting && coords.northing) {
            var result = utm2latlng(coords.zone, coords.hemisphere, coords.easting, coords.northing);

            coords.lat = result[0];
            coords.lng = result[1];
        }

        this.lat.value = coords.lat;
        this.lng.value = coords.lng;
    }

    if(this.coords.contains("utm")) {
        if(coords.lat && coords.lng) {
            var result = latlng2utm(coords.lat, coords.lng);

            coords.zone = result[0];
            coords.hemisphere = result[1];
            coords.easting = result[2];
            coords.northing = result[3];
        }

        this.zone.value = coords.zone;
        this.hemisphere.value = coords.hemisphere;
        this.easting.value = coords.easting;
        this.northing.value = coords.northing;
    }
};

function latlng2utm(lat, lng) {
    var latlng = "+proj=longlat +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
    var zone = (1 + Math.floor((lng + 180) / 6));
    var hemisphere = (lat >= 0) ? "N" : "S";
    var utm = "+proj=utm +zone=" + zone + " +ellps=WGS84 +datum=WGS84 +no_defs";

    return new Array(zone, hemisphere).concat(proj4(latlng, utm, [lng, lat]));
}

function utm2latlng(zone, hemisphere, easting, northing) {
    var utm = "+proj=utm +zone=" + zone + ((hemisphere == "S") ? " +south" : "") + " +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
    var latlng = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

    return proj4(utm, latlng, [easting, northing]).reverse();
}