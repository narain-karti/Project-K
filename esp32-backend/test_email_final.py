
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys

# Configuration from server.py
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465
SENDER_EMAIL = "dineshkuttan78@gmail.com"
SENDER_PASSWORD = "tebc irmm pbjv bxzp"
RECIPIENT_EMAIL = "vishalraajdnd@gmail.com"

print("-" * 50)
print("EMAIL DEBUGGING SCRIPT")
print("-" * 50)
print(f"Server: {SMTP_SERVER}:{SMTP_PORT} (SSL)")
print(f"Sender: {SENDER_EMAIL}")
print(f"Recipient: {RECIPIENT_EMAIL}")
print("-" * 50)

try:
    print("[1/5] Connecting to SMTP server (SSL)...")
    server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT, timeout=10)
    server.set_debuglevel(1)  # Verbose output
    print("      Connected!")

    print("[2/5] Logging in...")
    try:
        server.login(SENDER_EMAIL, SENDER_PASSWORD.replace(' ', ''))
        print("      Logged in successfully!")
    except smtplib.SMTPAuthenticationError:
        print("\n[!!!] AUTHENTICATION FAILED")
        print("Check your email and App Password.")
        sys.exit(1)

    print("[3/5] Preparing email...")
    msg = MIMEMultipart("alternative")
    msg['Subject'] = "Project K - Final Debug Test"
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECIPIENT_EMAIL
    
    html_content = """
    <html>
    <body>
        <h1 style="color: green;">Test Successful</h1>
        <p>This email confirms that:</p>
        <ul>
            <li>Python script can connect to Gmail (Port 465)</li>
            <li>Credentials are correct</li>
            <li>Email sending is working</li>
        </ul>
        <p>Button Test: <a href="https://call-ambulance-function.onrender.com/" style="background:red;color:white;padding:10px;">DEPLOY AMBULANCE</a></p>
    </body>
    </html>
    """
    msg.attach(MIMEText(html_content, 'html'))

    print("[4/5] Sending email...")
    server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, msg.as_string())
    print("      Email sent!")

    print("[5/5] Quitting...")
    server.quit()
    
    print("-" * 50)
    print("SUCCESS: Email system is working correctly.")
    print("-" * 50)

except Exception as e:
    print("\n[!!!] ERROR OCCURRED during execution:")
    print(str(e))
    import traceback
    traceback.print_exc()
