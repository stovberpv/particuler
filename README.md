# Пакет расширения функционала MoleculerJS - Particuler

## Описание

## Установка

## Использование

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
