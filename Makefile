up:
	docker-compose -f Docker-compose.dev.yml up -d

down: 
	docker-compose -f Docker-compose.dev.yml down -v

logs: 
	docker-compose -f Docker-compose.dev.yml logs -f