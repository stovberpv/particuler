import { expect } from 'chai';

import {
  Action,
  ActionsController,
  Event,
  EventsController,
  Hook,
  HooksController,
  Module,
} from '@package/common';
import { ModuleSchemaDiscovery } from '@package/core/discovery';

describe('ModuleSchemaDiscovery', function () {
  describe('Testing if no controller passed', function () {
    it('should return the array with one element when one module provided', function () {
      @Module({})
      class TestModule { }

      const schemas = Array.from(ModuleSchemaDiscovery(TestModule));

      expect(schemas).to.be.a('Array');
      expect(schemas).to.have.lengthOf(1);
    });
  });


  describe('Testing if empty controller passed', function () {
    it('should return empty moleculer service schema if no controllers provided', function () {
      @Module({})
      class TestModule { }

      const schemas = Array.from(ModuleSchemaDiscovery(TestModule));

      const expectedSchemas = [{
        actions: {},
        events: {},
        hooks: {
          before: {},
          after: {},
          error: {},
        },
      }];

      expect(schemas).to.have.deep.members(expectedSchemas);
    });

    it('should return empty moleculer service schema if an empty actions controller provided', function () {
      @ActionsController()
      class TestActionsProvider { }

      @Module({ actions: [TestActionsProvider] })
      class TestModule { }

      const schemas = Array.from(ModuleSchemaDiscovery(TestModule));

      const expectedSchemas = [{
        actions: {},
        events: {},
        hooks: {
          before: {},
          after: {},
          error: {},
        },
      }];

      expect(schemas).to.have.deep.members(expectedSchemas);
    });

    it('should return empty moleculer service schema if an empty events controller provided', function () {
      @EventsController()
      class TestEventsProvider { }

      @Module({ events: [TestEventsProvider] })
      class TestModule { }

      const schemas = Array.from(ModuleSchemaDiscovery(TestModule));

      const expectedSchemas = [{
        actions: {},
        events: {},
        hooks: {
          before: {},
          after: {},
          error: {},
        },
      }];

      expect(schemas).to.have.deep.members(expectedSchemas);
    });

    it('should return empty moleculer service schema if an empty hooks controller provided', function () {
      @HooksController()
      class TestHooksProvider { }

      @Module({ hooks: [TestHooksProvider] })
      class TestModule { }

      const schemas = Array.from(ModuleSchemaDiscovery(TestModule));

      const expectedSchemas = [{
        actions: {},
        events: {},
        hooks: {
          before: {},
          after: {},
          error: {},
        },
      }];

      expect(schemas).to.have.deep.members(expectedSchemas);
    });
  });


  describe('Testing handlers registration', function () {
    it('should return actions with registered one handler', function () {
      @ActionsController()
      class TestActionsProvider {
        @Action()
        testCase (): void { }
      }

      @Module({ actions: [TestActionsProvider] })
      class TestModule { }

      const schemas = Array.from(ModuleSchemaDiscovery(TestModule));

      const schema = schemas.at(0);

      expect(schema.actions).to.have.property('testCase');
      expect(schema.actions.testCase).to.have.property('handler');
      // @ts-expect-error
      expect(schema.actions.testCase.handler).to.be.a('function');
    });

    it('should return events with registered one handler', function () {
      @EventsController()
      class TestEventsProvider {
        @Event()
        testCase (): void { }
      }

      @Module({ events: [TestEventsProvider] })
      class TestModule { }

      const schemas = Array.from(ModuleSchemaDiscovery(TestModule));

      const schema = schemas.at(0);

      expect(schema.events).to.have.property('testCase');
      expect(schema.events.testCase).to.have.property('handler');
      // @ts-expect-error
      expect(schema.events.testCase.handler).to.be.a('function');
    });

    it('should return hooks with registered one handler', function () {
      @HooksController()
      class TestHooksProvider {
        @Hook('before', 'testCase')
        beforeTestCase (): void { }
      }

      @Module({ hooks: [TestHooksProvider] })
      class TestModule { }

      const schemas = Array.from(ModuleSchemaDiscovery(TestModule));

      const schema = schemas.at(0);

      expect(schema.hooks.before).to.have.property('testCase');
      expect(schema.hooks.before.testCase).to.be.a('function');
    });
  });


  describe('Testing handlers bounded context', function () {
    it('should return actions handler bounded to parent class', function () {
      @ActionsController()
      class TestActionsProvider {
        @Action()
        testCase (): this { return this; }
      }

      @Module({ actions: [TestActionsProvider] })
      class TestModule { }

      const schemas = Array.from(ModuleSchemaDiscovery(TestModule));

      const schema = schemas.at(0);

      // @ts-expect-error
      expect(schema.actions.testCase.handler()).to.instanceOf(TestActionsProvider);
    });

    it('should return events handler bounded to parent class', function () {
      @EventsController()
      class TestEventsProvider {
        @Event()
        testCase (): this { return this; }
      }

      @Module({ events: [TestEventsProvider] })
      class TestModule { }

      const schemas = Array.from(ModuleSchemaDiscovery(TestModule));

      const schema = schemas.at(0);

      // @ts-expect-error
      expect(schema.events.testCase.handler()).to.instanceOf(TestEventsProvider);
    });

    it('should return hooks handler bounded to parent class', function () {
      @HooksController()
      class TestEventsProvider {
        @Hook('before', 'testCase')
        beforeTestCase (): this { return this; }
      }

      @Module({ hooks: [TestEventsProvider] })
      class TestModule { }

      const schemas = Array.from(ModuleSchemaDiscovery(TestModule));

      const schema = schemas.at(0);

      // @ts-expect-error
      expect(schema.hooks.before.testCase()).to.instanceOf(TestEventsProvider);
    });
  });
});
