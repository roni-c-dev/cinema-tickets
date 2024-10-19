import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest";
import HelperService from "../../src/pairtest/utils/HelperService";
import { jest } from "@jest/globals";


describe("HelperService", () => {

    // Set up simple test data
    const HELPER_SERVICE = new HelperService();
    const zeroAdultReq = new TicketTypeRequest("ADULT", 0);
    const oneAdultReq = new TicketTypeRequest("ADULT", 1);
    const twoChildReq = new TicketTypeRequest("CHILD", 2);
    const oneInfantReq = new TicketTypeRequest("INFANT", 1);
    const twoInfantReq = new TicketTypeRequest("INFANT", 2);
    const familyReq = [oneAdultReq, twoChildReq, oneInfantReq];
    const bigFamilyReq = [oneAdultReq,twoChildReq, twoInfantReq];
    const childrenAndInfantsWithZeroAdultReq = [zeroAdultReq, twoChildReq, twoInfantReq]


    describe("hasValidAmountOfAdultsPresent", () => {
        beforeEach(() => {
            jest.resetAllMocks();
        });
        test("should be defined", () => {
            expect(HELPER_SERVICE.hasValidAmountOfAdultsPresent).toBeDefined();
        });

        test.each([
            [false, bigFamilyReq],
            [false, [zeroAdultReq]],
            [false, [twoChildReq]],
            [false, childrenAndInfantsWithZeroAdultReq],
            [true, [oneAdultReq]],
            [true, familyReq]
            
        ])(
            "it should return %true_or_false for request %given_request",
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
            "it should return %true_or_false for accountID %given_id",
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
            expect(HELPER_SERVICE.countTicketsInRequest(familyReq)).toBe(4)
        });  
    });

    describe("countSeatsInRequest", () => {
        test("should be defined", () => {
            expect(HELPER_SERVICE.countSeatsInRequest).toBeDefined();
        });

        test("should count the total number of tickets in request", () => {
            expect(HELPER_SERVICE.countSeatsInRequest(familyReq)).toBe(3);
        });
    });

    describe("calculatePayment", () => {
        test("should calculate the total payment due for requests", () => {
            expect(HELPER_SERVICE.calculatePayment(familyReq)).toBe(55);
        })

        test("should calculate the NIL payment due for infant request", () => {
            expect(HELPER_SERVICE.calculatePayment([twoInfantReq])).toBe(0)
        })
    })

})