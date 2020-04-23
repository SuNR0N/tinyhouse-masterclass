import { v2 as cloudinary } from 'cloudinary';

import { Configuration } from '../config';

const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } = Configuration;

cloudinary.config({
    /* eslint-disable @typescript-eslint/camelcase */
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    /* eslint-enable @typescript-eslint/camelcase */
});

export const Cloudinary = {
    upload: async (image: string) => {
        const result = await cloudinary.uploader.upload(image, {
            folder: 'TH_Assets/',
        });

        return result.secure_url;
    },
};
