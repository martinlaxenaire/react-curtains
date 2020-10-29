import {useRef} from 'react';
import {useCurtains} from '../hooks';
import {FXAAPass as WebGLFXAAPass} from 'curtainsjs';

export function FXAAPass(props) {
    // extract fxaa parameters from props
    const {
        // fxaa init parameters
        depthTest,
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
                depth,
                clear,
                renderTarget,
                texturesOptions,
            });

            webglFXAAPass.current.pass.onAfterRender(() => {
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
                webglFXAAPass.current.pass._uniqueKey = uniqueKey;
            }

            currentFXAAPass = webglFXAAPass.current;
        }
        else if(!webglFXAAPass.current) {
            webglFXAAPass.current = {
                pass: existingPass[0]
            };
        }

        return () => {
            if(currentFXAAPass) {
                currentFXAAPass.pass.remove();
            }
        }
    });

    return props.children || null;
}