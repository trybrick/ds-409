var storeApp = angular
  .module('storeApp', ['infinite-scroll', 'ngRoute', 'ngSanitize', 'ngAnimate', 'ngTouch', 'chieffancypants.loadingBar', 'gsn.core', 'ui.map', 'ui.keypress', 'ui.event', 'ui.utils', 'angulartics'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    // disable theme
    gsn.config.SiteTheme = '409';
    gsn.config.defaultMobileListView = true;

    gsn.applyConfig(gsn.config, false);
    $locationProvider.html5Mode(true).hashPrefix('!');
    $locationProvider.rewriteLinks = false;

  }]);

angular.element(document).ready(function() {
  globalConfig.data.FacebookDisable = true;
  angular.bootstrap(document, ['storeApp']);
  angular.element("a").not('[target]').prop('target', '_self');
});
