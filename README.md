# mcp-chargebee

Chargebee MCP Pack — wraps the Chargebee API v2

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `chargebee_list_subscriptions` | List all subscriptions with optional filtering by status (e.g., 'active', 'cancelled'). Returns subscription IDs, plans, amounts, and renewal dates. Paginate with limit and offset. |
| `chargebee_get_subscription` | Get full subscription details by ID. Returns plan, status, billing dates, customer info, and all charges. |
| `chargebee_list_customers` | List all customers with pagination. Returns customer IDs, names, emails, billing addresses, and creation dates. |
| `chargebee_get_customer` | Get complete customer profile by ID. Returns name, email, address, payment methods, subscription count, and account status. |
| `chargebee_list_invoices` | List invoices filtered by status (e.g., 'paid', 'pending') and/or customer ID. Returns invoice numbers, amounts, dates, and payment status. Paginate with limit and offset. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "chargebee": {
      "url": "https://gateway.pipeworx.io/chargebee/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Chargebee data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
