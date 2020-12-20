[Home](/modules/#ii-1-covidstat-widget) > CovidStat Widget
# CovidStat Widget

### 목차

* I. CovidStat / CovidStatLive 소개
* II. 시작하기
* III. API
* IV. 삭제하기
* V. 버전 히스토리
* VI. 종속 모듈

## I. CovidStat / CovidStatLive 소개

## II. 시작하기

### CovidStat 설치 및 실행하기

```javascript
const { install } = importModule('/modules/moduler')
const { CovidStat } = await install('covid')

let covidStat = new CovidStat()
await covidStat.present()
```

> 아래와 같이 Scriptable에 파일을 생성하여 복사한 후 우측 하단의 실행버튼을 클릭합니다.

<img width="450" alt="covid-stat" src="https://user-images.githubusercontent.com/5626425/102713086-e5416680-4308-11eb-982a-3a4c15b2ac43.jpg">

### CovidStatLive 설치 및 실행하기

```javascript
const { install } = importModule('/modules/moduler')
const { CovidStat } = await install('covid')

let covidStat = new CovidStat()
await covidStat.present()
```

> 아래와 같이 Scriptable에 파일을 생성하여 복사한 후 우측 하단의 실행버튼을 클릭합니다.

<img width="450" alt="covid-stat-live" src="https://user-images.githubusercontent.com/5626425/102713085-e2467600-4308-11eb-9f95-88be50f25d29.jpg">

## III. API

### i) CovidStat Class

> CovidStat(전일 확진자 기준) Widget 클래스의 API를 살펴봅니다.

#### Constructor Options

| 옵션 | 타입 | 기본값 | 설명 | 버전 |
:-: | :-: | :-: | :---- | :-:
refreshAfterSeconds | Int | 30 | Widget의 리프레시 시간을 결정 (초) | 1.1.0
titleSize | Int | 17(iPhone) 또는 20(iPad) | 타이틀 글자의 사이즈를 결정 | 1.1.0
countSize | Int | ... | 확진자수 글자의 사이즈를 결정 | 1.1.0
dateSize | Int | 11(iPhone) 또는 14(iPad) | 날짜 글자의 사이즈를 결정 | 1.1.0
weeklyChart | Boolean | false | 지난 7일간의 확진자 현황을 그래프로 표기 | 1.2.0
fillOpaque | Float | .7 | 그래프의 불투명도를 조절 (0 ~ 1) | 1.2.0

> 옵션의 사용은 아래의 코드를 참조 바랍니다.

```javascript
let covidStat = new CovidStat({     
    weeklyChart: true,
    titleSize: 17,
    countSize: 45,
    dateSize: 11,
    refreshAfterSecond: 60,
    fillOpaque: .5,
})
```

> iPhone/iPad별 사이즈를 설정하고 싶을 경우, 아래의 코드를 참조 바랍니다.

```javascript
let covidStat = new CovidStat({     
    titleSize: Device.iPhone() ? 17 : 20,
    countSize: Device.iPhone() ? 45 : 55,
    dateSize: Device.iPhone() ? 11 : 14,
})
```

#### Methods

| 메서드 | 파라메터 | 반환값 | 설명 | 버전 |
:-: | :---- | :-: | :---- | :-:
`async` present | | | CovidStat Widget을 출력 | 1.1.0

> 생성된 Widget을 출력하기 위해서는 아래의 메서드를 호출합니다. (비동기 메서드 이므로 await로 호출합니다)

```javascript
let covidStat = new CovidStat({
    ...
})
await covidStat.present()
```

### ii) CovidStatLive Class

> CovidStatLive(실시간 확진자 현황) Widget 클래스의 API를 살펴봅니다.

#### Constructor Options

| 옵션 | 타입 | 기본값 | 설명 | 버전 |
:-: | :-: | :-: | :---- | :-:
refreshAfterSeconds | Int | 30 | Widget의 리프레시 시간을 결정 (초) | 1.1.0
titleSize | Int | 17(iPhone) 또는 20(iPad) | 타이틀 글자의 사이즈를 결정 | 1.1.0
countSize | Int | ... | 확진자수 글자의 사이즈를 결정 | 1.1.0
dateSize | Int | 11(iPhone) 또는 14(iPad) | 날짜 글자의 사이즈를 결정 | 1.1.0

> 옵션의 사용은 아래의 코드를 참조 바랍니다.

```javascript
let covidStatLive = new CovidStatLive({     
    titleSize: 17,
    countSize: 45,
    dateSize: 11,
    refreshAfterSecond: 60,
})
```

> iPhone/iPad별 사이즈를 설정하고 싶을 경우, 아래의 코드를 참조 바랍니다.

```javascript
let covidStatLive = new CovidStatLive({     
    titleSize: Device.iPhone() ? 17 : 20,
    countSize: Device.iPhone() ? 45 : 55,
    dateSize: Device.iPhone() ? 11 : 14,
})
```

#### Methods

| 메서드 | 파라메터 | 반환값 | 설명 | 버전 |
:-: | :---- | :-: | :---- | :-:
`async` present | | | CovidStatLive Widget을 출력 | 1.1.0

> 생성된 Widget을 출력하기 위해서는 아래의 메서드를 호출합니다. (비동기 메서드 이므로 await로 호출합니다)

```javascript
let covidStatLive = new CovidStatLive({
    ...
})
await covidStatLive.present()
```

## IV. 삭제하기

CovidStat 모듈들 삭제하고 싶을 때에는 다음의 코드를 참조해주세요.

```javascript
const { uninstall } = importModule('/modules/moduler')

uninstall('covid')
```

## V. 버전 히스토리

| 버전 | 변경내용 | 배포일자 |
:-: | :---- | :-:
1.2.0 | 주간 확진자 현황 그래프 반영 | 2020/12/18 
1.1.0 | 모듈 기반 구조로 변경 (Moduler) | 2020/12/15 
1.0.0 | 초기 버전 배포 | 2020/11/23

## VI. 종속 모듈

> CovidStat / CovidStatLive Widget의 종속 모듈 관계는 다음과 같습니다.

* [covid](https://github.com/scriptable-apps/modules/blob/main/covid/index.js)
  * [covidbase](https://github.com/scriptable-apps/modules/blob/main/covidbase/index.js)
  * [simplechart](https://github.com/scriptable-apps/modules/blob/main/simplechart/index.js)
