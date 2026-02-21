import { logo, e4, e5, e6, new1, new2, new3, Krishna, Chandrashen, avatar, abhishek_avatar, rehant_avatar} from "../assets/script";


const info = [
  {
    url: new1,
    title: 'Sign Up & Get Started',
    Description: 'Register on CollegeSecracy and explore powerful counseling tools designed for aspirants.'
  },
  {
    url: new2,
    title: 'Access Premium Tools',
    Description: 'Make a one-time payment to unlock advanced features like College Predictor and detailed insights.'
  },
  {
    url: new3,
    title: 'Plan Your Journey',
    Description: 'Use expert tools and guidance to predict suitable colleges and make smart, timely decisions.'
  }
];

const quality = [
  {
    url: e4,
    title: 'Smart College Predictions',
    Description: 'Accurate predictions based on your rank, category, gender, and preferences—built for real decision-making.'
  },
  {
    url: e5,
    title: 'Trusted Counseling Support',
    Description: 'Get timely help from experienced mentors for form filling, choice locking, and personalized strategy.'
  },
  {
    url: e6,
    title: 'One-Time Payment Access',
    Description: 'Unlock premium features during the counseling season with a simple one-time payment. No hidden fees.'
  }
];



// Home Page FAQs (General & Platform-Related)
const homePageFAQs = [
  {
    question: "What is CollegeSecracy?",
    answer: "CollegeSecracy is a platform designed to help students access educational tools, notes, assignments, and discussion forums, making learning more efficient."
  },
  {
    question: "Who can use CollegeSecracy?",
    answer: "Any student, educator, or academic professional can use CollegeSecracy."
  },
  {
    question: "How do I register on CollegeSecracy?",
    answer: "Click the 'Sign Up' button on the homepage and follow the registration process."
  },
  {
    question: "What features does CollegeSecracy offer?",
    answer: "CollegeSecracy provides: Study Notes & Resources, Internship & Career Opportunities, Discussion Forums, Project Collaboration."
  },
  {
    question: "Is CollegeSecracy free to use?",
    answer: "Yes, most of the resources are free. Some premium features may require a subscription."
  },
  {
    question: "Can I contribute my own notes or assignments?",
    answer: "Yes! You can upload study materials to help other students."
  },
  {
    question: "Does CollegeSecracy offer internship opportunities?",
    answer: "Yes! We provide internship listings in various domains. Check the 'Career' section for details."
  },
  {
    question: "How can I apply for an internship?",
    answer: "You can visit the 'Career' section, find a suitable internship, and apply directly."
  },
  {
    question: "Do I get a certificate for contributing study materials?",
    answer: "Yes! Regular contributors may receive a certificate of appreciation."
  }
];

// Contact Page FAQs (Support & Help)
const contactPageFAQs = [
  {
    question: "I forgot my password. How do I reset it?",
    answer: "Click on 'Forgot Password' on the login page and follow the instructions."
  },
  {
    question: "I haven't received a verification email. What should I do?",
    answer: "Check your spam/junk folder. If it's not there, request a new verification email."
  },
  {
    question: "I'm facing login issues. What can I do?",
    answer: "Clear your browser cache and try again. If the issue persists, contact support."
  },
  {
    question: "Why is my uploaded study material not visible?",
    answer: "Uploaded materials go through a review process before appearing on the site."
  },
  {
    question: "Can I delete my CollegeSecracy account?",
    answer: "Yes, go to 'Account Settings > Delete Account' or contact support."
  },
  {
    question: "How long does it take to get a response from support?",
    answer: "We usually respond within 24-48 hours."
  },
  {
    question: "Do you offer live chat or phone support?",
    answer: "Yes! You can reach us via live chat (Telegram) or call us directly."
  },
  {
    question: "Where can I find CollegeSecracy's contact details?",
    answer: "Check our 'Contact Us' page for email, phone, and chat support."
  }
];

