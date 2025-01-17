INSERT INTO subscriptions (id, userID, courseID, status, powerRole)
SELECT
    UUID(), -- This generates a random unique identifier for the 'id' column
    creatorID AS userID,
    id AS courseID,
    TRUE AS status,
    1 AS powerRole
FROM courses;
