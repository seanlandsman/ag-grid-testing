"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
exports.log = function (message) {
    if (protractor_1.browser.params.debug) {
        console.log(message);
    }
};
exports.getCssSelectorForRowAndCol = function (row, col, additionalSelector) {
    additionalSelector = additionalSelector || '';
    exports.log("selector: div[row-id=\"" + row + "\"] div[col-id=\"" + col + "\"] " + additionalSelector);
    return "div[row-id=\"" + row + "\"] div[col-id=\"" + col + "\"] " + additionalSelector;
};
exports.getLocatorForCell = function (row, col, additionalSelector) {
    return protractor_1.by.css(exports.getCssSelectorForRowAndCol(row, col, additionalSelector));
};
exports.getCellContent = function (row, col, additionalSelector) {
    return protractor_1.element(exports.getLocatorForCell(row, col, additionalSelector));
};
exports.getCellContentAttribute = function (row, col, attribute, additionalSelector) {
    return exports.getCellContent(row, col, additionalSelector).getAttribute(attribute);
};
exports.verifyCellContentAttributesContains = function (row, col, attribute, values, additionalSelector) {
    exports.getCellContentAttributes(row, col, attribute, additionalSelector).then(function (attributes) {
        exports.log("Verifying " + values.length + " equals " + attributes.length);
        expect(values.length).toEqual(attributes.length, "Expect number of values supplied (" + values.length + ") to equal number of attributes found (" + attributes.length + "), for row " + row + ", col " + col + ", attribute " + attribute);
        for (var i = 0; i < values.length; i++) {
            var found = false;
            for (var j = 0; j < attributes.length && !found; j++) {
                if (attributes[j].indexOf(values[i]) !== -1) {
                    found = true;
                }
            }
            if (!found) {
                console.error("Could not find " + values[i] + " in list of attributes [" + attributes + "], for row " + row + ", col " + col + ", attribute " + attribute);
                fail();
            }
        }
    });
};
exports.getCellContentAttributes = function (row, col, attribute, additionalSelector) {
    return protractor_1.element.all(exports.getLocatorForCell(row, col, additionalSelector)).map(function (elm, index) {
        return elm.getAttribute(attribute);
    });
};
exports.verifyCellContentAttributeContains = function (row, col, attribute, value, additionalSelector) {
    exports.getCellContentAttribute(row, col, attribute, additionalSelector).then(function (text) {
        exports.log("Expecting " + text + " to contain " + value);
        expect(text).toContain(value, "Expecting " + text + " to contain " + value);
    });
};
exports.getCellContentsAsText = function (row, col, additionalSelector) {
    return exports.getCellContent(row, col, additionalSelector).getText();
};
exports.verifyCellContentsMatches = function (rowIndex, colId, expectedValue, additionalSelector) {
    exports.getCellContentsAsText(rowIndex, colId, additionalSelector).then(function (text) {
        exports.log("Expect " + text + " to equal " + expectedValue);
        expect(text).toEqual(String(expectedValue), "Expect " + text + " to equal " + expectedValue);
    });
};
exports.verifyRowDataMatchesGridData = function (exectedRowData) {
    var _loop_1 = function (rowIndex) {
        var currentRowData = exectedRowData[rowIndex];
        var colIds = Object.keys(currentRowData);
        colIds.forEach(function (colId) {
            exports.verifyCellContentsMatches(rowIndex, colId, currentRowData[colId]);
        });
    };
    for (var rowIndex = 0; rowIndex < exectedRowData.length; rowIndex++) {
        _loop_1(rowIndex);
    }
};
exports.verifyElementIsPresent = function (locator) {
    exports.log("Expect element " + locator + " to be present");
    return expect(protractor_1.element(locator).isPresent()).toBeTruthy("Expect element " + locator + " to be present");
};
exports.verifyElementIsNotPresent = function (locator) {
    exports.log("Expect element " + locator + " to not be present");
    expect(protractor_1.element(locator).isPresent()).toBeFalsy("Expect element " + locator + " to not be present");
};
exports.getAllElementsBy = function (locator) {
    return protractor_1.element.all(locator);
};
exports.mapAllElementsBy = function (locator, action) {
    return exports.getAllElementsBy(locator).map(action);
};
exports.allElementsByMatch = function (locator, action, comparisonFn) {
    return exports.mapAllElementsBy(locator, action)
        .then(function (item) {
        return comparisonFn(item);
    });
};
exports.allElementsTextMatch = function (locator, values) {
    exports.allElementsByMatch(locator, function (item) {
        return item.getText();
    }, function (item) {
        expect(item).toEqual(values);
    });
};
exports.clickOnHeader = function (headerName) {
    return protractor_1.element(protractor_1.by.cssContainingText(".ag-header-cell-text", headerName)).click();
};
