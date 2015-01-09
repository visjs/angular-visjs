angular.module('App', [
    'ui.router',
    'vis.home',
    'vis.graph2d',
    'vis.timeline'
//    'ui.bootstrap'
])
    .run(function run() {
    })

    .config(function myAppConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');
    })

    .controller('AppCtrl', function AppCtrl($scope) {
        $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (angular.isDefined(toState.data.pageTitle)) {
                $scope.pageTitle = 'Angular VisJS | ' + toState.data.pageTitle;
            }
        });
    })

;

