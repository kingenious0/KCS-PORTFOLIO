import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        // 1. Get screenshot from Microlink API (Cloud-friendly)
        const micrlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
        
        const screenshotResponse = await fetch(micrlinkUrl);
        if (!screenshotResponse.ok) {
            throw new Error("Failed to capture screenshot from API");
        }

        const screenshotBuffer = await screenshotResponse.arrayBuffer();

        // 2. Upload the captured image to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { 
                  folder: "portfolio/screenshots",
                  resource_type: "image" 
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(Buffer.from(screenshotBuffer));
        });

        return NextResponse.json({ url: (result as any).secure_url });

    } catch (error) {
        console.error("Screenshot error:", error);
        return NextResponse.json({ error: "Cloud capture failed. Try manual upload." }, { status: 500 });
    }
}
