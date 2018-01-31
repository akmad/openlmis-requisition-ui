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
        .module('program-requisition-template')
        .factory('TemplateDataBuilder', TemplateDataBuilder);

    TemplateDataBuilder.$inject = ['Template', 'TemplateColumnDataBuilder', 'COLUMN_SOURCES'];

    function TemplateDataBuilder(Template, TemplateColumnDataBuilder, COLUMN_SOURCES) {

        TemplateDataBuilder.prototype.build = build;
        TemplateDataBuilder.prototype.withColumn = withColumn;
        TemplateDataBuilder.prototype.withPopulateStockOnHandFromStockCards = withPopulateStockOnHandFromStockCards;

        return TemplateDataBuilder;

        function TemplateDataBuilder() {
            TemplateDataBuilder.instanceNumber = (TemplateDataBuilder.instanceNumber || 0) + 1;

            this.createdDate = new Date();
            this.id = 'template-' + TemplateDataBuilder.instanceNumber;
            this.numberOfPeriodsToAverage = 3;
            this.programId = 'program-' + TemplateDataBuilder.instanceNumber;
            this.populateStockOnHandFromStockCards = false;
            this.columnsMap = {};

            var column = new TemplateColumnDataBuilder().build();
            this.columnsMap[column.name] = column;
        }

        function build() {
            return new Template(this);
        }

        function withColumn(column) {
            this.columnsMap[column.name] = column;
            return this;
        }

        function withPopulateStockOnHandFromStockCards(column) {
            this.populateStockOnHandFromStockCards = true;
            return this;
        }
    }
})();
