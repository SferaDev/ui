import propTypes from '@dhis2/prop-types'
import { layers } from '@dhis2/ui-constants'
import cx from 'classnames'
import React from 'react'
import { Portal } from '../portal/Portal.js'
;('') // TODO: https://github.com/jsdoc/jsdoc/issues/1718

/**
 * @module
 * @param {AlertStack.PropTypes} props
 * @returns {React.Component}
 * @example import { AlertStack } from '@dhis2/ui-core'
 * @see Live demo: {@link /demo/?path=/story/alertstack--default|Storybook}
 */
const AlertStack = ({ className, children, dataTest }) => (
    <Portal>
        <div className={cx(className)} data-test={dataTest}>
            {children}
            <style jsx>{`
                div {
                    position: fixed;
                    top: auto;
                    right: auto;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);

                    z-index: ${layers.alert};

                    display: flex;
                    flex-direction: column-reverse;

                    pointer-events: none;
                }
            `}</style>
        </div>
    </Portal>
)

AlertStack.defaultProps = {
    dataTest: 'dhis2-uicore-alertstack',
}

/**
 * @typedef {Object} PropTypes
 * @static
 * @prop {string} [className]
 * @prop {Array.<AlertBar>} [children]
 * @prop {string} [dataTest]
 */
AlertStack.propTypes = {
    children: propTypes.arrayOf(propTypes.element),
    className: propTypes.string,
    dataTest: propTypes.string,
}

export { AlertStack }
