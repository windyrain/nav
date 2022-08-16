import Data from './data.json';

type NavData = Record<
    string,
    Array<{ name: string; infos: Array<{ name: string; url: string; urls?: Array<{ env: string; url: string }> }> }>
>;

let jsonData = Data;
const navData: NavData = {};

Data.map(({ name, categorys }) => {
    navData[name] = categorys;
});

export function updateNavData(data: typeof Data) {
    jsonData = data;
    data.map(({ name, categorys }) => {
        navData[name] = categorys;
    });
}

export function getJsonData() {
    return jsonData;
}

export default navData;
