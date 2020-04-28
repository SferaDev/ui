import React from 'react'
import { storiesOf } from '@storybook/react'
import { formDecorator } from '../formDecorator.js'

import { ReactFinalForm, SwitchControl, hasValue } from '../index.js'

const { Field } = ReactFinalForm

storiesOf('Testing:SwitchControl', module)
    .addDecorator(formDecorator)
    .add('Unchecked', () => (
        <Field
            component={SwitchControl}
            className="switch"
            name="switch"
            label="Label text"
            validate={hasValue}
            required
            type="checkbox"
        />
    ))
    .add('Checked ', () => (
        <Field
            component={SwitchControl}
            className="switch"
            name="switch"
            label="Label text"
            initialValue={true}
            type="checkbox"
        />
    ))
    .add('Unchecked with value', () => (
        <Field
            component={SwitchControl}
            className="switch"
            name="switch"
            label="Label text"
            value="yes"
            type="checkbox"
        />
    ))
    .add('Checked with value', () => (
        <Field
            component={SwitchControl}
            className="switch"
            name="switch"
            label="Label text"
            value="yes"
            initialValue={['yes']}
            type="checkbox"
        />
    ))
