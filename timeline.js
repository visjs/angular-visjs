angular.module('vis.timeline', [
    'ui.router',
    'ngVis'
])

    .config(function config($stateProvider) {
        $stateProvider.state('timeline', {
            url: '/timeline',
            views: {
                "main": {
                    controller: 'TimelineCtrl',
                    templateUrl: 'timeline.tpl.html'
                }
            },
            data: {pageTitle: 'Graph2D'}
        });
    })

    .controller('TimelineCtrl',
    function TimelineCtrl($scope, $timeout, VisDataSet) {
        var graph2d;


        // ------------------------------------------------
        // Event Handlers

        $scope.onLoaded = function (graphRef) {
            console.log("timeline loaded callback", graphRef);
            graph2d = graphRef;
            graph2d.setWindow($scope.startTime, $scope.stopTime);
        };

        $scope.setWindow = function (window) {
            var periodStart = moment().subtract(1, window);
            $scope.timeNow = moment().valueOf();

            if (graph2d === undefined) {
                return;
            }

            graph2d.setOptions({max: $scope.timeNow});
            graph2d.setWindow(periodStart, $scope.timeNow);
        };

        $scope.setNow = function (direction) {
            var range = graph2d.getWindow();
            var interval = range.end - range.start;
            $scope.timeNow = moment().valueOf();

            if (graph2d === undefined) {
                return;
            }

            graph2d.setOptions({max: $scope.timeNow});
            graph2d.setWindow($scope.timeNow - interval, $scope.timeNow);
        };

        $scope.stepWindow = function (direction) {
            var percentage = (direction > 0) ? 0.2 : -0.2;
            var range = graph2d.getWindow();
            var interval = range.end - range.start;

            if (graph2d === undefined) {
                return;
            }

            graph2d.setWindow({
                start: range.start.valueOf() - interval * percentage,
                end: range.end.valueOf() - interval * percentage
            });
        };

        $scope.zoomWindow = function (percentage) {
            var range = graph2d.getWindow();
            var interval = range.end - range.start;

            if (graph2d === undefined) {
                return;
            }

            graph2d.setWindow({
                start: range.start.valueOf() - interval * percentage,
                end: range.end.valueOf() + interval * percentage
            });
        };

        $scope.setDateRange = function () {
            $scope.timeNow = moment().valueOf();

            if (graph2d === undefined) {
                return;
            }

            graph2d.setOptions({max: $scope.timeNow});
            graph2d.setWindow($scope.startTime, $scope.stopTime);
        };

        /**
         * Callback from the chart whenever the range is updated
         * This is called repeatedly during zooming and scrolling
         * @param period
         */
        $scope.onRangeChange = function (period) {
            console.log("Range changing", period);
            function splitDate(date) {
                var m = moment(date);
                return {
                    year: m.get('year'),
                    month: {
                        number: m.get('month'),
                        name: m.format('MMM')
                    },
                    week: m.format('w'),
                    day: {
                        number: m.get('date'),
                        name: m.format('ddd')
                    },
                    hour: m.format('HH'),
                    minute: m.format('mm'),
                    second: m.format('ss')
                };
            }

            var p = {
                s: splitDate(period.start),
                e: splitDate(period.end)
            };

            // Set the window for so the appropriate buttons are highlighted
            // We give some leeway to the interval -:
            // A day, +/- 1 minutes
            // A week, +/- 1 hour
            // A month is between 28 and 32 days
            var interval = period.end - period.start;
            if (interval > 86340000 && interval < 86460000) {
                $scope.graphWindow = 'day';
            }
            else if (interval > 601200000 && interval < 608400000) {
                $scope.graphWindow = 'week';
            }
            else if (interval > 2419200000 && interval < 2764800000) {
                $scope.graphWindow = 'month';
            }
            else {
                $scope.graphWindow = 'custom';
            }

            if (p.s.year == p.e.year) {
                $scope.timelineTimeline =
                    p.s.day.name + ' ' + p.s.day.number + '-' + p.s.month.name + '  -  ' +
                    p.e.day.name + ' ' + p.e.day.number + '-' + p.e.month.name + ' ' + p.s.year;

                if (p.s.month.number == p.e.month.number) {
                    $scope.timelineTimeline =
                        p.s.day.name + ' ' + p.s.day.number + '  -  ' +
                        p.e.day.name + ' ' + p.e.day.number + ' ' +
                        p.s.month.name + ' ' + p.s.year;

                    if (p.s.day.number == p.e.day.number) {
                        if (p.e.hour == 23 && p.e.minute == 59 && p.e.second == 59) {
                            p.e.hour = 24;
                            p.e.minute = '00';
                            p.e.second = '00';
                        }

                        $scope.timelineTimeline =
                            p.s.hour + ':' + p.s.minute + '  -  ' +
                            p.e.hour + ':' + p.e.minute + ' ' +
                            p.s.day.name + ' ' + p.s.day.number + ' ' + p.s.month.name + ' ' + p.s.year;
                    }
                }
            }
            else {
                $scope.timelineTimeline =
                    p.s.day.name + ' ' + p.s.day.number + '-' + p.s.month.name + ', ' + p.s.year + '  -  ' +
                    p.e.day.name + ' ' + p.e.day.number + '-' + p.e.month.name + ', ' + p.e.year;
            }

            // Call apply since this is updated in an event and angular may not know about the change!
            if (!$scope.$$phase) {
                $timeout(function () {
                    $scope.$apply();
                }, 0);
            }
        };

        /**
         * Callback from the chart whenever the range is updated
         * This is called once at the end of zooming and scrolling
         * @param period
         */
        $scope.onRangeChanged = function (period) {
            console.log("Range changed", period);
        };

        var now = moment().minutes(0).seconds(0).milliseconds(0);
        var groupCount = 3;
        var itemCount = 20;

        // create a data set with groups
        var names = ['John', 'Alston', 'Lee', 'Grant'];
        var groups = new VisDataSet();
        for (var g = 0; g < groupCount; g++) {
            groups.add({id: g, content: names[g]});
        }

        // create a dataset with items
        var items = new VisDataSet();
        for (var i = 0; i < itemCount; i++) {
            var start = now.clone().add(Math.random() * 200, 'hours');
            var group = Math.floor(Math.random() * groupCount);
            items.add({
                id: i,
                group: group,
                content: 'item ' + i +
                ' <span style="color:#97B0F8;">(' + names[group] + ')</span>',
                start: start,
                type: 'box'
            });
        }

        // create visualization
        $scope.timelineOptions = {
            height:"100%",
            groupOrder: 'content'  // groupOrder can be a property name or a sorting function
        };

        $scope.graphEvents = {
            rangechange: $scope.onRangeChange,
            rangechanged: $scope.onRangeChanged,
            onload: $scope.onLoaded
        };

        $scope.timelineData = {
            items: items,
            groups: groups
        };


        $scope.timelineLoaded = true;
    })

;
