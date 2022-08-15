import Data from './data.json';

const navData: Record<
    string,
    Array<{ name: string; infos: Array<{ name: string; url: string; urls?: Array<{ env: string; url: string }> }> }>
> = {};

Data.map(({ name, categorys }) => {
    navData[name] = categorys;
});

export default navData;
