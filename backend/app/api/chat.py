from fastapi import APIRouter
from backend.app.schemas.pydantic_schemas import ChatMessageSchema, ChatResponseSchema

router = APIRouter(prefix="/chat", tags=["Healthcare Worker Chatbot"])

KNOWLEDGE_BASE = {
    "sensor_placement": {
        "keywords": ["sensor", "place", "mpu6050", "attach", "thigh", "shin", "lower leg", "wear", "स्थान", "सेन्सर", "लावायचे"],
        "en": (
            "**Sensor Placement Protocol (Dual MPU6050):**\n"
            "1. **Thigh Sensor:** Secure the upper IMU on the anterior mid-thigh (quadriceps), aligned with the femur axis. Ensure the Z-axis points outward.\n"
            "2. **Lower Leg (Tibial) Sensor:** Secure the lower IMU on the anterior medial tibia (shin bone), 5 cm below the tibial tuberosity, aligned with the tibia axis.\n"
            "3. **Orientation:** Both sensors must be firmly strapped using elastic Velcro bands to eliminate motion artifacts.\n"
            "4. **Calibration:** Have the patient sit upright with feet flat before initiating recording."
        ),
        "hi": (
            "**सेंसर लगाने का प्रोटोकॉल (Dual MPU6050):**\n"
            "1. **जांघ का सेंसर (Thigh Sensor):** ऊपरी IMU को जांघ के मध्य भाग पर फीमर की दिशा में मजबूती से लगाएं।\n"
            "2. **निचली टांग का सेंसर (Lower Leg / Shin):** निचले IMU को घुटने से 5 सेमी नीचे पिंडली (Tibia) पर लगाएं।\n"
            "3. **सुरक्षा:** इलास्टिक वेल्क्रो पट्टियों से कसकर बांधें ताकि सेंसर हिले नहीं।\n"
            "4. **कैलिब्रेशन:** परीक्षण शुरू करने से पहले मरीज को सीधा बैठने को कहें।"
        ),
        "mr": (
            "**सेन्सर जोडणी नियमावली (Dual MPU6050):**\n"
            "1. **मांडीचा सेन्सर (Thigh Sensor):** वरील IMU मांडीच्या मध्यभागी सरळ रेषेत सुरक्षित बांधा.\n"
            "2. **नडगीचा सेन्सर (Lower Leg / Shin):** खालचा IMU गुडघ्याखाली 5 सेमी अंतरावर नडगीवर (Tibia) घट्ट बांधा.\n"
            "3. **स्थिरता:** इलास्टिक पट्ट्यांनी व्यवस्थित बांधा जेणेकरून सेन्सर हलणार नाही.\n"
            "4. **कॅलिब्रेशन:** चाचणी सुरू करण्यापूर्वी रुग्णाला ताठ आणि स्थिर बसण्यास सांगा."
        ),
        "actions": {
            "en": ["Sit-to-stand instructions", "Explain 15 features", "What does High Risk mean?"],
            "hi": ["सिट-टू-स्टैंड निर्देश", "15 फीचर्स स्पष्ट करें", "उच्च जोखिम का क्या अर्थ है?"],
            "mr": ["उठण्या-बसण्याची चाचणी", "15 वैशिष्ट्ये स्पष्ट करा", "उच्च धोका म्हणजे काय?"]
        }
    },
    "sit_to_stand": {
        "keywords": ["sit", "stand", "chair", "test", "protocol", "30", "sts", "सिट", "स्टैंड", "उठणे", "बसणे", "चाचणी"],
        "en": (
            "**Sit-to-Stand (STS) Functional Test Instructions:**\n"
            "1. **Chair:** Use a standard armless chair (seat height approx. 43-45 cm).\n"
            "2. **Position:** Patient sits upright with arms crossed across the chest, feet flat on floor shoulder-width apart.\n"
            "3. **Execution:** On 'Start', the patient stands up fully and sits back down smoothly. For 30-sec test, perform as many controlled repetitions as possible.\n"
            "4. **Observation:** Note any knee hesitation, compensatory trunk lean, or bilateral asymmetry."
        ),
        "hi": (
            "**सिट-टू-स्टैंड (STS) परीक्षण निर्देश:**\n"
            "1. **कुर्सी:** बिना हत्थे वाली मानक ऊंचाई (43-45 सेमी) की कुर्सी का प्रयोग करें।\n"
            "2. **मुद्रा:** मरीज दोनों हाथ छाती पर क्रॉस करके बैठें, पैर जमीन पर सपाट हों।\n"
            "3. **प्रक्रिया:** 'शुरू' पर मरीज पूरा खड़ा होगा और पुनः सामान्य गति से बैठेगा।\n"
            "4. **ध्यान दें:** घुटने में कंपन, शरीर का झुकना या दर्द के लक्षणों पर नजर रखें।"
        ),
        "mr": (
            "**उठणे-बसणे (Sit-to-Stand) चाचणी मार्गदर्शक:**\n"
            "1. **खुर्ची:** हात नसलेली 43-45 सेमी उंचीची प्रमाणित खुर्ची वापरा.\n"
            "2. **स्थिती:** रुग्णाने दोन्ही हात छातीवर घडी घालून बसावे, पाय जमिनीवर सपाट असावेत.\n"
            "3. **पद्धत:** 'सुरू' म्हटल्यावर पूर्ण उभे राहावे आणि पुन्हा सावकाश बसावे.\n"
            "4. **निरीक्षण:** गुडघ्याचा थरकाप किंवा वेदना जाणवल्यास नोंद घ्यावी."
        ),
        "actions": {
            "en": ["Sensor placement", "Next steps after screening", "Explain risk scores"],
            "hi": ["सेंसर लगाने का तरीका", "स्क्रीनिंग के बाद के कदम", "जोखिम स्कोर समझें"],
            "mr": ["सेन्सर कसा लावावा?", "चाचणीनंतर पुढील पावले", "धोका गुण समजावून सांगा"]
        }
    },
    "features_15": {
        "keywords": ["feature", "15", "variable", "accelerometer", "gyroscope", "rms", "angular", "velocity", "bmi", "फीचर्स", "घटक"],
        "en": (
            "**OA-SMART 15-Feature ML Schema:**\n"
            "• **Kinematics (Tibial Acceleration):**\n"
            "  1. `lower_leg_acc_mag_mean`: Baseline movement acceleration.\n"
            "  2. `lower_leg_acc_mag_std` & `rms`: Dynamic acceleration variability & energy during transition.\n"
            "  3. `lower_leg_acc_mag_range`: Total acceleration amplitude.\n"
            "  4. `lower_leg_free_acc_mag_mean/std/rms`: Gravity-compensated dynamic thrust.\n"
            "• **Kinetics (Tibial Angular Velocity):**\n"
            "  8-10. `lower_leg_gyr_mag_mean/std/rms`: Rotational knee angular power.\n"
            "  11. `lower_leg_gyr_mag_range` & 12. `peak_angular_velocity`: Maximum rotational speed of extension.\n"
            "• **Clinical Demographics:**\n"
            "  13. `Age`, 14. `Sex_encoded` (M=1, F=0), 15. `BMI` (weight / (height/100)²).\n"
            "• **Decision Threshold:** Risk probability ≥ 0.30 triggers High KOA Alert."
        ),
        "hi": (
            "**OA-SMART 15-फीचर मॉडल विवरण:**\n"
            "• **गतिज विशेषताएं (Tibial Acceleration):**\n"
            "  1-7. त्वरण का औसत, RMS और मानक विचलन जो घुटने के झटके और कंपन को मापते हैं।\n"
            "• **घूर्णी विशेषताएं (Angular Velocity):**\n"
            "  8-12. घूर्णन गति, पीक कोणीय वेग जो उठने के समय घुटने की ताकत दर्शाते हैं।\n"
            "• **जनसांख्यिकी (Demographics):**\n"
            "  13. आयु (Age), 14. लिंग (Sex_encoded), 15. बॉडी मास इंडेक्स (BMI)।\n"
            "• **थ्रेसहोल्ड:** 0.30 से अधिक संभावना होने पर संभावित OA का संकेत।"
        ),
        "mr": (
            "**OA-SMART चे 15 विश्लेषणात्मक निकष:**\n"
            "• **गती वैशिष्ट्ये (Acceleration):**\n"
            "  1-7. नडगीच्या हालचालीचा वेग, सरासरी आणि कंपन.\n"
            "• **कोनीय वेग (Angular Velocity):**\n"
            "  8-12. उठताना गुडघ्याची ताकद आणि फिरण्याचा वेग (Peak Angular Velocity).\n"
            "• **वैद्यकीय माहिती:**\n"
            "  13. वय, 14. लिंग, 15. बीएमआय (BMI).\n"
            "• **थ्रेशोल्ड:** 0.30 किंवा अधिक असल्यास ऑस्टिओआर्थरायटिसचा संभाव्य धोका मानला जातो."
        ),
        "actions": {
            "en": ["What does High Risk mean?", "Next steps after positive screening", "Sensor placement"],
            "hi": ["उच्च जोखिम का क्या अर्थ है?", "पॉजिटिव स्क्रीनिंग के बाद क्या करें?", "सेंसर लगाना"],
            "mr": ["उच्च धोक्याचा अर्थ काय?", "चाचणी पॉझिटिव्ह आल्यावर काय करावे?", "सेन्सर जोडणी"]
        }
    },
    "risk_levels": {
        "keywords": ["risk", "high", "moderate", "low", "score", "result", "positive", "जोखिम", "धोका", "निकाल"],
        "en": (
            "**Risk Stratification & Next Steps:**\n"
            "• **Low Risk (< 0.20):** Joint kinematics within healthy normative limits. Recommend regular low-impact exercise (walking, swimming) and weight maintenance. Re-screen in 12 months.\n"
            "• **Moderate Risk (0.20 - 0.29):** Borderline gait deviations or elevated BMI. Recommend quadriceps strengthening, physical therapy consult, and follow-up in 3-6 months.\n"
            "• **High Risk / Potential KOA (≥ 0.30):** Statistically significant biomechanical degradation. Refer to orthopedic specialist or rheumatologist for bilateral knee X-ray (Kellgren-Lawrence grading) and clinical assessment."
        ),
        "hi": (
            "**जोखिम स्तर और अनुवर्ती कदम:**\n"
            "• **कम जोखिम (< 0.20):** घुटने की गति सामान्य है। नियमित व्यायाम और वजन नियंत्रण की सलाह दें। 1 साल बाद पुनः जांचें।\n"
            "• **मध्यम जोखिम (0.20 - 0.29):** प्रारंभिक लक्षण संभव। फिजियोथेरेपी और जांघ की मांसपेशियों को मजबूत करने वाले व्यायाम की सलाह दें।\n"
            "• **उच्च जोखिम (≥ 0.30):** बायोमैकेनिकल विकृति के संकेत। पुष्टि हेतु ऑर्थोपेडिक विशेषज्ञ को एक्स-रे (Kellgren-Lawrence) के लिए रेफर करें।"
        ),
        "mr": (
            "**धोक्याची पातळी आणि पुढील उपाय:**\n"
            "• **कमी धोका (< 0.20):** हालचाली सामान्य आहेत. नियमित चालणे व वजन नियंत्रणात ठेवण्याचा सल्ला द्या.\n"
            "• **मध्यम धोका (0.20 - 0.29):** हलके बदल आढळले. फिजिओथेरपिस्टचा सल्ला आणि स्नायू मजबूत करण्याचे व्यायाम सुचवा.\n"
            "• **उच्च धोका (≥ 0.30):** ऑस्टिओआर्थरायटिसची शक्यता. पुढील तपासणी व एक्स-रेसाठी अस्थिरोग तज्ज्ञांकडे (Orthopedic) पाठवा."
        ),
        "actions": {
            "en": ["How to generate report?", "Explain 15 features", "Sit-to-stand instructions"],
            "hi": ["रिपोर्ट कैसे बनाएं?", "15 फीचर्स स्पष्ट करा", "सिट-टू-स्टैंड निर्देश"],
            "mr": ["अहवाल कसा तयार करावा?", "15 वैशिष्ट्ये", "उठणे-बसणे चाचणी"]
        }
    },
    "workflow": {
        "keywords": ["workflow", "step", "how to use", "guide", "procedure", "start", "स्क्रीनिंग", "कसे वापरावे", "कदम"],
        "en": (
            "**Complete OA-SMART Screening Workflow:**\n"
            "1. **Register Patient:** Enter Age, Sex, Height, Weight (BMI is auto-computed). Name is strictly optional.\n"
            "2. **Connect BLE Sensors:** Turn on ESP32 device, click 'Connect BLE', verify dual MPU6050 packets streaming.\n"
            "3. **Conduct STS Test:** Fasten sensors, guide patient through the 30-second Sit-to-Stand or functional task.\n"
            "4. **Compute Features & Risk:** The system computes the 15 features and runs the calibrated Random Forest model (threshold 0.30).\n"
            "5. **Review & Print Report:** Review biomechanical graphs, risk score, and export the official screening PDF report."
        ),
        "hi": (
            "**संपूर्ण OA-SMART स्क्रीनिंग प्रक्रिया:**\n"
            "1. **मरीज पंजीकरण:** उम्र, लिंग, ऊंचाई, वजन भरें (नाम वैकल्पिक है)।\n"
            "2. **ब्लूटूथ सेंसर कनेक्ट करें:** ESP32 चालू करें और 'Connect BLE' दबाएं।\n"
            "3. **सिट-टू-स्टैंड परीक्षण:** सेंसर बांधें और मरीज से उठने-बैठने की क्रिया कराएं।\n"
            "4. **एआई विश्लेषण:** सिस्टम 15 फीचर्स निकालकर 0.30 थ्रेसहोल्ड पर जोखिम का आकलन करता है।\n"
            "5. **डिजिटल रिपोर्ट:** परिणाम देखें और प्रिंट/पीडीएफ डाउनलोड करें।"
        ),
        "mr": (
            "**OA-SMART चाचणी प्रक्रिया:**\n"
            "1. **नोंदणी:** वय, लिंग, उंची, वजन भरा (नाव ऐच्छिक आहे).\n"
            "2. **ब्लूटूथ जोडा:** ESP32 सुरू करा आणि 'Connect BLE' वर क्लिक करा.\n"
            "3. **चाचणी पूर्ण करा:** सेन्सर बांधून रुग्णाला उठण्या-बसण्यास सांगा.\n"
            "4. **एआय द्वारे तपासणी:** 15 वैशिष्ट्यांच्या आधारे 0.30 थ्रेशोल्डवर विश्लेषण केले जाते.\n"
            "5. **अहवाल मिळवा:** निष्कर्ष तपासा आणि पीडीएफ अहवाल डाउनलोड करा."
        ),
        "actions": {
            "en": ["Sensor placement", "Sit-to-stand instructions", "What does High Risk mean?"],
            "hi": ["सेंसर लगाने का तरीका", "सिट-टू-स्टैंड निर्देश", "उच्च जोखिम का क्या अर्थ है?"],
            "mr": ["सेन्सर कसा लावावा?", "उठणे-बसणे चाचणी", "उच्च धोका म्हणजे काय?"]
        }
    }
}

