(function (angular) {
	"use strict";

	angular.module("ngDynamicColumns").directive("dynamicRow", ['$rootScope', 'dynamicColumnService', function ($rootScope, dynamicColumnService) {
		var $event;

		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				if (!attrs.dynamicRow) {
					throw new Error("dynamicRow direcive needs a column configuration object, but got " + attrs.dynamicRow);
				}

				if (!scope[attrs.dynamicRow]) {
					throw new Error("Can't find the column configuration object on the scope: " + attrs.dynamicRow);
				}
				dynamicColumnService.renderRow(scope, element, scope[attrs.dynamicRow]);

				$rootScope.$on("columnToggled", function (event, columnId) {
					dynamicColumnService.toggleColumn(element, columnId);
				});

				$rootScope.$on("recreateColumns", function () {
					dynamicColumnService.renderRow(scope, element, scope[attrs.dynamicRow]);
				});

				$rootScope.$on("columnOrderChanged", function (event, sourceId, destinationId, options) {
					var indexes = dynamicColumnService.changeColumnOrder(element, sourceId, destinationId),
						_options = options || {};

					//move columns in column configuration too, but only once per event ...
					if ($event !== event && !_options.skipUpdatingColumnConfiguration) {
						scope[attrs.dynamicRow].splice(indexes.destIndex, 0, scope[attrs.dynamicRow].splice(indexes.sourceIndex,1)[0]);
						$event = event;
					}
				});
			}
		};
	}]);

})(angular);
