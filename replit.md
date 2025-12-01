# Kitchen Cabinet Cutting List Generator

## Overview
This professional single-page React application, built with TypeScript, automates the generation of precise cutting lists for kitchen cabinets. It streamlines the production process for cabinet makers and woodworkers by automating panel calculations, laminate selection, and configuration for various cabinet types. Key capabilities include comprehensive laminate code management, metric/imperial unit support, PDF export of optimized cutting lists, GADDI panel marking, material-based sheet separation, and wood grain direction control. The project aims to maximize material utilization and provide an efficient tool for the industry.

## User Preferences
- Preferred communication style: Simple, everyday language.
- Testing: Keep tests short and focused to save time.
- UI changes: Always ask before making UI changes.
- GADDI SYSTEM UNBLOCKED: The GADDI panel marking system is now available for modifications and enhancements.

## System Architecture

### Frontend Architecture
The frontend utilizes React 18 with TypeScript, Vite, shadcn/ui (Radix UI), and Tailwind CSS. React Hook Form with Zod handles form management, Wouter manages routing, and TanStack Query is used for global state. The design is responsive and mobile-first.

### Backend Architecture
The backend is an Express.js server in TypeScript, using Drizzle ORM for PostgreSQL integration with Neon Database. It follows a RESTful API design and uses `connect-pg-simple` for session management.

### Database Design
The application uses a PostgreSQL database, with schema managed through Drizzle ORM migrations, including user management and shared schema definitions.

### System Design Choices
- **Unified Cabinet with Shutter Section**: A single interface for shutters and cabinets with Basic/Advanced mode toggle.
- **Comprehensive Cabinet Configuration**: Supports various cabinet types with customizable dimensions and shutter configurations, exclusively using a laminate code system.
- **Automated Panel Calculations**: Accurately calculates panel dimensions based on user inputs and cabinet types.
- **100% Database-Driven Laminate Code System**: All laminate and wood grain logic is handled via direct database lookups using laminate codes, replacing a manual laminate type system.
- **Advanced PDF Export**: Generates multi-page A4 portrait PDFs with optimized cutting layouts, project details, panel lists, and cutting layouts, supporting deletable pages and separated sheets.
- **GADDI Panel Marking**: Individual toggle for panels requiring "GADDI" marking with visual indicators. TOP/BOTTOM panels always mark the WIDTH dimension, and LEFT/RIGHT panels always mark the HEIGHT dimension, regardless of panel rotation.
- **Material-Based Sheet Separation**: A universal grouping algorithm combines panels on the same sheet if they share matching plywood brand and base laminate code.
- **Wood Grain Direction**: A 100% database-driven system applies wood grain direction based on database lookups for laminates with `wood_grains_enabled = true`. 456SF panels never rotate. Wood grain panels display original nominal dimensions while non-wood grain panels display mapped dimensions.
- **Manual Panel Addition**: Allows users to add custom panels directly to specific sheets within the preview, integrated into PDF exports.
- **Link Panels Toggle**: A unified control to automatically synchronize plywood brand and laminate code across all cabinet panels, with manual override.
- **Master Settings**: A global control panel to synchronize plywood brand and laminate code across all cabinets, with wood grain preferences managed through the database and persistence across sessions.
- **Quick Save to Client Folders**: Instantly saves PDF cutting lists and material lists to client-specific folders in object storage.
- **Apply to All Toggle Controls**: Three configuration toggles (Center Post, Shelves, Include Shutters) automatically apply their state to all existing cabinets for unified project control.
- **Multi-Pass Optimization**: Employs a multi-strategy optimization system (e.g., Best Area Fit, Best Short Side Fit, Best Long Side Fit, Bottom Left) to maximize material utilization, especially for non-wood grain laminates.
- **Code Separation**: Wood grain and standard optimization logic are separated into distinct modules for clarity and maintainability.

## External Dependencies

### UI and Design
- **Radix UI**: Accessible UI primitives.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.
- **Google Fonts (Inter)**: Typography.

### Form Management
- **React Hook Form**: Forms library.
- **Zod**: Schema validation.

### Database and Backend
- **Drizzle ORM**: Type-safe ORM for PostgreSQL.
- **@neondatabase/serverless**: Serverless PostgreSQL driver.
- **connect-pg-simple**: PostgreSQL session store.

### PDF Generation
- **jsPDF**: Client-side PDF generation.

### Utility Libraries
- **date-fns**: Date manipulation.
- **clsx** and **class-variance-authority**: Conditional CSS classes.
- **nanoid**: Unique ID generation.