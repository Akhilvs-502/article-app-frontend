# Article Hub - Frontend Application

A modern, responsive frontend application for managing articles across various categories. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

### 🔐 Authentication
- **User Registration**: Complete signup form with personal details and article preferences
- **User Login**: Flexible login using either email or phone number
- **Form Validation**: Comprehensive client-side validation with error handling

### 📚 Article Management
- **Category-based Articles**: Support for Sports, Politics, Space, Technology, Health, Science, Entertainment, Business, Education, and Environment
- **User Preferences**: Users can select and manage their preferred article categories
- **Article CRUD**: Create, read, update, and delete articles (for article owners)

### 🎨 User Interface
- **Modern Design**: Clean, responsive design with Tailwind CSS
- **Dashboard**: User-friendly dashboard with tabbed interface
- **Responsive Layout**: Mobile-first design that works on all devices

## Pages

1. **Home Page** (`/`) - Landing page with navigation to auth and dashboard
2. **Registration** (`/auth/register`) - User signup with preferences
3. **Login** (`/auth/login`) - User authentication
4. **Dashboard** (`/dashboard`) - User dashboard with articles and preferences

## Components

- `ArticleForm` - Reusable form for creating/editing articles
- Form validation and error handling
- Responsive grid layouts
- Interactive category selection

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React hooks (useState)
- **Form Handling**: Controlled components with validation

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx      # Login page
│   │   └── register/page.tsx   # Registration page
│   ├── dashboard/
│   │   └── page.tsx            # User dashboard
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   └── ArticleForm.tsx         # Article form component
└── ...
```

## Features in Detail

### Registration Form
- First name, last name, phone, email, DOB
- Password and confirmation
- Article category preferences (checkboxes)
- Real-time validation
- Responsive grid layout

### Login Form
- Toggle between email and phone login
- Password field
- Form validation
- Links to registration and forgot password

### Dashboard
- **Articles Tab**: View, edit, delete user's articles
- **Preferences Tab**: Manage article category preferences
- Responsive design with proper spacing
- Mock data for demonstration

### Article Form Component
- Modal-based form
- Title, category, and content fields
- Validation and error handling
- Reusable for both create and edit modes

## Future Enhancements

- Backend API integration
- User authentication state management
- Article search and filtering
- Rich text editor for articles
- Image upload support
- User profile management
- Social sharing features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
