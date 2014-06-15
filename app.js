;(function (window, document, google) {

    'use strict';

    var nextTick, getGeoloc, resultGeoloc, geolocation, zoom, map, latitude, longitude, mapGOOG, searchBetween;

    nextTick = window.requestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               function (callback) {
                   window.setTimeout(callback, 1000 / 60);
               };

    getGeoloc = document.querySelector('#getGeoloc');
    resultGeoloc = document.querySelector('#resultGeoloc');

    geolocation = navigator.geolocation || 
                  false;

    zoom = 14;

    map = document.querySelector('#map');
    mapGOOG = false;

    searchBetween = document.querySelector('#searchBetween');

    function App() {
        if (!geolocation) {
            console.log('Unsupport browser');
            return;
        }

        nextTick(function() {
            this.init();
        }.bind(this));
    }

    App.prototype.init = function() {
        this.initialized = true;

        this.addEvents();
    };

    App.prototype.geolocError = function() {
        console.log('Can\'t provide');
    };

    App.prototype.searchZone = function() {
        var bounds = mapGOOG.getBounds();

        searchBetween.innerHTML = 'Search between: ' + bounds.getNorthEast().k + ' / ' + bounds.getNorthEast().A + ' and ' + bounds.getSouthWest().k + ' / ' + bounds.getSouthWest().A;
    };

    App.prototype.constructMap = function() {
        var mapOptions = {
          center: new google.maps.LatLng(latitude, longitude),
          zoom: parseInt(zoom, 10)
        };

        mapGOOG = new google.maps.Map(map, mapOptions);
        google.maps.event.addListener(mapGOOG, 'bounds_changed', function() {
            this.searchZone();
        }.bind(this));
        google.maps.event.addListener(mapGOOG, 'zoom_changed', function() {
            zoom = mapGOOG.getZoom();
            this.searchZone();
        }.bind(this));
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(latitude, longitude),
            map: mapGOOG,
            title: "I am here"
        });
        marker.setMap(mapGOOG);
    };

    App.prototype.geolocSuccess = function(position) {
        latitude  = position.coords.latitude;
        longitude = position.coords.longitude;

        resultGeoloc.innerHTML = 'Lat: ' + latitude + '\nLong: ' + longitude;

        if (!mapGOOG) {
            this.constructMap();
            return;
        }
    };

    App.prototype.addEvents = function() {
        getGeoloc.addEventListener('click', function(e) {
            geolocation.getCurrentPosition(function(position) { this.geolocSuccess(position); }.bind(this), function() { this.geolocError(); }.bind(this));
        }.bind(this));
    };

    /* global module, exports: true, define */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        // CommonJS, just export
        module.exports = exports = App;
    } else if (typeof define === 'function' && define.amd) {
        // AMD support
        define(function () { return App; });
    } else if (typeof window === 'object') {
        // If no AMD and we are in the browser, attach to window
        window.App = App;
    }
    /* global -module, -exports, -define */

}(window, document, google));
