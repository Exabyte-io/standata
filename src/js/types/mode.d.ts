// TODO: remove when @mat3ra/mode provides its own types
declare module "@mat3ra/mode" {
    export class MethodConversionHandler {
        static convertToSimple(cm: any, allMethods?: any[]): any;
        static convertToCategorized(sm: any, allMethods?: any[]): any;
    }

    export class ModelConversionHandler {
        static convertToSimple(cm: any, allModels?: any[]): any;
        static convertToCategorized(sm: any, allModels?: any[]): any;
    }

    export const tree: any;
    export const default_methods: any;
    export const default_models: any;
    export class Method {
        constructor(...args: any[]);
    }
    export class Model {
        constructor(...args: any[]);
    }
}
