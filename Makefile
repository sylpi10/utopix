.PHONY: deploy deploy-test restart

ifneq (,$(wildcard .env.deploy))
include .env.deploy
export
endif

RSYNC_EXCLUDES = \
	--exclude node_modules/ \
	--exclude .git/ \
	--exclude .next/ \
	--exclude .env \
	--exclude .env.local \
	--exclude .env.deploy \
	--exclude Makefile \
	--exclude tsconfig.tsbuildinfo \
	--exclude next-env.d.ts \
	--exclude src/generated/

deploy:
	rsync -av --old-args --itemize-changes ./ $(SERVER_USER)@$(SERVER_HOST):~/$(SERVER_PATH) \
		$(RSYNC_EXCLUDES)

	ssh $(SERVER_USER)@$(SERVER_HOST) "\
		cd $(SERVER_PATH) && \
		$(SERVER_NODE_ACTIVATE) && \
		npm install --include=dev && \
		npx prisma generate && \
		npx prisma migrate deploy && \
		npm run build:server && \
		npm prune --omit=dev && \
		mkdir -p tmp && touch tmp/restart.txt \
	"

deploy-test:
	rsync -av --old-args --itemize-changes --dry-run ./ $(SERVER_USER)@$(SERVER_HOST):~/$(SERVER_PATH) \
		$(RSYNC_EXCLUDES)

# Force Passenger a relancer l'appli sans repasser par tout le cycle de deploy
# (utile apres avoir change une variable d'env dans cPanel par exemple).
restart:
	ssh $(SERVER_USER)@$(SERVER_HOST) "cd $(SERVER_PATH) && mkdir -p tmp && touch tmp/restart.txt"
