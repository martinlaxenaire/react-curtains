<h1>ShaderPass</h1>

[Back to readme](README.md)

The `<ShaderPass />` component will create a WebGL ShaderPass (using a RenderTarget object), acting as a wrapper for the curtains.js <a href="https://www.curtainsjs.com/shader-pass-class.html">ShaderPass class</a>.

#### Usage

```jsx
import ReactDOM from 'react-dom';
import React from 'react';
import {ShaderPass} from 'react-curtains';

function BasicShaderPass() {
    return (
        <ShaderPass />
    );
}
```

#### Properties

##### Regular parameters & properties

You can pass any of the <a href="https://www.curtainsjs.com/shader-pass-class.html#shader-pass-parameters">ShaderPass class parameters</a> as a React prop to your component.

```jsx
// assuming passVs, passFs and passUniforms are defined above

<ShaderPass
    vertexShader={passVs}
    fragmentShader={passFs}
    uniforms={passUniforms}
    clear={false}
/>
```

##### uniqueKey property

When dealing with selective passes (ie: apply a shader pass to a bunch of planes, not all of them), it may be easier to add your render target and shader pass inside a loop. Just like with the `<RenderTarget />` you can pass an additional `uniqueKey` prop to your `<ShaderPass />` component and it will be created just once.



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
                        uniqueKey="planesPass" // optional, will be set to "planesRenderTarget" if not specified
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

Note that this prop is optional: if the parent `<RenderTarget />` component has its `autoDetectChildren` prop set to true (which is by default), it can inherit from its `uniqueKey` prop as well.

#### Events

You can also pass as a prop a function to execute for each corresponding <a href="https://www.curtainsjs.com/shader-pass-class.html#events">ShaderPass class events</a>. You'll have access to the corresponding `shaderPass` instance inside all of them.

```jsx
import ReactDOM from 'react-dom';
import React from 'react';
import {ShaderPass} from 'react-curtains';

function BasicShaderPass() {
    
    const onPassReady = (shaderPass) => {
        console.log("shader pass is ready", shaderPass);
    };
    
    const onPassRender = (shaderPass) => {
        console.log("on shader pass render!", shaderPass);
    };

    return (
        <ShaderPass
            onReady={onPassReady}
            onRender={onPassRender}
        />
    );
}
```

#### Unmounting

Each time the `<ShaderPass />` component will unmount, the corresponding WebGL shaderpass and its associated render target element will be automatically disposed.