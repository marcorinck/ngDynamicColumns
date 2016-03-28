(function (angular) {
	"use strict";

	angular.module("ngDynamicColumns").directive("draggableHeader", ['$rootScope', function ($rootScope) {

		return {
			restrict: 'A',
			link: function ($scope, $element) {
				var header = $element.parents('th');
				// var header = $element;

				header.attr("draggable", true).prop('draggable', true);

				header.on("dragstart", function () {
					$rootScope.draggable = header.attr("data-col-id");
				});

				header.on("dragend", function () {
					$rootScope.draggable = undefined;
					$('th.drag-over').removeClass('drag-over');
				});
			}
		};
	}]);
})(angular);