import re
import tldextract

def scan_text_for_threats(text: str):
    flags = []
    
    # Regional Scam Keywords (Hindi, Marathi, English)
    # Why Regex? It's infinitely faster than passing every word to an ML model.
# The "Top 5 + Universal" Hackathon Dictionary
    # Covers: English, Hindi, Marathi, Bengali, Tamil, Telugu
    threat_patterns = {
        "urgency": r"(तुरंत|आज रात्री|तातडीने|शीघ्र|এক্ষুনি|உடனடியாக|వెంటనే|immediately|urgent|alert)",
        
        "financial": r"(खाते बंद|account blocked|KYC|suspended|बँक खाते|बैंक|অ্যাকাউন্ট|வங்கி|బ్యాంక్)",
        
        # Scammers almost always use English for these, regardless of regional language
        "data_extraction": r"(OTP|पिन|PIN|CVV|password|Aadhaar|PAN)",
        
        # Catch common fake rewards
        "lure": r"(लॉटरी|lottery|win|जीत|बक्षीस|பரிசு|బహుమతి|पुरस्कार)"
    }

    for category, pattern in threat_patterns.items():
        for match in re.finditer(pattern, text, re.IGNORECASE):
            flags.append({
                "category": category,
                "phrase": match.group(),
                "start_index": match.start(),
                "end_index": match.end()
            })

    # Extract and check URLs
    url_pattern = r"(https?://[^\s]+)"
    urls = re.findall(url_pattern, text)
    
    for url in urls:
        ext = tldextract.extract(url)
        # If the domain has hyphens or weird TLDs, flag it
        if "-" in ext.domain or ext.suffix in ["xyz", "top", "online"]:
            flags.append({
                "category": "suspicious_url",
                "phrase": url,
                "start_index": text.find(url),
                "end_index": text.find(url) + len(url)
            })

    return flags