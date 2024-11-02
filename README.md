
# Survivor-Fantasy-League-Backend


Understanding the folder structure chosen:
src: Contains all the source code of the application.
app.js: The main entry point of your application. It initializes the server, sets up middleware, and defines the routes.
config: Stores configuration files for different environments, database connections, API keys, etc.
controllers: Contains the logic for handling incoming requests, validating data, and interacting with the models and services.
middleware: Houses custom middleware functions for authentication, logging, error handling, etc.
models: Defines data models (if using an ORM like Mongoose or Sequelize) to represent data structures and interact with the database.
routes: Defines the API routes and their corresponding controllers.
services: Contains the business logic for the application, such as fetching data, processing data, and interacting with external APIs.
utils: Stores utility functions for general-purpose tasks.
tests: Contains test files for unit testing, integration testing, etc.
.env: Stores environment variables for managing sensitive data and configuration settings.
package.json: Defines project dependencies and scripts.
README.md: Provides documentation about the project.