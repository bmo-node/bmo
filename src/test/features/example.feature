Feature: Update My Name
  As a DNA Customer
  I want to update my name
  So that I can be on the interwebz

  Background:
    Given I am a "DNACustomer"

  Scenario: Prompted for name
    When I go to the front page of the application
    Then I am prompted for my name

  Scenario: Enter my name
    When I go to the front page of the application
    And I enter my name
    Then My name is displayed in the main message
