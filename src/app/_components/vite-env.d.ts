/// <reference types="vite/client" />

declare module "*.vue" {
    import { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }

declare module "*.d.ts" {
    interface Response<T> {
        code: number;
        message: string;
        data: T;
    }
}
