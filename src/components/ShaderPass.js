import {useRef} from 'react';
import {useCurtains} from '../hooks';
import {ShaderPass as WebGLShaderPass} from 'curtainsjs';

export function ShaderPass(props) {
    // extract shader pass parameters and events from props
    const {
        // shader pass init parameters
        vertexShader,
        vertexShaderID,
        fragmentShader,
        fragmentShaderID,
        depthTest,
        depth,
        clear,
        renderTarget,
        texturesOptions,
        crossOrigin,
        uniforms,

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


    const webglShaderPass = useRef();

    useCurtains((curtains) => {
        let existingPass = [];
        if(uniqueKey) {
            existingPass = curtains.shaderPasses.filter(pass => pass._uniqueKey === uniqueKey);
        }

        let currentShaderPass;

        if(!webglShaderPass.current && !existingPass.length) {

            webglShaderPass.current = new WebGLShaderPass(curtains, {
                vertexShader,
                vertexShaderID,
                fragmentShader,
                fragmentShaderID,
                depthTest,
                depth,
                clear,
                renderTarget,
                texturesOptions,
                crossOrigin,
                uniforms,
            })
                .onAfterRender(() => {
                    onAfterRender && onAfterRender(webglShaderPass.current)
                })
                .onAfterResize(() => {
                    onAfterResize && onAfterResize(webglShaderPass.current);
                })
                .onError(() => {
                    onError && onError(webglShaderPass.current);
                })
                .onLoading(() => {
                    onLoading && onLoading(webglShaderPass.current);
                })
                .onReady(() => {
                    onReady && onReady(webglShaderPass.current);
                })
                .onRender(() => {
                    onRender && onRender(webglShaderPass.current);
                });

            if(uniqueKey) {
                webglShaderPass.current._uniqueKey = uniqueKey;
            }

            currentShaderPass = webglShaderPass.current;

            console.warn(">>> Adding shader pass", webglShaderPass.current);

            if(renderTarget) {
                console.warn(">>> Is it a scene pass (it shouldn't)?", webglShaderPass.current._isScenePass);
            }

        }
        else if(!webglShaderPass.current) {
            webglShaderPass.current = existingPass[0];
        }


        return () => {
            if(currentShaderPass) {
                console.warn(">>> Disposing shader pass");
                currentShaderPass.remove();
            }
        }
    });

    return props.children || null;
}