# Huddle - AI Learning Platform 🚀

A modern, AI-powered learning platform that revolutionizes how students create, share, and interact with educational content. Built with Next.js 15, Supabase, and Google's Gemini AI.

## ✨ Features

### 📝 Smart Note Management

- **Rich Text Editor**: Create and edit notes with a powerful TipTap-based editor
- **Real-time Collaboration**: Share notes publicly or keep them private
- **Advanced Search**: Find notes quickly with intelligent search functionality
- **Subject Organization**: Categorize notes by subjects for better organization
- **Word Count Tracking**: Monitor your writing progress with real-time statistics

### 🤖 AI-Powered Learning Tools

- **AI Summarization**: Generate concise summaries of your notes using Google Gemini AI
- **Interactive Quizzes**: Automatically create multiple-choice quizzes from your content
- **Mind Maps**: Visualize your notes as interactive mind maps for better understanding
- **Smart Content Analysis**: Extract key concepts and relationships from your notes

### 👥 Collaborative Study Groups

- **Group Creation**: Create public or private study groups
- **Real-time Chat**: Communicate with group members in dedicated chat rooms
- **Member Management**: Invite students and manage group permissions
- **Group Discovery**: Find and join public study groups based on your interests

### 🎨 Modern User Experience

- **Dark/Light Mode**: Toggle between themes for comfortable studying
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Intuitive Interface**: Clean, modern UI built with shadcn/ui components
- **Fast Performance**: Optimized with Next.js 15 and App Router

## 🛠️ Tech Stack

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Modern UI components
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

### Backend & Database

- **[Supabase](https://supabase.com/)** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - File storage
- **[Supabase Auth](https://supabase.com/auth)** - User authentication with Google OAuth

### AI & Rich Text

- **[Google Gemini AI](https://ai.google.dev/)** - AI-powered content generation
- **[TipTap](https://tiptap.dev/)** - Rich text editor
- **[React Flow](https://reactflow.dev/)** - Interactive mind map visualization

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[PostCSS](https://postcss.org/)** - CSS processing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google AI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/huddle.git
   cd huddle
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Google AI Configuration
   GEMINI_SECRET_KEY=your_gemini_api_key
   ```

4. **Set up Supabase**

   Run the following SQL commands in your Supabase SQL editor:

   ```sql
   -- Create profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users ON DELETE CASCADE,
     full_name TEXT,
     username TEXT UNIQUE,
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     PRIMARY KEY (id)
   );

   -- Create subjects table
   CREATE TABLE subjects (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL UNIQUE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create notes table
   CREATE TABLE notes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     excerpt TEXT,
     content_url TEXT NOT NULL,
     tags TEXT[] DEFAULT '{}',
     subject_id UUID REFERENCES subjects(id),
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     visibility TEXT DEFAULT 'public',
     is_public BOOLEAN DEFAULT true,
     group_id UUID,
     word_count INTEGER DEFAULT 0,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create study groups table
   CREATE TABLE study_groups (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     is_public BOOLEAN DEFAULT true,
     max_members INTEGER DEFAULT 20,
     member_count INTEGER DEFAULT 1,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create group members table
   CREATE TABLE group_members (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     role TEXT DEFAULT 'member',
     joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(group_id, user_id)
   );

   -- Create chat messages table
   CREATE TABLE chat_messages (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     content TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Set up Supabase Storage**

   Create the following storage buckets in your Supabase dashboard:

   - `note-contents` (for storing note content files)
   - `my-images` (for user-uploaded images)

6. **Configure Authentication**

   In your Supabase dashboard:

   - Enable Google OAuth provider
   - Add your site URL to allowed redirect URLs
   - Configure email templates if needed

7. **Run the development server**

   ```bash
   npm run dev
   ```

8. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
huddle/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Main dashboard pages
│   │   ├── (smart)/           # AI features pages
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── auth/             # Authentication components
│   │   ├── chat/             # Chat functionality
│   │   ├── groups/           # Study groups components
│   │   ├── notes/            # Note management components
│   │   ├── smart/            # AI features components
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utility functions and actions
│   │   ├── accountActions.ts # User account operations
│   │   ├── groupActions.ts   # Study group operations
│   │   ├── noteActions.ts    # Note CRUD operations
│   │   └── utils.ts          # General utilities
│   ├── utils/                # External service utilities
│   │   ├── gemini/           # Google Gemini AI integration
│   │   ├── supabase/         # Supabase client configuration
│   │   └── tiptap/           # TipTap editor utilities
│   └── providers/            # React context providers
├── public/                   # Static assets
├── components.json           # shadcn/ui configuration
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── package.json             # Dependencies and scripts
```

## 🔧 Key Features Implementation

### AI-Powered Content Generation

The platform leverages Google's Gemini AI for three main features:

- **Summarization**: Converts lengthy notes into concise, bullet-pointed summaries
- **Quiz Generation**: Creates multiple-choice questions based on note content
- **Mind Mapping**: Extracts key concepts and relationships to create visual mind maps

### Real-time Collaboration

Built on Supabase's real-time capabilities:

- **Live Chat**: Group members can communicate in real-time
- **Instant Updates**: Changes to groups and notes are reflected immediately
- **Presence Indicators**: See who's online and active in groups

### Rich Text Editing

Powered by TipTap editor with features like:

- **Formatting Options**: Bold, italic, underline, highlighting
- **Structure Elements**: Headers, lists, blockquotes, code blocks
- **Text Alignment**: Left, center, right, justify
- **Character/Word Counting**: Real-time statistics

## 🎯 Usage Examples

### Creating and Managing Notes

1. Navigate to "Create Note" from the dashboard
2. Fill in title, subject, and tags
3. Use the rich text editor to write your content
4. Save and choose visibility settings
5. Access AI features from the Smart Features page

### Joining Study Groups

1. Browse public groups on the Groups page
2. Use search to find groups by name or topic
3. Click "Join Group" to become a member
4. Participate in group chat and discussions

### Using AI Features

1. Go to Smart Features page
2. Select a note from the public collection
3. Choose from Summarize, Quiz, or Mind Map
4. View AI-generated content and interact with results

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy your app

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
GEMINI_SECRET_KEY=your_gemini_api_key
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines

1. Follow the existing code style and conventions
2. Write meaningful commit messages
3. Add comments for complex logic
4. Test your changes thoroughly
5. Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Vercel](https://vercel.com/)** - For the amazing deployment platform
- **[Supabase](https://supabase.com/)** - For the powerful backend infrastructure
- **[Google AI](https://ai.google.dev/)** - For the Gemini AI API
- **[shadcn](https://ui.shadcn.com/)** - For the beautiful UI components
- **[TipTap](https://tiptap.dev/)** - For the rich text editor
- **[React Flow](https://reactflow.dev/)** - For mind map visualization
- **[Lucide](https://lucide.dev/)** - For the icon library
- **[Tailwind CSS](https://tailwindcss.com/)** - For the utility-first CSS framework

## 📞 Contact

If you have any questions or suggestions, feel free to reach out:

- **GitHub**: [JoelJosy](https://github.com/JoelJosy)
- **Email**: contact.jolb@gmail.com
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/joel-josy/)

---

**Built with ❤️ for the learning community**

```

```
