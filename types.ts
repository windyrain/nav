export type NavData = Record<string, Array<ICategory>>;

export interface ICategory {
    name: string;
    infos: Array<{ name: string; url: string; urls?: Array<{ env: string; url: string }> }>;
}
