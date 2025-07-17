# **App Name**: EduReport Hub

## Core Features:

- Secure Authentication: User authentication: Allows users to securely log in using the Login API endpoint and refresh their tokens, and allows admins to register new users using the Register API.
- Report Management: Report Management: Allows authenticated users to create new reports, view all reports, and view a specific report by ID.  Integrates with the Create Report, Get All Reports, and Get Report by ID API endpoints.
- Advanced Search: Search and Filter: Allows users to search reports by teacher name, establishment name, class name, course title, date range, and keywords in descriptions.  This tool enhances data retrieval and reporting.
- Establishment Management: Establishment Management: Allows users to view a list of all establishments. Admins can also create new establishments or multiple establishments using the corresponding API endpoints.
- Bulk Data Upload: Data Upload: Enables admins to upload teachers from an Excel file. Uses the Upload Teachers API endpoint to handle bulk data uploads.
- Email Support: Email handling for account verification, and password reset if implemented

## Style Guidelines:

- Primary color: A vibrant blue (#29ABE2) to represent trust, stability, and professionalism, essential for an educational reporting system.
- Background color: A very light, desaturated blue (#F0F8FF), almost white, for a clean and unobtrusive backdrop that keeps focus on the content.
- Accent color: A contrasting orange (#FFB347), which can be used sparingly to draw attention to calls to action and important notifications.
- Headline font: 'Space Grotesk' (sans-serif) for a modern and technical feel. Use 'Inter' (sans-serif) for body text. Use 'Source Code Pro' to display any JSON data returned by the APIs
- The layout should be clean and intuitive, optimized for quick data entry and review. Employ a responsive design to ensure compatibility across devices.
- Use a consistent set of icons throughout the app. The icons should be simple, modern, and easily recognizable.
- Subtle animations for transitions and interactions will enhance user experience without being distracting. Use animations to confirm actions.