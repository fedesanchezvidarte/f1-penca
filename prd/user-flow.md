# App Flow

## User Flow

```plaintext
[Visitor] -> [Sign In with Google]  -> [User Dashboard]
                                    -> [Create Prediction (Race)]
                                    -> [Submit Prediction]
                                    -> [Leaderboard View]
                                    -> [Admin Panel (if admin)]
```

## Data Flow

```plaintext
[User Prediction] -> [Database (Predictions)] -> [Race Results (openf1)] -> [Leaderboard Calculation] -> [Leaderboard View]
```
