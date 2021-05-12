import PropTypes from 'prop-types'
import React from 'react'
import { Actions } from './actions.js'
import { AddAll } from './add-all.js'
import { AddIndividual } from './add-individual.js'
import { Container } from './container.js'
import { Filter } from './filter.js'
import { LeftFooter } from './left-footer.js'
import { LeftHeader } from './left-header.js'
import { LeftSide } from './left-side.js'
import { OptionsContainer } from './options-container.js'
import { RemoveAll } from './remove-all.js'
import { RemoveIndividual } from './remove-individual.js'
import { ReorderingActions } from './reordering-actions.js'
import { RightFooter } from './right-footer.js'
import { RightHeader } from './right-header.js'
import { RightSide } from './right-side.js'
import { TransferOption } from './transfer-option.js'
import {
    addAllSelectableSourceOptions,
    addIndividualSourceOptions,
    createDoubleClickHandlers,
    defaultFilterCallback,
    getOptionClickHandlers,
    isReorderDownDisabled,
    isReorderUpDisabled,
    moveHighlightedPickedOptionDown,
    moveHighlightedPickedOptionUp,
    removeAllPickedOptions,
    removeIndividualPickedOptions,
    useFilter,
    useHighlightedOptions,
} from './transfer/index.js'

const identity = value => value

/**
 * @module
 * @param {Transfer.PropTypes} props
 *
 * @returns {React.Component}
 *
 * @example import { Transfer } from @dhis2/ui-core
 * @see Specification: {@link https://github.com/dhis2/design-system/blob/master/organisms/transfer.md|Design system}
 * @see Live demo: {@link /demo/?path=/story/transfer--basic|Storybook}
 *
 * This component has to differentiate between different types of options,
 * here's an explanation of their meaning:
 *
 * * source options -> These are options listed on the left and are available
 * for selection
 *
 * * picked options -> These options have been selected by the user and are on
 * the right side
 *
 * * highlighted option -> These are visually highlighted options than can be
 * on either side and are ready for transferral with the action buttons to the
 * other side
 *
 * * filtered options -> These are the displayed source options filtered
 * by a search term or a custom search algorithm.
 *
 * The api surface uses "selected" for "picked" to be consistent with the
 * rest of the library
 */
