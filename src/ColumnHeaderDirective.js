(function (angular) {
	"use strict";

	var ignoreNextColumnOrderChangeEvent = false;

	angular.module("ngDynamicColumns").directive("columnHeader", ['$rootScope', 'dynamicColumnService', function ($rootScope, dynamicColumnService) {

		return {
			restrict: 'A',
			controller: function($scope, $element) {
				$scope.dropped = function(source, dest) {
					var result;

					$scope.$apply(function () {
						ignoreNextColumnOrderChangeEvent = true;
						$rootScope.$emit("columnOrderChanged", source, dest);

						result = dynamicColumnService.changeColumnOrder($element, source, dest);
					});

				};
			},
			link: function (scope, element, attrs) {
				if (!attrs.columnHeader) {
					throw new Error("columnHeader directive needs a column configuration object, but got " + attrs.dynamicRow);
				}

				if (!scope[attrs.columnHeader]) {
					throw new Error("Can't find the column configuration object on the scope: " + attrs.columnHeader);
				}

				dynamicColumnService.renderColumn(scope, element, scope[attrs.columnHeader]);

				$rootScope.$on('columnDropped', function (event, source, dest) {
					scope.dropped(source, dest);
				});

				$rootScope.$on("columnToggled", function (event, columnId) {
					dynamicColumnService.toggleColumn(element, columnId);
				});

				$rootScope.$on("recreateColumns", function () {
					dynamicColumnService.renderColumn(scope, element, scope[attrs.columnHeader]);
				});

				$rootScope.$on("columnOrderChanged", function (event, sourceId, destinationId) {
					if (!ignoreNextColumnOrderChangeEvent) {
						dynamicColumnService.changeColumnOrder(element, sourceId, destinationId);
					} else {
						ignoreNextColumnOrderChangeEvent = false;
					}
				});

			}
		};
	}]);
})(angular);
