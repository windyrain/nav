const dev = process.env.NODE_ENV !== 'production';
export const server = dev ? 'http://localhost:3000' : 'https://nav.oneadvise.cn';

export const customImageLoader = ({ src }: { src: string }) => {
    return `${server}${src}`;
};
