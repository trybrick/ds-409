(function(angular, undefined) {
  'use strict';

  var myDirectiveName = 'ctrlStoreLocator';

  angular.module('gsn.core')
    .controller(myDirectiveName, ['$scope', 'gsnApi', '$notification', '$timeout', '$rootScope', '$location', 'gsnStore', 'debounce', myController])
    .directive(myDirectiveName, myDirective);

  function myDirective() {
    var directive = {
      restrict: 'EA',
      scope: true,
      controller: myDirectiveName
    };

    return directive;
  }

  function myController($scope, gsnApi, $notification, $timeout, $rootScope, $location, gsnStore, debounce) {
    $scope.activate = activate;

    var defaultZoom = $scope.defaultZoom || 10;
    var storeGroup = $scope.storeGroup || '';

    $scope.fromUrl = $location.search().fromUrl;
    $scope.geoLocationCache = {};
    $scope.myMarkers = [];
    $scope.currentMarker = null;
    $scope.showIntermission = 0;
    $scope.distanceOrigin = null;
    $scope.storeList = [];
    $scope.currentStoreId = gsnApi.getSelectedStoreId();
    $scope.searchCompleted = false;
    $scope.searchRadius = 10;
    $scope.searchIcon = null; // https://sites.google.com/site/gmapsdevelopment/
    $scope.searchMarker = null;
    $scope.searchFailed = false;
    $scope.searchFailedResultCount = 1;
    $scope.pharmacyOnly = false;
    $scope.activated = false;
    $scope.storeByNumber = {};
    $scope.vmsl = {
      myMarkerGrouping: [],
      activated: false
    };

    gsnStore.getStores().then(function(rsp) {
      var storeList = rsp.response;
      var storeNumber = $scope.storeNumber || $scope.currentPath.replace(/\D*/, '');
      var storeUrl = '';
      if ($scope.currentPath.indexOf('/store/') >= 0) {
        storeUrl = $scope.currentPath.replace('/store/', '').replace(/[^a-z-]*/g, '');
      }

      $scope.storeByNumber = gsnApi.mapObject(storeList, "StoreNumber");
      var store = $scope.storeByNumber[storeNumber];

      if (storeUrl.length > 0) {
        $scope.storeByUrl = gsnApi.mapObject(storeList, 'StoreUrl');
        store = $scope.storeByUrl[storeUrl];
      }

      // filter out storelist
      var storeGroups = gsnApi.groupBy(storeList, 'SortBy');
      if (storeGroups[storeGroup]) {
        storeList = storeGroups[storeGroup].items;
      }

      if (store) {
        $scope.storeList = [store];
      } else if (storeNumber.length > 0 || storeUrl.length > 0) {
        // store not found when either storeNumber or storeUrl is valid
        gsnApi.goUrl('/404')
      } else {
        $scope.storeList = storeList;
      }
      if ($scope.storeList.length <= 1 && $scope.singleStoreRedirect) {
        gsnApi.goUrl($scope.singleStoreRedirect + '/' + $scope.storeList[0].StoreNumber)
      }

      $scope.showAllStores();
    });

    gsnStore.getStore().then(function(store) {
      var show = gsnApi.isNull($location.search().show, '');
      if (show == 'event') {
        if (store) {
          $location.url($scope.decodeServerUrl(store.Redirect));
        }
      }
    });

    function activate() {

      var gmap = (window.google || {}).maps || {};
      if ((typeof (gmap.Geocoder) === 'undefined')
        || (typeof (gmap.InfoWindow) === 'undefined')
        || (typeof (gmap.Map) === 'undefined')) {
        $timeout(activate, 1000);
        if ($scope.gvm.googleMapLoaded) return;

        $scope.gvm.googleMapLoaded = true;
        var myCallback = 'dynamic' + new Date().getTime();
        window[myCallback] = activate;

        // dynamically load google
        var src = '//maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry';
        var googleMapApiKey = gsnApi.getThemeConfigDescription('google-map-api-key');
        if (googleMapApiKey) {
          src += '&key=' + googleMapApiKey;
        }
        src += '&callback=' + myCallback;
        gsnApi.loadScripts(src, activate);
        return;
      }

      if (!$scope.vmsl.activated) {
        $scope.vmsl.activated = true;
        $scope.mapOptions = {
          center: new google.maps.LatLng(0, 0),
          zoom: defaultZoom,
          circle: null,
          panControl: false,
          zoomControl: true,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.LEFT_CENTER
          },
          scaleControl: true,
          navigationControl: false,
          streetViewControl: false,
          //styles: myStyles,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
      }

      // set default search with query string
      var search = $location.search;
      $scope.search.storeLocator = search.search || search.q;
      $scope.doSearch(true);
    }

    $scope.openMarkerInfo = function(marker, zoom) {
      $scope.currentMarker = marker;

      if (zoom) {
        $scope.myMap.setZoom(zoom);
      }

      $scope.myInfoWindow.open($scope.myMap, marker);
    };

    $scope.isCurrentStore = function(marker) {
      if (!marker) return false;

      return gsnApi.isNull($scope.currentStoreId, 0) == marker.location.StoreId;
    };

    $scope.setSearchResult = function(center) {
      $scope.searchCompleted = true;
      $scope.distanceOrigin = gsnApi.isNull(center, null);
      $scope.mapOptions.center = center;
      $timeout(function() {
        $scope.showAllStores(center);

        if ($scope.searchIcon) {
          if (center) {
            $scope.searchMarker = new google.maps.Marker({
              map: $scope.myMap,
              position: center,
              point: center.toUrlValue(),
              location: null,
              icon: $scope.searchIcon
            });

            google.maps.event.addListener($scope.searchMarker, 'click', function() {
              $scope.openMarkerInfo($scope.searchMarker);
            });
          }
        }

        $scope.fitAllMarkers();
      }, 50);
    };

    $scope.initializeMarker = function(stores) {
      $scope.currentMarker = null;

      // clear old marker
      if ($scope.myMarkers) {
        angular.forEach($scope.myMarkers, function(marker) {
          marker.setMap(null);
        });
      }

      if ($scope.searchMarker) {
        $scope.searchMarker.setMap(null);
        $scope.searchMarker = null;
      }

      var data = stores || [];
      var tempMarkers = [];
      var endIndex = data.length;

      // here we test with setting a limit on number of stores to show
      // if (endIndex > 10) endIndex = 10;

      for (var i = 0; i < endIndex; i++) {
        if ($scope.canShow(data[i])) {
          tempMarkers.push($scope.createMarker(data[i]));
        }
      }
      if (i == 1) {
        $scope.currentMarker = tempMarkers[i];
      }

      if (gsn.isNull($scope.myMap, null) !== null && $scope.myMarkers.length > 0) {
        $scope.fitAllMarkers();
      }

      $scope.myMarkers = tempMarkers;
      $scope.vmsl.myMarkerGrouping = gsnApi.groupBy($scope.myMarkers, 'SortBy');
    };

    // find the best zoom to fit all markers
    $scope.fitAllMarkers = debounce(function() {
      if (gsnApi.isNull($scope.myMap, null) === null) {
        return;
      }

      if ($scope.myMarkers.length == 1) {
        $scope.mapOptions.center = $scope.myMarkers[0].getPosition();
        $scope.mapOptions.zoom = $scope.defaultZoom || 10;
        $scope.myMap.setZoom($scope.mapOptions.zoom);
        $scope.myMap.setCenter($scope.mapOptions.center);
        return;
      }

      // make sure this is on the UI thread
      var markers = $scope.myMarkers;
      var bounds = new google.maps.LatLngBounds();
      for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
      }

      if ($scope.searchMarker) {
        bounds.extend($scope.searchMarker.getPosition());
      }

      $scope.myMap.fitBounds(bounds);
    }, 200);

    $scope.showAllStores = function(distanceOrigin) {
      if (!$scope.mapOptions) {
        $timeout(function() {
          $scope.showAllStores(distanceOrigin);
        }, 500);
        return;
      }

      $scope.distanceOrigin = gsnApi.isNull(distanceOrigin, null);
      $scope.mapOptions.zoom = defaultZoom;
      var result = $scope.storeList;
      var result2 = [];
      if (gsn.isNull($scope.distanceOrigin, null) !== null) {
        result = [];
        var searchRadius = parseFloat($scope.searchRadius);
        if (isNaN(searchRadius))
          searchRadius = 10;

        // calculate distance from center
        angular.forEach($scope.storeList, function(store) {
          var storeLatLng = new google.maps.LatLng(store.Latitude, store.Longitude);
          store.Distance = google.maps.geometry.spherical.computeDistanceBetween(distanceOrigin, storeLatLng) * 0.000621371192;
          store.zDistance = parseFloat(gsnApi.isNull(store.Distance, 0)).toFixed(2);
          result2.push(store);
          if (store.Distance <= searchRadius) {
            result.push(store);
          }
        });

        gsnApi.sortOn(result2, "Distance");
        $scope.searchFailed = (result.length <= 0 && result2.length > 0);
        if ($scope.searchFailed) {
          for (var i = 0; i < $scope.searchFailedResultCount; i++) {
            result.push(result2[i]);
          }
        } else {
          gsnApi.sortOn(result, "Distance");
        }
      }

      $scope.initializeMarker(result);
      $scope.fitAllMarkers();
    };

    $scope.canShow = function(store) {
      return !$scope.pharmacyOnly || ($scope.pharmacyOnly && gsnApi.isNull(store.PharmacyHours, '').length > 0);
    };

    $scope.doClear = function() {
      $scope.search.storeLocator = '';
      $scope.searchCompleted = false;
      $scope.showAllStores();
      $scope.fitAllMarkers();
    };

    $scope.doSearch = function(isSilent) {
      $scope.searchCompleted = false;
      $scope.searchFailed = false;
      var newValue = $scope.search.storeLocator;

      if (gsnApi.isNull(newValue, '').length > 1) {
        var point = $scope.geoLocationCache[newValue];

        if (point) {
          $scope.setSearchResult(point);
        } else {

          var geocoder = new google.maps.Geocoder();
          geocoder.geocode({
            'address': newValue
          }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
              point = new google.maps.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng());
              $scope.geoLocationCache[newValue] = point;
              $scope.setSearchResult(point);
            } else {
              $notification.alert('Error searching for: ' + newValue);
            }
          });
        }
      } else if (!isSilent) {
        $notification.alert('Zip or City, State is required.');
      }
    };

    $scope.viewEvents = function(marker) {
      gsnApi.setSelectedStoreId(marker.location.StoreId);
      $location.path($scope.decodeServerUrl(marker.location.Redirect));
    };

    $scope.viewSpecials = function(marker) {
      gsnApi.setSelectedStoreId(marker.location.StoreId);
      $location.url('/circular');
    };

    $scope.selectStore = function(marker, reload) {
      $scope.gvm.reloadOnStoreSelection = reload;
      gsnApi.setSelectedStoreId(marker.location.StoreId);
      if (gsnApi.isNull($location.search().show, '') == 'event') {
        $location.url($scope.decodeServerUrl(marker.location.Redirect));
      } else if (gsnApi.isNull($location.search().fromUrl, '').length > 0) {
        $location.url($location.search().fromUrl);
      }
    };

    $scope.$on('gsnevent:store-persisted', function(evt, store) {
      if ($scope.gvm.reloadOnStoreSelection) {
        $scope.goUrl($scope.currentPath, '_reload');
      }
    });

    // wait until map has been created, then add markers
    // since map must be there and center must be set before markers show up on map
    $scope.$watch('myMap', function(newValue) {
      if (newValue) {
        if ($scope.storeList[0]) {
          newValue.setCenter(new google.maps.LatLng($scope.storeList[0].Latitude, $scope.storeList[0].Longitude), defaultZoom);
          $scope.initializeMarker($scope.storeList);

          if (gsnApi.isNull($scope.fromUrl, null) !== null && gsnApi.isNull(gsnApi.getSelectedStoreId(), 0) <= 0) {
            $scope.showIntermission++;
          }
        }
      }
    });

    $scope.$on('gsnevent:storelist-loaded', function(event, data) {
      gsnApi.reload();
    });

    $scope.$on('gsnevent:store-setid', function(event, result) {
      $scope.currentStoreId = gsnApi.getSelectedStoreId();
    });

    $scope.$watch('pharmacyOnly', function(event, result) {
      if (!$scope.activated) return;

      var newValue = $scope.search.storeLocator;
      if (gsnApi.isNull(newValue, '').length > 1) {
        $scope.doSearch(true);
      } else {
        $scope.showAllStores(null);
      }
    });

    $scope.activate();

    //#region Internal Methods

    // helper method to add marker to map
    // populate marker array and distance
    $scope.createMarker = function(location) {
      var point = new google.maps.LatLng(location.Latitude, location.Longitude);

      //location.Phone = location.Phone.replace(/\D+/gi, '');
      var marker = new google.maps.Marker({
        map: $scope.myMap,
        position: point,
        location: location
      });

      google.maps.event.addListener(marker, 'click', function() {
        $scope.openMarkerInfo(marker);
      });

      location.zDistance = parseFloat(gsnApi.isNull(location.Distance, 0)).toFixed(2);
      marker.SortBy = location.SortBy;

      return marker;
    };
  //#endregion
  }

})(angular);
