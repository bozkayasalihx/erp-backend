dev-up:
	docker compose -f ./containers/docker-compose.dev.yml --env-file .env.test up

dev-up-build:
	docker compose -f ./containers/docker-compose.dev.yml --env-file .env.test up --build

dev-down: 
	docker compose -f ./containers/docker-compose.dev.yml --env-file .env.test down -v

dev-logs: 
	docker compose -f ./containers/docker-compose.dev.yml --env-file .env.test logs -f

up:
	docker compose -f ./containers/docker-compose.yml --env-file .env up

up-build:
	docker compose -f ./containers/docker-compose.yml --env-file .env up --build

down:
	docker compose -f ./containers/docker-compose.yml --env-file .env down -v

logs:
	docker compose -f ./containers/docker-compose.yml --env-file .env logs -f

dev-close: 
	docker compose -f ./containers/docker-compose.dev.yml --env-file .env.test down

deploy-containers: 
	docker compose build && docker compose push