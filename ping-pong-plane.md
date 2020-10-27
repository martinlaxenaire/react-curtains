<h1>PingPongPlane</h1>

[Back to readme](README.md)

The `<PingPongPlane />` component will create a WebGL PingPongPlane (using a Plane object), acting as a wrapper for the curtains.js <a href="https://www.curtainsjs.com/ping-pong-plane-class.html">PingPongPlane class</a>.

#### Usage

```jsx
import ReactDOM from 'react-dom';
import React from 'react';
import {PingPongPlane} from 'react-curtains';

function BasicPingPongPlane() {
    return (
        <PingPongPlane />
    );
}
```

#### Properties & Events

You can refer to both the <a href="https://www.curtainsjs.com/fxaa-pass-class.html">PingPongPlane curtains.js class</a> and [Plane component](plane.md) documentations.

Compared to the `<Plane />` component the only additional prop you have to pass to your `<PingPongPlane />` component is the `sampler` name that you'll use in your shader (if not set, will use "uPingPongTexture").

#### Unmounting

Each time the `<PingPongPlane />` component will unmount, the corresponding WebGL plane element will be automatically disposed.