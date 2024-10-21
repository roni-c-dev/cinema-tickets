import SeatReservationService from "../../src/thirdparty/seatbooking/SeatReservationService";

describe("SeatReservationService", () => {
    const SEAT_RESERVATION_SERVICE = new SeatReservationService();

    describe("Success scenarios", () => {
        test.each([
            [123, 40],
            [123, 0],
            [123, -1]
        ])(
            "it should not error if request made with good accountID %i and valid integer seat requirement %i",
            (accountId, totalSeatsToAllocate) => {
                expect(() => {
                    SEAT_RESERVATION_SERVICE.reserveSeat(accountId, totalSeatsToAllocate);
                }).not.toThrow();
            }
        )
    });

    describe("Failure scenarios", () => {
        test.each([
            ["ONE", 50, "string"],
            [null, 50, "null"],
            [undefined, 50, "undefined"],
            ["898", 50, "898 as string"]
        ])(
            "it should throw error if request made with bad accountID %j and valid integer payment amount %j (%j)",
            (accountId, totalSeatsToAllocate) => {
                expect(() => {
                    SEAT_RESERVATION_SERVICE.reserveSeat(accountId, totalSeatsToAllocate);
                }).toThrow(new TypeError("accountId must be an integer"));
            }
        );

        test.each([
            [123, "FIFTY", "string"],
            [123, null, "null"],
            [123, undefined, "undefined"],
            [123, "50", "number as string"],
            [123, 1.1, "float "]
        ])(
            "it should throw error if request made with good accountID %j and invalid payment amount %j (%j)",
            (accountId, totalAmountToPay) => {
                expect(() => {
                    SEAT_RESERVATION_SERVICE.reserveSeat(accountId, totalAmountToPay);
                }).toThrow(new TypeError("totalSeatsToAllocate must be an integer"));
            }
        );
    });
});
