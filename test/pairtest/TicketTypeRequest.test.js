import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest";

describe("TicketTypeRequest", () => {
    test.each([
        ["ADULTY", 1, "misspelled"],
        ["FROG", 1, "completely wrong type"],
        ["adult", 1, "lowercase"]
    ])(
        "constructor should throw error if request made with invalid type %j and valid integer 1 (%j)",
        (type, noOfTickets) => {
            expect(() => {
                new TicketTypeRequest(type, noOfTickets);
            }).toThrow("type must be ADULT, CHILD, or INFANT");
        }
    );

    test.each([
        ["ADULT", 1.1, "float"],
        ["CHILD", "ONE", "string"],
        ["INFANT", null, "null"],
        ["ADULT", undefined, "undefined"],
        ["ADULT", "123", "number as string"]
    ])(
        "constructor should throw error if request made with valid type %j and invalid noOfTickets %j (%j)",
        (type, noOfTickets) => {
            expect(() => {
                new TicketTypeRequest(type, noOfTickets);
            }).toThrow("noOfTickets must be an integer");
        }
    );
})