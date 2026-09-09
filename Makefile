# Raccourcis pour le serveur MCP (mcp-server/). Tout passe par bun.
.PHONY: setup check typecheck test smoke inspect http mcp-list

setup:      ## installe les dépendances
	cd mcp-server && bun install

check: typecheck test smoke   ## à lancer avant de rendre la main

typecheck:
	cd mcp-server && bun run typecheck

test:
	cd mcp-server && bun test

smoke:      ## lance le serveur en stdio et liste tools/resources/prompts
	cd mcp-server && bun run smoke

inspect:    ## MCP Inspector (UI web) branché sur le serveur stdio
	cd mcp-server && bun run inspect

http:       ## serveur HTTP stateless sur http://localhost:3333/mcp
	cd mcp-server && bun run http

mcp-list:   ## état des serveurs MCP vus par Claude Code
	claude mcp list
