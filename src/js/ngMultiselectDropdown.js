var app = angular.module('multiselectDropdown', []);
app.directive('multiselectDropdown', function(){
	return {
		restrict: 'EA',
		replace: true,
		scope: {
			options: '=', // [required] List of items to be selected (Must be an array of objects)
			ngModel: '=', // [required]Model to which the selected items are binded
			onSelect: '&', //Funtion to be executed on selection of a value
			onClose: '&', // Function to be executed on closing the selection dropdown
			onOpen: '&', // Funtction to be executed on opening the selection dropdown
			displayProp: '@', // [required] The key in options with text that you want to be display next to checkboxes
			valueProp: '@', // [required] The key in options that you want to be pushed to the model on selection
			maxItemsDisplay: '@', // Max no. of items that you want to display on the selection button
			triggerId: '@', // [required]Unique Id for the dropdown
			ddDirection: '@', // Direction in which you want to open the dropdown relative to selection button (Can be 'left', 'right', 'top', 'bottom')
			placeholder: '@', // The placeholder for selections
			maxSelectionsAllowed: '@', //Maximum number of selections allowed
			enableSelectAll: '@', // Enable the select all button
			theme: '@', // set it equal to 'material' for material checkboxes (needs google material icons)
			dropdownClass: '@' // Custom class for selection dropdown to override styles
		},
		link: {
			post: function(scope, element, attrs, ctrl){
				scope.dropdownClass = attrs.dropdownClass;
				scope.btnText = attrs.placeholder ? attrs.placeholder : "Select";
				scope.enableSelectAll = attrs.enableSelectAll ? attrs.enableSelectAll : 'false';
				scope.ngModel = scope.ngModel ? scope.ngModel : [];
				scope.allSelected = scope.ngModel.length == scope.options.length ? true : false;
				attrs.maxSelectionsAllowed = attrs.maxSelectionsAllowed ? attrs.maxSelectionsAllowed : scope.options.length;
				var theme = attrs.theme || 'normal';
				var defaultPlaceholder = scope.btnText;
				var compile = ctrl.compile;
				var body = document.querySelector('body');
				var triggerId = attrs.triggerId;
				var displayProp = attrs.displayProp;
				var valueProp = attrs.valueProp;
				var maxDisplayItems = attrs.maxItemsDisplay ? attrs.maxItemsDisplay : 3;

				// Function to get currently selected values (used for updating placeholder text)
				var getSelectedValues = function(){
					var temp = [];
					angular.forEach(scope.options, function(val, key){
						if(scope.ngModel.indexOf(val[valueProp]) > -1)
							temp.push(val[displayProp]);
					});
					return temp.join(', ');
				}

				// Function to update placeholder for selection button 
				var updateBtnText = function(){
					if(scope.ngModel.length == 0)
						scope.btnText = defaultPlaceholder;
					else if(scope.ngModel.length <= maxDisplayItems)
						scope.btnText = getSelectedValues();
					else
						scope.btnText = scope.ngModel.length+"of "+scope.options.length+" values selected";
				}

				// Funcition to add or remove items from the model depending upon check and uncheck of checkboxes
				scope.updateCheckedColumns = function($event, val){
					var temp = scope.ngModel.indexOf(val);
					if(temp < 0 && scope.ngModel.length < attrs.maxSelectionsAllowed)
						scope.ngModel.push(val);
					else if(temp < 0 && scope.ngModel.length >= attrs.maxSelectionsAllowed){
						$event.preventDefault();
						// $event.stopPropogation();
						alert("Only "+attrs.maxSelectionsAllowed+" selections are allowed");
					}
					else
						scope.ngModel.splice(temp, 1)
					if(scope.ngModel.length == scope.options.length )
						scope.allSelected = true;
					else
						scope.allSelected = false;
					updateBtnText();
					scope.onSelect();
				}

				// Function to select all values if not all the item are selected otherwise deselect all items
				scope.selectAll = function(){
					// Deselect all if all the items are already selected
					if(scope.ngModel.length == scope.options.length){
						var allCheckboxes = document.querySelectorAll('input[name="'+triggerId+'"]');
						angular.forEach(allCheckboxes, function(cbox){
							cbox.setAttribute('checked', false);
						})
						scope.ngModel = [];
					}
					else{
						// Select All items
						// angular.element('input[name="multi"]').attr('checked', true);
						scope.ngModel = [];
						angular.forEach(scope.options, function(option){
							scope.ngModel.push(option.value);
						})
						scope.allSelected = true;
					}
					updateBtnText();
				}

				// Returns template for checkboxes depending upon the selected theme and the type of checkbox (normal/selectAll)
				var getCheckbox = function(allCheckbox){
					var materialCheckbox;
					var normalCheckbox ;
					//if it is a select all checkbox
					if(allCheckbox){
						normalCheckbox =  '<input type="checkbox" name="'+triggerId+'" id="all-'+triggerId+'" ng-checked="allSelected" ng-click="selectAll()">';
									
						materialCheckbox = '<span class="checkbox-container">'+
										'<input type="checkbox" name="'+triggerId+'" id="all-'+triggerId+'" ng-checked="allSelected" ng-click="selectAll()">'+
										'<span class="icon-tick"><i class="material-icons">check</i></span>'+
									'</span>';
					}
					else{
						materialCheckbox = '<span class="checkbox-container">'+
										'<input type="checkbox" name="'+triggerId+'" id="option-'+triggerId+'-{{option[\''+valueProp.replace(/ /g,'')+'\']}}" ng-checked="ngModel.indexOf(option[\''+valueProp+'\']) > -1" ng-click="updateCheckedColumns($event, option[\''+valueProp+'\'])">'+
										'<span class="icon-tick"><i class="material-icons">check</i></span>'+
									'</span>';

						normalCheckbox = '<input type="checkbox" name="'+triggerId+'" id="option-'+triggerId+'-{{option[\''+valueProp.replace(/ /g,'')+'\']}}" ng-checked="ngModel.indexOf(option[\''+valueProp+'\']) > -1" ng-click="updateCheckedColumns($event, option[\''+valueProp+'\'])">';						
					}

					var checkbox = theme == 'material' ? materialCheckbox : normalCheckbox;
					return checkbox;
				}
				// Template for the selection dropdown (using ngPopover directive - https://github.com/FauzanKhan/angular-popover)
				var template = '<ng-popover trigger="'+triggerId+'" on-open="onOpen()" on-close="onClose()" ng-class="'+scope.dropdownClass+'">'+
					'<ul class="filters-list">'+
						'<li ng-if="enableSelectAll == \'true\'">'+getCheckbox(true)+
							'<label for="all-'+triggerId+'">All</label>'+
						'</li>'+
						'<li ng-repeat="option in options">'+getCheckbox()+
							'<label for="option-'+triggerId+'-{{option[\''+valueProp.replace(/ /g,'')+'\']}}">{{option[\''+displayProp+'\']}}</label>'+
						'</li>'+
					'</ul>'+
				'</ng-popover>';
				ctrl.timeout(function(){
					//Compile and append the selection dropdown template to body 
					body.appendChild(compile(template)(scope)[0]);
					updateBtnText();
				});
			}
		},
		controller: ['$scope', '$compile', '$timeout', function($scope, $compile, $timeout){
			this.timeout = $timeout;
			this.compile = $compile;
		}],
		template: '<a class="ng-popover-trigger multiselectDropdownBtn" id="{{triggerId}}" data-direction="{{ddDirection}}">{{btnText}}</a>'
	}
});