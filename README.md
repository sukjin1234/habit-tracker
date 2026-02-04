# Obsidian 습관 트래커 플러그인

Obsidian에서 습관을 추적하고 관리할 수 있는 플러그인입니다.

## 주요 기능

- **습관 관리**: 공부, 운동, 독서 등 여러 습관을 한곳에서 관리
- **3단계 달성도**: 각 습관별 목표 단계 설정 (예: 10분 / 1시간 / 3시간)
- **캘린더 뷰**: 월별 캘린더에서 날짜 클릭으로 달성 여부 기록
- **스트릭 & 통계**: 이번 달 달성도, 현재 스트릭 확인
- **설정**: 습관 추가/수정/삭제, 레벨 및 색상 커스터마이징
- **자동 저장**: 모든 데이터는 Vault 내 `habits.json` 파일에 저장

## 설치 방법

### 방법 1: 수동 설치

1. [Releases](https://github.com/sukjin1234/obsidianPlugin/releases/) 페이지에서 최신 버전 다운로드
2. `main.js`, `manifest.json`, `styles.css` 파일 다운로드
3. Vault의 `.obsidian/plugins/habit-tracker/` 폴더 생성
4. 다운로드한 3개 파일을 해당 폴더에 복사
5. Obsidian 재시작
6. 설정 → 커뮤니티 플러그인 → "습관트래커" 활성화

```
YourVault/
└── .obsidian/
    └── plugins/
        └── habit-tracker/
            ├── main.js
            ├── manifest.json
            └── styles.css
```

### 방법 2: 직접 빌드

```bash
cd habit-tracker
npm install
npm run build
```

생성된 `main.js`, `manifest.json`, `styles.css`를 Vault의 `.obsidian/plugins/habit-tracker/`에 복사한 후 Obsidian에서 플러그인을 활성화하세요.

## 사용 방법

### 플러그인 열기

- **리본 아이콘**: 왼쪽 사이드바의 체크 아이콘 클릭
- **커맨드 팔레트** (`Ctrl/Cmd + P`):
  - "습관 트래커 사이드바에서 열기" - 오른쪽 사이드바에서 열기
  - "습관 트래커 새 탭에서 열기" - 메인 영역에서 탭으로 열기

### 습관 기록하기

1. 상단 탭에서 습관 선택
2. 캘린더에서 날짜 클릭
3. 달성한 레벨 선택 (안함 / 레벨1 / 레벨2 / 레벨3)

### 습관 설정

1. 우측 상단 ⚙️ 아이콘 클릭
2. 습관 추가, 수정, 삭제
3. 각 습관의 레벨 목표와 색상 변경 가능

## 데이터 저장

- 저장 위치: Vault 루트의 `habits.json`
- Obsidian 동기화 시 자동으로 백업됨

## 개발

```bash
npm install
npm run dev    # watch 모드
npm run build  # 프로덕션 빌드
```

## 라이선스

MIT
