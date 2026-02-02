## 📸 Screenshots

![Medi Store Architecture Diagram](https://i.ibb.co.com/bjVtPPyq/Untitled-Diagram-drawio.png)



### Backend (.env)

```env
DATABASE_URL=postgresql://username:password@localhost:5432/medistore
FRONTEND_URL=https://your-frontend-url.com
BETTER_AUTH_SECRET=your_secret_key

BETTER_AUTH_URL=https://your-backend-url.com || http://localhost:5000/
APP_URL=https://your-frontend-url.com || http://localhost:3000/

APP_PASS=google_app_pass || nodemiller

APP_EMAIL=google_app_email ||nodemiller

GOOGLE_CLIENT_SECRET= GOOGLE_CLIENT_SECRET

GOOGLE_CLIENT_ID= GOOGLE_CLIENT_ID

```

---


## 🧪 Installation

### Clone the repository

```bash
git clone https://github.com/your-username/medi-store.git
cd medi-store
```

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Prisma setup (Backend)

```bash
npx prisma migrate dev
```

---
