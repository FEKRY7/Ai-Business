# AI Business – Customer Service Backend

A RESTful backend application built with **NestJS and PostgreSQL** to manage users, services, categories, FAQs, conversations, and messages. The project also integrates a locally hosted AI model using **Ollama** to generate customer service responses based on predefined business information.

## 🚀 Features

- **User Management:** Manage user accounts and roles.
- **Authentication & Authorization:** Secure authentication using JWT and Passport.
- **Password Management:** Forgot password and reset password functionality with OTP verification through email.
- **Role-Based Access Control:** Restrict protected operations based on user roles.
- **Category Management:** Organize business services into categories.
- **Service Management:** Create and manage business services.
- **FAQ Management:** Store frequently asked questions and their answers.
- **Conversation Management:** Create and manage customer conversations.
- **Message Management:** Store conversation messages and distinguish between user, assistant, and human messages.
- **AI-Powered Responses:** Use Ollama with the `llama3.2` model to generate responses using available business information.
- **FAQ Matching:** Identify relevant FAQs to help answer customer questions.
- **Database Integration:** Store application data using PostgreSQL and TypeORM.
- **Caching:** Integrate Redis for caching.
- **API Documentation:** Document and test endpoints using Swagger.
- **Input Validation:** Validate incoming requests using DTOs and NestJS validation pipes.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT, Passport
- **AI Model Runtime:** Ollama
- **AI Model:** Llama 3.2
- **Caching:** Redis
- **API Documentation:** Swagger / OpenAPI
- **Validation:** class-validator, class-transformer
- **HTTP Client:** Axios
- **Email:** OTP email integration
- **API Testing:** Postman and Swagger UI

## 📋 Prerequisites

Make sure you have the following installed:

- Node.js and npm
- PostgreSQL
- Redis
- Ollama
- Git

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ai-business
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and configure the required values.

```env
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=your_database_username
DATABASE_PASSWORD=your_database_password
DATABASE_NAME=nestjs-ai-business

JWT_SECRET=your_jwt_secret

REDIS_HOST=localhost
REDIS_PORT=6379

MAXOTPSMS=3
```

**Important:** These are example variable names. Make sure they match the configuration used in your project. Add any other variables required by your database, email service, JWT configuration, and OTP service. Never commit your real secrets to GitHub.

### 4. Set up Ollama

Install Ollama and pull the model:

```bash
ollama pull llama3.2
```

Start the Ollama service:

```bash
ollama serve
```

Ollama normally exposes its local API at:

```text
http://localhost:11434
```

Ensure the model name and API URL match your application configuration.

### 5. Start the application

Run the development server:

```bash
npm run start:dev
```

The backend will be available at:

```text
http://localhost:3000
```

## 📚 API Documentation

Swagger UI provides interactive API documentation and allows you to test endpoints directly from your browser.

Once the application is running, open:

**http://localhost:3000/api**

Use the Authorize option in Swagger to provide your JWT token when testing protected endpoints.

## 🔐 Authentication Flow

1. Register or create a user account.
2. Log in to obtain an authentication token.
3. Include the JWT token when accessing protected endpoints.
4. Request a password reset using the registered email address.
5. Verify the OTP and submit the new password with its confirmation.
6. After a successful password reset, the OTP is cleared and the OTP sending counter is reset.

## 🧠 AI Response Flow

1. A customer sends a message.
2. The message is associated with a conversation.
3. The application retrieves relevant business information, including FAQs and available services.
4. The backend sends the required context and conversation history to the local Ollama model.
5. The model generates a response based on the supplied information.
6. The response can be stored as an assistant message in the conversation.

The goal is to provide automated customer support using predefined business knowledge while keeping the AI model running locally.

## 🗂️ Main Modules

| Module | Responsibility |
|---|---|
| Users | User accounts and roles |
| Authentication | Login, JWT authentication, and password reset |
| Categories | Organizing services |
| Services | Business service information |
| FAQ | Frequently asked questions and answers |
| Conversations | Customer conversation management |
| Messages | Conversation message storage |
| AI | AI-powered response generation |

## 🧪 Testing

The API can be tested using:

- **Swagger UI:** Interactive endpoint testing at `/api`.
- **Postman:** Test requests, validation, authentication, and error responses.

Recommended test cases include:

- Valid and invalid login credentials.
- Access to protected endpoints with and without a JWT.
- Role-based authorization.
- Creating, retrieving, updating, and deleting records where supported.
- Invalid DTO input and validation errors.
- Forgot password and OTP verification.
- Expired or invalid OTP handling.
- Successful password reset and OTP cleanup.
- AI-generated responses based on FAQs and services.

## 🔒 Security Notes

- Keep `.env` out of version control.
- Use strong passwords and JWT secrets.
- Store passwords as secure hashes, never as plain text.
- Validate incoming requests using DTOs.
- Protect sensitive endpoints with authentication and authorization guards.
- Apply appropriate rate limits to authentication and OTP endpoints before production deployment.

## 🔮 Future Improvements

- Add automated unit and integration tests.
- Improve FAQ retrieval using semantic search or embeddings.
- Add rate limiting and stronger abuse protection.
- Add structured logging and monitoring.
- Improve AI response evaluation and fallback handling.
- Add Docker Compose configuration for easier deployment.
- Deploy the application to a production environment.

## 👨‍💻 Author

**Backend Developer**

Built with NestJS, TypeScript, PostgreSQL, Redis, and Ollama.
