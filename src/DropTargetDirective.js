(function (angular) {
	"use strict";

	var hoveredHeader;

	function getHoveredHeader(element) {
		var row;
		if (element.tagName === 'TH') {
			row = element;
		} else {
			row = $(element).parents('th').get(0);
		}

		return row;
	}

	function getHoveredColumnId(element) {
		return element.attributes['data-col-id'].nodeValue;
	}


	angular.module("ngDynamicColumns").directive("dropTarget", ['$rootScope', function ($rootScope) {
		return {
			restrict: 'A',
			scope: {
				onDrop: '&',
				dropTarget: "@"
			},
			link: function ($scope, $element) {
				$element.parents('th').on("dragover", function (event) {
					event.originalEvent.dataTransfer.dropEffect = 'move';
					event.preventDefault();

					return false;
				});

				$element.parents('th').find('*').on("dragenter", function (event) {
					var currentHeader, sourceColumn = $rootScope.draggable;

					event.originalEvent.dataTransfer.dropEffect = "move";
					if (!hoveredHeader) {
						currentHeader = getHoveredHeader(this);
						if (getHoveredColumnId(currentHeader) !== sourceColumn) {
							hoveredHeader = currentHeader;
							hoveredHeader.classList.add('drag-over');
						}
					} else {
						currentHeader = getHoveredHeader(this);
						if (currentHeader !== hoveredHeader && getHoveredColumnId(currentHeader) !== sourceColumn) {
							hoveredHeader.classList.remove('drag-over');
							currentHeader.classList.add('drag-over');
							hoveredHeader = currentHeader;
						} else {
							hoveredHeader.classList.remove('drag-over');
							hoveredHeader = null;
						}
					}
				});

				$element.parents('th').on("dragleave", function (e) {
					//console.log("dragleave", this);
				});

				$element.parents('th').on("drop", function (event) {
					var sourceColumn, destColumn;

					event.stopPropagation();
					if (hoveredHeader) {
						sourceColumn = $rootScope.draggable;
						destColumn = $element.parents('th').attr("data-col-id");

						$scope.onDrop({source: sourceColumn, dest: destColumn});
					}

					return false;
				});
			}
		};
	}]);
})(angular);