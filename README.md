# Huddle - AI Learning Platform 🚀

A modern, AI-powered learning platform that revolutionizes how students create, share, and interact with educational content. Built with Next.js 15, Supabase, and Google's Gemini AI.

## What is Huddle?

Huddle is an intelligent study platform that combines note-taking, AI-powered learning tools, and collaborative study groups. Create rich notes, generate AI summaries and quizzes, visualize content as mind maps, and collaborate with peers in real-time chat groups.

## 🚀 Quick Start

```bash
git clone https://github.com/yourusername/huddle.git
cd huddle
npm install
# Set up your .env.local file (see SETUP.md for details)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start using Huddle!

## ✨ Key Features

<details>
<summary>📝 Smart Note Management</summary>

- **Rich Text Editor**: Create and edit notes with a powerful TipTap-based editor
- **Real-time Collaboration**: Share notes publicly
- **Advanced Search**: Find notes quickly with intelligent search functionality
- **Subject Organization**: Categorize notes by subjects for better organization
- **PDF Uploads**: Extract text from pdf files and use AI to prettify it
</details>

<details>
<summary>🤖 AI-Powered Learning Tools</summary>

- **AI Summarization**: Generate concise summaries using Google Gemini AI
- **Interactive Quizzes**: Automatically create multiple-choice quizzes from your content
- **Mind Maps**: Visualize your notes as interactive mind maps
- **Smart Content Analysis**: Extract key concepts and relationships
</details>

<details>
<summary>👥 Collaborative Study Groups</summary>

- **Group Creation**: Create public or private study groups
- **Real-time Chat**: Communicate with group members in dedicated chat rooms
- **Group Discovery**: Find and join public study groups based on your interests
</details>

<details>
<summary>🎨 Modern User Experience</summary>

- **Dark/Light Mode**: Toggle between themes for comfortable studying
- **Responsive Design**: Seamless experience across all devices
- **Intuitive Interface**: Clean, modern UI built with shadcn/ui components
- **Fast Performance**: Optimized with Next.js 15 and App Router
</details>

## 🛠️ Tech Stack

<details>
<summary>View Tech Stack Details</summary>

### Frontend

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Modern UI components

### Backend & Database

- **[Supabase](https://supabase.com/)** - Backend-as-a-Service with PostgreSQL, real-time subscriptions, authentication, and file storage
- **[Supabase Auth](https://supabase.com/auth)** - User authentication with Google OAuth

### AI & Rich Text

- **[Google Gemini AI](https://ai.google.dev/)** - AI-powered content generation
- **[TipTap](https://tiptap.dev/)** - Rich text editor
- **[React Flow](https://reactflow.dev/)** - Interactive mind map visualization

</details>

## 🚀 Getting Started

For detailed installation and setup instructions, see **[SETUP.md](SETUP.md)**.

### Quick Setup

1. Clone the repository and install dependencies
2. Set up your Supabase project and get API keys
3. Configure Google AI API key
4. Set up environment variables in `.env.local`
5. Run database migrations
6. Start the development server with `npm run dev`

## 📁 Project Structure

<details>
<summary>View Project Structure</summary>

```
huddle/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Main dashboard pages
│   │   └── (smart)/           # AI features pages
│   ├── components/            # Reusable React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── auth/             # Authentication components
│   │   ├── chat/             # Chat functionality
│   │   ├── groups/           # Study groups components
│   │   ├── notes/            # Note management components
│   │   └── smart/            # AI features components
│   ├── lib/                  # Utility functions and actions
│   └── utils/                # External service utilities
├── supabase/                 # Supabase configuration and migrations
└── public/                   # Static assets
```

</details>

## 🔧 Key Features Implementation

<details>
<summary>Technical Implementation Details</summary>

### AI-Powered Content Generation

The platform leverages Google's Gemini AI for:

- **Summarization**: Converts lengthy notes into concise, bullet-pointed summaries
- **Quiz Generation**: Creates multiple-choice questions based on note content
- **Mind Mapping**: Extracts key concepts and relationships to create visual mind maps

### Real-time Collaboration

Built on Supabase's real-time capabilities:

- **Live Chat**: Group members can communicate in real-time
- **Instant Updates**: Changes to groups and notes are reflected immediately
- **Presence Indicators**: See who's online and active in groups

### Performance Optimizations

- **Database Query Caching**: Frequently accessed data cached using Supabase
- **Static Asset Caching**: Images and content cached with appropriate headers
- **CDN Optimization**: Assets served through Vercel's global CDN
- **Image Optimization**: Next.js Image component with automatic optimization

</details>

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

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy - Vercel will automatically build and deploy your app

For detailed deployment instructions, see **[SETUP.md](SETUP.md)**.

## 🤝 Contributing

Contributions are welcome! For detailed development setup instructions, see **[SETUP.md](SETUP.md)**.

### Quick Contributing Guide

1. Fork and clone the repository
2. Install dependencies with `npm install`
3. Set up your local Supabase instance
4. Configure environment variables
5. Run `npm run dev` to start development
6. Submit a pull request

For major changes, please open an issue first to discuss what you would like to change.

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
