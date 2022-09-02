import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { getSession, signIn } from 'next-auth/react';
import styles from '../styles/page/login.module.scss';
import { md5Password } from '../libs/auth';

const dev = process.env.NODE_ENV !== 'production';
export const server = dev ? 'http://localhost:3000' : 'https://nav.oneadvise.cn';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginStarted, setIsLoginStarted] = useState(false);
    const [loginError, setLoginError] = useState('');
    const router = useRouter();

    useEffect(() => {
        getSession().then((session) => {
            if (session) {
                router.replace('/');
            }
        });
    }, [router]);

    const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoginStarted(true);
        const secretPassowrd = await md5Password(password);
        const result = await signIn('credentials', {
            username,
            password: secretPassowrd,
            callbackUrl: server,
        });

        if (result?.error) {
            setLoginError(result?.error);
        }
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>登录</title>
            </Head>
            <main className={styles.loginMain}>
                <div className={styles.loginStep}>
                    <h1>凯叔导航</h1>
                    <form onSubmit={handleLogin} className={styles.loginForm}>
                        <label htmlFor="username">用户名</label>
                        <input
                            id="inputUsername"
                            type="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={loginError ? styles.errorInput : ''}
                        />
                        <span className={styles.error}>{loginError}</span>
                        <label htmlFor="inputPassword">密码</label>
                        <input
                            id="inputPassword"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" disabled={isLoginStarted} className={styles.blueButtonRound}>
                            登录
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
