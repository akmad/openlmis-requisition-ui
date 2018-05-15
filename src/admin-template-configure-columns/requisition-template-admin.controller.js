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

    /**
     * @ngdoc controller
     * @name admin-template-configure-columns.controller:RequisitionTemplateAdminController
     *
     * @description
     * Controller for template view page.
     */
    angular
        .module('admin-template-configure-columns')
        .controller('RequisitionTemplateAdminController', RequisitionTemplateAdminController);

    RequisitionTemplateAdminController.$inject = [
        '$state', 'template', 'program', 'tags', '$q', 'notificationService', 'messageService',
        'templateValidator', 'MAX_COLUMN_DESCRIPTION_LENGTH', 'COLUMN_SOURCES', 'TEMPLATE_COLUMNS',
        'loadingModalService', 'confirmService', 'requisitionTemplateService'
    ];

    function RequisitionTemplateAdminController(
        $state, template, program, tags, $q, notificationService, messageService, 
        templateValidator, MAX_COLUMN_DESCRIPTION_LENGTH, COLUMN_SOURCES, TEMPLATE_COLUMNS, 
        loadingModalService, confirmService, requisitionTemplateService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.goToTemplateList = goToTemplateList;
        vm.saveTemplate = saveTemplate;
        vm.dropCallback = dropCallback;
        vm.canChangeSource = canChangeSource;
        vm.sourceDisplayName = sourceDisplayName;
        vm.getColumnError = templateValidator.getColumnError;
        vm.isAverageConsumption = isAverageConsumption;
        vm.refreshAvailableTags = refreshAvailableTags;

        /**
         * @ngdoc property
         * @propertyOf admin-template-configure-columns.controller:RequisitionTemplateAdminController
         * @name maxColumnDescriptionLength
         * @type {Number}
         *
         * @description
         * Holds max column description length.
         */
        vm.maxColumnDescriptionLength = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-template-configure-columns.controller:RequisitionTemplateAdminController
         * @name template
         * @type {Object}
         *
         * @description
         * Holds template.
         */
        vm.template = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-template-configure-columns.controller:RequisitionTemplateAdminController
         * @name program
         * @type {Object}
         *
         * @description
         * Holds program.
         */
        vm.program = undefined;

        /**
         * @ngdoc property
         * @propertyOf admin-template-configure-columns.controller:RequisitionTemplateAdminController
         * @name tags
         * @type {Array}
         *
         * @description
         * Holds list of available reason tags.
         */
        vm.tags = undefined;

        /**
         * @ngdoc method
         * @methodOf admin-template-configure-columns.controller:RequisitionTemplateAdminController
         * @name goToTemplateList
         *
         * @description
         * Redirects user to template list view page.
         */
        function onInit() {
            vm.maxColumnDescriptionLength = MAX_COLUMN_DESCRIPTION_LENGTH;
            vm.template = template;
            vm.program = program;
            refreshAvailableTags();
        }

        /**
         * @ngdoc method
         * @methodOf admin-template-configure-columns.controller:RequisitionTemplateAdminController
         * @name goToTemplateList
         *
         * @description
         * Redirects user to template list view page.
         */
        function goToTemplateList() {
            $state.go('openlmis.administration.requisitionTemplates', {}, {reload: true});
        }

        /**
         * @ngdoc method
         * @methodOf admin-template-configure-columns.controller:RequisitionTemplateAdminController
         * @name saveTemplate
         *
         * @description
         * Saves template from scope if template is valid. After successful action displays
         * success notification on screen and redirects user to template
         * list view page. If saving is unsuccessful error notification is displayed.
         */
        function saveTemplate() {
            if (vm.template.isValid()) {
                confirmService.confirm(
                    'adminProgramTemplate.templateSave.description', 'adminProgramTemplate.save',
                    undefined, 'adminProgramTemplate.templateSave.title')
                .then(function() {
                    loadingModalService.open();
                    requisitionTemplateService.save(vm.template).then(function() {
                        notificationService.success('adminProgramTemplate.templateSave.success');
                        goToTemplateList();
                    }, function() {
                        notificationService.error('adminProgramTemplate.templateSave.failure');
                        loadingModalService.close();
                    });
                });
            } else {
                notificationService.error('adminProgramTemplate.template.invalid');
            }
        }

        /**
         * @ngdoc method
         * @methodOf admin-template-configure-columns.controller:RequisitionTemplateAdminController
         * @name dropCallback
         *
         * @description
         * Moves column using templateFactory method. If action is unsuccessful
         * it displays notification error on screen.
         *
         * @param {Event}   event Drop event
         * @param {Number}  index Indicates where column was dropped
         * @param {Object}  item  Dropped column
         */
        function dropCallback(event, index, item) {
            if(!vm.template.moveColumn(item, index)) {
                notificationService.error('adminProgramTemplate.canNotDropColumn');
            }
            return false; // disable default drop functionality
        }

        /**
         * @ngdoc method
         * @methodOf admin-template-configure-columns.controller:RequisitionTemplateAdminController
         * @name canChangeSource
         *
         * @description
         * Indicates if column source can be changed based on if there is more then one possible source to choose from.
         *
         * @param  {Object}  column column to be checked
         * @return {boolean}        true if source can be changed
         */
        function canChangeSource(column) {
            return column.columnDefinition.sources.length > 1 && 
                !vm.template.isColumnDisabled(column) && 
                !(vm.template.populateStockOnHandFromStockCards && column.isStockBasedColumn());
        }

        /**
         * @ngdoc method
         * @methodOf admin-template-configure-columns.controller:RequisitionTemplateAdminController
         * @name sourceDisplayName
         *
         * @description
         * Gives display name of given source type.
         *
         * @param  {String} name Column source name
         * @return {String}      Column source display name
         */
        function sourceDisplayName(name) {
            return messageService.get(COLUMN_SOURCES.getLabel(name));
        }

        /**
         * @ngdoc method
         * @methodOf admin-template-configure-columns.controller:RequisitionTemplateAdminController
         * @name isAverageConsumption
         *
         * @description
         * Determines whether displayed column is an average consumption.
         *
         * @param  {Object}  column Column
         * @return {Boolean}        True if column name is averageConsumption.
         */
        function isAverageConsumption(column) {
            return column.name === TEMPLATE_COLUMNS.AVERAGE_CONSUMPTION;
        }

        /**
         * @ngdoc method
         * @methodOf admin-template-configure-columns.controller:RequisitionTemplateAdminController
         * @name refreshAvailableTags
         *
         * @description
         * Determines whether displayed column is an average consumption.
         */
        function refreshAvailableTags() {
            var filteredTags = tags.filter(function(tag) {
                return Object.keys(vm.template.columnsMap).reduce(function(isNotSelected, columnName) {
                    return isNotSelected && vm.template.columnsMap[columnName].tag !== tag;
                }, true);
            });

            Object.keys(vm.template.columnsMap).forEach(function(columnName) {
                var column = vm.template.columnsMap[columnName];
                if (column.columnDefinition.supportsTag) {
                    column.availableTags = angular.copy(filteredTags);
                    if (column.tag) {
                        column.availableTags.push(column.tag);
                    }
                }
            });
        }
    }
})();
