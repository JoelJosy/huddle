# Huddle Setup Guide 🛠️

This guide provides detailed instructions for setting up Huddle locally and in production.

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google AI API key

## Local Development Setup

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/huddle.git
cd huddle
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google AI Configuration
GEMINI_SECRET_KEY=your_gemini_api_key
```

### 3. Supabase Database Setup

Apply the database migrations to set up your Supabase instance:

```bash
# Navigate to the supabase directory
cd supabase

# Link to your Supabase project
npx supabase link --project-ref your-project-id

# Apply all migrations
npx supabase db push

# Return to project root
cd ..
```

**Alternative**: Manually run the SQL commands in your Supabase SQL editor. The migration files are located in `supabase/migrations/`.

### 4. Supabase Storage Setup

Create the following storage buckets in your Supabase dashboard:

- `note-contents` (for storing note content files)
- `profile-avatars` (for storing avatar images to prevent google rate limiting)
- `my-images` (for other images)

### 5. Authentication Configuration

In your Supabase dashboard:

- Enable Google OAuth provider
- Add your site URL to allowed redirect URLs
- Configure email templates if needed

### 6. Run Development Server

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000) to see your application running.

## Production Deployment

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
GEMINI_SECRET_KEY=your_gemini_api_key
```

### Deploy to Vercel

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add all required environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy your application

### Deploy to Other Platforms

For other platforms (Railway, Render, etc.):

1. Set up environment variables
2. Configure build command: `npm run build`
3. Configure start command: `npm start`
4. Set Node.js version to 18+

## Local Development with Supabase CLI

### Setting Up Local Supabase

1. **Install Supabase CLI**

   ```bash
   npm install -g supabase
   ```

2. **Start Local Supabase**

   ```bash
   npx supabase start
   ```

3. **Apply Database Migrations**

   ```bash
   npx supabase db push
   ```

4. **Configure Local Environment**

   Create a `.env.local` file with your local Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_local_service_role_key
   GEMINI_SECRET_KEY=your_gemini_api_key
   ```

## Database Migrations

All database schema changes are managed through Supabase migrations located in the `supabase/migrations/` folder:

### Common Migration Commands

- **Create a new migration**: `npx supabase migration new your_migration_name`
- **Apply migrations**: `npx supabase db push`
- **Reset local database**: `npx supabase db reset`
- **Generate TypeScript types**: `npx supabase gen types typescript --local > src/types/database.types.ts`

### Migration Best Practices

1. Always test migrations locally before applying to production
2. Use descriptive names for migration files
3. Include rollback instructions in migration comments
4. Back up production data before applying major schema changes

## API Configuration

### Google Gemini AI Setup

1. **Get API Key**: Visit [Google AI Studio](https://ai.google.dev/) and create an API key
2. **Enable APIs**: Ensure the Gemini API is enabled for your project
3. **Set Rate Limits**: Configure appropriate rate limiting for your usage

### Supabase Configuration

1. **Database**: PostgreSQL database with Row Level Security enabled
2. **Authentication**: Configure OAuth providers (Google recommended)
3. **Storage**: Set up buckets with appropriate permissions
4. **Edge Functions**: Optional - for advanced AI processing

## Troubleshooting

### Common Issues

1. **Supabase Connection Issues**

   - Verify your Supabase URL and keys
   - Check if your IP is whitelisted (if applicable)
   - Ensure RLS policies are correctly configured

2. **Google AI API Issues**

   - Verify API key is valid and has proper permissions
   - Check rate limits and quotas
   - Ensure billing is set up if required

3. **Build Issues**

   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run type-check`

4. **Migration Issues**
   - Ensure Supabase CLI is up to date
   - Check migration file syntax
   - Verify database connection

### Getting Help

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/yourusername/huddle/issues)
2. Review Supabase and Next.js documentation
3. Create a new issue with detailed error messages and steps to reproduce

## Development Guidelines

### Code Style

1. Follow the existing code style and conventions
2. Use TypeScript for type safety
3. Add comments for complex logic
4. Use meaningful variable and function names

### Testing

1. Test your changes thoroughly
2. Verify functionality across different browsers
3. Test responsive design on various screen sizes
4. Ensure accessibility standards are met

### Documentation

1. Update documentation as needed
2. Add JSDoc comments for complex functions
3. Update this SETUP.md file for any new requirements
4. Include examples in code comments
