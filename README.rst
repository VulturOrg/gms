.. _Google Console: https://console.developers.google.com/flows/enableapi?apiid=maps_backend%2Cgeocoding_backend%2Cdirections_backend%2Cdistance_matrix_backend%2Celevation_backend%2Cplaces_backend&keyType=CLIENT_SIDE&reusekey=true&hl=es

__ `Google Console`_

###################
Google Maps Snippet
###################

Put maps in your forms and get/show the coordinates from a place. This snippet
supports UTM and Geographic coordinates.

Depends
=======

* Google Maps JavaScript API

.. code:: html

    <script
      src="https://maps.googleapis.com/maps/api/js?key=<API Key>&libraries=places">
        </script>

Click here__ to get an **API Key** from Google.

* Proj4JS

.. code:: html

    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.14/proj4.js">
        </script>

Usage
=====

.. code:: html

    <script
      src="https://maps.googleapis.com/maps/api/js?key=<API Key>&libraries=places">
        </script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.3.14/proj4.js">
        </script>
    <script src="gms.js"></script>
    <link rel="stylesheet" href="gms.css" />

    <div id="map"></div>

    <strong>Lat:</strong>
    <input type="text" id="lat" />

    <strong>Lng:</strong>
    <input type="text" id="lng" />

    <br /><br />

    <strong>Zone:</strong>
    <input type="text" id="zone" />

    <strong>Hemisphere:</strong>
    <input type="radio" name="hemisphere" id="hemisphere" value="N" /> North
    <input type="radio" name="hemisphere" value="S" /> South

    <br />

    <strong>Easting:</strong>
    <textarea id="easting"></textarea>

    <strong>Northing:</strong>
    <span id="northing"></span>

    <script>
        new Map({
            target: "#map",  // CSS Selector

            // Size settings

            height: "20em",
            width: "100%",

            // Bypassing options to the Google Maps API
            // https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapOptions

            bypass: {
                minzoom: 4,
                draggable: false
            },

            // Default settings

            zoom: 5,
            center: {lat: 6.42375, lng: -66.58973000000003},

            // A current place will add a marker by default and overide the
            // center

            current: {lat: 6.42375, lng: -66.58973000000003},

                // or a list of places, the first location will be the center

            current: [
                {lat: 6.42375, lng: -66.58973000000003},
                {lat: 7.42375, lng: -66.58973000000003},
                {lat: 6.42375, lng: -67.58973000000003},
                {lat: 7.42375, lng: -67.58973000000003}
            ],

            // Search Box

            searchbox: true,

                // or use an object for get a custom searchbox

            searchbox: {
                placeholder: "Type a place..",
                value: "Venezuela"
            },

            // Fields, must be a CSS Selector or a HTML object. For *radios*,
            // the attribute ``name`` is mandatory

            fields: {
                lat: "#lat",
                lng: "#lng",
                zone: "#zone",
                hemisphere: "#hemisphere",
                easting: "#easting",
                northing: "#northing"
            },

            // It's possible use a custom callable when a marker is clicked,
            // it receives an object with the coords of the marker as argument

            callable: function (location) {
                alert("I know where you are! Muajaja!");
            },

            // Defining a readonly map

            readonly: true
        }).init();
    </script>

Samples
=======

1. `Simple map <https://vulturorg.github.io/gms/#simple>`_
2. `Fields <https://vulturorg.github.io/gms/#fields>`_
3. `Searchbox <https://vulturorg.github.io/gms/#searchbox>`_
4. `Default place <https://vulturorg.github.io/gms/#default>`_
5. `Complex Map <https://vulturorg.github.io/gms/#complex>`_
6. `Read Only <https://vulturorg.github.io/gms/#readonly>`_

References
==========

*Google Maps JavaScript API.* https://developers.google.com/maps/documentation/javascript/