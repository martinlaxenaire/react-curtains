<h1>Plane</h1>

[Back to readme](README.md)

The `<Plane />` component will create a WebGL Plane, acting as a wrapper for the curtains.js <a href="https://www.curtainsjs.com/plane-class.html">Plane class</a>.

#### Usage

```jsx
import ReactDOM from 'react-dom';
import React from 'react';
import {Plane} from 'react-curtains';

// will draw a black rectangle
// since it needs at least a custom fragment shader
// to display the texture
function BasicPlane() {
    return (
        <Plane
            className="plane"
        >
            <img src="/path/to/my-image.jpg" alt="" />
        </Plane>
    );
}
```

#### Properties

##### Regular Plane class parameters & properties

You can pass any of the <a href="https://www.curtainsjs.com/plane-class.html#parameters">Plane class parameters</a> as a React prop to your component.

You can also use React props and events like `className` or `onClick`. They can be used to style your canvas container and listen to events. You can of course pass any DOM children you want to the component.

```jsx
// assuming vs, fs and planeUniforms are defined above

<Plane
    className="plane"
    vertexShader={vs}
    fragmentShader={fs}
    uniforms={planeUniforms}
    widthSegments={10}
    heightSegments={10}
    transparent={true}
    fov={75}
>
    <h2>This is the plane title!</h2>
    <img src="/path/to/my-image.jpg" data-sampler="uPlaneTexture" alt="" />
</Plane>
```

All the <a href="https://www.curtainsjs.com/plane-class.html#properties">plane properties</a> that are not read-only are therefore reactive and will be updated each time the corresponding prop is updated!

##### Transformations

You can also pass the Plane transformation values (rotation, translation, scale, transformOrigin) via props. Those are also reactive, which means you can control your Plane transformation via props only!
Just pass the values as arrays to the corresponding prop. To reset a transformation, just pass an empty array:

```jsx
// assuming vs, fs, planeUniforms and rotatePlane are defined above

<Plane
    className="plane"
    vertexShader={vs}
    fragmentShader={fs}
    uniforms={planeUniforms}
    rotation={rotatePlane ? [0, 0, 0.5] : []}
    scale={[1.25, 1.25]}
>
    <h2>This is the plane title!</h2>
    <img src="/path/to/my-image.jpg" data-sampler="uPlaneTexture" alt="" />
</Plane>
```

#### Events

##### Regular Plane class events

You can also pass as a prop a function to execute for each corresponding <a href="https://www.curtainsjs.com/plane-class.html#events">Plane class events</a>. You'll have access to the corresponding `plane` instance inside all of them.

```jsx
import ReactDOM from 'react-dom';
import React from 'react';
import {Plane} from 'react-curtains';

function BasicPlane() {
    const onPlaneReady = (plane) => {
        console.log("plane is ready", plane);
        // you can use any regular plane methods here
        plane.setRenderOrder(1);
    };
    
    const onPlaneRender = (plane) => {
        console.log("on plane render!", plane);
    };

    return (
        <Plane
            className="plane"
            
            onReady={onPlaneReady}
            onRender={onPlaneRender}
        >
            <img src="/path/to/my-image.jpg" alt="" />
        </Plane>
    );
}
```


##### Additional events

The component introduces 2 new events, `onBeforeCreate` and `onBeforeRemove` that will be called just before the plane is created and removed.

#### Complete prop list

Here's a complete prop list that you can pass to your `<Plane />` component (see also <a href="https://www.curtainsjs.com/plane-class.html">curtains.js Plane class documentation</a>):

| Prop  | Type | Reactive? | Description |
| --- | --- | :---: | --- |
| className | string | - | Plane's div element class names |
| vertexShader | string | - | Plane vertex shader |
| vertexShaderID | string | - | Plane vertex shader script tag ID |
| fragmentShader | string | - | Plane fragment shader |
| fragmentShaderID | string | - | Plane fragment shader script tag ID |
| widthSegments | int | - | Number of vertices along X axis |
| heightSegments | int | - | Number of vertices along Y axis |
| renderOrder | int | X | Determines in which order the plane is drawn |
| depthTest | bool | X | Whether the Plane should enable or disable the depth test |
| transparent | bool | - | If your Plane should handle transparency |
| cullFace | string | - | Which face of the plane should be culled |
| alwaysDraw | bool | X | If your Plane should always be drawn or use frustum culling |
| visible | bool | X | Whether to draw your Plane |
| drawCheckMargins | object | X | Additional margins to add in the frustum culling calculations, in pixels. |
| watchScroll | bool | X | Whether the plane should auto update its position on scroll |
| autoloadSources | bool | - | If the sources should be load on init automatically |
| texturesOptions | object | - | Default options to apply to the textures of the Plane |
| crossOrigin | string | - | Defines the crossOrigin process to load medias |
| fov | int | X | Defines the perspective field of view |
| uniforms | object | - | The uniforms that will be passed to the shaders |
| target | RenderTarget object | X | The render target used to render the Plane |
| relativeTranslation | array | X | Additional translation applied to your Plane along X, Y and Z axis, in pixel |
| rotation | array | X | Rotation applied to your Plane on X, Y and Z axis |
| scale | array | X | Scale applied to your Plane on X and Y axis |
| transformOrigin | array | X | Your Plane transform origin position along X, Y and Z axis |
| onAfterRender | function | - | Called just after your Plane has been drawn |
| onAfterResize | function | - | Called just after your plane has been resized |
| onError | function | - | Called if there's an error while instancing your Plane |
| onLeaveView | function | - | Called when the Plane gets frustum culled |
| onReady | function | - | Called once your Plane is all set up and ready to be drawn |
| onReEnterView | function | - | Called when the Plane's no longer frustum culled |
| onRender | function | - | Called at each Plane's draw call |
| onBeforeCreate | function | - | Called just before the Plane will be created |
| onBeforeRemove | function | - | Called just before the Plane will be removed |



#### Unmounting

Each time the `<Plane />` component will unmount, the corresponding WebGL plane element will be automatically disposed.


##### TODO: transitioning

At the moment there's no way to keep a WebGL plane when the component unmounts (think about page transitions for example).
Combining an `uniqueKey` property with the plane `resetPlane()` method should however do the trick. It should be implemented in an upcoming library version.