dev-up:
	docker compose -f docker-compose.dev.yml --env-file ./.env.test up -d

dev-up-build:
	docker compose -f docker-compose.dev.yml --env-file ./.env.test up --build -d

dev-down: 
	docker compose -f docker-compose.dev.yml --env-file ./.env.test down -v

dev-logs: 
	docker compose -f docker-compose.dev.yml --env-file ./.env.test logs -f

up:
	docker compose --env-file ./.env up -d

up-build:
	docker compose --env-file ./.env up --build -d

down:
	docker compose --env-file ./.env down -v

logs:
	docker compose --env-file ./.env logs -f

dev-close: 
	docker compose -f docker-compose.dev.yml --env-file ./.env.test down