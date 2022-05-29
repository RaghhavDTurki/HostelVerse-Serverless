
## HostelVerse


HostelVerse is a Hostel Management System, which aims to digitize and automate the daily and monotonic tasks that a Hostel Warden or Caretaker does. 


## Features

- Sign up for students using their college email id
- Automated Hostel Allotment Prodcedure, based on higher priority to the farthest students
- Creating Leave Applications, Room Issues that the warden can Resolve/Approve/Reject online
- Statistics for Admin, like Hostel Occcupancy Rate, Issue Clearance Rate for Wardens
- Create Feedback for the hostels and give them rating
- Location based Check In/Check Out for monitoring attendence of Students


## Tech Stack for Backend

- [Azure Functions] - Serverless Backend Technology
- [Typescript]    
- [Azure CosmosDB API for MongoDB] - A gloabally distributed database hosted on Azure
- [Sentry] - Application monitoring and error tracking software
- [@hapi/iron] - A more secure protocol for encrypting data in form of tokens
- [Mongoose] 

## Documentation
I have created a OpenAPI v3.0.0 complaint API and have documented the same using Swagger Docs and have hosted the docs on Heroku.



## Installation

The project requires Node.js 16.x LTS version to run

Install the dependencies and devDependencies and start the server.

```sh
cd HostelVerse-Serverless
npm i
npm start
```


## Future Milestones
- Integrate a payment gatweay like Stripe, Razorpay for students to pay their hostel fees
- Chat with Warden: Students should be able to chat with the warden in case of any urgent matters 
- Emergency Beacon: Students can use the emergency becon to send a distress seignal to the emergency services present at the campus


## License

MIT

**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

   [Azure Functions]: <https://azure.microsoft.com/en-in/services/functions/r>
   [Typescript]: <https://www.typescriptlang.org/>
   [Sentry]: <https://sentry.io/>
   [Azure CosmosDB API for MongoDB]: <https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb/mongodb-introduction>
   [@hapi/iron]: <https://hapi.dev/module/iron/>
   [Mongoose]: <https://mongoosejs.com/>
