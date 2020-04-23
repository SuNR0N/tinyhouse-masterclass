import { message, notification } from 'antd';
import { AppRoute } from '../config/app-route';

export const formatPrice = (price: number, round = true) => {
    const formattedPrice = round ? Math.round(price / 100) : price / 100;
    return `£${formattedPrice}`;
};

export const displaySuccessNotification = (message: string, description?: string) =>
    notification.success({
        message,
        description,
        placement: 'topLeft',
        style: {
            marginTop: 50,
        },
    });

export const displayErrorMessage = (error: string) => message.error(error);

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
