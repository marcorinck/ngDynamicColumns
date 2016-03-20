(function (angular) {
	"use strict";

	angular.module("ngDynamicColumns").directive("draggableHeader", ['$rootScope', function ($rootScope) {

		return {
			restrict: 'A',
			scope: {
				draggable: "@"
			},
			link: function ($scope, $element) {
				$element.attr("draggable", true).prop('draggable', true);

				$element.on("dragstart", function (event) {
					$rootScope.draggable = $element.parents('th').attr("data-col-id");
				});

				$element.on("dragend", function () {
					$rootScope.draggable = undefined;
					$('th.drag-over').removeClass('drag-over');
				});
			}
		};
	}]);
})(angular);