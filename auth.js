// pages/api/auth/[...nextauth].js

import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        // Add logic here to authenticate users
        const user = await authenticateUser(credentials.username, credentials.password);
        if (!user) {
          throw new Error('Invalid username or password');
        }
        return user;
      }
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    })
  ],

  // Configure session management
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },

  // Configure callbacks
  callbacks: {
    async jwt tokenize({ user, account, profile, isNewUser }) {
      // Add custom claims to the JWT token
      return {
        sub: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture
      };
    },
    async session({ session, token, user }) {
      // Add custom session data
      session.user = user;
      return session;
    }
  }
});

// helpers/auth.js

export async function authenticateUser(username, password) {
  // Add logic here to authenticate users
  // For example, you can use a database query to verify the username and password
  const user = await db.query(`SELECT * FROM users WHERE username = $1 AND password = $2`, username, password);
  if (user) {
    return user;
  }
  return null;
}
