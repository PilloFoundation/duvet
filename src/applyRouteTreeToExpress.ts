/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { RequestHandler, Router, Request, Response } from 'express';
import { z } from 'zod';
import { RouteTreeNode } from './RouteTreeNode';
import { Resource } from './models/Resource';
import { Endpoint } from './models/Endpoint';
import { ZodSchemaDefinition } from './models/ZodSchemaDefinition';
