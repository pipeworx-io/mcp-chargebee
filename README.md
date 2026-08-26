# mcp-chargebee

Chargebee MCP Pack — wraps the Chargebee API v2

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/chargebee/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Chargebee data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
