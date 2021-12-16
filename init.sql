CREATE DATABASE albumapi_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER albumapi@localhost IDENTIFIED BY 'albumapi2021';
GRANT ALL PRIVILEGES ON albumapi_dev.* TO albumapi@localhost;
FLUSH PRIVILEGES;

CREATE DATABASE albumapi_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON albumapi_test.* TO albumapi@localhost;
FLUSH PRIVILEGES;