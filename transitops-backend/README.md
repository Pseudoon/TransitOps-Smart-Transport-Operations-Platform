# TransitOps Backend

FastAPI + MongoDB backend for the TransitOps hackathon project.

## Setup
```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Make sure MongoDB is running locally (or update MONGO_URI in .env for Atlas).

## Run
```bash
uvicorn app.main:app --reload
```

Server runs at http://localhost:8000
Docs auto-generated at http://localhost:8000/docs

## Folder Guide
- `models/`   -> Pydantic schemas (one file per entity)
- `routers/`  -> API routes, kept thin (parse request -> call service -> return)
- `services/` -> business logic + validations + state machine (the real work)
- `auth/`     -> JWT + RBAC
- `utils/`    -> constants (status enums), CSV export helper

See BACKEND_TEAM.md (shared doc) for task split, phases, and the full API contract.
