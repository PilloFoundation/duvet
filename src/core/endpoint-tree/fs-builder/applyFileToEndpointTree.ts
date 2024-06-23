import path from "path";
import { Method } from "../../common/Method";
import { isDuvetExport } from "../../../utils/isDuvetExport";
import { tryRun } from "../../../utils/tryRun";
import { isDuvetEndpoint } from "../../../utils/isDuvetEndpoint";
import { EndpointTreeNode } from "../EndpointTree";
import { Handler } from "../../common/Handler";

/**
 * Applies a file to an endpoint tree node. If the file is a method file, it is added to the endpoint tree node. Otherwise, an error is thrown.
 * @param filePath The absolute path to the file.
 * @param endpointTreeNode The endpoint tree node to apply the file to.
 */
export function applyFileToEndpointTree<
  RequestType,
  ResponseType,
  Context,
  PluginConfig,
>(
  filePath: string,
  endpointTreeNode: EndpointTreeNode<
    RequestType,
    ResponseType,
    Context,
    PluginConfig
  >,
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

    const module = tryRun(() => require(moduleName));

    if (module instanceof Error) {
      throw new Error(
        `Error while loading module at ${moduleName}: ${module.message}`,
      );
    }

    const duvetExport = module?.default;

    // Check if the endpoint is a Duvet endpoint
    if (isDuvetExport(duvetExport) !== true) {
      throw new Error(`Endpoint at route ${filePath} is not a Duvet endpoint`);
    }

    const endpoint = duvetExport.data;

    if (isDuvetEndpoint(endpoint) !== true) {
      throw new Error(`Endpoint at route ${filePath} is not a Duvet endpoint`);
    }

    endpointTreeNode.addEndpoint({
      config: endpoint.config as PluginConfig,
      handler: endpoint.handler as Handler<
        RequestType,
        ResponseType,
        { global: Context }
      >,
      method: method,
    });
  }
}
