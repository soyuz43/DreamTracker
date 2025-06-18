.PHONY: serve backend frontend reset-db

serve:
	@echo "Starting backend and frontend..."
	make -j2 backend frontend

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
