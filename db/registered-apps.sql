CREATE TABLE IF NOT EXISTS RegisteredApp (
    app_id VARCHAR(100) NOT NULL PRIMARY KEY,
    display_name VARCHAR(255) NOT NULL,
    database_name VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO RegisteredApp (app_id, display_name, database_name, enabled, sort_order)
VALUES
    ('asset-manager', 'Asset Manager', 'AssetManager', TRUE, 10),
    ('car-care', 'Car Care', 'Car', TRUE, 20),
    ('meisai-lab', 'Meisai Lab', 'meisai-lab', TRUE, 30),
    ('clip-hive', 'Clip Hive', 'clip-hive', TRUE, 40),
    ('subscription-lists', 'Subscription Lists', 'subscribe-lists', TRUE, 50)
ON DUPLICATE KEY UPDATE
    display_name = VALUES(display_name),
    database_name = VALUES(database_name),
    enabled = VALUES(enabled),
    sort_order = VALUES(sort_order);
