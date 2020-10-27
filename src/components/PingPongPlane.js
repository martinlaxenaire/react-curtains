import React, {useRef, useEffect} from 'react';
import {useCurtains} from '../hooks';
import {PingPongPlane as WebGLPingPongPlane, Vec3, Vec2} from 'curtainsjs';

export function PingPongPlane(props) {
    // extract plane parameters and events from props
    const {
        sampler,
        // plane init parameters
        vertexShader,
        vertexShaderID,
        fragmentShader,
        fragmentShaderID,
        widthSegments,
        heightSegments,
        depthTest,
        transparent,
        cullFace,
        shareProgram,
        visible,
        drawCheckMargins,
        watchScroll,
        texturesOptions,
        crossOrigin,
        fov,
        uniforms,

        // render target
        target,

        // plane transformations
        relativeTranslation,
        rotation,
        scale,
        transformOrigin,

        // plane events
        onAfterRender,
        onAfterResize,
        onError,
        onLeaveView,
        onLoading,
        onReady,
        onReEnterView,
        onRender,

        // custom events
        onBeforeCreate,
        onBeforeRemove,

        // valid react props
        ...validProps
    } = props;

    const planeEl = useRef();
    const webglPlane = useRef();

    useCurtains((curtains) => {
        if(!webglPlane.current) {
            onBeforeCreate && onBeforeCreate();

            // just add the plane
            webglPlane.current = new WebGLPingPongPlane(curtains, planeEl.current, {
                sampler,
                vertexShader,
                vertexShaderID,
                fragmentShader,
                fragmentShaderID,
                widthSegments,
                heightSegments,
                depthTest,
                transparent,
                cullFace,
                shareProgram,
                visible,
                drawCheckMargins,
                watchScroll,
                texturesOptions,
                crossOrigin,
                fov,
                uniforms,
            })
                .onAfterRender(() => {
                    onAfterRender && onAfterRender(webglPlane.current)
                })
                .onAfterResize(() => {
                    onAfterResize && onAfterResize(webglPlane.current);
                })
                .onError(() => {
                    onError && onError(webglPlane.current);
                })
                .onLeaveView(() => {
                    onLeaveView && onLeaveView(webglPlane.current);
                })
                .onLoading((texture) => {
                    onLoading && onLoading(webglPlane.current, texture);
                })
                .onReady(() => {
                    onReady && onReady(webglPlane.current);
                })
                .onReEnterView(() => {
                    onReEnterView && onReEnterView(webglPlane.current);
                })
                .onRender(() => {
                    onRender && onRender(webglPlane.current);
                });

            console.warn(">>> Adding plane", webglPlane.current);
        }

        let currentPlane = webglPlane.current;

        return () => {
            if(currentPlane) {
                onBeforeRemove && onBeforeRemove(currentPlane);

                console.warn(">>> Disposing plane", currentPlane.index);
                currentPlane.remove();
            }
        }
    });



    // handle parameters/properties that could be changed at runtime
    useEffect(() => {
        if(webglPlane.current) {
            // simple properties
            if(cullFace !== undefined) {
                webglPlane.current.cullFace = cullFace;
            }
            if(drawCheckMargins !== undefined) {
                webglPlane.current.drawCheckMargins = drawCheckMargins;
            }
            if(visible !== undefined) {
                webglPlane.current.visible = visible;
            }
            if(watchScroll !== undefined) {
                webglPlane.current.watchScroll = watchScroll;
            }

            // other properties
            if(depthTest !== undefined) {
                webglPlane.current.enableDepthTest(depthTest);
            }

            // render target
            if(target !== undefined) {
                webglPlane.current.setRenderTarget(target);
            }

            // transformations
            if(relativeTranslation) {
                const newTranslation = new Vec3();
                if(rotation.length >= 3) {
                    newTranslation.set(relativeTranslation[0], relativeTranslation[1], relativeTranslation[2]);
                }

                webglPlane.current.setRelativeTranslation(newTranslation);
            }
            if(rotation) {
                const newRotation = new Vec3();
                if(rotation.length >= 3) {
                    newRotation.set(rotation[0], rotation[1], rotation[2]);
                }

                webglPlane.current.setRotation(newRotation);
            }
            if(scale) {
                const newScale = new Vec2(1, 1);
                if(scale.length >= 2) {
                    newScale.set(scale[0], scale[1]);
                }

                webglPlane.current.setScale(newScale);
            }
            if(transformOrigin) {
                const newTransformOrigin = new Vec3(0.5, 0.5, 0);
                if(transformOrigin.length >= 3) {
                    newTransformOrigin.set(transformOrigin[0], transformOrigin[1], transformOrigin[2]);
                }

                webglPlane.current.setTransformOrigin(newTransformOrigin);
            }

            // update camera fov only if it actually changed
            if(fov !== undefined && fov !== webglPlane.current.camera.fov) {
                webglPlane.current.setPerspective(fov);
            }
        }
    }, [
        cullFace,
        drawCheckMargins,
        visible,
        watchScroll,

        depthTest,

        target,

        relativeTranslation,
        rotation,
        scale,
        transformOrigin,

        fov,
    ]);

    return (
        <div ref={planeEl} {...validProps}>
            {props.children}
        </div>
    );
}