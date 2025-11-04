# Recipe Search & Shopping List Builder

A React/Next.js application for searching recipes and building shopping lists.

## 🚀 Features

### Core Functionality

- **Recipe Search**: Search for recipes using TheMealDB API
- **Recipe Details**: View detailed recipe information with ingredients and instructions
- **Shopping List Builder**: Add recipe ingredients to shopping list
- **Surprise Me**: Discover random recipes by clicking Surprise Me button

### User Experience

- Clean, modern interface with Tailwind CSS
- Modal-based recipe details for quick browsing
- Persistent shopping list using localStorage
- Loading states and error handling

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **API**: TheMealDB (https://www.themealdb.com/api.php)
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: Browser localStorage for shopping list persistence

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/Tianna-Wen/nib-recipe-app.git
   cd nib-recipe-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Running Tests

The project includes comprehensive unit tests for components, hooks, and utility functions.

**Run all tests:**

```bash
npm test
```

**Run tests in watch mode (for development):**

```bash
npm run test:watch
```

**Run tests with coverage report:**

```bash
npm run test:coverage
```

**Run tests in CI mode:**

```bash
npm run test:ci
```
