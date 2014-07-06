'use strict';

angular.module('ngVisJsApp')
  .controller(
  'TimelineCtrl',
  [
    '$rootScope', '$scope', '$location',
    function ($rootScope, $scope, $location)
    {

      $rootScope.pageIndex = 1;

      $scope.loadData = function (type)
      {
        switch (type)
        {
          case 'grouped':
            $scope.data = {
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
            $scope.data = [
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




      $scope.getExample = function (index)
      {
        var data,
            options = {
              defaults: true
            };

        var now = vis.moment().minutes(0).seconds(0).milliseconds(0);

        switch (index)
        {
          case 1:
            data = [
              {id: 1, content: 'item 1', start: '2014-06-20'},
              {id: 2, content: 'item 2', start: '2014-06-14'},
              {id: 3, content: 'item 3', start: '2014-06-18'},
              {id: 4, content: 'item 4', start: '2014-06-16', end: '2014-06-19'},
              {id: 5, content: 'item 5', start: '2014-06-25'},
              {id: 6, content: 'item 6', start: '2014-06-27', type: 'point'}
            ];
            break;

          case 2:
            break;

          case 3:
            break;


          case 4:
            var item1 = document.createElement('div');
            item1.appendChild(document.createTextNode('item 1'));

            var item2 = document.createElement('div');
            item2.innerHTML = '<span>item 2</span>';

            var item3 = document.createElement('div');
            var span3 = document.createElement('span');
            span3.className = 'large';
            span3.appendChild(document.createTextNode('item 3'));
            item3.appendChild(span3);

            var item4 = 'item <span class="large">4</span>';

            var item5 = document.createElement('div');
            item5.appendChild(document.createTextNode('item 5'));
            item5.appendChild(document.createElement('br'));
            var img5 = document.createElement('img');
            img5.src = 'img/attachment-icon.png';
            img5.style.width = '48px';
            img5.style.height = '48px';
            item5.appendChild(img5);

            var item6 = 'item6<br><img src="img/comments-icon.png" style="width: 48px; height: 48px;">';

            var item7 = 'item7<br><a href="http://visjs.org" target="_blank">click here</a>';

            data = [
              {id: 1, content: item1, start: '2013-06-20'},
              {id: 2, content: item2, start: '2013-06-14'},
              {id: 3, content: item3, start: '2013-06-18'},
              {id: 4, content: item4, start: '2013-06-16', end: '2013-06-19'},
              {id: 5, content: item5, start: '2013-06-25'},
              {id: 6, content: item6, start: '2013-06-27'},
              {id: 7, content: item7, start: '2013-06-21'}
            ];
            break;

          case 5:
            options = {
              groupOrder: 'content'  // groupOrder can be a property name or a sorting function
            };

            data = {
              John: [
                {id: 1, content: 'item 1', start: '2014-06-18'},
                {id: 2, content: 'item 2', start: '2014-06-18'}
              ],
              Alston: [
                {id: 3, content: 'item 3', start: '2014-06-16'},
                {id: 4, content: 'item 4', start: '2014-06-14', end: '2014-06-17'}
              ],
              Lee: [
                {id: 5, content: 'item 5', start: '2014-06-23'},
                {id: 6, content: 'item 6', start: '2014-06-25'}
              ]
            };
            break;
        }

        return {
          options: options,
          data: data
        }
      };

      $scope.setExample = function (index)
      {
        $scope.exampleIndex = index;

        var values = $scope.getExample(index);

        $location.hash(index);

        $scope.options = values.options;
        $scope.data = values.data;
      };

      $scope.setExample(angular.isDefined($location.hash()) ? $location.hash() : 1);




      // $scope.loadData('simple');

      var debug = false;




      $scope.simplifyItems = function (items)
      {
        var simplified = [];

        angular.forEach(
          items,
          function (group, label)
          {
            angular.forEach(
              group,
              function (item)
              {
                item.group = label;

                simplified.push(item);
              }
            );
          }
        );

        return simplified;
      };


      /**
       * Timeline stuff
       */
      $scope.timeline = {

        select: function (selected)
        {
          if (debug)
          {
            console.log('selected items: ', selected.items);
          }

          var items = $scope.simplifyItems($scope.items);

          var format = 'YYYY-MM-DDTHH:mm';

          angular.forEach(
            items,
            function (item)
            {
              if (item.id == selected.items[0])
              {
                $scope.slot = {
                  id: item.id,
                  start: moment(item.start).format(format),
                  end: (item.end) ? moment(item.end).format(format) : null,
                  content: item.content
                };

                $scope.$apply();
              }
            }
          );
        },

        range: {},

        rangeChange: function (period)
        {
          this.range = $scope.timeline.getWindow();

          if (! $scope.$$phase)
          {
            $scope.$apply();
          }

          if (debug)
          {
            console.log('rangeChange: start-> ', period.start, ' end-> ', period.end);
          }
        },

        rangeChanged: function (period)
        {
          if (debug)
          {
            console.log('rangeChange(d): start-> ', period.start, ' end-> ', period.end);
          }
        },

        customTime: null,

        timeChange: function (period)
        {
          if (debug)
          {
            console.log('timeChange: ', period.time);
          }

          $scope.$apply(
            function ()
            {
              $scope.timeline.customTime = period.time;
            }
          );
        },

        timeChanged: function (period)
        {
          if (debug)
          {
            console.log('timeChange(d): ', period.time);
          }
        },

        slot: {
          add: function (item, callback)
          {
            item.content = prompt('Enter text content for new item:', item.content);

            if (item.content != null)
            {
              callback(item); // send back adjusted new item
            }
            else
            {
              callback(null); // cancel item creation
            }
          },

          move: function (item, callback)
          {
            if (confirm(
                'Do you really want to move the item to\n' +
                'start: ' + item.start + '\n' +
                'end: ' + item.end + '?'))
            {
              callback(item); // send back item as confirmation (can be changed
            }
            else
            {
              callback(null); // cancel editing item
            }
          },

          update: function (item, callback)
          {
            item.content = prompt('Edit items text:', item.content);

            if (item.content != null)
            {
              callback(item); // send back adjusted item
            }
            else
            {
              callback(null); // cancel updating the item
            }
          },

          remove: function (item, callback)
          {
            if (confirm('Remove item ' + item.content + '?'))
            {
              callback(item); // confirm deletion
            }
            else
            {
              callback(null); // cancel deletion
            }
          }
        }
      };

      //    $scope.getCustomTime = function () {
      //      $scope.gotCustomDate = $scope.timeline.getCustomTime();
      //    };
      //
      //    $scope.getSelection = function () {
      //      $scope.gotSelection = $scope.timeline.getSelection();
      //    };
      //
      //    $scope.setSelection = function (selection) {
      //      selection = (angular.isArray(selection)) ? selection : [].concat(selection);
      //
      //      $scope.timeline.setSelection(selection);
      //    };
      //
      //    $scope.getWindow = function () {
      //      $scope.gotWindow = $scope.timeline.getWindow();
      //    };
      //
      //    $scope.setWindow = function (start, end) {
      //      $scope.timeline.setScope('custom');
      //
      //      $scope.timeline.setWindow(start, end);
      //    };

      //    $scope.setOptions = function (options) {
      //      $scope.timeline.setOptions(options);
      //    };

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