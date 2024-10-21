import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest";

export const zeroAdultReq = new TicketTypeRequest("ADULT", 0);
export const negativeAdultReq = new TicketTypeRequest("ADULT", -1);
export const oneAdultReq = new TicketTypeRequest("ADULT", 1);
export const twoChildReq = new TicketTypeRequest("CHILD", 2);
export const oneInfantReq = new TicketTypeRequest("INFANT", 1);
export const twoInfantReq = new TicketTypeRequest("INFANT", 2);
export const twentyFiveAdultsReq = new TicketTypeRequest("ADULT", 25);
export const exponentialAdultsReq = new TicketTypeRequest("ADULT", 123e3)
export const familyReq = [oneAdultReq, twoChildReq, oneInfantReq];
export const bigFamilyReq = [oneAdultReq,twoChildReq, twoInfantReq];
export const familyTooBigReq = [twentyFiveAdultsReq, oneInfantReq];
export const childrenAndInfantsWithZeroAdultReq = [zeroAdultReq, twoChildReq, twoInfantReq];
export const goodAccountNum = 1200;
export const stringAccountNum = "One";
