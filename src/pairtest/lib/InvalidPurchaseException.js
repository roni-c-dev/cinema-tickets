export default class InvalidPurchaseException extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidPurchaseException"; // Set the name for the error
    }   
}
