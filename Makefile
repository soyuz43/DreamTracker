.PHONY: serve backend frontend check-ef migrations reset-db

serve: check-ef
	@echo "Checking frontend dependencies..."
	@[ -d DreamTracker-Client/node_modules ] || (echo "Installing frontend dependencies..." && cd DreamTracker-Client && npm install)
	@echo "Ensuring database is created with latest migrations..."
	cd DreamTrackerAPI && dotnet ef database update
	@echo "Starting backend..."
	$(MAKE) backend &
	sleep 8
	@echo "Starting frontend..."
	$(MAKE) frontend

check-ef:
	@echo "Checking for dotnet-ef CLI tool..."
	@dotnet tool list -g | grep dotnet-ef > /dev/null || (echo "Installing dotnet-ef CLI globally..." && dotnet tool install --global dotnet-ef)

backend:
	cd DreamTrackerAPI && dotnet watch run --launch-profile https

frontend:
	cd DreamTracker-Client && npm run dev

migrations: check-ef
	@echo "[!] Resetting database and regenerating migrations..."
	@rm -rf DreamTrackerAPI/Migrations
	@echo "[-] Dropping PostgreSQL database 'DreamTracker'..."
	@psql -U postgres -c "DROP DATABASE IF EXISTS \"DreamTracker\";" || true
	@echo "Recreating migrations..."
	cd DreamTrackerAPI && dotnet ef migrations add InitialCreate
	cd DreamTrackerAPI && dotnet ef database update
	@echo "[Y] Database reset complete."
