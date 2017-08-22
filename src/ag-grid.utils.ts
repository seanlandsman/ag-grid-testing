import {browser, element, by, ElementFinder} from "protractor";
import {By} from "selenium-webdriver";

export let log = function (message: string): void {
    if (browser.params.debug) {
        console.log(message);
    }
};

export let getCssSelectorForRowAndCol = function (row: number, col: string, additionalSelector?: string) {
    additionalSelector = additionalSelector || '';
    log(`selector: div[row-id="${row}"] div[col-id="${col}"] ${additionalSelector}`);
    return `div[row-id="${row}"] div[col-id="${col}"] ${additionalSelector}`;
};

export let getLocatorForCell = function (row: number, col: string, additionalSelector?: string): By {
    return by.css(getCssSelectorForRowAndCol(row, col, additionalSelector));
};

export let getCellContent = function (row: number, col: string, additionalSelector?: string) {
    return element(getLocatorForCell(row, col, additionalSelector));
};

export let getCellContentAttribute = function (row: number, col: string, attribute: string, additionalSelector?: string) {
    return getCellContent(row, col, additionalSelector).getAttribute(attribute);
};

export let verifyCellContentAttributesContains = function (row: number, col: string, attribute: string, values: string[], additionalSelector?: string) {
    getCellContentAttributes(row, col, attribute, additionalSelector).then((attributes: string[]) => {
        log(`Verifying ${values.length} equals ${attributes.length}`);
        expect(values.length).toEqual(attributes.length, `Expect number of values supplied (${values.length}) to equal number of attributes found (${attributes.length}), for row ${row}, col ${col}, attribute ${attribute}`);
        for (let i = 0; i < values.length; i++) {

            let found: boolean = false;
            for (let j = 0; j < attributes.length && !found; j++) {
                if (attributes[j].indexOf(values[i]) !== -1) {
                    found = true;
                }
            }
            if (!found) {
                console.error(`Could not find ${values[i]} in list of attributes [${attributes}], for row ${row}, col ${col}, attribute ${attribute}`);
                fail()
            }
        }
    });
};

export let getCellContentAttributes = function (row: number, col: string, attribute: string, additionalSelector?: string) {
    return element.all(getLocatorForCell(row, col, additionalSelector)).map((elm, index) => {
        return elm.getAttribute(attribute)
    });
};

export let verifyCellContentAttributeContains = function (row: number, col: string, attribute: string, value: string, additionalSelector?: string) {
    getCellContentAttribute(row, col, attribute, additionalSelector).then((text) => {
        log(`Expecting ${text} to contain ${value}`);
        expect(text).toContain(value, `Expecting ${text} to contain ${value}`);
    });
};

export let getCellContentsAsText = function (row: number, col: string, additionalSelector?: string) {
    return getCellContent(row, col, additionalSelector).getText();
};

export let verifyCellContentsMatches = function (rowIndex: number, colId, expectedValue: any, additionalSelector?: string) {
    getCellContentsAsText(rowIndex,
        colId,
        additionalSelector).then((text) => {

        log(`Expect ${text} to equal ${expectedValue}`);
        expect(text).toEqual(String(expectedValue), `Expect ${text} to equal ${expectedValue}`);
    });
};

export let verifyRowDataMatchesGridData = function (exectedRowData: [{}]) {
    for (let rowIndex = 0; rowIndex < exectedRowData.length; rowIndex++) {
        let currentRowData = exectedRowData[rowIndex];
        let colIds = Object.keys(currentRowData);
        colIds.forEach((colId) => {
            verifyCellContentsMatches(rowIndex, colId, currentRowData[colId]);
        });
    }
};

export let verifyElementIsPresent = function (locator: By) {
    log(`Expect element ${locator} to be present`);
    return expect(element(locator).isPresent()).toBeTruthy(`Expect element ${locator} to be present`);
};

export let verifyElementIsNotPresent = function (locator: By) {
    log(`Expect element ${locator} to not be present`);
    expect(element(locator).isPresent()).toBeFalsy(`Expect element ${locator} to not be present`);
};

export let getAllElementsBy = function (locator: By) {
    return element.all(locator);
};

export let mapAllElementsBy = function <T>(locator: By,
                                           action: (elementFinder?: ElementFinder, index?: number) => T) {
    return getAllElementsBy(locator).map(action)
};

export let allElementsByMatch = function <T>(locator: By,
                                             action: (elementFinder?: ElementFinder, index?: number) => T,
                                             comparisonFn: Function) {
    return mapAllElementsBy(locator, action)
        .then((item) => {
            return comparisonFn(item);
        })
};

export let allElementsTextMatch = function (locator: By,
                                            values: string[]) {
    allElementsByMatch(locator, (item) => {
            return item.getText()
        },
        (item) => {
            expect(item).toEqual(values);
        });
};

export let clickOnHeader = function (headerName: string) {
    return element(by.cssContainingText(".ag-header-cell-text", headerName)).click()
}