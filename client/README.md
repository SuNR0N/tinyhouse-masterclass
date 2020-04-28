This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### `npm run codegen:schema`

Generates the _GraphQL_ schema of the server project as [schema.json](schema.json).

### `npm run codegen:generate`

Generates the _TypeScript_ interfaces using the available JSON schema definition.

### `npm run codegen`

Generates the _GraphQL_ schema of the server project and based on that the _TypeScript_ interfaces that the client code should use based on its currently implemented queries.

## Learn More

-   React - https://reactjs.org/
-   Create React App - https://facebook.github.io/create-react-app/docs/getting-started
-   GraphQL - https://graphql.org
-   Ant Design - https://ant.design
-   TypeScript - https://www.typescriptlang.org
-   Apollo CLI - https://www.apollographql.com/docs/devtools/cli/
-   React Apollo - https://www.apollographql.com/docs/react/api/react-apollo/
-   Jest - https://jestjs.io

## TODO

-   [ ] -   Replace icons
-   [ ] -   Enhance styles (units, variables, etc.)
-   [ ] -   Add unit tests
-   [ ] -   Add linting and prettier
-   [ ] -   Modularize
-   [ ] -   Create ViewerContext
-   [ ] -   Generate JS classnames from SCSS
-   [ ] -   Create constants for texts
-   [ ] -   Remove inline styles
-   [ ] -   Fix programmatic clearing of datepickers
-   [ ] -   Remove unused styles
-   [ ] -   Update README
-   [ ] -   Rename component files from index to their actual names
-   [ ] -   Use router hooks
-   [ ] -   Implement usePrevious hook
-   [ ] -   Externalise utility functions