const TermsAndConditons = [
  {
    title: "1. Introduction",
    content:
      "Welcome to CollegeSecracy. These Terms and Conditions govern your use of our platform. By accessing or using our services, you agree to be bound by these terms.",
  },
  {
    title: "2. User Responsibilities",
    content: "",
    list: [
      "You must be at least 18 years old to use CollegeSecracy.",
      "Provide accurate and complete information while registering.",
      "Do not share your account credentials with others.",
      "Respect the community and avoid harmful behavior.",
    ],
  },
  {
    title: "3. Privacy & Data Protection",
    content:
      "We prioritize your privacy. Your data is stored securely, and we do not sell your personal information to third parties. Read our ",
    link: { text: "Privacy Policy", href: "/privacy" },
  },
  {
    title: "4. Prohibited Activities",
    list: [
      "No illegal, misleading, or offensive content is allowed.",
      "Do not attempt to hack, manipulate, or misuse our services.",
      "Spamming, phishing, or unauthorized advertising is prohibited.",
    ],
  },
  {
    title: "5. Third-Party Links",
    content:
      "CollegeSecracy may contain links to external websites. We are not responsible for the content, policies, or practices of third-party websites.",
  },
  {
    title: "6. Refund & Cancellation Policy",
    content:
      "Payments made for premium features or services are non-refundable. If you wish to cancel your subscription, you may do so before the next billing cycle.",
  },
  {
    title: "7. Account Termination",
    content:
      "We reserve the right to terminate or suspend your account if you violate our policies or engage in malicious activities.",
  },
  {
    title: "8. Limitation of Liability",
    content:
      "CollegeSecracy is not responsible for any losses, damages, or legal issues that arise from using our platform.",
  },
  {
    title: "9. Governing Law",
    content:
      "These terms shall be governed by and interpreted in accordance with the laws of [Your Country/State].",
  },
  {
    title: "10. Changes to Terms",
    content:
      "We may update these Terms and Conditions from time to time. It is your responsibility to review them periodically.",
  },
  {
    title: "11. Contact Us",
    content: "For any questions, feel free to reach out at ",
    link: { text: "contact@collegesecracy.com", href: "mailto:contact@collegesecracy.com" },
  },
]

// faqs.js

const studentPageFAQs = [
  {
    question: "How do I use the Rank Calculator?",
    answer: "Just enter your exam score and category details in the Rank Calculator tool to get your estimated All India Rank instantly."
  },
  {
    question: "What is the College Predictor tool for?",
    answer: "The College Predictor helps you discover potential colleges based on your rank, category, and preferred branches or locations."
  },
  {
    question: "How accurate is the Percentile Calculator?",
    answer: "Our Percentile Calculator uses official data trends to give you a close estimate of your percentile based on your raw marks and shift difficulty."
  },
  {
    question: "Where can I calculate my CGPA?",
    answer: "You can calculate your CGPA by entering your semester-wise grades in the CGPA Calculator tool available on your dashboard."
  },
  {
    question: "What is the Marking Scheme section used for?",
    answer: "It shows the latest exam-specific marking schemes, including details about negative marking, subject-wise weightage, and question types."
  },
  {
    question: "How do I check previous year cutoffs?",
    answer: "Use the Cutoff Analyzer tool to view and filter previous year college cutoffs based on branch, category, and rank."
  },
  {
    question: "Can I compare colleges?",
    answer: "Yes! Our Compare Colleges tool lets you evaluate colleges side-by-side based on placement, fees, location, cutoff, and more."
  },
  {
    question: "Is there a way to track my preparation progress?",
    answer: "Yes, the dashboard includes a progress tracker that helps you monitor your performance in practice tests and identify improvement areas."
  },
  {
    question: "How often is the college data updated?",
    answer: "Our team updates college data regularly after every major counseling round and exam season to ensure accuracy and relevance."
  },
  {
    question: "Can I bookmark tools I use frequently?",
    answer: "Absolutely! You can pin your favorite tools on the dashboard for quicker access anytime."
  },
  {
    question: "How accurate is the JEE rank predictor tool?",
    answer: "Our JEE rank predictor uses historical data and statistical models to estimate your rank based on your percentile. While we strive for accuracy, actual ranks may vary slightly due to factors like the number of test-takers and difficulty level variations across sessions."
  },
  {
    question: "What's the difference between JEE Main and JEE Advanced?",
    answer: "JEE Main is the first stage exam for admission to NITs, IIITs, and other engineering colleges. JEE Advanced is the second stage for admission to IITs. Only the top 2.5 lakh JEE Main qualifiers can appear for JEE Advanced."
  },
  {
    question: "How do I calculate my JEE Main percentile?",
    answer: "Your percentile is calculated based on your performance relative to other candidates in your session. You can use our percentile calculator tool by entering your raw score and the total number of candidates in your session."
  },
  {
    question: "What colleges can I get with my JEE rank?",
    answer: "Use our college predictor tool by entering your expected rank. We'll provide a list of probable colleges based on previous year cutoff trends. Remember that cutoffs vary each year based on exam difficulty and number of applicants."
  },
  {
    question: "How is CUET different from JEE?",
    answer: "CUET (Common University Entrance Test) is for admission to central universities across various disciplines, while JEE is specifically for engineering admissions. CUET has different subject combinations depending on your chosen course."
  },
  {
    question: "What documents do I need for counselling registration?",
    answer: "Typically you'll need: JEE/CUET scorecard, class 10 & 12 mark sheets, category certificate (if applicable), domicile certificate, passport photos, and ID proof. Exact requirements may vary by institution."
  }
];

