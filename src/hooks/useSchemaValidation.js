import { useState, useEffect } from "react";

/**
 * Hook to consume MCP JSON Schemas for form validation.
 * Synchronizes with smart-core/mcp/schemas/
 */
export function useSchemaValidation() {
  const [schema, setSchema] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        // In local development, we try to fetch from the core schemas
        // If not available, we use a fallback version embedded here
        // Note: Production should have these schemas served or bundled
        const res = await fetch("/mcp/schemas/token-factory.json");
        if (res.ok) {
          const data = await res.json();
          setSchema(data);
        } else {
          // Fallback schema if fetch fails
          setSchema({
            tools: [
              {
                inputSchema: {
                  properties: {
                    name: { minLength: 3 },
                    symbol: { minLength: 2, maxLength: 6 },
                    maxSupply: { minimum: 1 },
                  },
                },
              },
            ],
          });
        }
      } catch (error) {
        console.warn("[SCHEMA] Failed to load MCP schema from server:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
  }, []);

  const validate = (data) => {
    if (!schema) return null;
    const tool = schema.tools?.find((t) => t.name === "deploy_jetton");
    const inputSchema = tool?.inputSchema;

    if (!inputSchema) return null;

    // Basic logic validation based on MCP schema
    if (
      data.tokenName &&
      data.tokenName.length < (inputSchema.properties.name?.minLength || 3)
    ) {
      return `Protocol Identity must be at least ${
        inputSchema.properties.name?.minLength || 3
      } characters.`;
    }

    if (
      data.tokenSymbol &&
      (data.tokenSymbol.length < 2 || data.tokenSymbol.length > 6)
    ) {
      return "Neural Symbol must be 2-6 characters.";
    }

    const supply = Number(data.tokenSupply);
    if (data.tokenSupply && isNaN(supply)) {
      return "Genesis Supply must be a valid number.";
    }

    if (supply <= 0) {
      return "Genesis Supply must be positive.";
    }

    return null;
  };

  return { schema, validate, loading };
}
