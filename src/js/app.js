var app = angular.module('popoverApp', ['ngPopover', 'multiselectDropdown']);

app.controller('masterController', ['$scope', 'ngPopoverFactory', function($scope, ngPopoverFactory){
	$scope.message = "Click on any of the above buttons to see the popovers in action"
	// $scope.openCallback = function(popoverName){
	// 	$scope.message = "You just opened "+popoverName;
	// }

	// $scope.closeCallback = function(popoverName){
	// 	$scope.message = "You just closed "+popoverName;
	// };

	// $scope.closePopover = function(trigger){
	// 	ngPopoverFactory.closePopover(trigger);
	// }
	    $scope.multiselectDdOptions = [
		{
		    displayName: 'option 1',
		    value: 'option1'
		},
		{
		    displayName: 'option 2',
		    value: 'option2'

		},
		{
		    displayName: 'option 3',
		    value: 'option3'

		},
		{
		    displayName: 'option 4',
		    value: 'option4'

		}
	];
	$scope.multiselectFeatures = [
		{value: "Custom Drop Directions"},
		{value: "Selection Callback"},
		{value: "Dropdown Open Callback"},
		{value: "Dropdown Close Callback"},
		{value: "Limit Max Selections"},
		{value: "Custom Class for CSS"},
		{value: "All/None Selection"},
		{value: "Display & Select Different Keys"}
	];
	$scope.multiselectSelection = function(ddNum){
		$scope.message = "You just made a selection in dropdown "+ddNum;
	}
	$scope.multiselectDdClose = function(ddNum){
		$scope.message = "You just closed dropdown "+ddNum;
	}
	$scope.miltiselectDdOpen = function(ddNum){
		$scope.message = "You just opened dropdown "+ddNum; 
	}
	$scope.model = {};
	$scope.model.material = ['option3'];
	$scope.multiselectModel = ['option3'];
	$scope.normalMultiselectModel = [];
}]);