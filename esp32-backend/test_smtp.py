
import smtplib
from email.mime.text import MIMEText

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465  # SSL Port
SENDER_EMAIL = "dineshkuttan78@gmail.com"
SENDER_PASSWORD = "tebc irmm pbjv bxzp"
RECIPIENT_EMAIL = "vishalraajdnd@gmail.com"

try:
    print(f"Connecting to {SMTP_SERVER}:{SMTP_PORT} (SSL)...")
    server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
    
    print(f"Logging in as {SENDER_EMAIL}...")
    server.login(SENDER_EMAIL, SENDER_PASSWORD.replace(' ', ''))
    
    print("Sending test email...")
    msg = MIMEText("This is a direct test from the python script via SSL port 465.")
    msg['Subject'] = "Direct SMTP Test (SSL)"
    msg['From'] = SENDER_EMAIL
    msg['To'] = RECIPIENT_EMAIL
    
    server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, msg.as_string())
    server.quit()
    print("SUCCESS: Email sent successfully via SSL.")
except Exception as e:
    print(f"FAILURE: {e}")
