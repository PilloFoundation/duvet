import { RouteTreeNode } from '../../../src/RouteTreeNode';
import path from 'path';

describe('Route Tree Builder', () => {
	test('Builds a route tree correctly from a correctly defined directory', async () => {
		const pathToRoutes = path.join(__dirname, 'routes');

		const routeTree = await RouteTreeNode.fromDirectory(pathToRoutes);

		expect(routeTree.name).toBe('root');

		expect(routeTree.resource);

		expect(routeTree.resource.GET).toBeDefined();
		expect(routeTree.resource.DELETE).toBeDefined();
		expect(routeTree.resource.PATCH).toBeDefined();
		expect(routeTree.resource.POST).toBeDefined();
		expect(routeTree.resource.PUT).toBeDefined();

		expect(routeTree.subRoutes.length).toBe(3);

		const someRoute = routeTree.subRoutes.find(
			(route) => route.name === 'some-route'
		);
		const routeWithParam = routeTree.subRoutes.find(
			(route) => route.name === 'route-with-param'
		);

		expect(someRoute).toBeDefined();
		expect(routeWithParam).toBeDefined();

		if (someRoute == null || routeWithParam == null) return;

		expect(someRoute.resource.GET).toBeDefined();
		expect(someRoute.resource.DELETE).toBeDefined();
		expect(someRoute.resource.PATCH).toBeDefined();
		expect(someRoute.resource.POST).toBeDefined();
		expect(someRoute.resource.PUT).toBeDefined();

		const paramRoute = routeWithParam.subRoutes.find(
			(route) => route.name === 'param'
		);

		expect(paramRoute).toBeDefined();

		if (paramRoute == null) return;

		expect(paramRoute.isUrlParam).toBe(true);

		expect(paramRoute.resource.GET).toBeDefined();
		expect(paramRoute.resource.DELETE).toBeDefined();
		expect(paramRoute.resource.PATCH).not.toBeDefined();
		expect(paramRoute.resource.PUT).not.toBeDefined();
		expect(paramRoute.resource.POST).not.toBeDefined();

		const anotherParamRoute = paramRoute.subRoutes.find(
			(route) => route.name === 'anotherParam'
		);

		expect(anotherParamRoute).toBeDefined();

		if (anotherParamRoute == null) return;

		expect(anotherParamRoute.isUrlParam).toBe(true);

		expect(anotherParamRoute.resource.POST).toBeDefined();
		expect(anotherParamRoute.resource.GET).not.toBeDefined();
		expect(anotherParamRoute.resource.DELETE).not.toBeDefined();
		expect(anotherParamRoute.resource.PATCH).not.toBeDefined();
		expect(anotherParamRoute.resource.PUT).not.toBeDefined();
	});

	test('Throws an error on an incorrectly defined endpoint', async () => {
		const pathToRoutes = path.join(__dirname, 'broken-routes');

		await expect(RouteTreeNode.fromDirectory(pathToRoutes)).rejects.toThrow();
	});

	test('Throws an error when a parameter is defined in a schema but not in a route path', async () => {
		const pathToRoutes = path.join(__dirname, 'invalid-parameter-routes');

		await expect(RouteTreeNode.fromDirectory(pathToRoutes)).rejects.toThrow();
	});
});
