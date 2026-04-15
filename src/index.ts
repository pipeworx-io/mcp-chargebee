interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Chargebee MCP Pack — wraps the Chargebee API v2
 *
 * BYO key: _apiKey (Chargebee API key) + _site (Chargebee site name, e.g. "mycompany").
 * Auth: Basic auth with apiKey as username, empty password.
 * Response format: { "list": [{ "subscription": {...} }] } for list endpoints.
 * Tools: list/get subscriptions, list/get customers, list invoices.
 */


function apiBase(site: string): string {
  return `https://${site}.chargebee.com/api/v2`;
}

function authHeaders(apiKey: string): Record<string, string> {
  const encoded = btoa(`${apiKey}:`);
  return {
    Authorization: `Basic ${encoded}`,
    Accept: 'application/json',
  };
}

async function cbFetch(apiKey: string, site: string, path: string, params?: URLSearchParams): Promise<unknown> {
  const qs = params?.toString();
  const url = `${apiBase(site)}${path}${qs ? `?${qs}` : ''}`;
  const res = await fetch(url, { headers: authHeaders(apiKey) });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Chargebee API error (${res.status}): ${text}`);
  }
  return res.json();
}

// -- Tool definitions --------------------------------------------------------

const tools: McpToolExport['tools'] = [
  {
    name: 'chargebee_list_subscriptions',
    description:
      'List subscriptions from Chargebee. Supports optional status filter, limit, and offset for pagination.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Chargebee API key' },
        _site: { type: 'string', description: 'Chargebee site name (e.g., "mycompany" for mycompany.chargebee.com)' },
        status: {
          type: 'string',
          description: 'Filter by subscription status: active, cancelled, non_renewing, future, in_trial, paused',
        },
        limit: { type: 'number', description: 'Number of results to return (default 10, max 100)' },
        offset: { type: 'string', description: 'Pagination offset from a previous response' },
      },
      required: ['_apiKey', '_site'],
    },
  },
  {
    name: 'chargebee_get_subscription',
    description: 'Get a single Chargebee subscription by its ID. Returns full subscription details.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Chargebee API key' },
        _site: { type: 'string', description: 'Chargebee site name' },
        subscription_id: { type: 'string', description: 'Subscription ID' },
      },
      required: ['_apiKey', '_site', 'subscription_id'],
    },
  },
  {
    name: 'chargebee_list_customers',
    description: 'List customers from Chargebee. Supports limit and offset for pagination.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Chargebee API key' },
        _site: { type: 'string', description: 'Chargebee site name' },
        limit: { type: 'number', description: 'Number of results to return (default 10, max 100)' },
        offset: { type: 'string', description: 'Pagination offset from a previous response' },
      },
      required: ['_apiKey', '_site'],
    },
  },
  {
    name: 'chargebee_get_customer',
    description: 'Get a single Chargebee customer by their ID. Returns full customer details.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Chargebee API key' },
        _site: { type: 'string', description: 'Chargebee site name' },
        customer_id: { type: 'string', description: 'Customer ID' },
      },
      required: ['_apiKey', '_site', 'customer_id'],
    },
  },
  {
    name: 'chargebee_list_invoices',
    description:
      'List invoices from Chargebee. Supports optional status and customer_id filters, plus limit and offset for pagination.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        _apiKey: { type: 'string', description: 'Chargebee API key' },
        _site: { type: 'string', description: 'Chargebee site name' },
        status: {
          type: 'string',
          description: 'Filter by invoice status: paid, posted, payment_due, not_paid, voided, pending',
        },
        customer_id: { type: 'string', description: 'Filter invoices by customer ID' },
        limit: { type: 'number', description: 'Number of results to return (default 10, max 100)' },
        offset: { type: 'string', description: 'Pagination offset from a previous response' },
      },
      required: ['_apiKey', '_site'],
    },
  },
];

// -- callTool dispatcher -----------------------------------------------------

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = args._apiKey as string | undefined;
  const site = args._site as string | undefined;
  delete args._context;
  delete args._apiKey;
  delete args._site;

  if (!apiKey) throw new Error('_apiKey is required for Chargebee API access');
  if (!site) throw new Error('_site is required (your Chargebee site name, e.g. "mycompany")');

  switch (name) {
    case 'chargebee_list_subscriptions': {
      const params = new URLSearchParams();
      if (args.limit) params.set('limit', String(Math.min(100, args.limit as number)));
      if (args.offset) params.set('offset', args.offset as string);
      if (args.status) params.set('status[is]', args.status as string);
      return cbFetch(apiKey, site, '/subscriptions', params);
    }
    case 'chargebee_get_subscription':
      return cbFetch(apiKey, site, `/subscriptions/${encodeURIComponent(args.subscription_id as string)}`);
    case 'chargebee_list_customers': {
      const params = new URLSearchParams();
      if (args.limit) params.set('limit', String(Math.min(100, args.limit as number)));
      if (args.offset) params.set('offset', args.offset as string);
      return cbFetch(apiKey, site, '/customers', params);
    }
    case 'chargebee_get_customer':
      return cbFetch(apiKey, site, `/customers/${encodeURIComponent(args.customer_id as string)}`);
    case 'chargebee_list_invoices': {
      const params = new URLSearchParams();
      if (args.limit) params.set('limit', String(Math.min(100, args.limit as number)));
      if (args.offset) params.set('offset', args.offset as string);
      if (args.status) params.set('status[is]', args.status as string);
      if (args.customer_id) params.set('customer_id[is]', args.customer_id as string);
      return cbFetch(apiKey, site, '/invoices', params);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 10 } } satisfies McpToolExport;