export const Transfer = ({
    options,
    onChange,

    addAllText,
    addIndividualText,
    className,
    dataTest,
    disabled,
    enableOrderChange,
    filterCallback,
    filterCallbackPicked,
    filterLabel,
    filterLabelPicked,
    filterPlaceholder,
    filterPlaceholderPicked,
    filterable,
    filterablePicked,
    height,
    hideFilterInput,
    hideFilterInputPicked,
    initialSearchTerm,
    initialSearchTermPicked,
    leftFooter,
    leftHeader,
    loadingPicked,
    loading,
    maxSelections,
    optionsWidth,
    removeAllText,
    removeIndividualText,
    renderOption,
    rightFooter,
    rightHeader,
    searchTerm,
    searchTermPicked,
    selected,
    selectedEmptyComponent,
    selectedWidth,
    sourceEmptyPlaceholder,
    onFilterChange,
    onFilterChangePicked,
    onEndReached,
    onEndReachedPicked,
}) => {
    /* Source options search value:
     * Depending on whether the onFilterChange callback has been provided
     * either the internal or external search value is used */
    const {
        filterValue: actualFilter,
        filter: actualFilterCallback,
        setInternalFilter,
    } = useFilter({
        initialSearchTerm,
        onFilterChange,
        externalSearchTerm: searchTerm,
        filterable,
        filterCallback,
    })

    /*
     * Actual source options:
     * Extract the not-selected options.
     * Filters options if filterable is true.
     */
    const sourceOptions = actualFilterCallback(
        options.filter(({ value }) => !selected.includes(value)),
        actualFilter
    )

    /*
     * Picked options highlighting:
     * These are all the highlighted options on the options side.
     */
    const {
        highlightedOptions: highlightedSourceOptions,
        setHighlightedOptions: setHighlightedSourceOptions,
        toggleHighlightedOption: toggleHighlightedSourceOption,
    } = useHighlightedOptions({
        options: sourceOptions,
        disabled,
        maxSelections,
    })

    /* Picked options search value:
     * Depending on whether the onFilterChangePicked callback has been provided
     * either the internal or external search value is used */
    const {
        filterValue: actualFilterPicked,
        filter: actualFilterPickedCallback,
        setInternalFilter: setInternalFilterPicked,
    } = useFilter({
        filterable: filterablePicked,
        initialSearchTerm: initialSearchTermPicked,
        onFilterChange: onFilterChangePicked,
        externalSearchTerm: searchTermPicked,
        filterCallback: filterCallbackPicked,
    })

    /*
     * Actual picked options:
     * Extract the selected options. Can't use `options.filter`
     * because we need to keep the order of `selected`
     */
    const pickedOptions = actualFilterPickedCallback(
        selected
            .map(value => options.find(option => value === option.value))
            // filter -> in case a selected value has been provided
            // that does not exist as option
            .filter(identity),
        actualFilterPicked
    )

    /*
     * Source options highlighting:
     * These are all the highlighted options on the selected side.
     */
    const {
        highlightedOptions: highlightedPickedOptions,
        setHighlightedOptions: setHighlightedPickedOptions,
        toggleHighlightedOption: toggleHighlightedPickedOption,
    } = useHighlightedOptions({
        options: pickedOptions,
        disabled,
        maxSelections,
    })

    /*
     * Source & Picked options:
     * These are the double click handlers for (de-)selection
     */
    const {
        selectSingleOption,
        deselectSingleOption,
    } = createDoubleClickHandlers({
        selected,
        setHighlightedSourceOptions,
        setHighlightedPickedOptions,
        onChange,
        maxSelections,
    })

    /**
     * Disabled button states
     */
    const isAddAllDisabled =
        disabled ||
        sourceOptions.filter(({ disabled }) => !disabled).length === 0
    const isAddIndividualDisabled = disabled || !highlightedSourceOptions.length
    const isRemoveAllDisabled = disabled || !selected.length
    const isRemoveIndividualDisabled =
        disabled || !highlightedPickedOptions.length

    return (
        <Container dataTest={dataTest} className={className} height={height}>
            <LeftSide dataTest={`${dataTest}-leftside`} width={optionsWidth}>
                {(leftHeader || filterable) && (
                    <LeftHeader dataTest={`${dataTest}-leftheader`}>
                        {leftHeader}

                        {filterable && !hideFilterInput && (
                            <Filter
                                label={filterLabel}
                                placeholder={filterPlaceholder}
                                dataTest={`${dataTest}-filter`}
                                filter={actualFilter}
                                onChange={
                                    onFilterChange
                                        ? onFilterChange
                                        : ({ value }) =>
                                              setInternalFilter(value)
                                }
                            />
                        )}
                    </LeftHeader>
                )}

                <OptionsContainer
                    dataTest={`${dataTest}-sourceoptions`}
                    emptyComponent={sourceEmptyPlaceholder}
                    getOptionClickHandlers={getOptionClickHandlers}
                    highlightedOptions={highlightedSourceOptions}
                    loading={loading}
                    options={sourceOptions}
                    renderOption={renderOption}
                    selectionHandler={selectSingleOption}
                    toggleHighlightedOption={toggleHighlightedSourceOption}
                    onEndReached={onEndReached}
                />

                {leftFooter && (
                    <LeftFooter dataTest={`${dataTest}-leftfooter`}>
                        {leftFooter}
                    </LeftFooter>
                )}
            </LeftSide>

            <Actions dataTest={`${dataTest}-actions`}>
                {maxSelections === Infinity && (
                    <AddAll
                        label={addAllText}
                        dataTest={`${dataTest}-actions-addall`}
                        disabled={isAddAllDisabled}
                        onClick={() =>
                            addAllSelectableSourceOptions({
                                sourceOptions,
                                selected,
                                onChange,
                                setHighlightedSourceOptions,
                            })
                        }
                    />
                )}

                <AddIndividual
                    label={addIndividualText}
                    dataTest={`${dataTest}-actions-addindividual`}
                    disabled={isAddIndividualDisabled}
                    onClick={() =>
                        addIndividualSourceOptions({
                            filterable,
                            sourceOptions,
                            highlightedSourceOptions,
                            selected,
                            maxSelections,
                            onChange,
                            setHighlightedSourceOptions,
                        })
                    }
                />

                {maxSelections === Infinity && (
                    <RemoveAll
                        label={removeAllText}
                        dataTest={`${dataTest}-actions-removeall`}
                        disabled={isRemoveAllDisabled}
                        onClick={() =>
                            removeAllPickedOptions({
                                setHighlightedPickedOptions,
                                onChange,
                            })
                        }
                    />
                )}

                <RemoveIndividual
                    label={removeIndividualText}
                    dataTest={`${dataTest}-actions-removeindividual`}
                    disabled={isRemoveIndividualDisabled}
                    onClick={() =>
                        removeIndividualPickedOptions({
                            filterablePicked,
                            pickedOptions,
                            highlightedPickedOptions,
                            onChange,
                            selected,
                            setHighlightedPickedOptions,
                        })
                    }
                />
            </Actions>

            <RightSide dataTest={`${dataTest}-rightside`} width={selectedWidth}>
                {(rightHeader || filterablePicked) && (
                    <RightHeader dataTest={`${dataTest}-rightheader`}>
                        {rightHeader}

                        {filterablePicked && !hideFilterInputPicked && (
                            <Filter
                                label={filterLabelPicked}
                                placeholder={filterPlaceholderPicked}
                                dataTest={`${dataTest}-filter`}
                                filter={actualFilterPicked}
                                onChange={
                                    onFilterChangePicked
                                        ? onFilterChangePicked
                                        : ({ value }) =>
                                              setInternalFilterPicked(value)
                                }
                            />
                        )}
                    </RightHeader>
                )}

                <OptionsContainer
                    selected
                    dataTest={`${dataTest}-pickedoptions`}
                    emptyComponent={selectedEmptyComponent}
                    getOptionClickHandlers={getOptionClickHandlers}
                    highlightedOptions={highlightedPickedOptions}
                    loading={loadingPicked}
                    options={pickedOptions}
                    renderOption={renderOption}
                    selectionHandler={deselectSingleOption}
                    toggleHighlightedOption={toggleHighlightedPickedOption}
                    onEndReached={onEndReachedPicked}
                />

                {(rightFooter || enableOrderChange) && (
                    <RightFooter dataTest={`${dataTest}-rightfooter`}>
                        {enableOrderChange && (
                            <ReorderingActions
                                dataTest={`${dataTest}-reorderingactions`}
                                disabledDown={isReorderDownDisabled({
                                    highlightedPickedOptions,
                                    selected,
                                })}
                                disabledUp={isReorderUpDisabled({
                                    highlightedPickedOptions,
                                    selected,
                                })}
                                onChangeUp={() =>
                                    moveHighlightedPickedOptionUp({
                                        selected,
                                        highlightedPickedOptions,
                                        onChange,
                                    })
                                }
                                onChangeDown={() => {
                                    moveHighlightedPickedOptionDown({
                                        selected,
                                        highlightedPickedOptions,
                                        onChange,
                                    })
                                }}
                            />
                        )}

                        {rightFooter}
                    </RightFooter>
                )}
            </RightSide>
        </Container>
    )
}

