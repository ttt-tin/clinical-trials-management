# Clinical Trials Management System

A modern web application for managing clinical trials, portfolios, and investigators.

## Technologies Used

### Frontend
- Angular 19 (upgraded from Angular 9 to support modern features like Signals)
- PrimeNG UI Components
- TypeScript
- SCSS
- RxJS with Signals

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

This project was developed using a systematic approach with modern AI tools:

1. **Research & Requirements Analysis with Grok**
   - Used Grok's research capabilities to analyze similar clinical trial management systems
   - Defined detailed functional requirements
   - Identified technical requirements and constraints
   - Created a comprehensive feature list and acceptance criteria
   - Generated Cursor AI rules file (`clinical-trials-standards.mdc`):
     * Defined coding standards for Angular 19 and NestJS
     * Established database schema and relationships
     * Set up project structure guidelines
     * Created component and service templates
     * Configured TypeScript and linting rules
     * Documented best practices and conventions
     * Automated code quality enforcement
     * Standardized error handling patterns
     * Defined testing requirements

2. **Project Planning & Architecture**
   - Developed technical architecture blueprint
   - Created database schema design
   - Defined API endpoints structure
   - Planned UI/UX wireframes
   - Set up project milestones and timeline

3. **Development with Cursor IDE & Claude**
   - **Initial Setup**
     * Created basic project structure
     * Configured development environment
     * Set up necessary tools and libraries

   - **Feature Development**
     * Created models and DTOs
     * Built UI components
     * Implemented business logic
     * Integrated API endpoints

   - **UI/UX Enhancement**
     * Integrated PrimeNG components
     * Customized themes and styles
     * Optimized layout and responsive design

   - **Testing and Debugging**
     * Handled validation errors
     * Fixed type mismatches
     * Improved error handling

   - **Optimization**
     * Enhanced performance
     * Refactored code for maintainability
     * Added documentation

4. **Continuous Improvement**
   - Regular code reviews with AI assistance
   - Performance optimization
   - Security enhancements
   - Documentation updates

AI Tools Contribution:
- **Grok**: Initial research and requirement analysis
- **Cursor IDE & Claude**: 
  * Code generation and modification
  * Debugging and error fixing
  * UI/UX improvements
  * Performance optimization
  * Documentation writing
  * Best practices suggestions

## API Documentation

API documentation is available at `http://localhost:3000/api` after starting the backend server.

## License

MIT License - see [LICENSE](LICENSE) file for details. 