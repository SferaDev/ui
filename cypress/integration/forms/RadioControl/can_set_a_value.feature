Feature: The RadioControl can set a value

    Scenario: The user clicks the first option
        Given a GroupControl with required RadioControls and no selected value
        And there are three options
        When the user selects the last option
        Then the form state's value equals the last option's value