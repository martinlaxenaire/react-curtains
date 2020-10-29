<h1>react-curtains</h1>

react-curtains is an attempt at converting <a href="https://github.com/martinlaxenaire/curtainsjs">curtains.js</a> WebGL classes into reusable React components.

[![Version](https://img.shields.io/npm/v/react-curtains?style=flat&colorA=f5f5f5&colorB=f5f5f5)](https://npmjs.com/package/react-curtains)
[![Twitter](https://img.shields.io/twitter/follow/webdesign_ml?label=%40webdesign_ml&style=flat&colorA=f5f5f5&colorB=f5f5f5&logo=twitter&logoColor=000000)](https://twitter.com/webdesign_ml)

## Getting started

### Installation

Of course you'll need to create a React app first. Then, just add react-curtains into your project by installing the npm package:

```bash
npm install react-curtains
```

### Components

react-curtains introduces a bunch of components based on curtains.js classes:

- [Curtains](curtains.md)
- [Plane](plane.md)
- [RenderTarget](render-target.md)
- [ShaderPass](shader-pass.md)
- [PingPongPlane](ping-pong-plane.md)
- [FXAAPass](fxaa-pass.md)

In order for it to work, you'll need to wrap your `App` into the `Curtains` component. You'll be then able to use the other components to add WebGL objects to your scene.

### Hooks

Inside your `<Curtains />` component, you'll have access to a couple useful custom React hooks:

##### useCurtains

```javascript
useCurtains(callback, dependencies);
```

This hook is called once the curtains WebGL context has been created and each time one of the dependencies changed after that. Note that you'll have access to the `curtains` object in your callback.
As with a traditional React hook, you can return a function to perform a cleanup.

```javascript
useCurtains((curtains) => {
    // get curtains bounding box for example...
    const curtainsBBox = curtains.getBoundingRect();
});
```

##### useCurtainsEvent

```javascript
useCurtainsEvent(event, callback, dependencies);
```

This hook lets you subscribe to any of your <a href="https://www.curtainsjs.com/curtains-class.html#events">curtains instance events</a>, so you can use those events from any component in your app.

```javascript
useCurtainsEvent("onScroll", (curtains) => {
    // get the scroll values...
    const scrollValues = curtains.getScrollValues();
});
```

### Examples

#### Explore

Here are codesandboxes ports of some of the official documentation examples:

- <a href="https://codesandbox.io/s/react-curtains-basic-plane-h30ie">Basic plane</a>
- <a href="https://codesandbox.io/s/react-curtains-vertex-coordinates-helper-b0b06">Vertex coordinates helper</a>
- <a href="https://codesandbox.io/s/react-curtains-simple-plane-ukzxi">Simple plane</a>
- <a href="https://codesandbox.io/s/react-curtains-simple-video-plane-ckozr">Simple video plane</a>
- <a href="https://codesandbox.io/s/react-curtains-slideshow-i7uim">Slideshow</a>
- <a href="https://codesandbox.io/s/react-curtains-multiple-planes-zh9bt">Multiple planes</a>
- <a href="https://codesandbox.io/s/react-curtains-multiple-planes-post-processed-1g5zj">Multiple planes with post processing</a>
- <a href="https://codesandbox.io/s/react-curtains-selective-render-targets-vbsez">Selective render targets</a>
- <a href="https://codesandbox.io/s/react-curtains-flowmap-0hn2t">Flowmap</a>

#### Basic example

This is the port of <a href="https://www.curtainsjs.com/examples/basic-plane/index.html">curtains.js documentation basic example</a>:

```jsx
import ReactDOM from 'react-dom';
import React from 'react';
import {Curtains, Plane} from 'react-curtains';

const basicVs = `
    precision mediump float;
    
    attribute vec3 aVertexPosition;
    attribute vec2 aTextureCoord;
    
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    
    uniform mat4 uTextureMatrix0;
    
    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;
    
    void main() {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
        
        // varyings
        vVertexPosition = aVertexPosition;
        vTextureCoord = (uTextureMatrix0 * vec4(aTextureCoord, 0.0, 1.0)).xy;
    }
`;


const basicFs = `
    precision mediump float;

    varying vec3 vVertexPosition;
    varying vec2 vTextureCoord;
    
    uniform sampler2D uSampler0;
    
    uniform float uTime;
    
    void main() {
        vec2 textureCoord = vTextureCoord;
        // displace our pixels along the X axis based on our time uniform
        // textures coords are ranging from 0.0 to 1.0 on both axis
        textureCoord.x += sin(textureCoord.y * 25.0) * cos(textureCoord.x * 25.0) * (cos(uTime / 50.0)) / 25.0;
        
        gl_FragColor = texture2D(uSampler0, textureCoord);
    }
`;

function BasicPlane({children}) {
    const basicUniforms = {
        time: {
            name: "uTime",
            type: "1f",
            value: 0
        }
    };

    const onRender = (plane) => {
        plane.uniforms.time.value++;
    };

    return (
        <Plane
            className="BasicPlane"
            
            // plane init parameters
            vertexShader={basicVs}
            fragmentShader={basicFs}
            uniforms={basicUniforms}

            // plane events
            onRender={onRender}
        >
            {children}
        </Plane>
    )
}

ReactDOM.render(
    <Curtains>
        <BasicPlane>
            <img src="/path/to/my-image.jpg" alt="" />
        </BasicPlane>
    </Curtains>,
    document.getElementById('root')
);
```
