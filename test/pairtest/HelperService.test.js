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
                expect (HELPER_SERVICE.hasValidAmountOfAdultsPresent(request)).toBe(result);
            }
        );

    });

    describe("hasValidAccountID", () => {
        test("should be defined", () => {
            expect(HELPER_SERVICE.hasValidAccountID).toBeDefined();
        });

        test.each([
            [false, "ONE"],
            [false, 0],
            [false, null],
            [false, undefined],
            [true, 123],
            [true, 123e5],
            
        ])(
            "it should return %j for accountID %j",
            (result, accountId) => {
                expect (HELPER_SERVICE.hasValidAccountID(accountId)).toBe(result);
            }
        );
    });

    describe("countTicketsInRequest", () => {
        test("should be defined", () => {
            expect(HELPER_SERVICE.countTicketsInRequest).toBeDefined();
        });

        test("should count the total number of tickets in request", () => {
            expect(HELPER_SERVICE.countTicketsInRequest(testdata.familyReq)).toBe(4)
        });  

        test("should count the total number of tickets in request even if it exceeds current limit", () => {
            expect(HELPER_SERVICE.countTicketsInRequest(testdata.familyTooBigReq)).toBe(26)
        }); 
    });

    describe("countSeatsInRequest", () => {
        test("should be defined", () => {
            expect(HELPER_SERVICE.countSeatsInRequest).toBeDefined();
        });

        test("should count the total number of seats in request", () => {
            expect(HELPER_SERVICE.countSeatsInRequest(testdata.familyReq)).toBe(3);
        });

        test("should count the total number of seats in request even if it exceeds current limit", () => {
            expect(HELPER_SERVICE.countSeatsInRequest(testdata.familyTooBigReq)).toBe(25)
        }); 
    });

    describe("calculatePayment", () => {
        test("should calculate the total payment due for requests", () => {
            expect(HELPER_SERVICE.calculatePayment(testdata.familyReq)).toBe(55);
        })

        test("should calculate the NIL payment due for infant request", () => {
            expect(HELPER_SERVICE.calculatePayment([testdata.twoInfantReq])).toBe(0)
        })

        test("should calculate payment for exponential request", () => {
            expect(HELPER_SERVICE.calculatePayment([testdata.exponentialAdultsReq])).toBe(3075000);
        })

        // TODO - look at calculation - don't think we really want to perform calculations for 0 or negs
        test("should calculate payment for zero request", () => {
            expect(HELPER_SERVICE.calculatePayment([testdata.zeroAdultReq])).toBe(0);
        })
    })

})