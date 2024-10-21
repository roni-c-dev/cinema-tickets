/**
 * External class for helper methods to allow for testability
 * and retain the business rules outside TicketService
 */

import TicketTypeRequest from "../lib/TicketTypeRequest";

export default class HelperService {
    MAXIMUM_TICKET_LIMIT = 25;
    ADULT_TICKET_PRICE = 25;
    CHILD_TICKET_PRICE = 15;
    INFANT_TICKET_PRICE = 0;

    /**
     * Is an adult present and the adult request not set to zero?
     * And are sufficient adults present for infants to sit on laps
     * @param { [TicketTypeRequest] } ticketTypeRequests 
     * @returns { Boolean }
     */
    hasValidAmountOfAdultsPresent (ticketTypeRequests, adultsRequested = 0, infantsRequested = 0) {
        ticketTypeRequests.forEach(req => {
            if (req.getTicketType() === "INFANT") infantsRequested += req.getNoOfTickets();
            if (req.getTicketType() === "ADULT") {
                adultsRequested += req.getNoOfTickets();
            }
        });
        if (adultsRequested === 0 || (adultsRequested < infantsRequested)) {
            return false
        } else return true
    };

    // hasValidAmountOfAdultsPresent(ticketTypeRequests) {
    //      if(ticketTypeRequests.find(getTicketType() === "ADULT")){
    //          return true
    //      } else return false
    //  }

    /**
     * accountID should be an integer greater than zero
     * @param { Integer } accountID 
     * @returns { Boolean }
     */
    hasValidAccountID (accountID) {
        if (Number.isInteger(accountID) && accountID > 0) {
            return true
        } else return false
    };

    /**
     * Count the number of tickets in the collection of requests
     * @param { [TicketTypeRequest] } ticketTypeRequests 
     * @param { {Integer} } ticketCount initialised to 0
     * @returns { Integer } ticketCount
     */
    countTicketsInRequest (ticketTypeRequests, ticketCount = 0) {
        ticketTypeRequests.forEach(req => {
            ticketCount += req.getNoOfTickets();
        })
        return ticketCount
    };

    /**
     * Count the number of seats required for the request
     * @param { [TicketTypeRequest] } ticketTypeRequests 
     * @param { Integer } seatCount 
     * @returns { Integer } seatCount
     */
    countSeatsInRequest (ticketTypeRequests, seatCount = 0) {
        ticketTypeRequests.forEach(req => {
            if (req.getTicketType() !== "INFANT") {
                seatCount += req.getNoOfTickets();
            }
        })
        return seatCount
    }
    
    /**
     * 
     * @param { [TicketTypeRequest] } ticketTypeRequests 
     * @param { Integer } totalAmountToPay 
     * @returns { Integer } totalAmountToPay
     */
    calculatePayment(ticketTypeRequests, totalAmountToPay = 0) {
        ticketTypeRequests.forEach(req => {
            switch(req.getTicketType()) {
                case "ADULT":
                  totalAmountToPay += this.ADULT_TICKET_PRICE * req.getNoOfTickets();
                  break;
                case "CHILD":
                  totalAmountToPay += this.CHILD_TICKET_PRICE * req.getNoOfTickets();
                  break;
                default:
                  totalAmountToPay += this.INFANT_TICKET_PRICE * req.getNoOfTickets(); // currently 0
              }
        })
        return totalAmountToPay;
    }

}