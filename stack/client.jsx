import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
    tokenStore: "nextjs-cookie",
    urls: {
        signIn: "/auth/login",
        signUp: "/auth/signup",
        handler: "/handler",
    },
    usePasskey: true,
});