const defaultRenderOption = option => <TransferOption {...option} />

Transfer.defaultProps = {
    dataTest: 'dhis2-uicore-transfer',
    height: '240px',
    initialSearchTerm: '',
    initialSearchTermPicked: '',
    maxSelections: Infinity,
    optionsWidth: '320px',
    renderOption: defaultRenderOption,
    selected: [],
    selectedWidth: '320px',
    filterCallback: defaultFilterCallback,
    filterCallbackPicked: defaultFilterCallback,
}

/**
 * @typedef {Object} PropTypes
 * @static
 *
 * @prop {Function} onChange
 * @prop {string} [addAllText]
 * @prop {string} [addIndividualText]
 * @prop {Node} [children]
 * @prop {string} [className]
 * @prop {string} [dataTest]
 * @prop {Node} [sourceEmptyPlaceholder]
 * @prop {Node} [selectedEmptyComponent]
 * @prop {bool} [hideFilterInput] Automatically true when "hideFilterInput" is true
 * @prop {bool} [enableOrderChange]
 * @prop {string} [filterLabel]
 * @prop {string} [filterPlaceholder]
 * @prop {Function} [filterCallback]
 * @prop {string} [height]
 * @prop {bool} [hideFilterInput]
 * @prop {string} [initialSearchTerm]
 * @prop {Node} [leftFooter]
 * @prop {Node} [leftHeader]
 * @prop {1|Infinity} maxSelections
 * @prop {string} [optionsWidth]
 * @prop {string} [removeAllText]
 * @prop {string} [removeIndividualText]
 * @prop {Node} [rightHeader]
 * @prop {Node} [rightFooter]
 * @prop {string} [searchTerm]
 * @prop {string[]} selected
 * @prop {string} [selectedWidth]
 * @prop {Function} [onFilterChange]
 */
Transfer.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            disabled: PropTypes.bool,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,

    addAllText: PropTypes.string,
    addIndividualText: PropTypes.string,
    className: PropTypes.string,
    dataTest: PropTypes.string,
    disabled: PropTypes.bool,
    enableOrderChange: PropTypes.bool,
    filterCallback: PropTypes.func,
    filterCallbackPicked: PropTypes.func,
    filterLabel: PropTypes.string,
    filterLabelPicked: PropTypes.string,
    filterPlaceholder: PropTypes.string,
    filterPlaceholderPicked: PropTypes.string,
    filterable: PropTypes.bool,
    filterablePicked: PropTypes.bool,
    height: PropTypes.string,
    hideFilterInput: PropTypes.bool,
    hideFilterInputPicked: PropTypes.bool,
    initialSearchTerm: PropTypes.string,
    initialSearchTermPicked: PropTypes.string,
    leftFooter: PropTypes.node,
    leftHeader: PropTypes.node,
    loading: PropTypes.bool,
    loadingPicked: PropTypes.bool,
    maxSelections: PropTypes.oneOf([1, Infinity]),
    optionsWidth: PropTypes.string,
    removeAllText: PropTypes.string,
    removeIndividualText: PropTypes.string,
    renderOption: PropTypes.func,
    rightFooter: PropTypes.node,
    rightHeader: PropTypes.node,
    searchTerm: PropTypes.string,
    searchTermPicked: PropTypes.string,
    selected: PropTypes.arrayOf(PropTypes.string),
    selectedEmptyComponent: PropTypes.node,
    selectedWidth: PropTypes.string,
    sourceEmptyPlaceholder: PropTypes.node,
    onEndReached: PropTypes.func,
    onEndReachedPicked: PropTypes.func,
    onFilterChange: PropTypes.func,
    onFilterChangePicked: PropTypes.func,
}