"use client";

import { UploadButton } from "@/lib/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPost } from "../api/create-posts";
import { CreatePostSchema } from "../types";
import { useAuth } from "@clerk/nextjs";

export default function CreatePostForm() {
    const { userId } = useAuth();

    if (!userId) {
        redirect("/sign-in");
    }

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>();
    const [lat, setLat] = useState<number>(0);
    const [long, setLong] = useState<number>(0);
    const form = useForm<z.infer<typeof CreatePostSchema>>({
        resolver: zodResolver(CreatePostSchema),
        defaultValues: {
            close_to: "main",
            watersupply_available: false,
            wifi_available: false,
            userId: userId!,
        },
    });

    useEffect(() => {
        form.reset();
    }, []);

    async function onSubmit(data: z.infer<typeof CreatePostSchema>) {
        try {
            await createPost(data);
            toast("Property Added Successfully");
            router.replace("/map");
            console.log(data);
        } catch (error) {
            console.log(error);
            toast.error(JSON.stringify(error));
        }

        form.reset();
    }

    function handleLocationClick(e: FormEvent) {
        e.preventDefault();
        console.log(form.formState.errors);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    form.setValue("latitude", latitude);
                    form.setValue("longitude", longitude);
                    setLong(longitude);
                    setLat(latitude);
                    console.log(position.coords);
                },
                (error) => {
                    console.error("Error getting location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 pb-20"
            >
                <section className="space-y-5">
                    <h2 className="text-2xl font-bold">Property Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Property Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is used for search filtering later.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rent</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            onChange={(
                                                event: ChangeEvent<HTMLInputElement>
                                            ) =>
                                                field.onChange(
                                                    parseInt(event.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Monthly cost of rent.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bedroom_no"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bedrooms</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            onChange={(
                                                event: ChangeEvent<HTMLInputElement>
                                            ) =>
                                                field.onChange(
                                                    parseInt(event.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        How many bedrooms?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bathroom_no"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bathrooms</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="number"
                                            onChange={(
                                                event: ChangeEvent<HTMLInputElement>
                                            ) =>
                                                field.onChange(
                                                    parseInt(event.target.value)
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        How many bathrooms?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </section>

                <section className="space-y-5">
                    <h2 className="text-2xl font-bold">Property Address</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Please provide the full address and
                                        street name of your property.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="close_to"
                            render={({ field }) => (
                                <FormItem aria-label="Nearest Campus">
                                    <FormLabel>Nearest Campus</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue="both"
                                                    placeholder="Select Campus"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="main">
                                                Main Campus
                                            </SelectItem>
                                            <SelectItem value="west">
                                                West Campus
                                            </SelectItem>
                                            <SelectItem value="both">
                                                Both Campuses
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Which campus is closest to your
                                        property?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormDescription className="col-span-2">
                            Please provide your precise property location.
                        </FormDescription>

                        <FormItem>
                            <FormLabel>Latitude</FormLabel>
                            <Input
                                type="number"
                                id="latitude"
                                value={lat}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setLat(parseFloat(e.target.value))
                                }
                            />
                            {form.formState.errors.latitude?.message && (
                                <p className="text-red-500">
                                    {form.formState.errors.latitude?.message}
                                </p>
                            )}
                        </FormItem>

                        <FormItem>
                            <FormLabel>Longitude</FormLabel>
                            <Input
                                type="number"
                                id="longitude"
                                value={long}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setLong(parseFloat(e.target.value))
                                }
                            />
                            {form.formState.errors.longitude?.message && (
                                <p className="text-red-500">
                                    {form.formState.errors.longitude?.message}
                                </p>
                            )}
                            <FormMessage />
                        </FormItem>
                    </div>

                    <FormDescription className="text-center">
                        Alternatively, you can use your device to determine the
                        property location.
                    </FormDescription>

                    <Button onClick={handleLocationClick} className="w-full">
                        Use Device Location
                    </Button>
                </section>

                <section className="space-y-5">
                    <h2 className="text-2xl font-bold">
                        What do your property offer?
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="wifi_available"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Wifi available</FormLabel>
                                        <FormDescription>
                                            Does your property offer wifi or
                                            internet?
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="watersupply_available"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Water Supply</FormLabel>
                                        <FormDescription>
                                            Does your property have a water
                                            source.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>
                </section>

                <section className="space-y-5">
                    <h2 className="text-2xl font-bold">Owner Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="owner_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Please provide your fullname.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="owner_contact"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact No.</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" />
                                    </FormControl>
                                    <FormDescription>
                                        Please provide your phone number.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </section>

                <section className="space-y-5">
                    <h2 className="text-2xl font-bold">Upload Images</h2>
                    <FormItem>
                        <FormLabel>
                            Upload up to 4 images and minimum of 8 mb
                        </FormLabel>
                        <FormControl>
                            <UploadButton
                                appearance={{
                                    button: {
                                        width: "100%",
                                        color: "white",
                                        backgroundColor: "hsl(0 0% 9%)",
                                    },
                                }}
                                endpoint="imageUploader"
                                onClientUploadComplete={(res) => {
                                    const images = res.map((item) => item?.url);
                                    setUploadedImages(images);
                                    form.setValue("images", images);
                                    setLoading(false);
                                }}
                                onUploadError={(error: Error) => {
                                    alert(`ERROR! ${error.message}`);
                                }}
                                onUploadBegin={() => setLoading(true)}
                            />
                        </FormControl>
                        {form.formState.errors.images?.message && (
                            <p className="text-red-500">
                                {form.formState.errors.images?.message}
                            </p>
                        )}
                        <div className="grid grid-cols-4 gap-2">
                            {uploadedImages &&
                                uploadedImages.map((img, idx) => (
                                    <Image
                                        key={idx}
                                        src={img}
                                        alt="uploaded image"
                                        width={100}
                                        height={100}
                                        quality={50}
                                    />
                                ))}
                        </div>
                    </FormItem>
                </section>

                <Button disabled={loading} className="w-full" type="submit">
                    Submit
                </Button>
            </form>
        </Form>
    );
}
