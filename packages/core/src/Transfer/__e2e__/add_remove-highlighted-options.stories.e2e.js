/* eslint-disable react/prop-types */
import React from 'react'

import { Transfer } from '../../index.js'
import { options, statefulDecorator } from './common'

export default {
    title: 'Transfer add & remove highlighted options',
    decorators: [statefulDecorator()],
}

export const HasOptions = ({ onChange, selected }) => (
    <Transfer
        filterable
        selected={selected}
        onChange={onChange}
        options={options}
    />
)

export const HasSelected = ({ onChange, selected }) => (
    <Transfer onChange={onChange} selected={selected} options={options} />
)

HasSelected.story = {
    decorators: [
        statefulDecorator({
            initialState: options.slice(0, 4),
        }),
    ],
}
