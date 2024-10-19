# Cinema Tickets
A simple NodeJS module to handle ticket booking
NOTE - REQUIRES NODE VERSION ^20

## Business Rules
Currently 3 types of ticket allowed, (ADULT, CHILD, INFANT)
An adult must be present on every booking
Ticket booking limit is 25 per request
Current Prices (ADULT = 25, CHILD = 15, INFANT = 0)
Infants currently free but must sit on an adult lap

## Error handling
Throws TypeError for invalid accountIDs
Throws InvalidPurchaseException for 

## Developer Assumptions
It is assumed that each infant will sit on a single adult lap

## How to use this module
To begin - clone the repo and run npm install to install required dependencies
To run unit tests - npm test
