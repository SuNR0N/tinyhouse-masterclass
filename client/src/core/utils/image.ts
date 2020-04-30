export const getBase64Value = (img: File | Blob, callback: (imageBase64Value: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => {
        callback(reader.result as string);
    };
};
