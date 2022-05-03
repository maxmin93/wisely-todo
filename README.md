<p align="center">
  <a href="https://www.sqlite.org/" target="blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/SQLite370.svg/1280px-SQLite370.svg.png" width="180" alt="Sqlite Logo" /></a>
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="180" alt="Nest Logo" /></a>
  <a href="https://angular.io/" target="blank"><img src="https://angular.io/assets/images/logos/angular/angular.png" width="200" alt="Angular Logo" /></a>
</p>

## Description

`Wisely Todo` 는 Todo 를 기록하고, 조회할 수 있는 간단한 웹애플리케이션입니다.<br>

- Todo 리스트와 Todo 상세 페이지로 구성됩니다.
- Todo 를 등록하고 수정하거나 삭제할 수 있습니다.
  - Todo 를 삭제하는 경우, 하위 Todo 로 등록한 상위 Todo 들도 함께 수정됩니다. (update cascade)
- Todo 는 하위에 여러 Todo 를 등록할 수 있지만, Depth=1 만 허용합니다.
  - 하위에 Todo 를 가진 경우 Todo 리스트에서 숫자 아이콘이 표시됩니다.
  - 하위 Todo 에 대한 추가/삭제는 Todo 상세 페이지에서 할 수 있습니다.
- `node dist-server/main` 실행시 API 서버와 웹애플리케이션이 함께 시작됩니다.
  - Todo 저장소로 `Sqlite` 를 사용하였습니다. (파일DB: `todos.db`)
  - Todo 기본 데이터로 `WiselyCompany` 의 제품들이 들어 있습니다.

## Installation & Build

`Wisely Todo` 은 node 를 기반으로 백엔드 nestjs 와 프로트엔드 angular 를 사용하여 만들어졌습니다.

- node 16.14.1 (npm 8.5.0)
- @nestjs/cli 8.0.0
- @angular/cli 13.3.4

```bash
# node 설치
$ brew install node@16

# sqlite3 설치
$ brew install sqlite

# @nestjs/cli 설치
$ npm i -g @nestjs/cli

# @angular/cli 설치
$ npm i -g @angular/cli

# 소스 다운로드 및 이동
$ git clone https://github.com/maxmin93/wisely-todo
$ cd wisely-todo

# 라이브러리 설치
$ npm run prebuild

# 백엔드 및 프론트엔드 빌드 (build:server + build:client)
$ npm run build

# 빌드 결과 확인
$ ls dist-server dist-client
```

### sources 설명

- `{{SOURCE_ROOT}}` nestjs 프로젝트 루트
- `{{SOURCE_ROOT}}/dist-server` nestjs 빌드 출력
- `{{SOURCE_ROOT}}/angular` angular 프로젝트 루트
- `{{SOURCE_ROOT}}/dist-client` angular 빌드 출력
- `{{SOURCE_ROOT}}/create_todos.sql` sqlite 생성 스크립트
- `{{SOURCE_ROOT}}/todos.db` sqlite 파일DB
- `{{SOURCE_ROOT}}/docs` readme 용 이미지 파일들

## Running the app

angular 빌드 파일들은 nestjs 서버 기동시 static 컨텐츠로 함께 로딩됩니다.<br>
때문에 nestjs 서버만 기동하면 프론트엔드와 백엔드가 모두 시작됩니다.

