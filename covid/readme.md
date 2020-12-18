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

```javascript
const { install } = importModule('/modules/moduler')
const { CovidStat } = await install('covid')

let covidStat = new CovidStat()
await covidStat.present()
```

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
weeklyChart | Boolean | false | Widget의 리프레시 시간을 결정 (초) | 1.1.0
fillOpaque | Float | .7 | Widget의 리프레시 시간을 결정 (초) | 1.1.0

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

```javascript

```

### ii) CovidStatLive Class

> CovidStat(전일 확진자 기준) Widget 클래스의 API를 살펴봅니다.

## IV. 삭제하기

## V. 버전 히스토리

| 버전 | 변경내용 | 배포일자 |
:-: | :---- | :-:
1.1.0 | 모듈 기반 구조로 변경 (Moduler)<br/>주간 확진자 현황 그래프 반영 | 2020/12/18 
1.0.0 | 초기 버전 배포 | 2020/11/23 '

## VI. 종속 모듈

> CovidStat / CovidStatLive Widget의 종속 모듈 관계는 다음과 같습니다.

* [covid](https://github.com/scriptable-apps/modules/blob/main/covid/index.js)
  * [covidbase](https://github.com/scriptable-apps/modules/blob/main/covidbase/index.js)
  * [simplechart](https://github.com/scriptable-apps/modules/blob/main/simplechart/index.js)
