<div align="center">
  <h1>✨ Optify Dashboard</h1>
  <p>A premium, minimalist, and high-performance client dashboard for Optify LLC.</p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Supabase-0.10-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
  </p>
</div>

---

## 📖 Overview

The **Optify Dashboard** is a modern web application designed to provide a seamless and visually stunning experience for managing client interactions. Built with a focus on "quiet luxury" and professional aesthetics, it features an elegant landing page, robust authentication flows, and a comprehensive dashboard interface.

### ✨ Key Features

- **🎨 Modern Aesthetic:** A sleek, premium design language inspired by modern interfaces, utilizing glassmorphism, subtle borders, and smooth micro-animations.
- **⚡ High Performance:** Powered by Next.js 16 and React 19 for fast page loads and dynamic rendering.
- **🔐 Secure Authentication:** Seamless integration with Supabase for robust user login, signup, and session management.
- **📊 Comprehensive Dashboard:** Includes dedicated views for Overview, Calls, Appointments, Leads, and Clients, enhanced with layout-accurate skeleton loading states for fluid transitions.
- **📱 Responsive Layouts:** Fully responsive design ensuring an optimal experience across all devices, from desktop to mobile.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (v16.2)
- **Library:** [React](https://react.dev/) (v19.2)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v4)
- **Backend & Auth:** [Supabase](https://supabase.com/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd optify-dashboard
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root of your project and configure your Supabase credentials. Use the provided `.env.example` as a reference.

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the app running locally.

---

## 📂 Project Structure

```text
optify-dashboard/
├── src/
│   ├── app/           # Next.js App Router (Pages, Layouts, & API routes)
│   └── components/    # Reusable React components (UI, Landing, Dashboard, Auth)
├── supabase/          # Supabase configuration, edge functions, and migrations
├── public/            # Static assets (images, icons, fonts)
├── package.json       # Project dependencies and npm scripts
├── postcss.config.mjs # PostCSS configuration for Tailwind CSS
└── tsconfig.json      # TypeScript configuration
```

---

## 🤝 Contributing

Contributions are always welcome! If you'd like to improve the dashboard or fix issues, please create a pull request or open an issue. Ensure your code follows the existing style guidelines and passes the linter.

```bash
# Run the linter to check for errors
npm run lint
```

---

<div align="center">
  <p>Built with ❤️ for the Optify Team.</p>
</div>
