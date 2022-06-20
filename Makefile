dev-up:
	docker-compose -f Docker-compose.dev.yml --env-file ./dev.env up -d

dev-up-build:
	docker-compose -f Docker-compose.dev.yml --env-file ./dev.env up --build -d

dev-down: 
	docker-compose -f Docker-compose.dev.yml --env-file ./dev.env down -v

dev-logs: 
	docker-compose -f Docker-compose.dev.yml --env-file ./dev.env logs -f

up:
	docker-compose --env-file ./prod.env up -d

up-build:
	docker-compose --env-file ./prod.env up --build -d

down:
	docker-compose --env-file ./prod.env down -v

logs:
	docker-compose --env-file ./prod.env logs -f
