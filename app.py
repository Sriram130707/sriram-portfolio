
import os
import logging

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

# Load credentials from portfolio/backend/.env
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, "backend", ".env"))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Portfolio Contact API")

# Allow the local portfolio frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://sriram-portfolio-frontend.vercel.app",
],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class ContactMessage(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    subject: str = Field(min_length=2, max_length=150)
    message: str = Field(min_length=10, max_length=2000)
    website: str = ""


@app.get("/health")
async def health():
    return {
        "success": True,
        "message": "FastAPI is running"
    }


@app.post("/api/contact")
async def contact(data: ContactMessage):

    # Spam protection
    if data.website:
        return {"success": True, "message": "Message received"}

    api_key = os.getenv("RESEND_API_KEY")
    from_email = os.getenv("RESEND_FROM_EMAIL")
    to_email = os.getenv("CONTACT_TO_EMAIL")

    if not all([api_key, from_email, to_email]):
        logger.error("Resend environment variables are missing")
        raise HTTPException(
            status_code=500,
            detail="Email configuration is incomplete"
        )

    email_data = {
        "from": from_email,
        "to": [to_email],
        "reply_to": str(data.email),
        "subject": f"Portfolio Contact: {data.subject}",
        "text": (
            f"Name: {data.name}\n"
            f"Email: {data.email}\n"
            f"Subject: {data.subject}\n\n"
            f"Message:\n{data.message}"
        )
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json=email_data,
            )

        if response.is_error:
            logger.error(
                "Resend returned HTTP %s: %s",
                response.status_code,
                response.text
            )
            raise HTTPException(
                status_code=502,
                detail="Email service rejected the request"
            )

        logger.info("Contact email accepted by Resend")

        return {
            "success": True,
            "message": "Your message has been sent successfully!"
        }

    except httpx.TimeoutException:
        logger.exception("Resend request timed out")
        raise HTTPException(
            status_code=504,
            detail="Email service timed out. Please try again."
        )

    except httpx.RequestError:
        logger.exception("Could not connect to Resend")
        raise HTTPException(
            status_code=502,
            detail="Could not connect to the email service"
        )
