# Particuler

## Описание

Particuler - это пакет расширения функционала фреймворка MoleculerJS.

Пакет добавляет следующий функционал: 

- Инъекция зависимостей.
- Декораторы TypeScript.
- Валидацию на основе декораторов.
- Возможнсоть инъекции контекста запроса напрямую в цеопчке вызовов без необходимости передачи его в качестве параметров.
- Более строгая модульность бизнес-логики.

## Философия

MoleculerJS предоставляет богатый функционал из коробки. Но архитектура построения сервиса, предлагаемая командой фреймворка, не подразумевает создания комплексых проектов, находящихся на долгой поддержке у большой команды разработчиков. Каждый микросервис написанный на MoleculerJS отличается от любого другого микросервиса написанного на этом же фреймворке. Очень часто различие настолько кардинальное, что разработчики сталкиваются с трудностями при переходе на другие проекты даже в рамках одной компании.
Отсутствие строгой архитектуры, протекание абстракций (сontext с информацией о фреймворке, который передается в качестве аргументов во все функции по цепочке), использование императивно-декларативного стиля написания сервиса, что неибежно приводит к появлению других стилей программирования в кодовой базе проекта и пр., все это призван решить данный пакет.

Каждый бизнес-процесс должен представлять из себя атомарный модуль со строго связным функционалом. Каждый модуль может быть примиксован к одному из сервисов проекта. Взаимодействие между модулями возможно только через публичные провайдеры или события благодаря чему все зацепления между модулями будут легко прослеживаемыми.
Контекст запроса может быть использован только в провайдерах общего функционала, которые могут быть инжектированы в любой модуль через инъекцию зависимостей в конструкторе класса.

## Установка

### Npm

```bash
npm i particuler
```

```bash
npm -D @types/particuler
```

### Yarn

```bash
yarn add particuler
```

```bash
yarn add -D @types/particuler
```

### Декораторы Action

```ts
// foo.action.controller.ts
import { ActionsController } from 'particuler/common';

@ActionsController()
export class FooActionsController {
  constructor(private readonly fooProvider: FooProvider) {}

  @Action()
  @Get('/foo')
  @RequiredPermission('/foo-service/foo')
  @Description('Some action description')
  @Summary('Action summary test')
  async getFoo(ctx: Context): Promise<unknown> {
    return this.fooProvider.getFoo(ctx.params);
  }

  @Action('actionAlias')
  async getAllFoo(ctx: Context): Promise<unknown> {}
}
```

### Контроллеры

```ts
// foo.action.controller.ts
import { ActionsController } from 'particuler/common';

@ActionsController()
export class FooActionsController {
  constructor(private readonly fooProvider: FooProvider) {}

  @Action()
  async getFoo(ctx: Context): Promise<unknown> {
    return this.fooProvider.getFoo(ctx.params);
  }
}


// foo.events.controller.ts
import { EventsController } from 'particuler/common';

@EventsController()
export class FooEventsController {
  constructor(private readonly fooEventProvider: FooEventProvider) {}

  @Event()
  @Name(FooEvents.created)
  async fooCreated(ctx: Context): Promise<void> {
    return this.fooEventProvider.onFooCreated(ctx.params);
  }
}


// foo.hooks.controller.ts
import { HooksController } from 'particuler/common';

@HooksController()
export class FooHooksController {
  constructor(private readonly fooProvider: FooProvider) {}

  @Hook('before', 'getFoo')
  async beforeGetFoo(ctx: Context): Promise<void> {
    return this.fooProvider.check(ctx.params);
  }

  @Hook('after', 'getFoo')
  afterFoo(ctx: Context, res: unknown): void {}

  @Hook('error', '*')
  onError(this: object, ctx: Context, err: unknown): void {
    assert(!(this instanceof Moleculer.Service));
    assert(this instanceof FooHooksController);
  }
}


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


// foo.action.controller.ts
import { ActionsController } from 'particuler/common';

@ActionsController()
export class FooActionsController {
  @Action()
  async getFoo(@Validate() params: RequestDto): Promise<void> {}
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


// foo.action.controller.ts
import { ActionsController } from 'particuler/common';

@ActionsController()
export class FooActionsController {
  constructor(private readonly fooProvider: FooProvider) {}

  @PropagateContextStorage(true)
  async getFoo(ctx: Context): Promise<unknown> {
    return this.fooProvider.getFoo();
  }
}


// foo.provider.ts
@Injectable()
export class FooProvider {
  getFoo(): unknown {
    const ctx = InjectContext();
  }
}
```
