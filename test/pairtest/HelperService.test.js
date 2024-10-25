import HelperService from "../../src/pairtest/utils/HelperService";
import * as testdata from "./testdata";
import { jest } from "@jest/globals";


describe("HelperService", () => {

    // Test data is defined in testdata.js so it can be reused across files
    const HELPER_SERVICE = new HelperService();
    
    describe("hasValidAmountOfAdultsPresent", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });
        test("should be defined", () => {
            expect(HELPER_SERVICE.hasValidAmountOfAdultsPresent).toBeDefined();
        });

        test.each([
            [false, testdata.bigFamilyReq, "1 adult, 2 child, 2 infant"],
            [false, [testdata.zeroAdultReq], "Zero adults"],
            [false, [testdata.twoChildReq], "2 children no adult"],
            [false, testdata.childrenAndInfantsWithZeroAdultReq, "Zero adult, 2 child, 2 infant"],
            [true, [testdata.oneAdultReq], "1 adult"],
            [true, testdata.familyReq, "1 adult, 2 child, 1 infant"]
            
        ])(
            "it should return %j for request %j (%j)",
            (result, request) => {
                expect(HELPER_SERVICE.hasValidAmountOfAdultsPresent(request)).toBe(result);
            }
        );

    });

    describe("hasValidAccountID", () => {
        test("should be defined", () => {
            expect(HELPER_SERVICE.hasValidAccountID).toBeDefined();
        });

        test.each([
            [false, "ONE", "string"],
            [false, 0, "zero"],
            [false, null, "null"],
            [false, undefined, "undefined"],
            [true, 123, "valid integer"],
            [true, 123e5, "valid exponential"],
            
        ])(
            "it should return %j for accountID %j (%j)",
            (result, accountId) => {
                expect (HELPER_SERVICE.hasValidAccountID(accountId)).toBe(result);
            }
        );
    });

    describe("countTicketsInRequest", () => {
        test("should be defined", () => {
            expect(HELPER_SERVICE.countTicketsInRequest).toBeDefined();
        });

        test.each([
            [4, testdata.familyReq, "1 adult 2 child 1 infant"],
            [26, testdata.familyTooBigReq, "25 adults 1 infant"],
            [0, [testdata.zeroAdultReq], "0 adults - param intialised to 0"],    
        ])(
            "it should return %j for request %j (%j)",
            (result, request) => {
                expect (HELPER_SERVICE.countTicketsInRequest(request)).toBe(result);
            }
        );
        
    });

    describe("countSeatsInRequest", () => {
        test("should be defined", () => {
            expect(HELPER_SERVICE.countSeatsInRequest).toBeDefined();
        });

        test.each([
            [3, testdata.familyReq, "1 adult 2 child 1 infant"],
            [25, testdata.familyTooBigReq, "25 adults 1 infant"],
            [0, [testdata.zeroAdultReq], "0 adults - param intialised to 0"],    
        ])(
            "it should return %j for request %j (%j)",
            (result, request) => {
                expect (HELPER_SERVICE.countSeatsInRequest(request)).toBe(result);
            }
        );
    });

    describe("calculatePayment", () => {

        test.each([
            [55, testdata.familyReq, "1 adult 2 child 1 infant"],
            [0, [testdata.twoInfantReq], "2 infant"],
            [3075000, [testdata.exponentialAdultsReq], "123e5 adults"],
            [0, [testdata.zeroAdultReq], "0 adults - param intialised to 0"],    
        ])(
            "it should return %j for request %j (%j)",
            (result, request) => {
                expect (HELPER_SERVICE.calculatePayment(request)).toBe(result);
            }
        );
    })

})
