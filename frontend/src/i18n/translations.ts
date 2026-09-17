export type Language = 'en' | 'hi' | 'mr';

export interface TranslationDict {
  nav: {
    dashboard: string;
    newScreening: string;
    history: string;
    settings: string;
    aboutUs: string;
    login: string;
    signup: string;
    logout: string;
    assistant: string;
    healthcareWorker: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    startScreening: string;
    totalScreenings: string;
    highRiskDetected: string;
    lowRiskNormal: string;
    systemStatus: string;
    deviceConnected: string;
    deviceDisconnected: string;
    recentScreenings: string;
    patientId: string;
    patientName: string;
    age: string;
    sex: string;
    riskScore: string;
    riskLevel: string;
    date: string;
    action: string;
    viewReport: string;
    noScreenings: string;
    quickGuidanceTitle: string;
    quickGuidanceDesc: string;
    anonymousPatient: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    signupTitle: string;
    signupSubtitle: string;
    email: string;
    password: string;
    fullName: string;
    fullNameOptional: string;
    fullNamePlaceholder: string;
    loginBtn: string;
    signupBtn: string;
    noAccount: string;
    haveAccount: string;
    signUpLink: string;
    logInLink: string;
    logoutConfirm: string;
    invalidEmail: string;
    passwordShort: string;
    authSuccess: string;
    loginFailed: string;
  };
  intake: {
    title: string;
    subtitle: string;
    nameLabel: string;
    nameOptional: string;
    namePlaceholder: string;
    ageLabel: string;
    genderLabel: string;
    male: string;
    female: string;
    heightLabel: string;
    weightLabel: string;
    bmiLabel: string;
    phoneLabel: string;
    phoneOptional: string;
    startScreeningBtn: string;
    anonymousPatient: string;
  };
  screening: {
    title: string;
    patientDetails: string;
    sensorsTitle: string;
    sensorConnected: string;
    sensorDisconnected: string;
    connectSensors: string;
    stsTestTitle: string;
    stsTestDesc: string;
    calibrate: string;
    startRecording: string;
    stopRecording: string;
    packetsReceived: string;
    recordingTime: string;
    runAnalysis: string;
    analyzing: string;
  };
  results: {
    title: string;
    riskAssessment: string;
    oaDetected: string;
    oaNotDetected: string;
    lowRisk: string;
    moderateRisk: string;
    highRisk: string;
    probability: string;
    thresholdNotice: string;
    recommendationsTitle: string;
    biomechanicalFeatures: string;
    printReport: string;
    newScreening: string;
  };
  chat: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    send: string;
    suggestedTopics: string;
    disclaimer: string;
    minimize: string;
    openAssistant: string;
  };
  about: {
    title: string;
    tagline: string;
    missionTitle: string;
    missionDesc: string;
    techTitle: string;
    techDualSensor: string;
    techDualSensorDesc: string;
    techML: string;
    techMLDesc: string;
    techEdge: string;
    techEdgeDesc: string;
    features15Title: string;
    features15Desc: string;
    sihTitle: string;
    sihDesc: string;
  };
  footer: {
    appName: string;
    tagline: string;
    sihBadge: string;
    medicalDisclaimer: string;
    copyright: string;
    rightsReserved: string;
    linksTitle: string;
    contactTitle: string;
  };
  common: {
    lightMode: string;
    darkMode: string;
    selectLanguage: string;
    close: string;
    cancel: string;
    save: string;
    loading: string;
    error: string;
    success: string;
  };
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    nav: {
      dashboard: "Dashboard",
      newScreening: "New Screening",
      history: "Patient History",
      settings: "Settings",
      aboutUs: "About Us",
      login: "Log In",
      signup: "Sign Up",
      logout: "Log Out",
      assistant: "AI Assistant",
      healthcareWorker: "Healthcare Worker"
    },
    dashboard: {
      title: "Clinical Screening Dashboard",
      subtitle: "Dual-IMU kinematics & 15-feature AI risk assessment for early knee osteoarthritis",
      startScreening: "Start New Screening",
      totalScreenings: "Total Screenings",
      highRiskDetected: "High Risk / OA Detected",
      lowRiskNormal: "Low / Normal Risk",
      systemStatus: "System Readiness",
      deviceConnected: "Dual MPU6050 Sensors Online",
      deviceDisconnected: "BLE Disconnected - Standby",
      recentScreenings: "Recent Screening Sessions",
      patientId: "Patient ID",
      patientName: "Patient Name",
      age: "Age",
      sex: "Sex",
      riskScore: "Risk Score",
      riskLevel: "Risk Level",
      date: "Date",
      action: "Actions",
      viewReport: "View Report",
      noScreenings: "No screening records found yet. Begin by starting a new screening.",
      quickGuidanceTitle: "Healthcare Worker Screening Protocol",
      quickGuidanceDesc: "Attach Dual MPU6050 on mid-thigh and anterior tibia. Instruct patient to perform 30-second Sit-to-Stand with arms crossed.",
      anonymousPatient: "Anonymous Patient"
    },
    auth: {
      loginTitle: "Healthcare Worker Login",
      loginSubtitle: "Sign in to access clinical screening records and AI diagnostics",
      signupTitle: "Healthcare Worker Registration",
      signupSubtitle: "Register to deploy portable knee osteoarthritis screening",
      email: "Email Address",
      password: "Password",
      fullName: "Full Name",
      fullNameOptional: "(Optional)",
      fullNamePlaceholder: "e.g., Nurse Priya (Leave blank if preferred)",
      loginBtn: "Sign In",
      signupBtn: "Create Account",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      signUpLink: "Register here",
      logInLink: "Sign in here",
      logoutConfirm: "Are you sure you want to log out?",
      invalidEmail: "Please enter a valid email address.",
      passwordShort: "Password must be at least 6 characters long.",
      authSuccess: "Authentication successful!",
      loginFailed: "Invalid email or password."
    },
    intake: {
      title: "Patient Intake & Demographics",
      subtitle: "Collect clinical baseline parameters for the 15-feature biomechanical model",
      nameLabel: "Patient Name",
      nameOptional: "(Optional - leave blank for anonymous screening)",
      namePlaceholder: "Anonymous Patient",
      ageLabel: "Age (Years)",
      genderLabel: "Biological Sex",
      male: "Male (1.0)",
      female: "Female (0.0)",
      heightLabel: "Height (cm)",
      weightLabel: "Weight (kg)",
      bmiLabel: "Calculated BMI",
      phoneLabel: "Contact Number",
      phoneOptional: "(Optional)",
      startScreeningBtn: "Proceed to Sensor Connection",
      anonymousPatient: "Anonymous Patient"
    },
    screening: {
      title: "Sensor Kinematics & STS Assessment",
      patientDetails: "Screening Subject",
      sensorsTitle: "Dual MPU6050 Hardware Telemetry",
      sensorConnected: "ESP32 BLE Connected",
      sensorDisconnected: "ESP32 BLE Offline",
      connectSensors: "Connect BLE Sensors",
      stsTestTitle: "30-Second Sit-to-Stand Protocol",
      stsTestDesc: "Patient sits upright with arms folded across chest. Perform controlled sit-to-stand transitions.",
      calibrate: "Zero Calibration",
      startRecording: "Start Motion Capture",
      stopRecording: "Stop & Compute Features",
      packetsReceived: "Packets Captured",
      recordingTime: "Test Duration",
      runAnalysis: "Execute 15-Feature ML Inference",
      analyzing: "Extracting Kinematics & Inferring Risk..."
    },
    results: {
      title: "Screening Results & Biomechanical Report",
      riskAssessment: "Risk Assessment",
      oaDetected: "Potential Knee OA Detected",
      oaNotDetected: "Normative Kinematics / Low Risk",
      lowRisk: "Low Risk (< 0.30 Threshold)",
      moderateRisk: "Clinical Review",
      highRisk: "High Risk (≥ 0.30 Threshold)",
      probability: "KOA Probability Score",
      thresholdNotice: "Calibrated Decision Boundary: 0.30 probability threshold",
      recommendationsTitle: "Clinical Referral & Decision Support",
      biomechanicalFeatures: "15 Kinematic & Demographic Features",
      printReport: "Print Clinical Report",
      newScreening: "Start Another Screening"
    },
    chat: {
      title: "Healthcare Worker Assistant",
      subtitle: "Screening & Decision-Support AI",
      inputPlaceholder: "Ask about sensor placement, STS test, 15 features...",
      send: "Send",
      suggestedTopics: "Suggested Topics",
      disclaimer: "Operational decision-support tool for healthcare workers. Not a final medical diagnosis.",
      minimize: "Minimize",
      openAssistant: "Clinical Assistant"
    },
    about: {
      title: "About OA-SMART",
      tagline: "Portable AI-Assisted Osteoarthritis Risk Screening System",
      missionTitle: "Our Mission",
      missionDesc: "OA-SMART enables community-level, non-invasive early screening for knee osteoarthritis (KOA). Designed for primary health centers and rural camps, it bridges the diagnostic gap before irreversible cartilage degeneration occurs.",
      techTitle: "Integrated Technological Architecture",
      techDualSensor: "Dual MPU6050 IMU Kinematics",
      techDualSensorDesc: "Synchronous 6-DOF inertial measurement units on thigh and shin capture real-time angular velocity and dynamic linear acceleration during functional Sit-to-Stand movements.",
      techML: "Calibrated 15-Feature Random Forest",
      techMLDesc: "Trained on real human biomechanical trials with rigorous participant-level cross-validation and a 0.30 sensitivity-optimized decision boundary.",
      techEdge: "Offline-First ESP32 BLE Architecture",
      techEdgeDesc: "Operates seamlessly in low-connectivity rural settings with local SQLite persistence and progressive web application capabilities.",
      features15Title: "The 15 Biomechanical & Demographic Features",
      features15Desc: "Extracts tibial acceleration magnitude mean, std, rms, range; dynamic gravity-compensated acceleration; tibial angular velocity mean, std, rms, range; peak angular velocity; alongside clinical age, sex encoding, and BMI.",
      sihTitle: "Clinical Decision Support System",
      sihDesc: "Engineered to provide cost-effective, portable medical diagnostics for primary healthcare and field screenings."
    },
    footer: {
      appName: "OA-SMART",
      tagline: "Portable AI-Assisted Osteoarthritis Risk Screening",
      sihBadge: "Clinical Decision Support System",
      medicalDisclaimer: "Medical Disclaimer: OA-SMART is a screening and clinical decision-support tool designed for healthcare workers. It is not an autonomous diagnostic device. All risk assessments require validation through clinical evaluation and diagnostic radiography.",
      copyright: "OA-SMART Research & Development Team. All rights reserved.",
      rightsReserved: "Licensed for Healthcare & Research Use",
      linksTitle: "Quick Navigation",
      contactTitle: "Clinical Support"
    },
    common: {
      lightMode: "Light Mode",
      darkMode: "Dark Mode",
      selectLanguage: "Language",
      close: "Close",
      cancel: "Cancel",
      save: "Save",
      loading: "Loading...",
      error: "Error",
      success: "Success"
    }
  },
  hi: {
    nav: {
      dashboard: "डैशबोर्ड",
      newScreening: "नई स्क्रीनिंग",
      history: "मरीज का इतिहास",
      settings: "सेटिंग्स",
      aboutUs: "हमारे बारे में",
      login: "लॉग इन",
      signup: "साइन अप",
      logout: "लॉग आउट",
      assistant: "एआई सहायक",
      healthcareWorker: "स्वास्थ्य कार्यकर्ता"
    },
    dashboard: {
      title: "क्लिनिकल स्क्रीनिंग डैशबोर्ड",
      subtitle: "घुटने के पुराने ऑस्टिओआर्थराइटिस (OA) की शीघ्र जांच हेतु 15-फीचर एआई सिस्टम",
      startScreening: "नई स्क्रीनिंग शुरू करें",
      totalScreenings: "कुल स्क्रीनिंग",
      highRiskDetected: "उच्च जोखिम / OA संभावित",
      lowRiskNormal: "सामान्य / कम जोखिम",
      systemStatus: "सिस्टम की स्थिति",
      deviceConnected: "डुअल MPU6050 सेंसर कनेक्टेड",
      deviceDisconnected: "ब्लूटूथ डिस्कनेक्टेड - स्टैंडबाय",
      recentScreenings: "हाल की स्क्रीनिंग सत्र",
      patientId: "मरीज आईडी",
      patientName: "मरीज का नाम",
      age: "आयु",
      sex: "लिंग",
      riskScore: "जोखिम स्कोर",
      riskLevel: "जोखिम स्तर",
      date: "दिनांक",
      action: "कार्रवाई",
      viewReport: "रिपोर्ट देखें",
      noScreenings: "अभी तक कोई स्क्रीनिंग रिकॉर्ड नहीं मिला। कृपया नई स्क्रीनिंग शुरू करें।",
      quickGuidanceTitle: "स्वास्थ्य कार्यकर्ता स्क्रीनिंग प्रोटोकॉल",
      quickGuidanceDesc: "जांघ और पिंडली पर MPU6050 सेंसर लगाएं। मरीज को हाथ छाती पर रखकर 30 सेकंड सिट-टू-स्टैंड करने को कहें।",
      anonymousPatient: "अनाम मरीज"
    },
    auth: {
      loginTitle: "स्वास्थ्य कार्यकर्ता लॉगिन",
      loginSubtitle: "स्क्रीनिंग रिकॉर्ड और एआई विश्लेषण तक पहुंचने के लिए साइन इन करें",
      signupTitle: "स्वास्थ्य कार्यकर्ता पंजीकरण",
      signupSubtitle: "पोर्टेबल ऑस्टिओआर्थराइटिस स्क्रीनिंग शुरू करने के लिए खाता बनाएं",
      email: "ईमेल पता",
      password: "पासवर्ड",
      fullName: "पूरा नाम",
      fullNameOptional: "(वैकल्पिक)",
      fullNamePlaceholder: "उदा. नर्स प्रिया (खाली छोड़ सकते हैं)",
      loginBtn: "साइन इन करें",
      signupBtn: "खाता बनाएं",
      noAccount: "क्या आपका खाता नहीं है?",
      haveAccount: "पहले से खाता है?",
      signUpLink: "यहां रजिस्टर करें",
      logInLink: "यहां लॉगिन करें",
      logoutConfirm: "क्या आप निश्चित रूप से लॉग आउट करना चाहते हैं?",
      invalidEmail: "कृपया एक मान्य ईमेल पता दर्ज करें।",
      passwordShort: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।",
      authSuccess: "सत्यापन सफल!",
      loginFailed: "अमान्य ईमेल या पासवर्ड।"
    },
    intake: {
      title: "मरीज पंजीकरण व जनसांख्यिकी",
      subtitle: "15-फीचर बायोमैकेनिकल मॉडल के लिए मरीज का बुनियादी डेटा दर्ज करें",
      nameLabel: "मरीज का नाम",
      nameOptional: "(वैकल्पिक - अनाम स्क्रीनिंग के लिए खाली छोड़ें)",
      namePlaceholder: "अनाम मरीज",
      ageLabel: "आयु (वर्ष)",
      genderLabel: "जैविक लिंग",
      male: "पुरुष (1.0)",
      female: "महिला (0.0)",
      heightLabel: "ऊंचाई (सेमी)",
      weightLabel: "वजन (किग्रा)",
      bmiLabel: "परिकलित बीएमआई (BMI)",
      phoneLabel: "मोबाइल नंबर",
      phoneOptional: "(वैकल्पिक)",
      startScreeningBtn: "सेंसर कनेक्शन पर आगे बढ़ें",
      anonymousPatient: "अनाम मरीज"
    },
    screening: {
      title: "सेंसर किनेमेटिक्स और STS परीक्षण",
      patientDetails: "जांच विषय",
      sensorsTitle: "डुअल MPU6050 हार्डवेयर टेलीमेट्री",
      sensorConnected: "ESP32 ब्लूटूथ कनेक्टेड",
      sensorDisconnected: "ESP32 ब्लूटूथ डिस्कनेक्टेड",
      connectSensors: "ब्लूटूथ सेंसर कनेक्ट करें",
      stsTestTitle: "30-सेकंड सिट-टू-स्टैंड प्रोटोकॉल",
      stsTestDesc: "मरीज दोनों हाथ छाती पर क्रॉस करके बैठें। नियंत्रित तरीके से उठने-बैठने की क्रिया करें।",
      calibrate: "शून्य कैलिब्रेशन",
      startRecording: "रिकॉर्डिंग शुरू करें",
      stopRecording: "रोकें और फीचर्स निकालें",
      packetsReceived: "प्राप्त डेटा पैकेट्स",
      recordingTime: "परीक्षण समय",
      runAnalysis: "15-फीचर एआई विश्लेषण चलाएं",
      analyzing: "बायोमैकेनिक्स का विश्लेषण किया जा रहा है..."
    },
    results: {
      title: "स्क्रीनिंग परिणाम एवं रिपोर्ट",
      riskAssessment: "जोखिम मूल्यांकन",
      oaDetected: "संभावित घुटना ऑस्टिओआर्थराइटिस संकेत",
      oaNotDetected: "सामान्य किनेमेटिक्स / कम जोखिम",
      lowRisk: "कम जोखिम (< 0.30 सीमा)",
      moderateRisk: "नैदानिक समीक्षा",
      highRisk: "उच्च जोखिम (≥ 0.30 सीमा)",
      probability: "संभाव्यता स्कोर (KOA Score)",
      thresholdNotice: "अंशांकित निर्णय सीमा: 0.30 संभावना थ्रेसहोल्ड",
      recommendationsTitle: "क्लिनिकल रेफरल व सिफारिशें",
      biomechanicalFeatures: "15 बायोमैकेनिकल एवं जनसांख्यिकीय फीचर्स",
      printReport: "क्लिनिकल रिपोर्ट प्रिंट करें",
      newScreening: "अन्य स्क्रीनिंग शुरू करें"
    },
    chat: {
      title: "स्वास्थ्य कार्यकर्ता सहायक",
      subtitle: "स्क्रीनिंग एवं निर्णय-समर्थन एआई",
      inputPlaceholder: "सेंसर प्लेसमेंट, STS टेस्ट, 15 फीचर्स के बारे में पूछें...",
      send: "भेजें",
      suggestedTopics: "सुझाए गए विषय",
      disclaimer: "स्वास्थ्य कार्यकर्ताओं के लिए एक सहायक टूल। यह डॉक्टर का अंतिम निदान नहीं है।",
      minimize: "छोटा करें",
      openAssistant: "क्लिनिकल सहायक"
    },
    about: {
      title: "OA-SMART के बारे में",
      tagline: "पोर्टेबल एआई-सहायक ऑस्टिओआर्थराइटिस जोखिम स्क्रीनिंग प्रणाली",
      missionTitle: "हमारा उद्देश्य",
      missionDesc: "OA-SMART समुदाय स्तर पर घुटने के पुराने ऑस्टिओआर्थराइटिस की गैर-आक्रामक और प्रारंभिक जांच संभव बनाता है। प्राथमिक स्वास्थ्य केंद्रों के लिए विशेष रूप से डिज़ाइन किया गया।",
      techTitle: "एकीकृत तकनीकी संरचना",
      techDualSensor: "डुअल MPU6050 किनेमेटिक्स",
      techDualSensorDesc: "जांघ और पिंडली पर लगे 6-DOF सेंसर सिट-टू-स्टैंड गतिविधि के दौरान कोणीय वेग और त्वरण को सटीकता से मापते हैं।",
      techML: "अंशांकित 15-फीचर रैंडम फॉरेस्ट",
      techMLDesc: "वास्तविक मानवीय बायोमैकेनिकल डेटा पर प्रशिक्षित, जिसे 0.30 संवेदनशीलता थ्रेसहोल्ड पर अनुकूलित किया गया है।",
      techEdge: "ऑफलाइन-प्रथम ESP32 BLE संरचना",
      techEdgeDesc: "दूरदराज के ग्रामीण क्षेत्रों में बिना इंटरनेट के भी स्थानीय SQLite डेटाबेस के साथ सुचारू रूप से कार्य करता है।",
      features15Title: "15 बायोमैकेनिकल एवं जनसांख्यिकीय विशेषताएं",
      features15Desc: "पिंडली त्वरण, घूर्णन गति, कोणीय वेग, चरम वेग के साथ-साथ आयु, लिंग और बॉडी मास इंडेक्स (BMI) का समावेश।",
      sihTitle: "क्लिनिकल निर्णय समर्थन प्रणाली",
      sihDesc: "प्राथमिक स्वास्थ्य सेवा और फील्ड स्क्रीनिंग के लिए लागत प्रभावी, पोर्टेबल चिकित्सा निदान तकनीक प्रदान करने हेतु विकसित।"
    },
    footer: {
      appName: "OA-SMART",
      tagline: "पोर्टेबल एआई-सहायक ऑस्टिओआर्थराइटिस जोखिम स्क्रीनिंग",
      sihBadge: "क्लिनिकल निर्णय समर्थन प्रणाली",
      medicalDisclaimer: "चिकित्सीय अस्वीकरण: OA-SMART स्वास्थ्य कार्यकर्ताओं के लिए एक स्क्रीनिंग सहायता टूल है। यह एक स्वायत्त नैदानिक उपकरण नहीं है। सभी जोखिम आकलनों की पुष्टि एक योग्य डॉक्टर द्वारा एक्स-रे के माध्यम से की जानी चाहिए।",
      copyright: "OA-SMART रिसर्च एवं डेवलपमेंट टीम। सर्वाधिकार सुरक्षित।",
      rightsReserved: "स्वास्थ्य सेवा और अनुसंधान हेतु अधिकृत",
      linksTitle: "त्वरित नेविगेशन",
      contactTitle: "क्लिनिकल सहायता"
    },
    common: {
      lightMode: "लाइट मोड",
      darkMode: "डार्क मोड",
      selectLanguage: "भाषा",
      close: "बंद करें",
      cancel: "रद्द करें",
      save: "सुरक्षित करें",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफल"
    }
  },
  mr: {
    nav: {
      dashboard: "डॅशबोर्ड",
      newScreening: "नवीन तपासणी",
      history: "रुग्ण इतिहास",
      settings: "सेटिंग्ज",
      aboutUs: "आमच्याबद्दल",
      login: "लॉग इन",
      signup: "नोंदणी",
      logout: "लॉग आउट",
      assistant: "एआय सहाय्यक",
      healthcareWorker: "आरोग्य सेवक"
    },
    dashboard: {
      title: "क्लिनिकल स्क्रीनिंग डॅशबोर्ड",
      subtitle: "गुडघ्याच्या ऑस्टिओआर्थरायटिसच्या सुरुवातीच्या निदानासाठी 15-वैशिष्ट्यपूर्ण AI प्रणाली",
      startScreening: "नवीन तपासणी सुरू करा",
      totalScreenings: "एकूण तपासण्या",
      highRiskDetected: "उच्च जोखीम / संभाव्य OA",
      lowRiskNormal: "सामान्य / कमी जोखीम",
      systemStatus: "प्रणाली स्थिती",
      deviceConnected: "दुहेरी MPU6050 सेन्सर जोडलेले",
      deviceDisconnected: "ब्लूटूथ डिस्कनेक्टेड - सज्ज",
      recentScreenings: "अलीकडील तपासणी सत्रांची यादी",
      patientId: "रुग्ण आयडी",
      patientName: "रुग्णाचे नाव",
      age: "वय",
      sex: "लिंग",
      riskScore: "जोखीम गुण",
      riskLevel: "जोखीम पातळी",
      date: "तारीख",
      action: "कृती",
      viewReport: "अहवाल पहा",
      noScreenings: "अद्याप कोणतीही तपासणी नोंद नाही. नवीन तपासणी सुरू करा.",
      quickGuidanceTitle: "आरोग्य कर्मचाऱ्यांसाठी नियमावली",
      quickGuidanceDesc: "मांडी आणि नडगीवर सेन्सर बांधा. रुग्णाला 30 सेकंद नियंत्रित गतीने उठून बसण्यास सांगा.",
      anonymousPatient: "अनामित रुग्ण"
    },
    auth: {
      loginTitle: "आरोग्य कर्मचारी लॉगिन",
      loginSubtitle: "स्क्रीनिंग नोंदी आणि एआय अहवाल पाहण्यासाठी साइन इन करा",
      signupTitle: "आरोग्य कर्मचारी नोंदणी",
      signupSubtitle: "पोर्टेबल ऑस्टिओआर्थरायटिस तपासणीसाठी खाते तयार करा",
      email: "ईमेल पत्ता",
      password: "पासवर्ड",
      fullName: "पूर्ण नाव",
      fullNameOptional: "(ऐच्छिक)",
      fullNamePlaceholder: "उदा. सिस्टर अनिता (रिकामे ठेवू शकता)",
      loginBtn: "साइन इन करा",
      signupBtn: "खाते तयार करा",
      noAccount: "खाते नाही का?",
      haveAccount: "आधीच खाते आहे का?",
      signUpLink: "येथे नोंदणी करा",
      logInLink: "येथे लॉगिन करा",
      logoutConfirm: "आपण नक्की लॉग आउट करू इच्छिता?",
      invalidEmail: "कृपया वैध ईमेल पत्ता प्रविष्ट करा.",
      passwordShort: "पासवर्ड किमान 6 वर्णांचा असावा.",
      authSuccess: "प्रमाणीकरण यशस्वी!",
      loginFailed: "चुकीचा ईमेल किंवा पासवर्ड."
    },
    intake: {
      title: "रुग्ण नोंदणी व प्राथमिक माहिती",
      subtitle: "15-घटक बायोमेकॅनिकल मॉडेलसाठी रुग्णाची माहिती प्रविष्ट करा",
      nameLabel: "रुग्णाचे नाव",
      nameOptional: "(ऐच्छिक - अनामित तपासणीसाठी रिकामे ठेवा)",
      namePlaceholder: "अनामित रुग्ण",
      ageLabel: "वय (वर्षे)",
      genderLabel: "लिंग",
      male: "पुरुष (1.0)",
      female: "स्त्री (0.0)",
      heightLabel: "उंची (सेमी)",
      weightLabel: "वजन (किग्रॅ)",
      bmiLabel: "बीएमआय (BMI)",
      phoneLabel: "मोबाईल क्रमांक",
      phoneOptional: "(ऐच्छिक)",
      startScreeningBtn: "सेन्सर जोडणीकडे जा",
      anonymousPatient: "अनामित रुग्ण"
    },
    screening: {
      title: "सेन्सर हालचाली व चाचणी",
      patientDetails: "तपासणी रुग्ण",
      sensorsTitle: "दुहेरी MPU6050 हार्डवेअर माहिती",
      sensorConnected: "ESP32 ब्लूटूथ जोडलेले",
      sensorDisconnected: "ESP32 ब्लूटूथ डिस्कनेक्टेड",
      connectSensors: "ब्लूटूथ सेन्सर जोडा",
      stsTestTitle: "30-सेकंद उठणे-बसणे (STS) पद्धत",
      stsTestDesc: "रुग्णाने हात छातीवर घडी घालून बसावे आणि दिलेल्या वेळेत सावकाश उभे राहून बसावे.",
      calibrate: "शून्य कॅलिब्रेशन",
      startRecording: "हालचाल नोंदणी सुरू करा",
      stopRecording: "थांबवा व वैशिष्ट्ये काढा",
      packetsReceived: "प्राप्त डेटा पॅकेट्स",
      recordingTime: "चाचणी कालावधी",
      runAnalysis: "15-घटक एआय विश्लेषण सुरू करा",
      analyzing: "बायोमेकॅनिक्सचे विश्लेषण चालू आहे..."
    },
    results: {
      title: "तपासणी निष्कर्ष व अहवाल",
      riskAssessment: "धोका मूल्यांकन",
      oaDetected: "गुडघ्याच्या ऑस्टिओआर्थरायटिसची शक्यता",
      oaNotDetected: "हालचाली सामान्य / कमी धोका",
      lowRisk: "कमी धोका (< 0.30 मर्यादा)",
      moderateRisk: "वैद्यकीय पुनरावलोकन",
      highRisk: "उच्च धोका (≥ 0.30 मर्यादा)",
      probability: "संभाव्यता गुण (KOA Score)",
      thresholdNotice: "प्रमाणित निर्णय मर्यादा: 0.30 संभाव्यता मर्यादा",
      recommendationsTitle: "वैद्यकीय सल्ला व उपाय",
      biomechanicalFeatures: "15 बायोमेकॅनिकल व सांख्यिकी घटक",
      printReport: "अहवाल प्रिंट करा",
      newScreening: "नवीन तपासणी सुरू करा"
    },
    chat: {
      title: "आरोग्य सेवक सहाय्यक",
      subtitle: "तपासणी व सल्लागार एआय",
      inputPlaceholder: "सेन्सर कसा जोडायचा, STS चाचणी, 15 वैशिष्ट्ये विचारा...",
      send: "पाठवा",
      suggestedTopics: "सुचवलेले प्रश्न",
      disclaimer: "आरोग्य कर्मचाऱ्यांसाठी सहाय्यक साधन. हा अंतिम वैद्यकीय निष्कर्ष नाही.",
      minimize: "लहान करा",
      openAssistant: "क्लिनिकल सहाय्यक"
    },
    about: {
      title: "OA-SMART विषयी",
      tagline: "पोर्टेबल एआय-सहाय्यक ऑस्टिओआर्थरायटिस जोखीम तपासणी प्रणाली",
      missionTitle: "आमचे ध्येय",
      missionDesc: "OA-SMART गुडघ्याच्या ऑस्टिओआर्थरायटिसची सुरुवातीच्या टप्प्यात बिनदुखापत तपासणी ग्रामीण व प्राथमिक आरोग्य केंद्रात उपलब्ध करून देते.",
      techTitle: "एकीकृत तंत्रज्ञान",
      techDualSensor: "दुहेरी MPU6050 किनेमॅटिक्स",
      techDualSensorDesc: "मांडी व नडगीवरील सेन्सर्स हालचालीतील कोनीय वेग आणि त्वरण अचूक मोजतात.",
      techML: "प्रमाणित 15-घटक रँडम फॉरेस्ट",
      techMLDesc: "खऱ्या बायोमेकॅनिकल डेटावर प्रशिक्षित आणि 0.30 संवेदनशील मर्यादेवर आधारित अचूक मॉडेल.",
      techEdge: "ऑफलाइन-सक्षम ESP32 BLE रचना",
      techEdgeDesc: "इंटरनेट नसलेल्या भागातही स्थानिक SQLite डेटाबेससह सुरळीत कार्य करते.",
      features15Title: "15 बायोमेकॅनिकल व सांख्यिकी निकष",
      features15Desc: "नडगी त्वरण, कोनीय वेग, सर्वोच्च वेग यासोबत वय, लिंग आणि बीएमआयचे एकत्रित विश्लेषण.",
      sihTitle: "क्लिनिकल निर्णय सहाय्य प्रणाली",
      sihDesc: "प्राथमिक आरोग्य सेवा आणि प्रत्यक्ष तपासणीसाठी किफायतशीर आणि पोर्टेबल वैद्यकीय निदान तंत्रज्ञान निर्मितीचा उपक्रम."
    },
    footer: {
      appName: "OA-SMART",
      tagline: "पोर्टेबल एआय-सहाय्यक ऑस्टिओआर्थरायटिस जोखीम तपासणी",
      sihBadge: "क्लिनिकल निर्णय सहाय्य प्रणाली",
      medicalDisclaimer: "वैद्यकीय सूचना: OA-SMART हे आरोग्य कर्मचाऱ्यांसाठी केवळ चाचणी सहाय्यक साधन आहे. हा अंतिम वैद्यकीय निष्कर्ष नसून डॉक्टरांचा सल्ला आणि एक्स-रे तपासणी आवश्यक आहे.",
      copyright: "OA-SMART संशोधन व विकास गट. सर्व हक्क राखीव.",
      rightsReserved: "आरोग्य सेवा व संशोधनासाठी अधिकृत",
      linksTitle: "जलद दुवे",
      contactTitle: "क्लिनिकल मदत"
    },
    common: {
      lightMode: "लाइट मोड",
      darkMode: "डार्क मोड",
      selectLanguage: "भाषा",
      close: "बंद करा",
      cancel: "रद्द करा",
      save: "जतन करा",
      loading: "लोड होत आहे...",
      error: "त्रुटी",
      success: "यशस्वी"
    }
  }
};