서버 시동 후 브라우저로 [http://localhost:3000/](http://localhost:3000/) 을 열면 됩니다.

```bash
# development mode
$ npm run start

# production mode
$ npm run start:prod
```

![todo-server](/docs/todo-server.png)

## Test

`Wisely Todo` 의 unit(controller) 및 end-to-end 테스트를 수행합니다.

```bash
# unit tests
$ npm run test
...
 FAIL  src/todo/todo.controller.spec.ts
  TodoController
    select TODO
      ✓ /api/todo/all (12 ms)
      ✓ /api/todo/11 (2 ms)
      ✓ /api/todo/ids/11,12
      ✓ /api/todo/pages/0 (1 ms)
      ✓ /api/todo/candidates/0?excludes=11
    create, update, delete TODO
      ✓ create Todo{ name } (15 ms)
      ✓ update Todo{ arrtodos } (8 ms)
      ✓ delete Todo{ id } (3 ms)
      ✕ update Todo{ arrtodos } cascade by delete (2 ms)
...

# e2e tests (잘 되었던게 안됨)
$ npm run test:e2e
```

## Sqlite Database

`todos.db` (Sqlite DB파일) 의 데이터 손상시 `create_todos.sql` 을 이용해 복구할 수 있습니다.

- Todo 저장에 사용된 테이블은 `todo` 입니다.
- `id` 는 저장시 자동으로 생성됩니다. (auto-increment)
- `name` 은 Todo 의 이름입니다.
- `todos` 는 하위 Todo 의 id 리스트(콤마로 연결된 문자열)입니다.

```bash
# DB 오류시 스크립트 실행으로 재생성
$ sqlite3 todos.db < create_todos.sql

# 내용 확인
$ sqlite3 todos.db -header -column

> pragma table_info('todo');
cid  name   type          notnull  dflt_value  pk
---  -------  ------------  -------  ---------------------------  --
0    id       integer       1                                     1
1    name     varchar(200)  1                                     0
2    done     integer       1        0                            0
3    created  varchar(20)   1        datetime('now','localtime')  0
4    updated  varchar(20)   1        datetime('now','localtime')  0
5    todos    varchar       0                                     0

> select * from todo where created > '2022-04-29';
id  name               done  created              updated              todos
--  -----------------  ----  -------------------  -------------------  -----
28  혈앵,눈건강,기억력 오메가3    0     2022-04-29 12:00:00  2022-04-29 12:00:00  29
30  뼈,신경,근육엔 칼슘마그네슘    0     2022-04-30 12:00:00  2022-04-30 12:00:00
38  hello new Todo 38  0     2022-05-04 01:18:44  2022-05-04 01:22:23  18,19

> .quit
```

## REST API

`http://localhost:3000/api/todo` 아래에 api 를 등록해 놓았습니다.

### select APIs

- GET [http://localhost:3000/api/todo/all](http://localhost:3000/api/todo/all) : 모든 Todo 반환
- GET [http://localhost:3000/api/todo/13](http://localhost:3000/api/todo/13) : 특정 Todo 반환
- GET [http://localhost:3000/api/todo/ids/11,12,15](http://localhost:3000/api/todo/ids/11,12,15) : 특정 Id 리스트의 Todo 반환
- GET [http://localhost:3000/api/todo/pages/1](http://localhost:3000/api/todo/pages/1) : 특정 페이지 Todo 반환
  - GET [http://localhost:3000/api/todo/pages/2?size=3](http://localhost:3000/api/todo/pages/2?size=3) : size 파라미터
- GET [http://localhost:3000/api/todo/candidates/2?excludes=11,12](http://localhost:3000/api/todo/candidates/2?excludes=11,12) : 하위 Todo 후보의 페이지 반환
  - 하위 Todo 후보는 전체 Todo 에서 아래 조건을 포함하는 Todo 만으로 제한합니다.
    - 완료 상태 Todo 제외
    - 포함될 상위 Todo 제외
    - 하위 Todo를 가진 Todo 제외

### search

- POST `http://localhost:3000/api/todo/search` : Todo 검색
  - body `{ "size": 5, "page": 0, "done": true }`

### create, update, delete APIs

- POST `http://localhost:3000/api/todo` : Todo 추가
  - body `{ "name": "hello40", "done": false }`
- PUT `http://localhost:3000/api/todo/40` : Todo 수정
  - body `{ "id": 40, "name": "hello40", "done": true, "arrtodos": [11,42] }`
- DELETE `http://localhost:3000/api/todo/40` : Todo 삭제

## UI (Screens)

### Todo 리스트 페이지

기본 페이지로 사용되고, Todo 를 등록/삭제하거나 리스트를 조회합니다.

- 리스트 상에서 완료된 Todo 는 id 아래에 주황색 표시로 강조됩니다.
- 하위 항목이 있는 경우 오른쪽에 숫자가 표시됩니다.

![todo-list](/docs/todo-list.png)

상단 입력상자와 `Add todo` 버튼으로 Todo 를 등록할 수 있습니다.<br>
(추가된 상태를 쉽게 알아보기 위해 리스트 상단에 출력하도록 했습니다)

![todo-list-insert](/docs/todo-list-insert.png)

검색 결과와 pagination 을 연동하였습니다.<br>
(검색 옵션 변경시 pagination 도 변경됨)

![todo-list-pagination](/docs/todo-list-pagination.png)

검색 옵션으로 `done(완료여부)`, `name 검색`, `created 시작일`, `created 종료일` 을 사용할 수 있습니다.<br>

- name 검색어에 대해 특수문자를 삭제 처리 후 매칭
- created 시작일과 종료일은 "YYYY-MM-DD" 형식을 확인후 매칭

![todo-list-search-done](/docs/todo-list-search-done.png)

![todo-list-search-name](/docs/todo-list-search-name.png)

![todo-list-search-date](/docs/todo-list-search-date.png)

### Todo 상세 페이지

특정 Todo 에 상세 내용을 조회하고, 하위 Todo 를 추가/삭제합니다.<br>
하위 Todo 는 다이얼로그 창을 통해 선택합니다.

![todo-detail-done](/docs/todo-detail-done.png)

하위 Todo 선택을 위한 다이얼로그 창은 `add sub-todo` 버는을 누르면 나타납니다.<br>
선택 가능한 하위 Todo의 조건은 미완료 상태이고, 하위 Todo 가 없는 항목들입니다.

![todo-detail-dialog](/docs/todo-detail-dialog.png)

`save` 버튼을 누르면 Todo 의 내용이 변경됩니다.<br>
(변경 가능한 항목은 name, done, 하위 Todo 리스트 입니다)

![todo-detail-update](/docs/todo-detail-update.png)

하위 Todo 항목에 미완료 Todo 가 포함된 경우 `Done 체크박스` 가 비활성화 됩니다.<br>
(완료 상태이더라도 미완료 Todo 가 추가된 경우 미완료 상태로 변경됩니다)

![todo-detail-undone](/docs/todo-detail-undone.png)

## License

`Wisely Todo` is [MIT licensed](LICENSE).
