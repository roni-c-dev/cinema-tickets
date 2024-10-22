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
Throws TypeError for invalid accountIDs (TicketTypeRequest & external services)
Throws InvalidPurchaseException for 
* invalid accountId (forwarded from TypeError thrown by TicketTypeRequest)
* booking request without an adult present
* booking request with insufficient adults present for infants on 1>1 basis
* booking request that exceeds maximum limit
* failure in external services
* unhandled errors in TicketService (e.g. network error)

## Developer Assumptions/Notes
It is assumed that each infant will sit on a single adult lap
CI/CD pipeline below is currently working when PR from named branch to main is created
Developer has more familiarity with GitlabCI for CI/CD workflows - this is left in to showcase knowledge
of the purpose of CI/CD and provide a basic level of protection at this stage

## CI/CD Pipeline
A very simple Github Actions pipeline has been added to run unit tests on pull request to main, this can be updated to include various code quality and security checks, helping to prevent bugs and issues from entering the production environment.   Would also run further automated workflows here to push deployment artifacts to the relevant Cloud hosting platform (for example AWS)

## How to use this module
To begin - clone the repo and run `npm install` to install required dependencies
To run unit tests - `npm test`
