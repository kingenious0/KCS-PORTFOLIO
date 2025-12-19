import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import puppeteer from "puppeteer";

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

        // Validate URL format roughly
        try {
            new URL(url);
        } catch {
            return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
        }

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true, // "new" is deprecated, but "true" works or boolean true
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        
        // Set a reasonable viewport for a desktop-like screenshot
        await page.setViewport({ width: 1440, height: 900 });

        // Navigate to URL
        try {
            await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
        } catch (error) {
            await browser.close();
            console.error("Navigation error:", error);
            return NextResponse.json({ error: "Failed to load the website. It might be down or blocking bots." }, { status: 422 });
        }

        // Take a screenshot
        const screenshotBuffer = await page.screenshot({ type: 'jpeg', quality: 90, fullPage: false }); // viewport only is usually better for a card
        await browser.close();

        // Upload to Cloudinary
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
            uploadStream.end(screenshotBuffer);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return NextResponse.json({ url: (result as any).secure_url });

    } catch (error) {
        console.error("Screenshot error:", error);
        return NextResponse.json({ error: "Internal server error generating screenshot" }, { status: 500 });
    }
}
