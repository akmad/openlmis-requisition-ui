/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

	'use strict';

	angular
		.module('requisition-approval')
		.config(routes);

	routes.$inject = ['$stateProvider', 'REQUISITION_RIGHTS', 'REQUISITION_STATUS'];

	function routes($stateProvider, REQUISITION_RIGHTS, REQUISITION_STATUS) {

		$stateProvider.state('requisitions.approvalList', {
			showInNavigation: true,
			label: 'requisitionApproval.approve',
			url: '/approvalList?page&size&program',
			controller: 'RequisitionApprovalListController',
			controllerAs: 'vm',
			templateUrl: 'requisition-approval/requisition-approval-list.html',
			accessRights: [REQUISITION_RIGHTS.REQUISITION_APPROVE],
            resolve: {
				requisitions: function(paginationService, requisitionService, $stateParams) {
					return paginationService.registerUrl($stateParams, function(stateParams) {
						if (stateParams.program) {
							stateParams.requisitionStatus = REQUISITION_STATUS.AUTHORIZED;
                            return requisitionService.search(false, stateParams);
                        }
                        return undefined;
					});
				},
                user: function(authorizationService) {
                    return authorizationService.getUser();
                },
				programs: function(programService, user, $q, $filter) {
                    var deferred = $q.defer();

                    $q.all([
                    programService.getUserPrograms(user.user_id, true),
                    programService.getUserPrograms(user.user_id, false)
					]).then(function (results) {
                        if (!results[1]) {
                        	deferred.resolve(results[0]);
                        }
                        deferred.resolve($filter('unique')(results[0].concat(results[1]), 'id'));
					}, function() {
						deferred.reject();
					});

                    return deferred.promise;
                }
			}
		});
	}

})();
