import React, { FC, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { Link, Redirect } from 'react-router-dom';
import { Button, Form, Input, InputNumber, Layout, Radio, Typography, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { BankOutlined, HomeOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';

import { HOST_LISTING } from '../../core/graphql/mutations/host-listing';
import { HostListing as HostListingData, HostListingVariables } from '../../core/graphql/mutations/__generated__/HostListing';
import { AppRoute } from '../../core/config/app-route';
import { ListingType } from '../../core/graphql/globalTypes';
import { displayErrorMessage, displaySuccessNotification, getBase64Value, resolveRoute } from '../../core/utils';
import { useScrollToTop } from '../../core/hooks/use-scroll-to-top';
import { useViewerContext } from '../../core/contexts/viewer-context';
import './host.scss';

const { Content } = Layout;
const { Text, Title } = Typography;
const { Item } = Form;

interface FormValues {
    address: string;
    city: string;
    description: string;
    image: string;
    numOfGuests: number;
    postalCode: string;
    price: number;
    state?: string;
    title: string;
    type: ListingType;
}

export const Host: FC = () => {
    useScrollToTop();

    const { viewer } = useViewerContext();
    const [imageLoading, setImageLoading] = useState(false);
    const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);
    const [hostListing, { loading, data }] = useMutation<HostListingData, HostListingVariables>(HOST_LISTING, {
        onCompleted: () => {
            displaySuccessNotification("You've successfully created your listing!");
        },
        onError: () => {
            displayErrorMessage("Sorry! We weren't able to create your listing. Please try again later.");
        },
    });

    const handleBeforeUpload = (file: File) => {
        const fileIsValidImage = file.type === 'image/jpeg' || file.type === 'image/png';
        const fileIsValidSize = file.size / 1024 / 1024 < 1;

        if (!fileIsValidImage) {
            displayErrorMessage("You're only able to upload valid JPG or PNG files!");
            return false;
        }

        if (!fileIsValidSize) {
            displayErrorMessage("You're only able to upload valid image files of under 1MB in size!");
            return false;
        }

        return true;
    };

    const handleImageUpload = (info: UploadChangeParam) => {
        const { file } = info;

        if (file.status === 'uploading') {
            setImageLoading(true);
            return;
        }

        if (file.status === 'done' && file.originFileObj) {
            getBase64Value(file.originFileObj, (imageBase64Value) => {
                setImageBase64Value(imageBase64Value);
                setImageLoading(false);
            });
        }
    };

    const handleHostListing = (values: any) => {
        const { address, city, description, numOfGuests, postalCode, price, title, type, state } = values as FormValues;
        const fullAddress = [address, city, state, postalCode].filter(Boolean).join(', ');

        const input: HostListingVariables['input'] = {
            description,
            numOfGuests,
            title,
            type,
            address: fullAddress,
            image: imageBase64Value!,
            price: price * 100,
        };

        hostListing({ variables: { input } });
    };

    const handleValidationError = () => {
        displayErrorMessage('Please complete all required form fields!');
    };

    if (!viewer.id || !viewer.hasWallet) {
        return (
            <Content className="host">
                <div className="host__form-header">
                    <Title level={4} className="host__form-title">
                        You&apos;ll have to be signed in and connected with Stripe to host a listing!
                    </Title>
                    <Text type="secondary">
                        We only allow users who&apos;ve signed in to our application and have connected with Stripe to host new listings.
                        You can sign in at the <Link to={AppRoute.LOGIN}>/login</Link> page and connect with Stripe shortly after.
                    </Text>
                </div>
            </Content>
        );
    }

    if (loading) {
        return (
            <Content className="host">
                <div className="host__form-header">
                    <Title level={3} className="host__form-title">
                        Please wait!
                    </Title>
                    <Text type="secondary">We&apos;re creating your listing now.</Text>
                </div>
            </Content>
        );
    }

    if (data && data.hostListing) {
        return <Redirect to={resolveRoute(AppRoute.LISTING, data.hostListing.id)} />;
    }

    return (
        <Content className="host">
            <Form layout="vertical" onFinish={handleHostListing} onFinishFailed={handleValidationError}>
                <div className="host__form-header">
                    <Title level={3} className="host__form-title">
                        Hi! Let&apos;s get started listing your place.
                    </Title>
                    <Text type="secondary">In this form, we&apos;ll collect some basic and additional information about your listing.</Text>
                </div>

                <Item name="type" rules={[{ required: true, message: 'Please select a home type!' }]} label="Home Type">
                    <Radio.Group>
                        <Radio.Button value={ListingType.APARTMENT}>
                            <BankOutlined className="icon--primary" />
                            <span>Apartment</span>
                        </Radio.Button>
                        <Radio.Button value={ListingType.HOUSE}>
                            <HomeOutlined className="icon--primary" />
                            <span>House</span>
                        </Radio.Button>
                    </Radio.Group>
                </Item>

                <Item
                    name="numOfGuests"
                    rules={[{ required: true, message: 'Please enter a max number of guests!' }]}
                    label="Max # of Guests"
                >
                    <InputNumber min={1} placeholder="4" />
                </Item>

                <Item
                    name="title"
                    rules={[{ required: true, message: 'Please enter a title for your listing!' }]}
                    label="Title"
                    extra="Max character count of 100"
                >
                    <Input maxLength={100} placeholder="The iconic and luxurious Bel-Air mansion" />
                </Item>

                <Item
                    name="description"
                    rules={[{ required: true, message: 'Please enter a description for your listing!' }]}
                    label="Description"
                    extra="Max character count of 5000"
                >
                    <Input.TextArea
                        rows={3}
                        maxLength={5000}
                        placeholder="Modern, clean, and iconic home of the French Prince. Situated in the heart of Bel-Air, Los Angeles."
                    />
                </Item>

                <Item name="address" rules={[{ required: true, message: 'Please enter an address for your listing!' }]} label="Address">
                    <Input placeholder="251 North Bristol Avenue" />
                </Item>

                <Item name="city" rules={[{ required: true, message: 'Please enter a city for your listing!' }]} label="City/Town">
                    <Input placeholder="Los Angeles" />
                </Item>

                <Item name="state" rules={[{ required: false }]} label="State/Province">
                    <Input placeholder="California" />
                </Item>

                <Item
                    name="postalCode"
                    rules={[{ required: true, message: 'Please enter a zip (or postal code) for your listing!' }]}
                    label="Zip/Postal Code"
                >
                    <Input placeholder="Please enter a zip code for your listing!" />
                </Item>

                <Item
                    name="image"
                    rules={[{ required: true, message: 'Please provide an image for your listing!' }]}
                    label="Image"
                    extra="Images have to be under 1MB in size and of type JPG or PNG"
                >
                    <div className="host__form-image-upload">
                        <Upload
                            name="image"
                            listType="picture-card"
                            showUploadList={false}
                            // TODO: Investigate
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={handleBeforeUpload}
                            onChange={handleImageUpload}
                        >
                            {imageBase64Value ? (
                                <img src={imageBase64Value} alt="Listing" />
                            ) : (
                                <div>
                                    {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
                                    <div className="ant-upload-text">Upload</div>
                                </div>
                            )}
                        </Upload>
                    </div>
                </Item>

                <Item
                    name="price"
                    rules={[{ required: true, message: 'Please enter a price for your listing!' }]}
                    label="Price"
                    extra="All price in GBP/day"
                >
                    <InputNumber min={0} placeholder="120" />
                </Item>

                <Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Item>
            </Form>
        </Content>
    );
};
