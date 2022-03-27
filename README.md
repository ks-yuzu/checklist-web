## usage
public 直下に config.yaml を置き、同ディレクトリをブラウザで開く

例
```yaml
title: サンプルチェックリスト

nav:
- text: Link1
  url:  https://example.com
- type: dropdown
  text: Dropdown1
  dropdown:
  - type: header
    text: カテゴリ1
  - text: SubItem1
    url:  https://example.com/foo
  - text: SubItem2
    url:  https://example.com/bar
  - type: divider
  - type: header
    text: カテゴリ2
  - text: SubItem3
    url:  https://example.com/baz

checklists:
- title: チェックリスト1
  baseTime: 13:00
  checklist: &checklist
  - timeOffset: -10
    summary: 事前XXXX
    details: XXXX しておく
  - timeOffset: 0
    summary: YYYY
    details: null
  - timeOffset: 30
    summary: |-
      foo<br>
      bar<br>
    details: |-
      ZZZZ<br>
      <ul><li>aaa</li>
          <li>bbb</li>
          <li>ccc</li>
      </ul>
  - timeOffset: 95
    summary: 確認
    details: |-
      <ul><li><a href="https://example.com/xxx">link A</a></li>
          <li><a href="https://example.com/yyy">link B</a></li>
      </ul>
  active: true
- title: チェックリスト2
  baseTime: 15:00
  checklist: *checklist
- title: チェックリスト3
  baseTime: 16:00
  checklist: *checklist

highlight:
  done:
   #color: '#606060 !important'
   #background: '#484848'
  delayed:
   #lefttime: 0
   #color: white
   #background: rgb(225, 145, 0)
  urgent:
    lefttime: 3
   #background: red

timer:
  enabled: true
  minutes: 5
 #soundUrl: https://smar-tone.com/data/su804.mp3 
  soundUrl: /my-sound.mp3  # 同じディレクトリ (public) 直下のファイル
```

```
$ (cd public && python3 -m http.server 8000)
$ open localhost:8000
```


## build
```
npm i
npm run build
```

## develop
```
npm i
npm run dev
```