DISCLAIMERS = {
    "en": "\n\n⚠️ **Operational Notice:** OA-SMART is a screening & clinical decision-support tool for healthcare workers. It is not an autonomous diagnostic system. All findings must be confirmed by qualified medical professionals.",
    "hi": "\n\n⚠️ **सूचना:** OA-SMART स्वास्थ्य कार्यकर्ताओं के लिए एक स्क्रीनिंग सहायता टूल है। यह डॉक्टरों का विकल्प नहीं है और अंतिम चिकित्सीय निदान प्रदान नहीं करता है।",
    "mr": "\n\n⚠️ **महत्त्वाची सूचना:** OA-SMART हे आरोग्य कर्मचाऱ्यांसाठी केवळ चाचणी सहाय्यक साधन आहे. हा अंतिम वैद्यकीय निष्कर्ष नसून डॉक्टरांचा सल्ला आवश्यक आहे."
}

DEFAULT_REPLIES = {
    "en": (
        "Hello! I am your **OA-SMART Healthcare Assistant**. I can help you with:\n"
        "• Dual MPU6050 sensor placement instructions\n"
        "• Sit-to-Stand (STS) functional test protocol\n"
        "• Explaining the 15 ML kinematic features\n"
        "• Interpreting risk scores & referral next steps\n"
        "• Screening workflow guidance\n\n"
        "How can I assist you with your screening today?"
    ),
    "hi": (
        "नमस्ते! मैं आपका **OA-SMART स्वास्थ्य सहायक** हूँ। मैं निम्न कार्यों में आपकी मदद कर सकता हूँ:\n"
        "• डुअल MPU6050 सेंसर लगाने के निर्देश\n"
        "• सिट-टू-स्टैंड (STS) परीक्षण विधि\n"
        "• 15 बायोमैकेनिकल फीचर्स की व्याख्या\n"
        "• जोखिम स्कोर और मरीज रेफरल के सुझाव\n"
        "• संपूर्ण स्क्रीनिंग प्रक्रिया में मार्गदर्शन\n\n"
        "आज मैं आपकी क्या सहायता कर सकता हूँ?"
    ),
    "mr": (
        "नमस्कार! मी आपला **OA-SMART आरोग्य सहाय्यक** आहे. मी आपल्याला खालील बाबींमध्ये मदत करू शकतो:\n"
        "• दुहेरी MPU6050 सेन्सर जोडणीची माहिती\n"
        "• उठणे-बसणे (Sit-to-Stand) चाचणी पद्धत\n"
        "• 15 बायोमेकॅनिकल वैशिष्ट्यांचे स्पष्टीकरण\n"
        "• जोखीम पातळी आणि रुग्णाला पुढील सल्ल्याचे मार्गदर्शन\n"
        "• संपूर्ण चाचणी प्रक्रियेचे मार्गदर्शन\n\n"
        "मी आज आपल्याला कशी मदत करू शकतो?"
    )
}

