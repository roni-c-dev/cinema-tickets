import InvalidPurchaseException from "./lib/InvalidPurchaseException";
import logger from "./utils/Logger";

export default class TicketService {

  constructor(helperService, seatReserver, paymentService) {
    this.HELPER_SERVICE = helperService;
    this.SEAT_RESERVER = seatReserver;
    this.PAYMENT_SERVICE = paymentService;
  }

  #isAccountIDValid = (accountId) => {
    if (!this.HELPER_SERVICE.hasValidAccountID(accountId)) {
      logger.log({
        message: "Ticket request accountID threw an exception",
        level: "error"
      })
      throw new InvalidPurchaseException("Invalid account ID provided")
    } else return true
  }

  #hasValidAdultNumberInBooking = (ticketTypeRequests) => {
    if (!this.HELPER_SERVICE.hasValidAmountOfAdultsPresent(ticketTypeRequests)){
      logger.log({
        message: "Ticket request adult check threw an exception",
        level: "error"
      })
      throw new InvalidPurchaseException("Request did not contain the required number of adults")
    } else return true
  }

  #validateTicketCountInRequest = (ticketTypeRequests) => {
    const ticketCount = this.HELPER_SERVICE.countTicketsInRequest(ticketTypeRequests)
    const MAXIMUM_TICKET_LIMIT = this.HELPER_SERVICE.MAXIMUM_TICKET_LIMIT;
    if (ticketCount > MAXIMUM_TICKET_LIMIT){
      logger.log({
        message: "Ticket count exceeded provided limit and threw an exception",
        level: "error"
      })
      throw new InvalidPurchaseException(`Booking cannot exceed the maximum limit of ${MAXIMUM_TICKET_LIMIT}`);
    } else return true;
  }

  #isRequestValid = (accountId, ticketTypeRequests) => {
    if ((this.#hasValidAdultNumberInBooking(ticketTypeRequests)) && 
        (this.#isAccountIDValid(accountId)) && this.#validateTicketCountInRequest(ticketTypeRequests)){
      return true
    } else return false
  }

  #makePayment = (accountId, totalAmountToPay) => {
    try {
      this.PAYMENT_SERVICE.makePayment(accountId, totalAmountToPay);
      logger.log({
        message: "Successful payment",
        level: "info"
      })
    } catch (err) {
      logger.log({
        message: "Error occurred in payment service",
        level: "error"
      });
      throw new InvalidPurchaseException("payment failure: " + err.message);
    }
  }

  #reserveSeats = (accountId, totalSeatsToAllocate) => {
    console.log("deets", accountId, totalSeatsToAllocate)
    try {
      this.SEAT_RESERVER.reserveSeat(accountId, totalSeatsToAllocate);
      logger.log({
        message: "Successful payment",
        level: "info"
      })
    } catch (err) {
      logger.log({
        message: "Error occurred in seat reservation service",
        level: "error"
      });
      throw new InvalidPurchaseException("seat booking failure: " + err.message);

    }
  }

  #finaliseBooking = (accountId, ...ticketTypeRequests) => {
    try {
      const totalAmountToPay = this.HELPER_SERVICE.calculatePayment(...ticketTypeRequests);
    const totalSeatsToAllocate = this.HELPER_SERVICE.countSeatsInRequest(...ticketTypeRequests);
    const totalNumberInBooking = this.HELPER_SERVICE.countTicketsInRequest(...ticketTypeRequests);

    this.#makePayment(accountId, totalAmountToPay);
    this.#reserveSeats(accountId, totalSeatsToAllocate);
    
    logger.log({
      message: "Payment and reservation completed successfully",
      level: "info"
    })
    return {
      status: 200,
      message: `Reservation for ${totalNumberInBooking} (${totalSeatsToAllocate} seats) at cost ${totalAmountToPay}`
    }
    } catch (err) {
      logger.log({
        message: "An error occurred in finaliseBooking",
        level: "error"
      })
      throw new InvalidPurchaseException("finaliseBooking error: " + err.message);
    }
    
    
  }
  /**
   * Should only have private methods other than the one below.
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    try {
      if (this.#isRequestValid(accountId, ...ticketTypeRequests)){
        return this.#finaliseBooking(accountId, ...ticketTypeRequests)
      }
    } catch (err) {
      logger.log({
        message: "An error was thrown while booking",
        level: "error"
      })
      throw new InvalidPurchaseException("Error during booking: " + err.message)
    };
  }
}
