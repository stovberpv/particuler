import { expect } from 'chai';

import { ActionsController, EventsController, HooksController, Module } from '../../../package/common';
import { ModuleSchemaDiscovery } from '../../../package/core/discovery';

describe('ModuleSchemaDiscovery', function () {
  describe('Checking schema validity', function () {
    it('should return the array with one element when one module provided', function () {
      @Module({})
      class TestModule { }

      const schemas = Array.from(ModuleSchemaDiscovery(TestModule));

      expect(schemas).to.be.a('Array');
      expect(schemas).to.have.lengthOf(1);
    });

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
          error: {}
        }
      }]

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
          error: {}
        }
      }]

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
          error: {}
        }
      }]

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
          error: {}
        }
      }]

      expect(schemas).to.have.deep.members(expectedSchemas);
    });
  });
});
