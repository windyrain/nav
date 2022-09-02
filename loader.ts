import { server } from './constants';

export const customImageLoader = ({ src }: { src: string }) => {
    return `${server}${src}`;
};
