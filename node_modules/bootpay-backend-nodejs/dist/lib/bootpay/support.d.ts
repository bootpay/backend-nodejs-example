export interface Validate {
    isBlank(value: any): Boolean;
    isType(value: any, type: string): Boolean;
    isPresent(value: any): Boolean;
    presence(value: any, defaultValue: any): any;
    toUnderscore(value: any): any;
    objectKeyToUnderscore(value: any): any;
}
export declare const isPresent: (value: any) => Boolean;
export declare const isBlank: (value: any) => Boolean;
export declare const presence: (value: any, defaultValue: any) => any;
export declare const toUnderscore: (value: any) => any;
export declare const objectKeyToUnderscore: (value: any) => any;
export declare const isType: (value: any, type: string) => boolean;
