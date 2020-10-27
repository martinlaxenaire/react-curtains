<h1>RenderTarget</h1>

[Back to readme](README.md)

The `<RenderTarget />` component will create a WebGL RenderTarget (or Frame Buffer Object), acting as a wrapper for the curtains.js <a href="https://www.curtainsjs.com/render-target-class.html">RenderTarget class</a>.

#### Usage

```jsx
import ReactDOM from 'react-dom';
import React from 'react';
import {RenderTarget} from 'react-curtains';

function BasicRenderTarget({children}) {
    return (
        <RenderTarget>
            {children}
        </RenderTarget>
    );
}
```

#### Properties

##### Regular parameters & properties

You can pass any of the <a href="https://www.curtainsjs.com/render-target-class.html#parameters">RenderTarget class parameters</a> as a React prop to your component.

```jsx
<RenderTarget
    depth={false}
    clear={false}
>
    {children}
</RenderTarget>
```

##### uniqueKey property

Sometimes you'll want to apply your render target to multiple planes (usually combined with a [ShaderPass](shader-pass.md)), and it may be easier to add your render target inside a loop. You can pass an additional `uniqueKey` prop to your `<RenderTarget />` component and it will be created just once:

```jsx
import ReactDOM from 'react-dom';
import React from 'react';
import {RenderTarget, ShaderPass} from 'react-curtains';
import BasicPlane from './components/BasicPlane'; // a basic plane component

function SelectivePlanesPass({planeElements}) {
    return (
        <div>
            {planeElements.map((planeEl) => {
                <RenderTarget
                    uniqueKey="planesRenderTarget"
                >
                    <ShaderPass
                        uniqueKey="planesPass"
                    >
                        <BasicPlane
                            element={planeEl}
                        />
                    </ShaderPass
                </RenderTarget>
            })}
        </div>
    );
}
```

##### autoDetectChildren property

By default, the `<RenderTarget />` component will loop through all its children and assign itself as the `target` prop of all `<Plane />` and `<ShaderPass />` children it will found.

If you want to prevent this behaviour and handle this by yourself, just set its `autoDetectChildren` prop to false:

```jsx
<RenderTarget
    autoDetectChildren={false}
>
    {children}
</RenderTarget>
```

#### Event

The `<RenderTarget />` component provides an additional `onReady` event fired once the render target has been created: 

```jsx
import ReactDOM from 'react-dom';
import React from 'react';
import {RenderTarget} from 'react-curtains';

function BasicRenderTarget({children}) {

    const onRenderTargetReady = (renderTarget) => {
        console.log("render target is ready!", renderTarget);
        // you have access to the render target method here
        const renderTexture = renderTarget.getTexture();
    };

    return (
        <RenderTarget
            onReady={onRenderTargetReady}
        >
            {children}
        </RenderTarget>
    );
}
```

#### Unmounting

Each time the `<RenderTarget />` component will unmount, the corresponding WebGL render target element will be automatically disposed.