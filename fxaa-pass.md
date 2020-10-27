<h1>FXAAPass</h1>

[Back to readme](README.md)

The `<FXAAPass />` component will create a WebGL FXAAPass (using a ShaderPass object), acting as a wrapper for the curtains.js <a href="https://www.curtainsjs.com/fxaa-pass-class.html">FXAAPass class</a>.

#### Usage

```jsx
import ReactDOM from 'react-dom';
import React from 'react';
import {FXAAPass} from 'react-curtains';

function BasicFXAAPass() {
    return (
        <FXAAPass />
    );
}
```

#### Properties & Events

You can refer to both the <a href="https://www.curtainsjs.com/fxaa-pass-class.html">FXAAPass curtains.js class</a> and [ShaderPass component](shader-pass.md) documentations.

Most of the time tho, you'll just add the `<FXAAPass />` component without any props and let it automatically add anti-aliasing to your scene. 

#### Unmounting

Each time the `<FXAAPass />` component will unmount, the corresponding WebGL shaderpass and its associated render target element will be automatically disposed.