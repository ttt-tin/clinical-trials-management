# Clinical Trials Management System

A modern web application for managing clinical trials, portfolios, and investigators.

## Technologies Used

### Frontend
- Angular 14
- PrimeNG UI Components
- TypeScript
- SCSS
- RxJS

### Backend
- NestJS 11
- SQLite with Sequelize
- OpenAPI/Swagger

## Project Setup

### System Requirements
- Node.js v16 or higher
- pnpm (recommended over npm)

### Installation

1. Clone repository:
```bash
git clone <repository-url>
cd clinical-trials-management
```

2. Install frontend dependencies:
```bash
cd frontend
pnpm install
```

3. Install backend dependencies:
```bash
cd ../backend
pnpm install
```

4. Start the backend:
```bash
cd backend
pnpm start:dev
```

5. Start the frontend (in a new terminal):
```bash
cd frontend
pnpm start
```

6. Access the application at `http://localhost:4200`

## Project Structure

```
clinical-trials-management/
├── frontend/                # Angular frontend application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Shared components
│   │   │   ├── core/       # Core functionality
│   │   │   └── features/   # Feature modules
│   │   ├── assets/         # Static assets
│   │   └── styles/         # Global styles
│   └── package.json
│
└── backend/                 # NestJS backend application
    ├── src/
    │   ├── modules/        # Feature modules
    │   ├── common/         # Shared functionality
    │   └── main.ts         # Application entry point
    └── package.json
```

## Development Process with AI

This project was developed with the assistance of Claude (Anthropic) through Cursor IDE. Here's the main workflow:

1. **Initial Setup**
   - Created basic project structure
   - Configured development environment
   - Set up necessary tools and libraries

2. **Feature Development**
   - Created models and DTOs
   - Built UI components
   - Implemented business logic
   - Integrated API endpoints

3. **UI/UX Enhancement**
   - Integrated PrimeNG components
   - Customized themes and styles
   - Optimized layout and responsive design

4. **Testing and Debugging**
   - Handled validation errors
   - Fixed type mismatches
   - Improved error handling

5. **Optimization**
   - Enhanced performance
   - Refactored code for maintainability
   - Added documentation

AI assisted with:
- Code generation and modification
- Debugging and error fixing
- UI/UX improvements
- Performance optimization
- Documentation writing
- Best practices suggestions

## API Documentation

API documentation is available at `http://localhost:3000/api` after starting the backend server.

## License

MIT License - see [LICENSE](LICENSE) file for details. 