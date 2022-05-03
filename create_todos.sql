-- truncate table 문법이 없음
DROP TABLE IF EXISTS todo;

CREATE TABLE todo(
	id integer primary key autoincrement,
	name text not null,
    done integer not null default 0,
    created text not null default (datetime('now','localtime')),
    updated text not null default (datetime('now','localtime')),
	todos text		-- 콤마로 구분된 숫자열, ex) '11,12'
	-- @AfterLoad 계산필드: arrtodos number[]
);
-- 굳이 strict 모드를 쓸 필요 없음 (데이터로 인한 에러 방지)
-- 데이터 관리의 편리를 위해 foreign key 관계를 만들지 않음
-- JSON 등의 object를 취급하는 컬럼 타입이 없음 -> text 사용

INSERT INTO todo VALUES
	(11, '와이즐리 제품', 1, '2022-04-04 12:00:00', '2022-04-04 12:00:00', null),
	(12, '리필면도날 4개입', 0, '2022-04-05 12:00:00', '2022-04-09 12:00:00', null),
	(13, '면도기 스타터세트', 0, '2022-04-06 12:00:00', '2022-04-12 12:00:00', '11,15,17'),
	(14, '쉐이빙젤 150mL', 0, '2022-04-07 12:00:00', '2022-04-07 12:00:00', null),
	(15, '애프터쉐이브 60mL', 0, '2022-04-08 12:00:00', '2022-04-08 12:00:00', null),
	(16, '면도기 핸들+트래블 커버', 0, '2022-04-09 12:00:00', '2022-04-11 12:00:00', '17'),
	(17, '면도기 트래블 커버', 1, '2022-04-10 12:00:00', '2022-04-11 12:00:00', null),
	(18, '클렌징폼 180mL', 0, '2022-04-12 12:00:00', '2022-04-12 12:00:00', null),
	(19, '부스터 80mL', 0, '2022-04-13 12:00:00', '2022-04-14 12:00:00', null),
	(20, '로션 100mL', 0, '2022-04-15 12:00:00', '2022-04-15 12:00:00', null),
	(21, '선크림 45mL', 0, '2022-04-16 12:00:00', '2022-04-17 12:00:00', null),
	(22, '탈모 고민용 샴푸 500mL', 0, '2022-04-22 12:00:00', '2022-04-23 12:00:00', '25'),
	(23, '비듬 고민용 샴푸 500mL', 0, '2022-04-24 12:00:00', '2022-04-24 12:00:00', '26'),
	(24, '두피 건강 개선 샴푸 500mL', 0, '2022-04-21 12:00:00', '2022-04-21 12:00:00', null),
	(25, '탈모 고민용 부스터 100mL', 0, '2022-04-18 12:00:00', '2022-04-18 12:00:00', null),
	(26, '비듬 고민용 부스터 100mL', 1, '2022-04-19 12:00:00', '2022-04-20 12:00:00', null),
	(27, '에너지 포커스 60정', 0, '2022-04-25 12:00:00', '2022-04-26 12:00:00', null),
	(28, '혈앵,눈건강,기억력 오메가3', 0, '2022-04-29 12:00:00', '2022-04-29 12:00:00', '29'),
	(29, '눈건강 아스타잔틴', 0, '2022-04-27 12:00:00', '2022-04-28 12:00:00', null),
	(30, '뼈,신경,근육엔 칼슘마그네슘', 0, '2022-04-30 12:00:00', '2022-04-30 12:00:00', null),
	(31, '항산화,면역 프로폴리스', 0, '2022-04-27 12:00:00', '2022-04-27 12:00:00', null),
	(32, '자연유래 성분 치약', 0, '2022-04-14 12:00:00', '2022-04-14 12:00:00', null),
	(33, '잇몸케어 칫솔', 1, '2022-04-05 12:00:00', '2022-04-06 12:00:00', null),
	(34, '잇몸케어 칫솔 4개입', 0, '2022-04-11 12:00:00', '2022-04-11 12:00:00', '33'),
	(35, '치석케어 칫솔', 0, '2022-04-07 12:00:00', '2022-04-08 12:00:00', null),
	(36, '치석케어 칫솔 4개입', 0, '2022-04-12 12:00:00', '2022-04-12 12:00:00', '35'),
	(37, '칫솔 거치대', 0, '2022-04-09 12:00:00', '2022-04-10 12:00:00', null)
;

-- autoincrement 시작 위치 지정
DELETE FROM sqlite_sequence WHERE name='todo';
INSERT INTO sqlite_sequence(name, seq) VALUES('todo', 40);

-- ERROR: primary 또는 unique 제약이 없으면 conflict가 작동 안함
-- 참고) upsert 문법이 없음
-- INSERT INTO sqlite_sequence(name, seq) VALUES('todo',10)
-- ON CONFLICT(name) DO NOTHING;

-- 1) 스크립트 실행
-- sqlite3 todos.db < create_todos.sql

-- 2) 내용 확인
-- sqlite3 todos.db -header -column
-- > pragma table_info('todo');
-- > select * from todo;
