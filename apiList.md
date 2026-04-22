# DevTinder API

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

## connectionRequestRouter
- POST /request/send/:status/:toUserId
- POST /request/review/:status/:requestId


<!-- - POST /request/send/ignored/:userId -->
<!-- - POST /request/send/interested/:userId -->
<!-- - POST /request/review/accepted/:requestId -->
<!-- - POST /request/review/rejected/:requestId -->
<!-- - POST /request/review/blocked/:userId -->
<!-- - POST /request/review/reported/:userId -->

## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed

Status - ignored, interested, accepted and rejected
