import path from "path";
import { Method } from "../../models/Resource";
import { isKintExport } from "../../../utils/isKintEndpoint";
import { tryFn } from "../../../utils/tryFn";
import { isKintEndpoint } from "../../../utils/isEndpointMeta";
import { EndpointTreeNode } from "../EndpointTree";
import { getDirectoryContents } from "../../../utils/getDirectoryContents";

/**
 * Builds an endpoint tree from a directory.
 * @param directory The path to the routes directory.
 * @returns An endpoint tree representing the directory.
 */
export function endpointTreeFromDirectory<Context, PluginConfig>(
  directory: string,
) {
  const root = new EndpointTreeNode<Context, PluginConfig>(null, "", false);

  applyDirectoryContentsToEndpointTreeNode(directory, root);

  return root;
}

/**
 * Applies all the contents from a directory to a given endpoint tree node.
 * @param directoryPath The path to the routes directory.
 * @param endpointTreeNode The parent endpoint tree node.
 */
export function applyDirectoryContentsToEndpointTreeNode<Context, PluginConfig>(
  directoryPath: string,
  endpointTreeNode: EndpointTreeNode<Context, PluginConfig>,
) {
  const { directories, files } = getDirectoryContents(directoryPath);

  for (const subDir of directories) {
    const absolutePathToSubDir = path.join(directoryPath, subDir);
    createEndpointTreeNodeFromSubDirectory(
      absolutePathToSubDir,
      endpointTreeNode,
    );
  }

  for (const file of files) {
    applyFileToEndpointTree(path.join(directoryPath, file), endpointTreeNode);
  }
}

/**
 * Applies a file to an endpoint tree node. If the file is a method file, it is added to the endpoint tree node. Otherwise, an error is thrown.
 * @param filePath The absolute path to the file.
 * @param endpointTreeNode The endpoint tree node to apply the file to.
 */
function applyFileToEndpointTree<Context, PluginConfig>(
  filePath: string,
  endpointTreeNode: EndpointTreeNode<Context, PluginConfig>,
) {
  // Current file is not a directory
  const httpMethodRegExp =
    /^(PUT|POST|GET|DELETE|PATCH|OPTIONS|HEAD)\.(ts|js)$/;

  const filePathObject = path.parse(filePath);
  // Check if it's a method file
  const methodMatch = filePathObject.base.match(httpMethodRegExp);

  if (methodMatch) {
    // eslint-disable-next-line no-type-assertion/no-type-assertion -- We know that methodMatch[1] is a Method because of the regex
    const method = methodMatch[1] as Method;

    const moduleName = path.join(filePathObject.dir, filePathObject.base);

    const module = tryFn(() => require(moduleName));

    if (module instanceof Error) {
      throw new Error(
        `Error while loading module at ${moduleName}: ${module.message}`,
      );
    }

    const kintExport = module?.default;

    // Check if the endpoint is a Kint endpoint
    if (isKintExport(kintExport) !== true) {
      throw new Error(`Endpoint at route ${filePath} is not a Kint endpoint`);
    }

    const endpoint = kintExport.data;

    if (isKintEndpoint(endpoint) !== true) {
      throw new Error(`Endpoint at route ${filePath} is not a Kint endpoint`);
    }

    endpointTreeNode.addEndpoint({
      config: endpoint.config as PluginConfig,
      handler: endpoint.handler,
      method: method,
    });
  }
}

/**
 * Creates an endpoint tree node from a sub directory. The name is set based on the name of the directory.
 * If the directory is a url param, the name is set to the url param name. This recursively populates the directory using
 * the `applyDirectoryToEndpointTreeNode` function.
 * @param directoryPath The absolute path to the directory.
 * @param parent The parent endpoint tree node.
 * @returns An endpoint tree node representing the directory.
 */
function createEndpointTreeNodeFromSubDirectory<Context, PluginConfig>(
  directoryPath: string,
  parent: EndpointTreeNode<Context, PluginConfig>,
): EndpointTreeNode<Context, PluginConfig> {
  const directoryObject = path.parse(directoryPath);
  const directoryName = directoryObject.name;
  // Check if it's a url param
  const urlParamRegExp = /^\[(\w+)\]$/;
  const result = directoryName.match(urlParamRegExp);
  const isUrlParam = result !== null;
  const routeName = isUrlParam ? result[1] : directoryName;

  const routeTree = new EndpointTreeNode<Context, PluginConfig>(
    parent,
    routeName,
    isUrlParam,
  );

  applyDirectoryContentsToEndpointTreeNode(directoryPath, routeTree);

  return routeTree;
}