const Founders = [
  {
    Name: "Chandrashen Yadav",
    Role: "Founder & Director",
    url: Chandrashen,
    About: "Visionary leader with a strong background in education and technology. He drives innovation to make learning more accessible and impactful.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/chandrashen", // ← Replace with actual links
      twitter: "https://twitter.com/chandrashen"
    }
  },
  {
    Name: "Krishna Singh",
    Role: "Co-Founder & CEO",
    url: Krishna,
    About: "Tech-driven innovator focused on building scalable solutions that enhance the education experience through cutting-edge technology.",
    socialLinks: {
      linkedin: "https://linkedin.com/in/krishnasingh", // ← Replace with actual links
      twitter: "https://twitter.com/krishnasingh"
    }
  }
];


const TeamMembers = [
        {
    name: "Chandrashen Yadav",
    role: "Chief Financial Officer ( CFO )",
    avatar: Chandrashen
  },
        {
    name: "Krishna Singh",
    role: "Chief Technology Officer ( CTO )",
    avatar: Krishna
  },

      {
    name: "Chandrashen Yadav",
    role: "Chief Creative Officer ( CCO )",
    avatar: Chandrashen
  },
  {
    
    name: "Abhishek Yadav",
    role: "Cheif Technology Operational Officer ( CTOO )",
    avatar: abhishek_avatar
  },
  {
    name: "Rehant Roy",
    role: "Cheif Operational Officer ( COO )",
    avatar: rehant_avatar
  },
];

const TeamLeads = [
       {
    name: "Pushkar Raj",
    role: "Tech Lead",
    department: "Tech Department",
    avatar: avatar
  },
      {
    name: "Aaima Salman",
    role: "Content Research Lead",
    department: "Content & Strategy Department",
    avatar: avatar
  },
      {
    name: "AS",
    role: "Design Lead",
    department: "Designing Department",
    avatar: avatar
  },

]

const Advisors = [
  {
    name: "Dr. Nisha Verma",
    title: "Academic Advisor",
    expertise: "Former Dean, XYZ University",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    name: "Prof. Rajeev Malhotra",
    title: "Industry Expert",
    expertise: "20+ Years in EdTech Innovation",
    avatar: "https://randomuser.me/api/portraits/men/31.jpg"
  },
  {
    name: "Meera Chopra",
    title: "Education Consultant",
    expertise: "Ex-Director at CareerPath Institute",
    avatar: "https://randomuser.me/api/portraits/women/34.jpg"
  }
];

const Milestones = [
  {
    date: "11 June 2025",
    title: "Founded",
    description: "Started with a vision to help students make better career decisions"
  },
  {
    date: "12 June 2025",
    title: "First Student Guided",
    description: "Successfully guided our first student through personal mentorship"
  },
  {
    date: "15 June 2025",
    title: "Initial Outreach",
    description: "Reached out to our first set of students through WhatsApp and social media"
  },
  {
    date: "25 June 2025",
    title: "Positive Feedback",
    description: "Received encouraging feedback from early students about our guidance approach"
  }
];



const Testimonials = [
  {
    name: "Alex Johnson",
    college: "Harvard University",
    quote: "CollegeSecracy helped me find the perfect mentor for my application",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    name: "Priya Patel",
    college: "Stanford University",
    quote: "The insights I gained from my mentor were invaluable in making my college decision",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg"
  },
  {
    name: "Michael Chen",
    college: "MIT",
    quote: "The platform connected me with alumni who gave me real perspective on campus life",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    name: "Sarah Williams",
    college: "Yale University",
    quote: "I wouldn't have gotten into my dream college without CollegeSecracy's guidance",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg"
  }
];

  

export {
    info,
    quality,
    Founders,
    homePageFAQs,
    contactPageFAQs,
    TermsAndConditons,
    TeamMembers,
    TeamLeads,
    Milestones,
    Testimonials,
    studentPageFAQs
};


