# Gulp BEM tmpl-specs updater
[![travis build](https://img.shields.io/travis/MadMed677/gulp-bem-tmpl-specs-updater.svg?style=flat-square)](https://travis-ci.org/MadMed677/gulp-bem-tmpl-specs-updater)
[![codecov coverage](https://img.shields.io/codecov/c/github/MadMed677/gulp-bem-tmpl-specs-updater.svg?style=flat-square)](https://codecov.io/gh/MadMed677/gulp-bem-tmpl-specs-updater)
![npm release](https://img.shields.io/github/release/MadMed677/gulp-bem-tmpl-specs-updater.svg?style=flat-square)
[![npm downloads](https://img.shields.io/npm/dm/gulp-bem-tmpl-specs-updater.svg?style=flat-square)](https://www.npmjs.com/package/gulp-bem-tmpl-specs-updater)
![github tags](https://img.shields.io/github/tag/MadMed677/gulp-bem-tmpl-specs-updater.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/gulp-bem-tmpl-specs-updater.svg?style=flat-square)](https://www.npmjs.com/package/gulp-bem-tmpl-specs-updater)

Плагин, для проверки и обновления шаблонов в magic-bundles и исходных блоках. Нужен для автоматической правки тестов.
При запуске gulp плагина, проверяет magic-bundles и исходные тесты, если они различаются, то
плагин показывает ошибки не совпадения в шаблонах и спрашивает, нужно ли заменить шаблоны.

### Для чего

С помощью этого плагина, вы можете быстро править тесты, если вы уверены в том, что замена будет корректной.
Помогает не ходить по файловой системе и не править все эти файлы вручную, то есть автоматизирует этот процесс.

### Как пользоваться

1. Создать gulp таск
2. В параметрах передать пути к `magic-bundles` и к `blocks`

Пример:

```js
const bemReplacer = require('gulp-bem-tmpl-specs-updater');
const gulp = require('gulp');

gulp.task('updater-tmpl-specs', () =>
    gulp.src(['./magic-bundles/**/*.html', './blocks/**/*.tmpl-specs/*.html'], {
        base: './'
    })
        .pipe(bemReplacer())
);
```

После каждого не совпадающего теста, будет выходит _prompt_ о сообщении, нужно ли заменить
эталонный тест.

### Как работает

Плагин, на данный этап, **НЕ** принимает параметры. Она достаточно сильно завязана на файловую структуру
(будет изменено в ближайшем релизе). Все файлы она ищет в папке `blocks`. Точка входа для файлов проверки:
`magic-bundles`, для эталонных любая папка, любой вложенности. Главное, чтобы в ней были папки, формата `*.blocks`.
Именно по этому паттерну и ищет плагин. Ниже будет приведен пример файловой структуры.

```
├── blocks/
|   ├── magic-bundles/
|   ├── ├── desktop.blocks/
|   ├── ├── ├── user/
|   ├── ├── ├── ├── user.tmpl-specs/
|   ├── ├── ├── ├── ├── 10-empty.html
|   ├── ├── ├── ├── ├── 20-simple.html
|   └── └── └── └── └── 30-extended.html
|   └── └── touch-pad
|   └── └── touch-phone
|   ├── yamoney-project
|   ├── ├── common.blocks
|   ├── ├── ├── user/
|   ├── ├── ├── ├── user.tmpl-specs/
|   ├── ├── ├── ├── ├── 10-empty.html
|   ├── ├── ├── ├── ├── 20-simple.html
|   └── └── └── └── └── 0-extended.html
|   └── └── desktop.blocks
```

В данном примере произойдет следующее:

1. Плагин пойдет по структуре magic-bundles и найдет первый файл формата `*.tmpl-specs`
этим файлом окажется 10-empty.html, лежащий в `user`.
2. Затем, он найдет точно такой же файл, но в yamoney-projects. Но сделает это по уровням,
Например, для уровня `desktop`, плагин сначала попробует найти его в `desktop`, а потом в `common`.
Для планшета `touch-pad`, произойдет проверка в `touch-pad` -> `touch` -> `common`.
3. После того, как плагин нашел файлы, он начнет их сравниват, если они НЕ идентичные, то
покажет пользователю различия и спросит, хочет ли тот сделать замену html.
4. После выбора пользователя, пойдет искать след. файл.


### Таблица принипов поиска по блокам

| Название уровня блока в magic-bundles | Название блоков, в которых будет происводиться сравнение |
| ------------------------------------- | ---------------------------------------- |
| `desktop`     | `desktop` / `common`  |
| `touch-pad`   | `touch-pad` / `touch` / `common` |
| `touch-phone` | `touch-phone` / `touch` / `common` |
