.PHONY: api scraper test lint

api:
	uvicorn api.main:app --reload --host 0.0.0.0 --port 8000

scraper:
	python scraper/runner.py

test:
	pytest api/tests -v

lint:
	ruff check .
