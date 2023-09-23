<div align="center" style="display:flex;justify-content:center">
  <img src="assets/logo.svg" width="150px"/>
</div>
<h1 align="center">
  <a href="https://github.com/moleculerjs/moleculer"target="blank">Moleculer</a> на <a href="https://github.com/nestjs/nest"target="blank">NestJS</a> стероидах
</h1>
<div align="center" style="display:flex;justify-content:space-evenly;gap:10px">
  <a href="https://github.com/stovberpv/particuler/actions/workflows/npm-publish.yml" target="_blank"><img src="https://github.com/stovberpv/particuler/actions/workflows/npm-publish.yml/badge.svg" alt="Publish Package to NPM"/></a>
  <a href="https://www.npmjs.org/package/particuler" target="_blank"><img src="https://img.shields.io/npm/v/particuler.svg?style=flat-square" alt="npm version"/></a>
  <a href="https://npm-stat.com/charts.html?package=particuler" target="_blank"><img src="https://img.shields.io/npm/dm/particuler.svg?style=flat-square" alt="npm downloads"/></a>
  <a href="https://bundlephobia.com/package/particuler@latest" target="_blank"><img src="https://img.shields.io/bundlephobia/minzip/particuler?style=flat-square" alt="npm bundle size"/></a>
  <a href="https://snyk.io/test/npm/particuler" target="_blank"><img src="https://snyk.io/test/npm/particuler/badge.svg" alt="Known Vulnerabilities"/></a>
</div>

## Описание

Particuler - это пакет расширения функционала фреймворка [Moleculer](https://github.com/moleculerjs/moleculer).

Добавляемый функционал:

- Инъекция зависимостей.
- Декораторы TypeScript.
- Валидацию на основе декораторов.
- Возможность инъекции контекста запроса напрямую в цепочке вызовов без необходимости передачи его в качестве параметров.
- Более строгая модульность бизнес-логики.

## Установка

```bash
npm i particuler
```

## Использование

### 1. Инициализация проекта

```ts
// foo.service.ts
export const FooService = {
  name: "foo-service"
}
```

```ts
// bootstrap.ts
import type { ServiceSchema } from 'moleculer'

import { ServiceFactory } from 'particuler'

import { FooService } from './foo.service'
import { FooModule } from './foo.module'

function bootstrap(): ServiceSchema {
  const fooService = new ServiceFactory()
    .useService(FooService)
    .useBrokerConfig({ nodeID: '' })
    .useModules([
      FooModule
    ])
    .create()

  return fooService
}

export default bootstrap()
```

### 2. Создание модуля

```ts
// foo.module.ts
import { Module } from 'particuler'

import {
  FooActionsController,
  FooEventsController,
  FooHooksController
} from './controllers'

@Module({
  actions: [FooActionsController],
  events: [FooEventsController],
  hooks: [FooHooksController]
})
export class FooModule {}
```

### 3. Создание контроллеров

```ts
// foo.action.controller.ts
import { ActionsController, Action } from 'particuler'

@ActionsController()
export class FooActionsController {
  @Action()
  async createFoo(ctx: Context): Promise<void> {}
}
```

```ts
// foo.events.controller.ts
import { EventsController, Event, Name } from 'particuler'

@EventsController()
export class FooEventsController {
  @Event()
  @Name(FooEvents.created)
  async onFooCreated(ctx: Context): Promise<void> {}
}
```

```ts
// foo.hooks.controller.ts
import { HooksController, Hook } from 'particuler'

@HooksController()
export class FooHooksController {
  @Hook('before', 'createFoo')
  async beforeCreateFoo(ctx: Context): Promise<void> {}

  @Hook('after', 'createFoo')
  afterCreateFoo(ctx: Context, res: unknown): void {}

  @Hook('error', '*')
  onError(this: object, ctx: Context, err: unknown): void {
    /**
     * К сожалению в данном случае нарушена совместимость с Moleculer.
     */
    assert(!(this instanceof Moleculer.Service))
    assert(this instanceof FooHooksController)
  }
}
```

### 4. Использование декораторов экшена

```ts
// foo.action.controller.ts
import { ActionsController, Action, Post } from 'particuler'

@ActionsController()
export class FooActionsController {
  @Action()
  @Post('/foo')
  async createFoo(ctx: Context): Promise<unknown> {}

  @Action('actionAlias')
  async getFoo(ctx: Context): Promise<unknown> {}
}
```

### 5. Инъекция зависимостей

```ts
// foo.provider.ts
import { Injectable, InjectContext } from 'particuler'

@Injectable()
export class FooProvider {
  createFoo(): void {}
}
```

```ts
// foo.action.controller.ts
import { ActionsController, Action, PropagateContextStorage } from 'particuler'

import { FooProvider } from './foo.provider'

@ActionsController()
export class FooActionsController {
  constructor(private readonly fooProvider: FooProvider) {}

  @Action()
  createFoo(): void {
    return this.fooProvider.createFoo()
  }
}
```

### 6. Инъекция контекста

```js
// moleculer.config.js
const {
  PropagateContextActionMiddleware,
  PropagateContextEventMiddleware
} = require('particuler')

module.exports = {
  middlewares: [
    PropagateContextActionMiddleware,
    PropagateContextEventMiddleware
  ],
}
```

```ts
// foo.provider.ts
import { Injectable, InjectContext } from 'particuler'

@Injectable()
export class FooProvider {
  createFoo(): void {
    const ctx = InjectContext()
  }
}
```

```ts
// foo.action.controller.ts
import { ActionsController, Action, PropagateContextStorage } from 'particuler'

import { FooProvider } from './foo.provider'

@ActionsController()
export class FooActionsController {
  constructor(private readonly fooProvider: FooProvider) {}

  @Action()
  @PropagateContextStorage(true)
  createFoo(): void {
    return this.fooProvider.createFoo()
  }
}
```

### 7. Валидация параметров

```js
// moleculer.config.js
const {
  ValidateActionMiddleware,
  ValidateEventMiddleware
} = require('particuler')

module.exports = {
  middlewares: [
    ValidateActionMiddleware(),
    ValidateEventMiddleware()
  ],
}
```

```ts
// foo.provider.ts
import { Injectable } from 'particuler'

@Injectable()
export class FooProvider {
  deleteFoo(id: number): void {}
}
```

```ts
// delete-foo.dto.ts
import { IsDefined } from 'class-validator'

class DeleteFooDto {
  @IsDefined()
  id: number
}
```

```ts
// foo.action.controller.ts
import { ActionsController, Action, Validate } from 'particuler'

import { DeleteFooDto } from './delete-foo.dto'

@ActionsController()
export class FooActionsController {
  @Action()
  deleteFoo(@Validate() params: DeleteFooDto): void {
    return this.fooProvider.deleteFoo(params.id)
  }
}
```
