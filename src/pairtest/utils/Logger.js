 import * as winston from "winston";
 const logConfig = {
   "transports": [
     new winston.transports.Console()
   ]
 }
 const logger = winston.createLogger(logConfig);

 export default logger