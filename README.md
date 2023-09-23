# Particuler

## Описание

Particuler - это пакет расширения функционала фреймворка MoleculerJS.

Добавляет следующий функционал:

- Инъекция зависимостей.
- Декораторы TypeScript.
- Валидацию на основе декораторов.
- Возможность инъекции контекста запроса напрямую в цепочке вызовов без необходимости передачи его в качестве параметров.
- Более строгая модульность бизнес-логики.

## Философия

MoleculerJS предоставляет богатый функционал из коробки.
Но архитектура построения сервиса, предлагаемая командой фреймворка, не подразумевает создания комплексных проектов. Находящихся на долгой поддержке у большой команды разработчиков.
Каждый микросервис написанный на MoleculerJS отличается от любого другого микросервиса написанного на этом же фреймворке.
Очень часто различие настолько кардинальное, что разработчики сталкиваются с трудностями при переходе на другие проекты даже в рамках одной компании.
Отсутствие строгой архитектуры, протекание абстракций, чрезмерная свобода в выборе стиля программирования - все эти и многие другие проблемы призван решить данный пакет.

## Концепция построения бизнес-логики с использованием Particuler

Каждый бизнес-процесс должен представлять из себя атомарный модуль со строго связным функционалом.
Каждый модуль может быть примиксован к одному из сервисов проекта.
Взаимодействие между модулями возможно только через публичные провайдеры или события.

## Установка

```bash
npm i particuler
```

## Использование

### Декораторы Action

```ts
// foo.action.controller.ts
import { ActionsController } from 'particuler/common';

import { FooProvider } from './foo.provider';

@ActionsController()
export class FooActionsController {
  constructor(private readonly fooProvider: FooProvider) {}

  @Action()
  @Post('/foo')
  async createFoo(ctx: Context): Promise<unknown> {
    return this.fooProvider.createFoo(ctx.params);
  }

  @Action('actionAlias')
  async getFoo(ctx: Context): Promise<unknown> {}
}
```

### Контроллеры

```ts
// foo.action.controller.ts
import { ActionsController } from 'particuler/common';

import { FooProvider } from './foo.provider';

@ActionsController()
export class FooActionsController {
  constructor(private readonly fooProvider: FooProvider) {}

  @Action()
  async updateFoo(ctx: Context): Promise<void> {
    return this.fooProvider.updateFoo(ctx.params);
  }
}
```

```ts
// foo.events.controller.ts
import { EventsController } from 'particuler/common';

import { FooEventProvider } from './foo.event.provider';

@EventsController()
export class FooEventsController {
  constructor(private readonly fooEventProvider: FooEventProvider) {}

  @Event()
  @Name(FooEvents.created)
  async fooCreated(ctx: Context): Promise<void> {
    return this.fooEventProvider.onFooCreated(ctx.params);
  }
}
```

```ts
// foo.hooks.controller.ts
import { HooksController } from 'particuler/common';

import { FooProvider } from './foo.provider';

@HooksController()
export class FooHooksController {
  constructor(private readonly fooProvider: FooProvider) {}

  @Hook('before', 'getFoo')
  async beforeGetFoo(ctx: Context): Promise<void> {
    return this.fooProvider.check(ctx.params);
  }

  @Hook('after', 'getFoo')
  afterGetFoo(ctx: Context, res: unknown): void {}

  @Hook('error', '*')
  onError(this: object, ctx: Context, err: unknown): void {
    /**
     * К сожалению в данном случае нарушена совместимость с Moleculer.
     */
    assert(!(this instanceof Moleculer.Service));
    assert(this instanceof FooHooksController);
  }
}
```

### Валидация параметров

```ts
// moleculer.config.ts
import {
  ValidateActionMiddleware,
  ValidateEventMiddleware
 } from 'particuler/common';

export = {
  middlewares: [
    ValidateActionMiddleware(),
    ValidateEventMiddleware(),
  ]
}
```

```ts
// set-foo.dto.ts
import { IsDefined } from 'class-validator';

class DeleteFooDto {
  @IsDefined()
  id: number;
}
```

```ts
// foo.action.controller.ts
import { ActionsController } from 'particuler/common';

import { DeleteFooDto } from './set-foo.dto';

@ActionsController()
export class FooActionsController {
  @Action()
  deleteFoo(@Validate() params: DeleteFooDto): void {
    return this.fooProvider.deleteFoo(params.id);
  }
}
```

```ts
// foo.provider.ts
@Injectable()
export class FooProvider {
  deleteFoo(id: number): vod {}
}
```

### Инъекция контекста

```ts
// moleculer.config.ts
import {
  PropagateContextActionMiddleware,
  PropagateContextEventMiddleware
 } from 'particuler/common';

export = {
  middlewares: [
    PropagateContextActionMiddleware,
    PropagateContextEventMiddleware,
  ]
}
```

```ts
// foo.action.controller.ts
import { ActionsController } from 'particuler/common';

import { FooProvider } from './foo.provider';

@ActionsController()
export class FooActionsController {
  constructor(private readonly fooProvider: FooProvider) {}

  @Action()
  @PropagateContextStorage(true)
  sendFoo(): vod {
    return this.fooProvider.sendFoo();
  }
}
```

```ts
// foo.provider.ts
@Injectable()
export class FooProvider {
  sendFoo(): vod {
    const ctx = InjectContext();
  }
}
```

### Модули

```ts
// foo.module.ts
import {
  FooActionsController,
  FooEventsController,
  FooHooksController,
} from './controllers';

@Module({
  actions: [FooActionsController],
  events: [FooEventsController],
  hooks: [FooHooksController],
})
export class FooModule {}
```

### Инициализация проекта

```ts
// bootstrap.ts
import type { ServiceSchema } from 'moleculer';

import { ServiceFactory } from 'particuler/core';

function bootstrap(): ServiceSchema {
  const myAwesomeService = new ServiceFactory()
    .useService(MyAwesomeMoleculerService)
    .useBrokerConfig({ nodeID: '' })
    .useModules([
      FooModule,
    ])
    .create();

  return myAwesomeService;
}

export default bootstrap();
```
