'use strict';

angular.module('ngVisJsApp')
  .controller(
  'TimelineCtrl',
  [
    '$rootScope', '$scope', '$location',
    function ($rootScope, $scope, $location)
    {
      $rootScope.pageIndex = 1;

      $scope.examples = [
        '01. Basic usage',
        '02. Interactive',
        '03. Lots of data',
        '06. HTML data',
        '05. Groups',
        '06. Event listeners',
        '07. Custom time bar',
        '08. Edit items',
        '09. Order groups',
        '10. Points',
        '11. Custom styling',
        '12. Past and future',
        '13. Lots of grouped data',
        '14. Item class names'
      ];

      $scope.setExample = function (index)
      {
      };

      $scope.setView = function (hash, example)
      {
        $scope.view = {
          introduction: false,
          examples: false
        };

        $scope.view[hash] = true;

        $location.hash(hash);

        if ($location.hash() == 'introduction')
        {
          $location.search({});
        }
        else
        {
          if (example)
          {
            id = example;
          }
          else
          {
            var id = angular.isDefined($location.search().id) ? $location.search().id : 1;
          }

          $scope.exampleIndex = id;

          $location.search({id: id});
        }
      };

      $scope.setView((($location.hash()) != '') ? $location.hash() : 'introduction');
    }
  ]
);





















angular.module('ngVisJsApp')
  .controller(
  'timeline01Ctrl',
  [
    '$scope',
    function ($scope)
    {
      $scope.options1 = {
        defaults: true
      };

      $scope.loadData = function (type)
      {
        switch (type)
        {
          case 'grouped':
            $scope.data1 = {
              team_1: [
                {id: 1, content: 'item 1', start: '2014-06-18'},
                {id: 2, content: 'item 2', start: '2014-06-18'}
              ],
              team_2: [
                {id: 3, content: 'item 3', start: '2014-06-16'},
                {id: 4, content: 'item 4', start: '2014-06-14', end: '2014-06-17'}
              ],
              team_3: [
                {id: 5, content: 'item 5', start: '2014-06-23'},
                {id: 6, content: 'item 6', start: '2014-06-25'}
              ]
            };
            break;
          case 'simple':
            $scope.data1 = [
              {id: 1, content: 'item 1', start: '2014-06-20'},
              {id: 2, content: 'item 2', start: '2014-06-20'},
              {id: 3, content: 'item 3', start: '2014-06-18'},
              {id: 4, content: 'item 4', start: '2014-06-16', end: '2014-06-19'},
              {id: 5, content: 'item 5', start: '2014-06-25'},
              {id: 6, content: 'item 6', start: '2014-06-27'}
            ];
            break;
        }
      };

      $scope.loadData('simple');
    }
  ]
);



angular.module('ngVisJsApp')
  .controller(
  'timeline02Ctrl',
  [
    '$scope',
    function ($scope)
    {
      $scope.options2 = {
        start: '2014-01-10',
        end: '2014-02-10',
        orientation: 'top',
        height: '300px',
        editable: true,
        /* alternatively, enable/disable individual actions:
         editable: {
         add: true,
         updateTime: true,
         updateGroup: true,
         remove: true
         },
         */
        showCurrentTime: true
      };

      $scope.data2 = [
        {id: 1, content: 'item 1<br>start', start: '2014-01-23'},
        {id: 2, content: 'item 2', start: '2014-01-18'},
        {id: 3, content: 'item 3', start: '2014-01-21'},
        {id: 4, content: 'item 4', start: '2014-01-19', end: '2014-01-24'},
        {id: 5, content: 'item 5', start: '2014-01-28', type: 'point'},
        {id: 6, content: 'item 6', start: '2014-01-26'}
      ];
    }
  ]
);


angular.module('ngVisJsApp')
  .factory(
  'produceSlots',
  [
    function ()
    {
      return function (desired)
      {
        var now = vis.moment().minutes(0).seconds(0).milliseconds(0);

        var count = parseInt(desired) || 100;
        var newData = [];

        for (var i = 0; i < count; i ++)
        {
          newData.push(
            {
              id: i,
              content: 'item ' + i,
              start: now + ((60 * 1000 * 60 * 24) * i)
            }
          );
        }

        return newData;
      }
    }
  ]
);


angular.module('ngVisJsApp')
  .controller(
  'timeline03Ctrl',
  [
    '$scope',
    function ($scope)
    {
      $scope.options3 = {
        editable: true,
        zoomMin: 1000 * 60 * 60 * 24,
        zoomMax: 1000 * 60 * 60 * 24 * 30 * 3
      };

      $scope.drawLotsOfDataValue = 10;

      var produceSlots = function (desired)
      {
        var now = vis.moment().minutes(0).seconds(0).milliseconds(0);

        var count = parseInt(desired) || 100;
        var newData = [];

        for (var i = 0; i < count; i ++)
        {
          newData.push(
            {
              id: i,
              content: 'item ' + i,
              start: now + ((60 * 1000 * 60 * 24) * i)
            }
          );
        }

        return newData;
      };

      $scope.data3 = produceSlots(10);

      $scope.drawLotsOfData = function ()
      {

        $scope.data3 = produceSlots($scope.drawLotsOfDataValue);
      };
    }
  ]
);