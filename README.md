<h1>react-curtains</h1>

react-curtains is an attempt at converting <a href="https://www.curtainsjs.com/">curtains.js</a> WebGL classes into reusable React components.

## Getting started

### Installation

Of course you'll need to create a React app first. Then, just add react-curtains into your project by installing the npm package:

```bash
npm install react-curtains
```

### Components

react-curtains introduce a bunch of components based on curtains.js classes:

- [Curtains](curtains.md)
- [Plane](plane.md)
- [RenderTarget](render-target.md)
- [ShaderPass](shader-pass.md)
- [PingPongPlane](ping-pong-plane.md)
- [FXAAPass](fxaa-pass.md)

In order for it to work, you'll need to wrap your `App` into the `Curtains` component. You'll be then able to use the other components to add WebGL objects to your scene.

### Hooks

Inside your `<Curtains />` component, you'll have access to a couple useful custom React hooks:

#####useCurtains

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

#####useCurtainsEvent

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

### Basic example

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
