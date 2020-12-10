import {useEffect, useRef} from 'react';
import {useCurtains} from '../hooks';
import {ShaderPass as WebGLShaderPass, Vec2, Vec3} from 'curtainsjs';

export function ShaderPass(props) {
    // extract shader pass parameters and events from props
    const {
        // shader pass init parameters
        vertexShader,
        vertexShaderID,
        fragmentShader,
        fragmentShaderID,
        renderOrder,
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
                renderOrder,
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
        }
        else if(!webglShaderPass.current) {
            webglShaderPass.current = existingPass[0];
        }


        return () => {
            if(currentShaderPass) {
                currentShaderPass.remove();
            }
        }
    });

    // handle parameters/properties that could be changed at runtime
    useEffect(() => {
        if(webglShaderPass.current) {
            if(renderOrder !== undefined) {
                webglShaderPass.current.setRenderOrder(renderOrder);
            }
        }
    }, [renderOrder]);

    return props.children || null;
}