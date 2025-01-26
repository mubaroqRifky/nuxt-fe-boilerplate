import Authenticate from "../apis/Authenticate.ts";
import User from "../apis/User.ts";
import Role from "../apis/Role.ts";
import Permission from "../apis/Permission.ts";

export default defineNuxtPlugin(() => {
    return {
        provide: {
            auth: new Authenticate(),
            user: new User(),
            role: new Role(),
            permission: new Permission(),
        },
    };
});
