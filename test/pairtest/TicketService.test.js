import InvalidPurchaseException from "../../src/pairtest/lib/InvalidPurchaseException.js";
import TicketService from "../../src/pairtest/TicketService.js";
import SeatReservationService from "../../src/thirdparty/seatbooking/SeatReservationService.js";
import TicketPaymentService from "../../src/thirdparty/paymentgateway/TicketPaymentService.js";

// required import to enable full usage of jest mocks against ES6 modules
import { jest}  from "@jest/globals"

import * as testdata from "./testdata";
import HelperService from "../../src/pairtest/utils/HelperService";

describe("TicketService", () => {
    let mockSeatReservationService, mockTicketPaymentService;

    const testTicketService =  new TicketService(new HelperService(), new SeatReservationService(), new TicketPaymentService());
    beforeEach(() => {
        // reset any previous mock and mock the appropriate services anew
        jest.clearAllMocks();  
        mockTicketPaymentService = jest.spyOn(TicketPaymentService.prototype, "makePayment");
        mockSeatReservationService = jest.spyOn(SeatReservationService.prototype, "reserveSeat");
    })
    test("should take payment, book seat and return succesful if an adult request present", () => {
        const result = testTicketService.purchaseTickets(testdata.goodAccountNum,testdata.familyReq);  
        expect(mockTicketPaymentService).toHaveBeenCalledWith(1200, 55);
        expect(mockSeatReservationService).toHaveBeenCalledWith(1200,3);
        expect(result.message).toEqual("Reservation for 4 (3 seats) at cost 55");
        expect(result.status).toEqual(200);        
    })

    test("should take payment, book seat and return succesful for exactly 25 ticket requests", () => {
        const result = testTicketService.purchaseTickets(testdata.goodAccountNum,[testdata.twentyFiveAdultsReq]);
        expect(mockTicketPaymentService).toHaveBeenCalledWith(1200, 625);
        expect(mockSeatReservationService).toHaveBeenCalledWith(1200, 25);
        expect(result.message).toEqual("Reservation for 25 (25 seats) at cost 625");
        expect(result.status).toEqual(200);
    })

    test("should not call booking services if no adult request present", () => {
        expect(() => {
            testTicketService.purchaseTickets(testdata.goodAccountNum, [testdata.twoChildReq]);
        }).toThrow("Error during booking: InvalidPurchaseException: Request did not contain the required number of adults");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled();        
    });

    test("should throw error and not call booking services if too many seats requested", () => {
        expect(() => {
            testTicketService.purchaseTickets(testdata.goodAccountNum, [testdata.twentyFiveAdultsReq, testdata.oneInfantReq]);
        }).toThrow("Error during booking: InvalidPurchaseException: Booking cannot exceed the maximum limit of 25");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled(); 
                
    });

    // Testing that zero and negative bookings are prevented
    test("should throw error and not call booking services if no seats requested", () => {
        expect(() => {
            testTicketService.purchaseTickets(testdata.goodAccountNum, [testdata.zeroAdultReq]);
        }).toThrow("Error during booking: InvalidPurchaseException: Request did not contain the required number of adults");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled(); 
    });

    test("should throw error and not call booking services if negative seats requested", () => {
        expect(() => {
            testTicketService.purchaseTickets(testdata.goodAccountNum, [testdata.negativeAdultReq]);
        }).toThrow("Error during booking: InvalidPurchaseException: Request did not contain the required number of adults");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled(); 
    });

    test("should throw error and not call booking services if account number is not an integer", () => {
        expect(() => {
            testTicketService.purchaseTickets(testdata.stringAccountNum, [testdata.oneAdultReq]);
        }).toThrow("Error during booking: InvalidPurchaseException: Invalid account ID provided");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled();        
    });

    test("should throw error and not call booking services if account number is zero", () => {
        expect(() => {
            testTicketService.purchaseTickets(0, [testdata.oneAdultReq]);
        }).toThrow("Error during booking: InvalidPurchaseException: Invalid account ID provided");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled();         
    });

    test("should throw error and not call booking services if account number is below zero", () => {
        expect(() => {
            testTicketService.purchaseTickets(-1, [testdata.oneAdultReq]);
        }).toThrow("Error during booking: InvalidPurchaseException: Invalid account ID provided");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled();          
    });

    test("with random failure in external seat reservation service it should handle and propagate error", () => {

        mockSeatReservationService.mockImplementation(() => {
            throw new Error("User not found");
        });

        expect(() => {
            testTicketService.purchaseTickets(testdata.goodAccountNum, [testdata.oneAdultReq]);
        }).toThrow(new InvalidPurchaseException("Error during booking: finaliseBooking error: seat booking failure: User not found"));
        expect(mockTicketPaymentService).toHaveBeenCalled();
        expect(mockSeatReservationService).toHaveBeenCalled();   
    });

    test("with random failure in external ticket payment service it should handle and propagate error and not reserve seats", () => {
        mockTicketPaymentService.mockImplementation(() => {
            throw new Error("User not found");
          });

        expect(() => {
            testTicketService.purchaseTickets(testdata.goodAccountNum, [testdata.oneAdultReq]);
        }).toThrow("Error during booking: finaliseBooking error: payment failure: User not found");
        expect(mockTicketPaymentService).toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled(); 
    });

    test("with failure in ticket service it should throw error and not request payment or reserve seats", () => {
        const myFakeTicketService = jest.spyOn(TicketService.prototype, "purchaseTickets");
        myFakeTicketService.mockImplementation(() => {
            throw new Error("Fake internal error");
        });
        
        expect(() => {
            testTicketService.purchaseTickets(testdata.goodAccountNum, [testdata.oneAdultReq]);
        }).toThrow("Fake internal error");
        expect(mockTicketPaymentService).not.toHaveBeenCalled();
        expect(mockSeatReservationService).not.toHaveBeenCalled();   
    });

})