DEFAULT_ACTIONS = {
    "en": [
        "How to place MPU6050 sensors?",
        "Sit-to-stand instructions",
        "Explain 15 features",
        "What does High Risk mean?",
        "Next steps after positive screening"
    ],
    "hi": [
        "MPU6050 सेंसर कैसे लगाएं?",
        "सिट-टू-स्टैंड निर्देश",
        "15 फीचर्स स्पष्ट करें",
        "उच्च जोखिम का क्या अर्थ है?",
        "पॉजिटिव स्क्रीनिंग के बाद क्या करें?"
    ],
    "mr": [
        "सेन्सर कसा लावावा?",
        "उठण्या-बसण्याची चाचणी",
        "15 वैशिष्ट्ये सांगा",
        "उच्च धोका म्हणजे काय?",
        "पॉझिटिव्ह आल्यावर काय करावे?"
    ]
}

@router.post("/message", response_model=ChatResponseSchema)
def send_chat_message(payload: ChatMessageSchema):
    lang = payload.language if payload.language in ["en", "hi", "mr"] else "en"
    query = payload.message.lower().strip()
    
    matched_key = None
    for key, data in KNOWLEDGE_BASE.items():
        if any(kw in query for kw in data["keywords"]):
            matched_key = key
            break
            
    if matched_key:
        reply_text = KNOWLEDGE_BASE[matched_key][lang] + DISCLAIMERS[lang]
        actions = KNOWLEDGE_BASE[matched_key]["actions"][lang]
    else:
        reply_text = DEFAULT_REPLIES[lang] + DISCLAIMERS[lang]
        actions = DEFAULT_ACTIONS[lang]

    return ChatResponseSchema(
        reply=reply_text,
        suggested_actions=actions,
        language=lang
    )
