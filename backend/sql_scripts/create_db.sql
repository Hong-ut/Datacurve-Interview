-- to access the mysql server on server.js
-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Aga2me0827.';

CREATE DATABASE code_submissions;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255),
    user_name VARCHAR(255)
);

INSERT INTO users (user_id, user_email, user_name) VALUES (1, '7594hsj@gmail.com', 'sungjin');

CREATE TABLE submissions (
    submission_id INT AUTO_INCREMENT PRIMARY KEY, 
    code LONGTEXT,
    output LONGTEXT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ALTER TABLE submissions ADD COLUMN output LONGTEXT;
