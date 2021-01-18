import {useEffect, useRef} from 'react';
import {useCurtains} from '../hooks';
import {FXAAPass as WebGLFXAAPass} from 'curtainsjs';

export function FXAAPass(props) {
    // extract fxaa parameters from props
    const {
        // fxaa init parameters
        depthTest,
        renderOrder,
        depth,
        clear,
        renderTarget,
        texturesOptions,

        // shader pass events
        onAfterRender,
        onAfterResize,
        onError,
        onLoading,
        onReady,
        onRender,

        // unique key if created inside a loop
        uniqueKey,
    } = props;


    const webglFXAAPass = useRef();

    useCurtains((curtains) => {
        let existingPass = [];
        if(uniqueKey) {
            existingPass = curtains.shaderPasses.filter(pass => pass._uniqueKey === uniqueKey);
        }

        let currentFXAAPass;

        if(!webglFXAAPass.current && !existingPass.length) {

            webglFXAAPass.current = new WebGLFXAAPass(curtains, {
                depthTest,
                renderOrder,
                depth,
                clear,
                renderTarget,
                texturesOptions,
            });

            webglFXAAPass.current.onAfterRender(() => {
                    onAfterRender && onAfterRender(webglFXAAPass.current)
                })
                .onAfterResize(() => {
                    onAfterResize && onAfterResize(webglFXAAPass.current);
                })
                .onError(() => {
                    onError && onError(webglFXAAPass.current);
                })
                .onLoading(() => {
                    onLoading && onLoading(webglFXAAPass.current);
                })
                .onReady(() => {
                    onReady && onReady(webglFXAAPass.current);
                })
                .onRender(() => {
                    onRender && onRender(webglFXAAPass.current);
                });

            if(uniqueKey) {
                webglFXAAPass.current._uniqueKey = uniqueKey;
            }

            currentFXAAPass = webglFXAAPass.current;
        }
        else if(!webglFXAAPass.current) {
            webglFXAAPass.current = existingPass[0];
        }

        return () => {
            if(currentFXAAPass) {
                currentFXAAPass.remove();
            }
        }
    });

    // handle parameters/properties that could be changed at runtime
    useEffect(() => {
        if(webglFXAAPass.current) {
            if(renderOrder !== undefined) {
                webglFXAAPass.current.setRenderOrder(renderOrder);
            }
        }
    }, [renderOrder]);

    return props.children || null;
}