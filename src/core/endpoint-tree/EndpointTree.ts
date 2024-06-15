import { Handler } from "../models/Handler";
import { Method } from "../models/Resource";

export type EndpointTreeEndpoint<GlobalContext, Config> = {
  handler: Handler<{ global: GlobalContext }>;
  config: Config;
  method: Method;
};

// TODO: Add js docs
export class EndpointTreeNode<Context, PluginConfig> {
  private _fullPath: string;
  private _name: string;
  private _parent: EndpointTreeNode<Context, PluginConfig> | null;

  private _isParam: boolean;
  private _params: string[] = [];

  private _endpoints: EndpointTreeEndpoint<Context, unknown & PluginConfig>[];
  private _subRoutes: EndpointTreeNode<Context, PluginConfig>[];

  constructor(
    parent: EndpointTreeNode<Context, PluginConfig> | null,
    name: string,
    isParam: boolean,
  ) {
    this._parent = parent;

    this._name = name;
    this._fullPath = name;

    this._endpoints = [];
    this._subRoutes = [];

    this._isParam = isParam;

    if (parent != null) this.setParent(parent);
  }

  private setParent(parent: EndpointTreeNode<Context, PluginConfig>) {
    this._parent = parent;
    this._fullPath = `${this._parent.fullPath}/${this._name}`;
    this._params = [...this._parent.params];
    if (this._isParam) {
      this._params.push(this._name);
    }
    parent.addSubRoute(this);
  }

  public get endpoints() {
    return this._endpoints;
  }

  public get subRoutes() {
    return this._subRoutes;
  }

  public get fullPath() {
    return this._fullPath;
  }

  public get name() {
    return this._name;
  }

  public get params() {
    return this._params;
  }

  public get parent() {
    return this._parent;
  }

  public get isParam() {
    return this._isParam;
  }

  public addEndpoint(
    endpoint: EndpointTreeEndpoint<Context, unknown & PluginConfig>,
  ) {
    if (this._endpoints.includes(endpoint)) return;
    const conflict = this.checkConflict(endpoint);
    if (conflict.conflict) {
      throw new Error(
        `There was a conflict trying to add the endpoint ${conflict.newEndpoint.method} to the route ${this._fullPath}. The method is already defined in the route ${this._fullPath}`,
      );
    }
    this._endpoints.push(endpoint);
  }

  public addSubRoute(subRoute: EndpointTreeNode<Context, PluginConfig>) {
    if (this.subRoutes.includes(subRoute)) return;
    this._subRoutes.push(subRoute);
  }

  public endpoint(
    method: Method,
  ): EndpointTreeEndpoint<Context, unknown & PluginConfig> | null {
    return this._endpoints.find((e) => e.method === method) ?? null;
  }

  public checkConflict(
    endpoint: EndpointTreeEndpoint<Context, unknown & PluginConfig>,
  ):
    | {
        conflict: false;
      }
    | {
        conflict: true;
        newEndpoint: EndpointTreeEndpoint<Context, unknown & PluginConfig>;
        existingEndpoint: EndpointTreeEndpoint<Context, unknown & PluginConfig>;
      } {
    const existingEndpoint = this._endpoints.find(
      (e) => e.method === endpoint.method,
    );

    if (existingEndpoint) {
      return {
        conflict: true,
        existingEndpoint,
        newEndpoint: endpoint,
      };
    } else {
      return {
        conflict: false,
      };
    }
  }
}
