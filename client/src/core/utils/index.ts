import { message, notification } from 'antd';

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
