import { AppRoute } from '../config/app-route';

export const resolveRoute = (route: AppRoute, ...args: any[]) => {
    const regExp = /(:\w+)/g;
    const matches = route.match(regExp);
    return args.reduce<string>((acc, arg, i) => {
        const match = matches && matches[i];
        if (match) {
            acc = acc.replace(match, arg);
        }
        return acc;
    }, route);
};
