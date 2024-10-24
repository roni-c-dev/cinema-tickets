import InvalidPurchaseException from "./lib/InvalidPurchaseException";
import TicketTypeRequest from "./lib/TicketTypeRequest";
import logger from "./utils/Logger";

export default class TicketService {

  // Use dependency injection so that these components can be changed at will
  constructor(helperService, seatReserver, paymentService) {
    this.HELPER_SERVICE = helperService;
    this.SEAT_RESERVER = seatReserver;
    this.PAYMENT_SERVICE = paymentService;
  }

  /**
   * Check account validity using HelperService
   * Return true if valid or throw an error
   * @param { Integer } accountId 
   * @returns true
   * @throws { InvalidPurchaseException }
   */
  #isAccountIDValid = (accountId) => {
    if (!this.HELPER_SERVICE.hasValidAccountID(accountId)) {
      logger.log({
        message: "Ticket request accountID threw an exception",
        level: "error"
      })
      throw new InvalidPurchaseException("Invalid account ID provided")
    } else return true
  }

  /**
   * Check adult count validity using HelperService
   * Return true if valid or throw an error
   * @param { [TicketTypeRequest] } ticketTypeRequests 
   * @returns true
   * @throws { InvalidPurchaseException }
   */
  #hasValidAdultNumberInBooking = (ticketTypeRequests) => {
    if (!this.HELPER_SERVICE.hasValidAmountOfAdultsPresent(ticketTypeRequests)){
      logger.log({
        message: "Ticket request adult check threw an exception",
        level: "error"
      })
      throw new InvalidPurchaseException("Request did not contain the required number of adults")
    } else return true
  }

  /**
   * Check overall count validity using HelperService
   * Return true if within limits (provided in HelperService) or throw an error
   * @param { [TicketTypeRequest] } ticketTypeRequests 
   * @returns true
   * @throws { InvalidPurchaseException }
   */
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

  /**
   * Checks overall validity calling each of the services
   * @param { Integer } accountId 
   * @param { [TicketTypeRequest] } ticketTypeRequests 
   * @returns true or throws error via the functions being called
   */

  #isRequestValid = (accountId, ticketTypeRequests) => {
    if ((this.#hasValidAdultNumberInBooking(ticketTypeRequests)) && 
        (this.#isAccountIDValid(accountId)) && this.#validateTicketCountInRequest(ticketTypeRequests)){
      return true
    } else return false
  }

  /**
   * Calls the external TicketPaymentService to make a booking
   * @param { Integer } accountId 
   * @param { Integer } totalAmountToPay
   * @throws { InvalidPurchaseException }
   */
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

  /**
   * Calls the external SeatReservationService to complete booking after payment is made
   * @param { Integer } accountId 
   * @param { Integer } totalSeatsToAllocate 
   * @throws { InvalidPurchaseException }
   */
  #reserveSeats = (accountId, totalSeatsToAllocate) => {
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

  /**
   * Calls HelperService to establish booking details required
   * Calls PaymentServivce to request payment, then SeatReservationService to reserve seats
   * @param { Integer } accountId 
   * @param  {...any} ticketTypeRequests 
   * @returns { Object } structured JSON object with HTTP status code and message
   * @throws { InvalidPurchaseException }
   */
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

  /**
   * Calls internal private functions to make booking
   * Details of business logic on validity and booking process remain private
   * @param { Integer } accountId 
   * @param  {...any} ticketTypeRequests 
   * @returns { Object } returns structured object via internal private calls
   * @throws { InvalidPurchaseException }
   */
  purchaseTickets(accountId, ...ticketTypeRequests) {
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
