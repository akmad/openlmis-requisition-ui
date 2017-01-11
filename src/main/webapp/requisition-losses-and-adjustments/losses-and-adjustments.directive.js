(function() {

    'use strict';

    angular
        .module('requisition-losses-and-adjustments')
        .directive('lossesAndAdjustments', lossesAndAdjustments);

    lossesAndAdjustments.$inject = ['$compile', '$templateRequest', 'messageService'];

    function lossesAndAdjustments($compile, $templateRequest, messageService) {
        var directive = {
            restrict: 'A',
            replace: true,
            controller: 'LossesAndAdjustmentsController',
            controllerAs: 'vm',
            templateUrl: 'requisition-losses-and-adjustments/losses-and-adjustments-cell.html',
            scope: {
                lineItem: '=',
                requisition: '='
            },
            link: link
        }
        return directive;

        function link(scope, element, attr, vm) {
            var dialog;

            vm.showModal = showModal;
            vm.hideModal = hideModal;

            function showModal() {
                $templateRequest('requisition-losses-and-adjustments/losses-and-adjustments-modal.html')
                    .then(function(modal){
                        dialog = bootbox.dialog({
                            title: messageService.get('label.losses.adjustments'),
                            message: $compile(modal)(scope),
                            backdrop: true,
                            onEscape: true,
                            closeButton: true,
                            size: 'large'
                        });
                    }
                );
            }

            function hideModal() {
                dialog.modal('hide');
            }
        }
    }

})();
