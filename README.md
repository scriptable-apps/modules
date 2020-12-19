# Prj. Scriptable Modules

**Scriptable Modules 프로젝트**는 [iOS Scriptable App](https://scriptable.app)에서 동작시킬 App들을 **Module기반**으로 작성하여 손쉽게 재사용할 수 있도록 제공합니다.

재사용 가능한 다양한 **공통 컴포넌트**들을 작성하고, 그 기반 위에서 개발된 다양한 **Scriptable Apps**들을 소개해 볼 예정입니다.

많은 관심 부탁드립니다~:)

### 주요기능

* 반복적으로 사용되는 코드를 **module 기반**으로 작성하여 **재사용성**을 높이고 효율적인 개발이 가능하도록 지원
* 모듈 설치시 **종속모듈**을 파악하여 **자동설치** 지원
* Moduler를 통해 설치된 모듈들의 **버전을 관리**하여 개선 버전이 배포되었을 때 **자동 업데이트 지원**
* 미려한 디자인의 다양한 Scriptable App 배포 예정~:)

### 목차
* [I. 시작하기](#i-시작하기)
  * [I-1. Moduler 설치](#i-1-moduler-설치)
  * [I-2. Hello World (정상 설치 확인)](#i-2-hello-world-정상-설치-확인)
  * [I-3. Moduler를 이용한 재사용 Module의 설치](#i-3-moduler를-이용한-재사용-module의-설치)
  * [I-4. 설치된 Modules 삭제](#i-4-설치된-modules-삭제)
* [II. App Modules 소개](#ii-app-modules-소개)
  * [II-1. CovidStat Widget](#ii-1-covidstat-widget)
  * [II-2. Artvee Widget](#ii-2-artvee-widget)
* [III. Component Modules 소개](#iii-component-modules-소개)
  * [III-1. Store](#iii-1-store)
  * [III-2. SimpleChart](#iii-2-simplechart)
* [IV. 3rd Modules 소개](#iv-3rd-modules-소개)
  * [IV-1. Lodash](#iv-1-lodash)
  * [IV-2. Moment.js](#iv-2-momentjs)
* [V. Feedback](#v-feedback)
  
## I. 시작하기

### I-1. Moduler 설치

**Moduler**는 Scriptable Modules 프로젝트에서 개발된 모듈들을 **자동설치** / **자동업데이트**를 지원하는 재사용 모듈입니다. **Scriptable Modules** 프로젝트에서 개발되는 **App의 사용을 위해서는 반드시 설치가 필요**하므로 아래의 가이드 라인을 참조하여 설치를 진행해주세요.

> 아래의 코드를 Scriptable App에 복사하여 실행해 주세요.

```javascript
let fm = FileManager.iCloud()
let dir = fm.documentsDirectory()
const baseDirs = [`${dir}/modules`, `${dir}/modules/moduler`]

baseDirs.forEach(dir => {
    if (!fm.isDirectory(dir)) {
        fm.createDirectory(dir)    
    }
})

let request = new Request('https://scriptable-apps.github.io/modules/moduler/index.js')
let moduleFile = await request.loadString()
fm.writeString(`${baseDirs[1]}/index.js`, moduleFile)

await importModule('/modules/moduler').hello()
```

> 설치가 정상적으로 진행되었다면, 아래와 같이 Notification이 화면에 출력됩니다.

<img width="450" alt="install-complete" src="https://user-images.githubusercontent.com/5626425/102679856-3d3b7880-41f6-11eb-85e3-5c768513b198.jpeg">

> 모듈이 설치된 위치의 확인은, 파일 앱에서 `iCloud Drive > Scriptable` 위치로 이동해 보시면, **modules 폴더**가 생성되어 있고 그 하위에 **moduler가 정상적으로 설치**된 것을 확인 할 수 있습니다.

### I-2. Hello World (Moduler 정상동작 확인)

Moduler의 설치가 완료되었으니, 정상적으로 설치되었는지 확인하기 위해 Hello World를 실행해 볼까요?

> 아래의 코드를 Scriptable App에 복사하여 실행해 주세요.

```javascript
const { install } = importModule('/modules/moduler')
const { hello } = await install('hello')

hello('julio')
```

위의 코드가 정상적으로 실행이 되었다면, **hello** 모듈을 포함한 **종속모듈이 같이 설치**되고 아래와 같이 **Notification이 출력**됩니다.

<img width="450" alt="hello-module" src="https://user-images.githubusercontent.com/5626425/102562109-b31de200-4119-11eb-9d69-8a59eb15b311.jpeg">

### I-3. Moduler를 이용한 재사용 Module의 설치

Scriptable Modules 프로젝트에서 개발된 모듈은 Moduler의 **install**을 통해 설치할 수 있습니다.

예를 들어, [CovidStat Widget](#ii-1-covidstat-widget)의 특정 클래스를 사용한다고 했을 때 아래와 같이 import를 수행할 수 있습니다.

```javascript
const { install } = importModule('/modules/moduler')

// covid module에서 CovidStat 클래스를 import
const { CovidStat } = await install('covid')
...
```

> **install** 수행시에 개선된 새로운 버전이 발견되면, 자동 업데이트를 수행한 후 Import를 진행합니다.

### I-4. 설치된 Modules 삭제

만약에, 설치된 모듈들 삭제하고 싶을 때에는 다음의 코드를 참조해주세요.

```javascript
const { list, uninstall } = importModule('/modules/moduler')

// 특정 모듈을 직접 Uninstall
uninstall('covid')

// 현재 설치된 모듈들을 불러와 하나씩 Uninstall을 진행
list().map(ver => ver.name).forEach(ver => uninstall(ver))
```

> 이제 본격적으로 Scriptable Modules 프로젝트에서 개발 중인 모듈들을 소개해 보겠습니다~:)

## II. App Modules 소개

### II-1. CovidStat Widget

#### CovidStat Widget (코로나 확진자 현황 위젯)

<img width="450" alt="covid-stat-preview" src="https://user-images.githubusercontent.com/5626425/102501997-6ad2d580-40c1-11eb-9f1c-ee0680dcae70.png">

#### CovidStatLive Widget (코로나 확진자 실시간 현황 위젯)

<img width="450" alt="covid-stat-live-preview" src="https://user-images.githubusercontent.com/5626425/102680654-8d6a0900-41fd-11eb-908b-6cdd9fdbe363.png">


#### i) 시작하기

Moduler를 통한 CovidStat Widget의 설치는 매우 간단합니다. (아래의 코드를 실행하기 전에 반드시 [Moduler가 설치](#i-1-moduler-설치)되어 있어야 합니다.)

> 아래의 코드를 복사해서 Scriptable App에서 실행해 주세요.

##### CovidStat Widget 설치 및 실행하기

```javascript
const { install } = importModule('/modules/moduler')
const { CovidStat } = await install('covid')

let covidStat = new CovidStat()
await covidStat.present()
```

##### CovidStatLive Widget 설치 및 실행하기

```javascript
const { install } = importModule('/modules/moduler')
const { CovidStatLive } = await install('covid')

let covidStatLive = new CovidStatLive()
await covidStatLive.present()
```

#### ii) 세부 옵션 사용하기

Widget에 변경을 전달할 수 있는 일부 세부사항들은 **options를 전달**하여 표기할 수 있습니다.

예를 들어, CovidStat Widget에서 다음의 세부사항의 변경을 하려면,
* Widget 갱신 시간을 기존 1분으로 증가 (default 30초)
* 주간 확진자 현황 그래프를 Widget 배경으로 표기 (default 표기안함)

```javascript
const { install } = importModule('/modules/moduler')
const { CovidStat } = await install('covid')

let covidStat = new CovidStat({
    weeklyChart: true, // 주간 확진자 현황 그래프 표기
    refreshAfterSeconds: 60 // Widget 갱신시간 60초
})
await covidStat.present()
```

그 밖의 **자세한 세부 옵션사항**들에 대해서는 **아래의 문서**에서 확인 바랍니다.

* [CovidStat Widget 자세히 살펴보기](/modules/covid)

### II-2. Artvee Widget

> 공개된 미술 작품(Public Domain Artwork)을 소개하는 사이트인 [Artvee](https://artvee.com)의 작품들을 위젯으로 감상할 수 있습니다.
>
> 12월 중, 공개 예정입니다~:)

<img width="450" alt="artsen-preview" src="https://user-images.githubusercontent.com/5626425/102680886-184c0300-4200-11eb-8478-44b3a0e1177d.png">

## III. Component Modules 소개

Scriptable App 에서 사용 할 수 있는 직접 제작한 **재사용 컴포넌트**들을 추가하고 있습니다. 아래의 재사용 컴포넌트를 활용하여 Scriptable App 개발시 생산성을 높여보세요.

### III-1. Store

> **JSON 기반의 데이터 스토어**를 Local에 구성하고 사용할 수 있도록 제공합니다. **저장유형(기간)**에 따라 **Temporary** / **Cache** / **Documents** 형태의 저장이 가능하고, **직관적인 API를 제공**할 예정입니다.
>
> 활용 예시라면, [Artvee Widget](#ii-2-artvee-widget)에서는 Artwork을 매번 로딩하게 되면 성능문제가 있어서, 초기 로딩한 Artwork들을 Store에 저장하여 재사용하도록 구현했습니다.
>
> API가 확정되는 대로 공개 해보겠습니다~:)

### III-2. SimpleChart

> **Widget**에 어울리는 **심플한 스타일**의 기본 **Chart Set**을 기획하고 있습니다. ([CovidStat Widget](#ii-1-covidstat-widget)의 배경 차트가 Pilot으로 만들어본 SimpleAreaChart입니다. 조금 거칠죠...)
>
> 기본적인 Chart Set이 완성될 시점에 API를 확정할 계획이어서 조금 시간이 걸릴 수 있을 것 같네요... 최대한 공개를 서둘러 보겠습니다~:)

## IV. 3rd Modules 소개

Scriptable App 에서 사용가능한 유용한 **3rd 라이브러리**들을 추가하고 있습니다. 아래의 라이브러리를 활용하여 Scriptable App 개발시 생산성을 높여보세요.

### IV-1. Lodash

Lodash는 Javascript Utility Library로 Array, Collection, Date, Number, String, Object등을 손쉽게 다룰 수 있는 다양한 기능을 제공합니다.

#### i) Lodash 설치

```javascript
const { install } = importModule('/modules/moduler')

const lodash = await install('lodash')
// 전달받은 문자의 첫번째 글자를 대문자로 전환하여 반환: Julio
console.log(lodash.capitalize('julio'))
...
```

#### ii) Lodash의 자세한 가이드

* [Homepage (https://lodash.com)](https://lodash.com)
* [Documentation (https://lodash.com/docs/4.17.15)](https://lodash.com/docs/4.17.15)

### IV-2. Moment.js

Moment.js는 Date를 직관적이고 효율적으로 다룰 수 있는 다양한 기능을 제공합니다.

#### i) Moment.js 설치

```javascript
const { install } = importModule('/modules/moduler')

const moment = await install('moment')
// 현재 날짜를 전달받은 Date Format에 맞추어 반환: 2020/12/17 11:00:00
console.log(moment().format('YYYY/MM/DD HH:mm:ss'))
...
```

#### ii) Moment.js의 자세한 가이드

* [Homepage (https://momentjs.com)](https://momentjs.com)
* [Documentation (https://momentjs.com/docs/)](https://momentjs.com/docs/)
* [Guides (https://momentjs.com/guides/)](https://momentjs.com/guides/)


## V. Feedback

> Scriptable Modules 프로젝트는 개발 피드백을 받고 있습니다~:)

Module을 사용하시면서 **버그로 인한 불편한 점**이나, **개선사항이 필요하신 경우** 아래의 이슈 링크에서 진행 부탁드립니다.

* [Scriptable modules issues](https://github.com/scriptable-apps/modules/issues)
