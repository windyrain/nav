import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { server } from '../../../constants';
import { getJsonData } from '../user/query';

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            credentials: {},
            async authorize(credentials) {
                const submitInfo = credentials as { username: string; password: string };
                const usersCollection = getJsonData();

                const user = usersCollection.find(({ username }) => username === submitInfo.username);

                if (!user) {
                    throw new Error('用户不存在');
                }

                // console.log(user.password, submitInfo.password);
                const isValid = user.password === submitInfo.password;

                if (!isValid) {
                    throw new Error('密码不正确');
                }

                return { username: user.username, id: `${Date.now()}` };
            },
        }),
    ],
    secret: server,
};

export default NextAuth(authOptions);
