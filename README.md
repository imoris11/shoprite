## SHOPRITE
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm install` or `yarn install`
Install all the dependencies of the application.

### `npm start` or `yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Folder Structure
All the components are located in `src/Components`. Each component is placed in its own folder (e.g `Home` folder for `Home` component). All secondary/supporting components are contained in the same folder as their parent component. However, `Timestamp` and `Loading` are used multiple over several components and as such can be found in the `Extra` folder under `Components`.
<br>

Each file exports ONLY ONE component. <br>
CamelCase is the primary naming convention for methods while underscores are used for data (variables) retrieved from the server.  

## Learn More (Packages)

### Material UI and Bootstrap
Used for presentation of the frontend

### React Stripe Checkout
[See here](https://www.npmjs.com/package/react-stripe-checkout) for more information. <br>
This package provides a "Checkout" implementation of stripe. Another options for stripe implementation was stripe elements. The package requires just a public key (PK), and a callback function that accepts the token generated by the card.
### Card Details for Payment
Card No: 4242424242424242<br>
CVV: 123<br>
Date: 12/23 <br>

### Moment
[See here](https://momentjs.com/) for more information. <br>
This package is used to convert UNIX timestamps returned by the server to relative time (** mins ago).It is also used to format UNIX times to specific formats (DD/MM/YYYY etc)

### React Router Dom
[See here](https://www.npmjs.com/package/react-router-dom) for more information.<br>
Used primarily for app navigation. <br>

### React Toastify
[See here](https://github.com/fkhadra/react-toastify) is used for showing status messages to the user.

## Learn More (APIs)

### Turing APIs
[See here](https://backendapi.turing.com/docs/#/) for all API endpoints.

### Local Storage (Offline first approach)
Local storage was used to store persistent data throughout the life cycle of the application. Design choices were made in favor of local storage over accessing the endpoints when possible. <br><br>
