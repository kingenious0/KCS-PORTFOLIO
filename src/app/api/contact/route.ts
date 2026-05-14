import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, service, description } = body;

        // 1. Send to Formspree
        const FORMSPREE_ID = "xgodbbjl"; 

        const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                subject: `New Inquiry from ${name} (${service})`,
                name,
                email,
                phone,
                service,
                message: description,
                secondary_email: "ingenious@gmail.com",
                _replyto: email
            })
        });

        if (!response.ok) {
            throw new Error("Failed to send email via Formspree");
        }

        return NextResponse.json({ success: true, message: "Inquiry sent successfully!" });

    } catch (error: any) {
        console.error("Contact API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to process request" },
            { status: 500 }
        );
    }
}
