# Event Management API  

The Event Management API is a RESTful service that allows to create, manage, and track events and user registrations. It provides a set of endpoints for handling the entire event lifecycle, including creating events, registering users, listing upcoming events, and viewing event status.  

---  

## Setup Instructions  
1. Clone the Repository  
git clone https://github.com/Mansi-prasad/Event-Management-API  
cd Event-Management-API  

2. Install dependencies  
npm install  

3. Configure environment variables  
Create a .env file in the root directory like .env-sample file and fill the details  

4. Run the server  
npm run server  

---  

## 📚 API Description  
The Event Management API provides endpoints to:  
* Create a new event  
* Get event details(returns all event data with registerd users)  
* Register a user for an event  
* Cancel a user's registration  
* List upcomming events  
* Check the event's status  

---  

## 🚀 API Endpoints (Example requests/responses)  
1. Create Event  
Request:  
`POST /api/events`  
`Content-Type: application/json`  
```json
{
  "title": "Conference 2025",
  "event_datetime": "2025-11-15T09:00:00Z",
  "location": "Grand Hall",
  "capacity": 300
}  
```

Response(Success):  
```json 
{
  "eventId": 4
}  
```
Response(Validation Error - Capacity > 1000):  
```json
{
  "success": false,
  "error": "Capacity must be between 1 and 1000."
}  
```

2. Get Event Details  
Request:  
`GET /api/events/2 `

Response:  
```json
{
  "id": 2,
  "title": "Tech Conference 2025",
  "event_datetime": "2025-11-15T09:00:00.000Z",
  "location": "Grand Hall",
  "capacity": 300,
  "registrations": [
      {
        "id": 1,
        "name": "Alice Smith",
        "email": "alice@example.com"
      }
    ]
}  
```

3. Register for Event  
Request:  
`POST /api/events/1/register` 
`Content-Type: application/json`  
```json
{
  "user_id": 1
}  
```
Response(Success):  
```json
{
  "success":true,
  "message": "Registration successful."
} 
``` 
Response (Duplicate Registration):  
```json
{
  "success": false,
  "error": "User is already registered for this event."
}  
```
Response(Event full):  
```json
{
  "success": false,
  "error": "Event capacity has been reached."
}  
```
Response (Past Event):  
```json
{
  "success": false,
  "error": "Cannot register for past events."
}  
```

4. Cancel Registration  
Request:  
`DELETE /api/events/1/cancel`
`Content-Type: application/json`  
```json
{
  "user_id": 1
}
```
Response (Success):  
```json
{
  "success": true,
  "message": "Registration cancelled."
}  
``` 
Response (User not registered):  
```json
{
  "success": false,
  "error": "User is not registered for this event."
}  
```

5. List Upcoming Events  
Request:  
`GET /api/events`

Response: 
```json 
[
  {
    "id": 1,
    "title": "Tech Conference 2025",
    "event_datetime": "2025-11-15T09:00:00.000Z",
    "location": "Grand Hall",
    "capacity": 300
    },
    {
      "id": 2,
      "title": "Tech Conference 2025",
      "event_datetime": "2025-11-15T09:00:00.000Z",
      "location": "Grand Hall",
      "capacity": 300
    }
]  
```

6. Event Status:  
Request:  
`GET /api/events/2/status`  

Response:  
```json
{
  "success": true,
  "totalRegistrations": 1,
  "remainingCapacity": 299,
  "percentageUsed": "0.33%"
}  
```