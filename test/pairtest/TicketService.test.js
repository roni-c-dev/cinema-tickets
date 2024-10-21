import HelperService from "../../src/pairtest/utils/HelperService";
import InvalidPurchaseException from "../../src/pairtest/lib/InvalidPurchaseException";
import TicketService from "../../src/pairtest/TicketService";


import TicketPaymentService from "../../src/thirdparty/paymentgateway/TicketPaymentService";
import SeatReservationService from "../../src/thirdparty/seatbooking/SeatReservationService";

import { jest } from "@jest/globals";
import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest";

describe("TicketService", () => {
    let mockTicketPaymentService, mockSeatReservationService
    const testTicketService = new TicketService(new HelperService(), new TicketPaymentService(), new SeatReservationService());
    
    beforeEach(() => {
        jest.resetAllMocks();
        mockTicketPaymentService = jest.spyOn(TicketPaymentService.prototype, "makePayment");
        mockSeatReservationService = jest.spyOn(SeatReservationService.prototype, "reserveSeat");
    })

    test("should be defined", () => {
        expect(TicketService).toBeDefined();
    })

    describe("Failure scenarios", () => {
        test.each([
            [123, [new TicketTypeRequest("CHILD", 1)], "no adult"], // no adult
            [123, [new TicketTypeRequest("ADULT", 0)], "zero adult"], // zero adult
            [123, [new TicketTypeRequest("CHILD", 1), new TicketTypeRequest("INFANT", 1)], "no adult both kids"], // no adult both kids
            [123, [new TicketTypeRequest("ADULT", 1), new TicketTypeRequest("INFANT", 2)], "insufficient adults"], // insufficient adults
        ])(
            "it should throw error if request made with good accountID %j and invalid request %j(%j)",
            (accountId, ticketTypeRequests) => {
                expect(() => {
                    testTicketService.purchaseTickets(accountId, ticketTypeRequests);
                }).toThrow(InvalidPurchaseException, "Error during booking: Error: Request did not contain the required number of adults");
            }
        );

        test.each([
            ["ONE", [new TicketTypeRequest("ADULT", 1)], "String and single adult"],
            [0, [new TicketTypeRequest("ADULT", 1)], "Zero and single adult"],
            [null, [new TicketTypeRequest("ADULT", 1)], "Null and single adult"],
            [undefined, [new TicketTypeRequest("ADULT", 1)], "Undefined and single adult"]
        ])(
            "it should throw error if request made with bad accountID %j and valid request %j (%j)",
            (accountId, ticketTypeRequests) => {
                expect(() => {
                    testTicketService.purchaseTickets(accountId, ticketTypeRequests);
                }).toThrow("Error during booking: Error: Invalid account ID provided");
            }
        );
    })
    

})