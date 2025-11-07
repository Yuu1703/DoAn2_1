import NextAuthImport from 'next-auth'
import GoogleProviderImport from 'next-auth/providers/google'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { getMongoClient } from '@/lib/mongodb'

const GoogleProvider = GoogleProviderImport?.default || GoogleProviderImport

export const authOptions = {
  adapter: MongoDBAdapter(getMongoClient(), { databaseName: process.env.MONGODB_DB || 'DoAn2' }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: { strategy: 'jwt' },
  // Helpful during development to surface detailed errors in the server logs
  debug: process.env.NODE_ENV === 'development',
  // Use our custom login page and send auth errors back there as query params
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) session.user = { ...(session.user || {}), id: token.sub }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const NextAuthFn = NextAuthImport?.default || NextAuthImport
export default NextAuthFn(authOptions)
