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

    <div id="map"></div>

    <script src="gms.js"></script>
    <link rel="stylesheet" href="gms.css" />

    <script>
        new Map({
            target: "#map",  // CSS Selector

            // Size settings

            height: "20em",
            width: "100%",

            // Default settings

            zoom: 5,
            center: {lat: 6.42375, lng: -66.58973000000003},

            // A current place will add a marker by default and overide the center

            current: {lat: 6.42375, lng: -66.58973000000003},

            // Search Box

            searchbox: true,

                // or use an object for get a custom searchbox

            searchbox: {
                placeholder: "Type a place..",
                value: "Venezuela"
            },

            // Coords settings

            coords: ["latlng", "utm"],

                // CSS Selector for inputs

            lat: "#lat",
            lng: "#lng",
            zone: "#zone",
            hemisphere: "#hemisphere",
            easting: "#easting",
            northing: "#northing"
        }).init();
    </script>

Samples
=======

1. `Simple map <https://vulturorg.github.io/gms/#simple>`_
2. `Geographic Coords <https://vulturorg.github.io/gms/#geographic>`_
3. `UTM Coords <https://vulturorg.github.io/gms/#utm>`_
4. `Multicoords <https://vulturorg.github.io/gms/#multi>`_
5. `Searchbox <https://vulturorg.github.io/gms/#searchbox>`_
6. `Default place <https://vulturorg.github.io/gms/#default>`_
7. `AIO Map <https://vulturorg.github.io/gms/#aio>`_
8. `Read Only <https://vulturorg.github.io/gms/#readonly>`_

References
==========

*Google Maps JavaScript API.* https://developers.google.com/maps/documentation/javascript/