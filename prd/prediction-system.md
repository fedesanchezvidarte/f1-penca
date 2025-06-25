# F1-Penca Prediction System

This document describes the prediction system implemented in F1-Penca, including the prediction categories and the scoring system.

## Prediction Categories

### Regular Race Weekend

For each Grand Prix, users can make predictions in the following categories:

1.  **Pole Position**: The driver who will take first place in qualifying.
2.  **Race Winner**: The driver who will win the main race.
3.  **2nd Place**: The driver who will finish in second place.
4.  **3rd Place**: The driver who will finish in third place.
5.  **Positions 4-10**: Prediction of the drivers who will complete the top 10.

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
| 2nd Place | 10 points | 5 points (if they finish on the podium) |
| 3rd Place | 8 points | 4 points (if they finish on the podium) |
| Positions 4-10 | 5 points for each exact position | 2 points for each correct driver but in the wrong position within the top 10 |

### Scoring for Sprint Race

| Category | Correct Prediction | Partially Correct Prediction |
| --- | --- | --- |
| Sprint Pole | 5 points | N/A |
| Sprint Winner | 8 points | N/A |

### Bonuses

Bonuses are not cumulative; only the highest achieved bonus is awarded.

*   **Perfect Podium**: 10 additional points if the 3 podium drivers are correctly predicted in the exact order.
*   **Perfect Top 5**: 15 additional points if the top 5 drivers are correctly predicted in the exact order.
*   **Perfect Top 10**: 22 additional points if the top 10 drivers are correctly predicted in the exact order (very difficult!).

### Maximum Possible Score

The maximum scores are calculated as follows:

*   **Regular Weekend**: 100 points
    *   **Base Points (all correct positions):** 78 points
    *   **Perfect Top 10 Bonus:** 22 points
*   **Sprint Weekend**: 113 points
    *   **Max Regular Weekend Score:** 100 points
    *   **Sprint Pole:** 5 points
    *   **Sprint Winner:** 8 points

## Additional Rules

1.  **Prediction Deadlines**:
    *   For qualifying/pole: Predictions must be submitted at least 1 hour before the start of the qualifying session.
    *   For the race/sprint: Predictions must be submitted at least 1 hour before the start of the corresponding race.
2.  **Modifications**:
    *   Users can modify their predictions until the deadline.
    *   No modifications will be allowed after the deadline under any circumstances.
3.  **Disqualifications and Penalties**:
    *   If a driver is disqualified after the race, the official post-penalty result will be considered.
    *   If a driver cannot participate in the race after predictions have closed, predictions including them will not receive points for that position.
4.  **Ties**:
    *   In case of a tie in the overall standings, the tie will be broken by:
        1.  Highest number of perfect predictions (highest score in a single race)
        2.  Highest number of correctly predicted winners
        3.  Highest number of correctly predicted podiums

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
5.  Highlight best prediction
6.  Perfect predictions (if any)
7.  Total season score

## Future Improvements

We will consider adding in future versions:

*   Predictions for fastest lap
*   Predictions for retirements
*   Predictions for specific incidents (safety car, red flag, etc.)
*   Predictions for duels between teammates
