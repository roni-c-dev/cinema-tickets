import TicketPaymentService from "../../src/thirdparty/paymentgateway/TicketPaymentService";

describe("TicketPaymentService", () => {
    const TICKET_PAYMENT_SERVICE = new TicketPaymentService();

    describe("Success scenarios", () => {
        test.each([
            [123, 40],
            [123, 0],
            [123, -1]
        ])(
            "it should not error if request made with good accountID %i and valid integer payment amount %i",
            (accountId, totalAmountToPay) => {
                expect(() => {
                    TICKET_PAYMENT_SERVICE.makePayment(accountId, totalAmountToPay);
                }).not.toThrow();
            }
        )
    });

    describe("Failure scenarios", () => {
        test.each([
            ["ONE", 50, "string"],
            [null, 50, "null"],
            [undefined, 50, "undefined"],
            ["898", 50, "number as string"]
        ])(
            "it should throw error if request made with bad accountID %j and valid integer payment amount %j (%j)",
            (accountId, totalAmountToPay) => {
                expect(() => {
                    TICKET_PAYMENT_SERVICE.makePayment(accountId, totalAmountToPay);
                }).toThrow(new TypeError("accountId must be an integer"));
            }
        );

        test.each([
            [123, "FIFTY"],
            [123, null],
            [123, undefined],
            [123, "50"]
        ])(
            "it should throw error if request made with good accountID %j and invalid payment amount %j",
            (accountId, totalAmountToPay) => {
                expect(() => {
                    TICKET_PAYMENT_SERVICE.makePayment(accountId, totalAmountToPay);
                }).toThrow(new TypeError("totalAmountToPay must be an integer"));
            }
        );
    });
});
