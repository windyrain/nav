export type NavData = Record<
    string,
    Array<{ name: string; infos: Array<{ name: string; url: string; urls?: Array<{ env: string; url: string }> }> }>
>;
