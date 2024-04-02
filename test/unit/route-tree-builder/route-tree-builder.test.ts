import { RouteTreeNode } from '../../../src/RouteTreeNode';
import path from 'path';

test('Builds a route tree from a route directory', async () => {
	const pathToRoutes = path.join(__dirname, 'routes');

	const routeTree = await RouteTreeNode.buildRouteTree(pathToRoutes);

	expect(routeTree.name).toBe('root');

	expect(routeTree.resource);

	expect(routeTree.resource.GET).toBeDefined();
	expect(routeTree.resource.DELETE).toBeDefined();
	expect(routeTree.resource.PATCH).toBeDefined();
	expect(routeTree.resource.POST).toBeDefined();
	expect(routeTree.resource.PUT).toBeDefined();

	expect(routeTree.subRoutes.length).toBe(2);

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

	const deepParamRoute = paramRoute.subRoutes.find(
		(route) => route.name === 'deep'
	);

	expect(deepParamRoute).toBeDefined();

	if (deepParamRoute == null) return;

	expect(deepParamRoute.isUrlParam).toBe(false);

	expect(deepParamRoute.resource.POST).toBeDefined();
	expect(deepParamRoute.resource.GET).not.toBeDefined();
	expect(deepParamRoute.resource.DELETE).not.toBeDefined();
	expect(deepParamRoute.resource.PATCH).not.toBeDefined();
	expect(deepParamRoute.resource.PUT).not.toBeDefined();
});
