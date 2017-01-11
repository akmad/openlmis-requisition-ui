(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-summary.RequisitionSummaryController
     *
     * @description
     * Responsible for managing Requisition Total Cost popover.
     */
    angular
        .module('requisition-summary')
        .controller('RequisitionSummaryController', controller);

    controller.$inject = ['$filter', 'calculations'];

    function controller($filter, calculations) {
        var vm = this;

        vm.calculateFullSupplyCost = calculateFullSupplyCost;
        vm.calculateNonFullSupplyCost = calculateNonFullSupplyCost;
        vm.calculateTotalCost = calculateTotalCost;
        vm.closePopover = closePopover;

        /**
         * @ngdoc method
         * @name calculateFullSupplyCost
         * @methodOf requisition-summary.RequisitionSummaryController
         *
         * @description
         * Calculates total cost of all full supply line items. This method will ignore skipped
         * line items.
         *
         * @return {Number} the total cost of all full supply line items
         */
        function calculateFullSupplyCost() {
            return calculateCost(true);
        }

        /**
         * @ngdoc method
         * @name calculateNonFullSupplyCost
         * @methodOf requisition-summary.RequisitionSummaryController
         *
         * @description
         * Calculates total cost of all non full supply line items. This method will ignore skipped
         * line items.
         *
         * @return {Number} the total cost of all non full supply line items
         */
        function calculateNonFullSupplyCost() {
            return calculateCost(false);
        }

        /**
         * @ngdoc method
         * @name calculateTotalCost
         * @methodOf requisition-summary.RequisitionSummaryController
         *
         * @description
         * Calculates total cost of all line items. This method will ignore skipped line items.
         *
         * @return {Number} the total cost of all line items
         */
        function calculateTotalCost() {
            return calculateCost();
        }

        function closePopover() {
            vm.popoverOpen = false;
        }

        function calculateCost(fullSupply) {
            var sum = 0;

            getLineItems(fullSupply).forEach(function(lineItem) {
                if (!lineItem.skipped) {
                    sum += calculations.totalCost(lineItem);
                }
            });

            return sum;
        }

        function getLineItems(fullSupply) {
            var lineItems;

            if (fullSupply === undefined) {
                lineItems = vm.requisition.requisitionLineItems;
            } else {
                lineItems = $filter('filter')(vm.requisition.requisitionLineItems, {
                    $program: {
                        fullSupply: fullSupply
                    }
                });
            }

            return lineItems;
        }
    }

})();