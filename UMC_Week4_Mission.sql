CREATE DATABASE umc_study;
USE umc_study;

-- 1. 지역(Region) 테이블 생성
CREATE TABLE region (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

-- 2. 음식 카테고리(Food Category) 테이블 생성
CREATE TABLE food_category (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(15) NOT NULL
);

-- 3. 회원(Member) 테이블 생성
CREATE TABLE member (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20),
    gender VARCHAR(10),
    birth_date DATE,
    address VARCHAR(100),
    email VARCHAR(50),
    phone_num VARCHAR(15),
    nickname VARCHAR(20),
    point INT DEFAULT 0,
    status VARCHAR(15),
    inactive_date DATETIME,
    created_at DATETIME(6),
    updated_at DATETIME(6)
);

-- 4. 가게(Store) 테이블 생성 (region_id, category_id를 외래키로 가짐)
CREATE TABLE store (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    region_id BIGINT,
    category_id BIGINT,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(100),
    score FLOAT DEFAULT 0.0,
    FOREIGN KEY (region_id) REFERENCES region(id),
    FOREIGN KEY (category_id) REFERENCES food_category(id)
);

-- 5. 미션(Mission) 테이블 생성
CREATE TABLE mission (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    store_id BIGINT,
    reward INT,
    deadline DATETIME,
    mission_spec TEXT,
    FOREIGN KEY (store_id) REFERENCES store(id)
);