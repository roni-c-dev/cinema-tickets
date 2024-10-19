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
            ["ONE", 50],
            [null, 50],
            [undefined, 50],
            ["898", 50]
        ])(
            "it should throw error if request made with bad accountID %i and valid integer payment amount %i",
            (accountId, totalSeatsToAllocate) => {
                expect(() => {
                    SEAT_RESERVATION_SERVICE.reserveSeat(accountId, totalSeatsToAllocate);
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
                    SEAT_RESERVATION_SERVICE.reserveSeat(accountId, totalAmountToPay);
                }).toThrow(new TypeError("totalSeatsToAllocate must be an integer"));
            }
        );
    });
});
