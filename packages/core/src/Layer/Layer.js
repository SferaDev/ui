import cx from 'classnames'
import React, { createContext, useState, useContext } from 'react'
import { createPortal } from 'react-dom'
import propTypes from '@dhis2/prop-types'
import { layers } from '@dhis2/ui-constants'

const LayerContext = createContext({
    node: document.body,
    level: 0,
})

const useLayerContext = () => useContext(LayerContext)

const createClickHandler = onClick => event => {
    // don't respond to clicks that originated in the children
    if (onClick && event.target === event.currentTarget) {
        onClick({}, event)
    }
}

/**
 * @module
 * @param {Layer.PropTypes} props
 * @returns {React.Component}
 * @example import {     } from @dhis2/ui-core
 * @see Live demo: {@link /demo/?path=/story/component-widget-layer--default|Storybook}
 */
const Layer = ({
    children,
    className,
    dataTest,
    level,
    onClick,
    position,
    translucent,
}) => {
    const parentLayer = useLayerContext()
    const [layerEl, setLayerEl] = useState(null)
    const nextLayer = {
        node: layerEl,
        level: Math.max(parentLayer.level, level),
    }
    const portalNode =
        level > parentLayer.level ? document.body : parentLayer.node

    return createPortal(
        <div
            ref={setLayerEl}
            className={cx('layer', className, position, `level-${level}`, {
                translucent,
            })}
            data-test={dataTest}
            onClick={createClickHandler(onClick)}
        >
            {layerEl && (
                <LayerContext.Provider value={nextLayer}>
                    {children}
                </LayerContext.Provider>
            )}
            <style jsx>{`
                div {
                    z-index: ${level};
                }
            `}</style>
            <style jsx>{`
                div {
                    top: 0;
                    left: 0;
                    min-height: 100vh;
                    min-width: 100vw;
                }
                div.fixed {
                    position: fixed;
                    height: 100vh;
                    width: 100vw;
                }
                div.absolute {
                    position: absolute;
                    height: 100%;
                    width: 100%;
                }
                div.translucent {
                    background-color: rgba(33, 43, 54, 0.4);
                }
            `}</style>
        </div>,
        portalNode
    )
}

Layer.defaultProps = {
    position: 'fixed',
    dataTest: 'dhis2-uicore-layer',
    level: layers.applicationTop,
}

/**
 * @typedef {Object} PropTypes
 * @static
 * @prop {string} [className]
 * @prop {Node} [children]
 * @prop {string} [dataTest=dhis2-uicore-layer]
 * @prop {number} [level=layers.applicationTop]
 * @prop {boolean} [translucent] - When true a semi-transparent background is added
 * @prop {function} [onClick]
 */
Layer.propTypes = {
    children: propTypes.node,
    className: propTypes.string,
    dataTest: propTypes.string,
    level: propTypes.number,
    position: propTypes.oneOf(['absolute', 'fixed']),
    translucent: propTypes.bool,
    onClick: propTypes.func,
}

export { Layer, useLayerContext }
