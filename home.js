angular.module('vis.home', [
    'ui.router'
])

    .config(function config($stateProvider) {
        $stateProvider.state('home', {
            url: '/home',
            views: {
                "main": {
                    controller: 'HomeCtrl',
                    templateUrl: 'home.tpl.html'
                }
            },
            data: {pageTitle: 'Home'}
        });
    })

    .controller('HomeCtrl',
    function HomeCtrl($scope) {

    });