/* Google Maps Snippet.

:Author: A.C. Vultur
:Licence: MIT
:Version: 0.2.0
:Date: 2016-08-15
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
        for(var property in arguments[i])
            if(arguments[i].hasOwnProperty(property))
                result[property] = arguments[i][property];

    return result;
}

function getElement(value) {
    /* Get element function.

    Check if ``value`` is a string and get the HTML element from it

    :param value: a string with a CSS selector or a HTML object 
    :returns: a HTML object
    */

    return typeof value === "string" ? document.querySelector(value) : value;
}

function setValue(obj, value) {
    /* Set value function.

    Write a value in a HTML object, this function decide itself which way must
    use for write in the HTML object.

    :param obj: a HTML object
    :param value: a value for write in ``obj``
    */

    if(obj.type == "radio") {
        var fields = document.getElementsByName(obj.name);

        for(var i = 0; i < fields.length; ++i) {
            if(fields[i].value == value) {
                fields[i].checked = true;
                break;
            }
        }
    }

    else if((new String(obj).search("Input") >= 0) ||
        (new String(obj).search("Select") >= 0))
        obj.value = value;

    else
        obj.innerHTML = value;
}



// Coords functions {

function getLatLng(from) {
    /* Get geographic coords function.

    :param from: an object with coords
    :returns: an object with geographic coords
    */

    if(from.zone && from.hemisphere && from.easting && from.northing) {
        var result = utm2latlng(from.zone, from.hemisphere, from.easting, from.northing);

        return {lat: result[0], lng: result[1]};
    }

    else
        throw incompleteCoordsError(from);
}

function getUTM(from) {
    /* Get UTM coords function.

    :param from: an object with coords
    :returns: an object with UTM coords
    */

    if(from.lat && from.lng) {
        var result = latlng2utm(from.lat, from.lng);

        return {zone: result[0], hemisphere: result[1], easting: result[2], northing: result[3]};
    }

    else
        throw incompleteCoordsError(from);
}

function incompleteCoordsError(coords) {
    var msg = "The coords are incomplete, received:";

    for(var coord in coords)
        msg += " * " + coord + ": " + coords[coord];

    return msg;
}

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

// }



function Map(config) {
    /* Map constructor.

    Interface to easy-create maps with Google Maps, this constructor supports
    the following options:

    * ``target``: a string with a CSS selector or a HTML object

    :param config: an object with the configurations
    */

    // Map container {

    this.target = getElement(config.target);
    this.target.style.height = config.height || config.width || "25em";
    this.target.style.width = config.width || config.height || "100%";

    // }

    this.bypass = config.bypass || {};  // Options for Google API

    this.readonly = config.readonly || false;
    this.zoom = config.zoom || 5;
    this.current = config.current || false;
    config.center = config.current[0] || config.current || config.center;

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

    // Fields config {

    this.fields = config.fields;

    for(var field in this.fields)
        if(this.fields.hasOwnProperty(field))
            this.fields[field] = getElement(this.fields[field]);

    // }

    if(! this.readonly) {
        this.markers = [];
        this.searchbox = config.searchbox || false;
    }
}

Map.prototype.init = function () {
    /* Map init method.
    */

    var obj = this;

    obj.map = new google.maps.Map(obj.target, concatObjects({
        center: obj.center,
        zoom: obj.zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }, obj.bypass));

    // Add marker for current place {

    if(obj.current) {
        if(! obj.current.length) {
            obj.addMarker(obj.current);
            obj.showCoords(obj.current);
        }

        // For multiple current places

        else
            for(var i = 0; i < obj.current.length; ++i)
                obj.addMarker(obj.current[i]);
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

            obj.sbMarkers = [];
            obj.searchbox.addListener("places_changed", function () {
                var places = obj.searchbox.getPlaces();  // Founded places

                if(places.length == 0) {
                    return;
                }

                // Delete old markers {

                obj.sbMarkers.forEach(function (marker) {
                    marker.setMap(null);
                });
                obj.sbMarkers = [];

                // }

                var bounds = new google.maps.LatLngBounds();

                places.forEach(function (place) {

                    // Create markers

                    obj.sbMarkers.push(obj.addMarker(place.geometry.location));

                    if(place.geometry.viewport)
                        bounds.union(place.geometry.viewport);

                    else
                        bounds.extend(place.geometry.location);
                });

                obj.map.fitBounds(bounds);
            });
        }

        // }
    }
};

Map.prototype.addMarker = function (location) {
    /* Add marker method.

    :param location: an object with coords
    :returns: a marker object
    */

    var obj = this;

    if(! location.lat || ! location.lng)
        location = getLatLng(location);

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
    /* Delete marker method.
    */

    this.markers.splice(this.markers.indexOf(marker), 1);
    marker.setMap(null);
};

Map.prototype.showCoords = function (location) {
    /* Show coords method.

    Write coords of a location in the coords fields

    :param location: an object with coords
    */

    var fields = this.fields;

    if(fields.lat || fields.lng)
        if(! location.lat || ! location.lng)
            location = concatObjects(location, getLatLng(location));

    if(fields.zone || fields.hemisphere || fields.easting || fields.northing)
        if(! location.zone || ! location.hemisphere || ! location.easting || ! location.northing)
            location = concatObjects(location, getUTM(location));

    for(var field in fields)
        setValue(fields[field], location[field]);
};