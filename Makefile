.PHONY: serve backend frontend reset-db

serve:
	@echo "Checking frontend dependencies..."
	@[ -d DreamTracker-Client/node_modules ] || (echo "Installing frontend dependencies..." && cd DreamTracker-Client && npm install)
	@echo "Starting backend..."
	$(MAKE) backend &
	sleep 8
	@echo "Starting frontend..."
	$(MAKE) frontend

backend:
	cd DreamTrackerAPI && dotnet watch run --launch-profile https

frontend:
	cd DreamTracker-Client && npm run dev

migrations:
	@echo "[!]  Resetting database and regenerating migrations..."
	@rm -rf DreamTrackerAPI/Migrations
	@echo "[-] Dropping PostgreSQL database 'DreamTracker'..."
	@psql -U postgres -c "DROP DATABASE IF EXISTS \"DreamTracker\";" || true
	@echo "Recreating migrations..."
	cd DreamTrackerAPI && dotnet ef migrations add InitialCreate
	cd DreamTrackerAPI && dotnet ef database update
	@echo "[Y] Database reset complete."
