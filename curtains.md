<h1>Curtains</h1>

[Back to readme](README.md)

The `<Curtains></Curtains>` component is responsible for the creation of the WebGL context. It will act as a wrapper for the curtains.js <a href="https://www.curtainsjs.com/curtains-class.html">Curtains class</a>.

This component will create a React context that will be used in the custom `useCurtains` and `useCurtainsEvent` hooks onto which the other components rely.

**Do not try to create a `react-curtains` component or use one of those hooks outside this component or your app will crash.**

For all those reasons, you should always wrap your application, including additional context providers and routing inside the `<Curtains></Curtains>` component.

#### Usage

```jsx
import ReactDOM from 'react-dom';
import React from 'react';
import {Curtains} from 'react-curtains';
import App from 'App';

ReactDOM.render(
    <Curtains>
        <App />
    </Curtains>,
    document.getElementById('root')
);
```

#### Properties

Except for the container, which will be set internally, you can pass any of the <a href="https://www.curtainsjs.com/curtains-class.html#curtains-init-params">Curtains class parameters</a> as a React prop to your component.
Also note that the `production` property is set to `false` on development and `true` on production environments by default.

You can also use React props and events like `className` or `onClick`. They can be used to style your canvas container and listen to events:

```jsx
<Curtains
    className="canvas"
    pixelRatio={Math.min(1.5, window.devicePixelRatio)}
    antialias={false}
>
    <App />
</Curtains>
```

#### Events

You can also pass as props a function to execute for each corresponding <a href="https://www.curtainsjs.com/curtains-class.html#events">Curtains class events</a>. You'll have access to your `curtains` instance inside all of them.

```jsx
function MainCurtains() {

    const onCurtainsError = (curtains) => {
        console.log("on error!", curtains);
    };
    
    const onCurtainsRender = (curtains) => {
        console.log("on render!", curtains);
    };
    
    return (
        <Curtains
            className="canvas"
            pixelRatio={Math.min(1.5, window.devicePixelRatio)}
            antialias={false}
            
            onRender={onCurtainsError}
            onRender={onCurtainsRender}
        >
            <App />
        </Curtains>
    );
}
```

#### Unmounting

Even tho this should not happen in most use case, the WebGL context will be disposed each time this component will unmount.