# F1-Penca Prediction System

This document describes the prediction system implemented in F1-Penca, including the prediction categories and the scoring system.

## Prediction Categories

### Regular Race Weekend

For each Grand Prix, users can make predictions in the following categories:

1.  **Pole Position**: The driver who will take first place in qualifying.
2.  **Race Winner**: The driver who will win the main race.
3.  **2nd Place**: The driver who will finish in second place.
4.  **3rd Place**: The driver who will finish in third place.
5.  **Top-5**: Prediction of the drivers who will complete the top 5.

### Weekend with Sprint Race

For Grands Prix that include a sprint race, the following categories will be added:

1.  **Sprint Pole**: The driver who will take first place in the sprint qualifying.
2.  **Sprint Winner**: The driver who will win the sprint race.

In addition to the regular categories for the main race.

## Scoring System

The scoring system is designed to reward the accuracy of predictions, with a greater emphasis on the more difficult positions to predict.

### Scoring for Regular Race

| Category | Correct Prediction | Partially Correct Prediction |
| --- | --- | --- |
| Pole Position | 10 points | N/A |
| Race Winner | 15 points | N/A |
| Race 2nd Place | 10 points | 5 points (if they finish on the podium) |
| Race 3rd Place | 8 points | 3 points (if they finish on the podium) |
| Race Top 5 | 5 points for each exact position | 1 points for each correct driver but in the wrong position within the top 5 |
| Fastest Lap | 1 point | N/A

### Scoring for Sprint Race

| Category | Correct Prediction | Partially Correct Prediction |
| --- | --- | --- |
| Sprint Pole | 5 points | N/A |
| Sprint Winner | 8 points | N/A |
| Sprint 2nd Place | 5 points | 3 |
| Sprint 3rd Place | 3 points | 1 |

### Bonuses

*   **Perfect Podium**: 10 additional points if the 3 podium drivers are correctly predicted in the exact order.
*   **Perfect Top 5**: 10 additional points if the top 5 drivers are correctly predicted in the exact order.
*   **Perfect Sprint Podium**: 5 additional points if the 3 podium drivers are correctly predicted in the exact order.

### Maximum Possible Score

#### Normal Weekend: 74 points
#### Sprint Weekend: 100 points

## Additional Rules

1.  **Prediction Deadlines**:
    *   Predictions must be submitted at least 1 hour before the start of the qualifying session.
    *   In case of sprint weekend, predictions must be at least 1 hour before the start of the sprint qualifying session.
2.  **Modifications**:
    *   Users can modify their predictions until the deadline.
    *   No modifications will be allowed after the deadline.
3.  **Disqualifications and Penalties**:
    *   If a driver is disqualified after the race, the official post-penalty result will be considered.
    *   If a driver cannot participate in the race after predictions have closed, predictions including them will not receive points for that position.
4.  **Ties**:
    *   In case of a tie in the overall standings, the tie will be broken by:
        1.  Highest number of perfect predictions (highest score in a single race)
        2.  Highest number of correctly predicted winners
        3.  Highest number of correctly predicted 2nd places.
        4.  Highest number of correctly predicted 3nd places.
        5.  Highest number of correctly predicted 4nd places.
        6.  Highest number of correctly predicted 5nd places.

## Leaderboard

The system will maintain an updated leaderboard after each race, showing:

### Simple view

1.  Position
2.  User
3.  Total season score

### Full view

1.  Position
2.  User
3.  Points
4.  All season races prediction score
7.  Total season score
