# express-authentication
This is a project to create a basic authentication using passport, express-session, bcrypt and ejs. 

## Express-session 

Express-session is a HTTP server-side framework used to create and manage a session middleware. When the client makes a login request to the server, the server will create a session and store it on the server-side with a unique session ID. 

When the server responds to the client's request, it sends a cookie which contains the session ID. The client will then store the cookie as session cookies. (Note: client only stores session ID and attaches it to each subsequent HTTP requests to the server, the server stores the session *data*

Once stored in the client-side, the cookie will persist until the browser is closed or the cookie expires. 
