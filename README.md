# mcp-chargebee

Chargebee MCP Pack — wraps the Chargebee API v2

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `chargebee_get_subscription` | Get a single Chargebee subscription by its ID. Returns full subscription details. |
| `chargebee_list_customers` | List customers from Chargebee. Supports limit and offset for pagination. |
| `chargebee_get_customer` | Get a single Chargebee customer by their ID. Returns full customer details. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "chargebee": {
      "url": "https://gateway.pipeworx.io/chargebee/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use chargebee
```

## License

MIT
