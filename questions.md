### 1. What is the difference between Component and PureComponent? give an example where it might break my app.
By default, both Class and Functional components re-renders when the parent component re-render. That's one of the reasons why we should keep the state as close as possible from the components that needs it. But with PureComponents, children components only re-render if the props change. This is quite useful to improve performance, but could cause some issues. The most common is caused by having a Component, child of a PureComponent.

### 2. Context + ShouldComponentUpdate might be dangerous. Can think of why is that?
When the Context Provider value changes, it forces the consumers to re-render, even if a consumer implements ShouldComponentUpdate.

### 3. Describe 3 ways to pass information from a component to its PARENT.
1) Using a callback. The child component receives a function defined by the parent.
2) Using contexts. It's common to use it to prevent prop drilling, but one of the benefits is also how simple it is to pass information between components (it could also be an issue).
3) Using libraries like Redux, MobX

### 4. Give 2 ways to prevent components from re-rendering.
- Memoization: avoid re-renders by returning the same value, if the dependencies haven't changed. Also prevent some hooks to run unnecessarily, because of value stability.
- Using ref: components will re-render if the state changes, but not if the ref changes.

### 5. What is a fragment and why do we need it? Give an example where it might break my app.
Sometimes we need a component to return an Array of components, or maybe we need a div and a label at the same DOM level. JSX doesn't support that, we need to create a parent element to encapsulate them. It could be an HTML element like a DIV, or a **Fragment**. Unlike DIVs, Fragments don't become part of the DOM, so if a container is needed for layout purposes, is good to have that in mind.

### 6. Give 3 examples of the HOC pattern.
```js
const withDarkMode = (Component) => {
  return (props) => {
    const isDarkModeEnabled = localStorage.getItem('darkMode') === 'true';
    return <Component darkMode={isDarkModeEnabled} {...props} />
  }
}

const Button = ({ darkMode }) => {
  return (
    <button style={{ background: darkMode ? 'black' : 'white' }} type="submit">Send</button>
  )
}

return withDarkMode(Button)
```

### 7. what's the difference in handling exceptions in promises, callbacks and async...await.
There are two ways to handle errors using promises.
- Using catch: Promises are objects that encapsulates asynchronous tasks. This object has a method called `catch` that could be used to handle exceptions. This error is not thrown by default, so in this case, it won't break your app (but could cause some inconsistencies)
- Using async/await: in this case we're waiting for the promise to resolve. And if an error occurs, it will be thrown, and it's possible to handle it with a try/catch clause.

Callbacks are also thrown, so we need try/catch blocks. React also has ErrorBoundaries, that could prevent errors to be thrown and break the application.

### 8. How many arguments does setState take and why is it async.
It takes 2 arguments
1) An object or function to set the new state
2) A callback that is called after the state change
g
setState is async to avoid performance issue, like leaving the page unresponsive. Changing the state could be a simple or a complex operation, and internally react tries to batch some calls. 

### 9. List the steps needed to migrate a Class to Function Component.
- Change the class keyword to function and remove the extension from React.Component or PureComponent
- Content inside render method, should be the function return
- Remove the constructor, and the initial state could be migrated to useState
- setState calls should be converted to useState. If you decide to use a single state object, it's important to remember that they work differently
  - this.setState({ value: 1 }) should look like setState((state) => ({ ...state, value: 1 }))
- Migrate class lifecycles to hooks
  - componentDidMount, componentDidUpdate and componentWillUnmount -> useEffect or useLayoutEffect (DOM measures / layout updates)

### 10. List a few ways styles can be used with components.
- Using the `styles` prop
- Importing css/less/sass files and using classNames
- Using libraries like styled-components

### 11. How to render an HTML string coming from the server.
Using the `dangerouslySetInnerHTML` prop
