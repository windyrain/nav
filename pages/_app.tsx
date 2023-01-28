import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <MantineProvider>
            <NotificationsProvider position="top-right">
                <ModalsProvider>
                    <Component {...pageProps} />
                </ModalsProvider>
            </NotificationsProvider>
        </MantineProvider>
    );
}

export default MyApp;
