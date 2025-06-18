# Makefile (place at project root)

.PHONY: serve backend frontend

serve:
	@echo "Starting backend and frontend..."
	make -j2 backend frontend

backend:
	cd DreamTrackerAPI && dotnet watch run --launch-profile https

frontend:
	cd DreamTracker-Client && npm run dev
