export const COMPANY = {
  name: 'Dugar Capital Advisors Private Limited',
  tagline: 'Expert financial guidance tailored to drive your business growth.',
  address: '101-102, Lusa Tower, Azadpur Commercial Complex, Azadpur, New Delhi -110033',
  // only one number is shown on the site; the other one on file is 9412330008
  phone: '9999154568',
  phoneIntl: '+91 9999154568',
  linkedin: 'https://www.linkedin.com/in/dugar-capital-advisors-privated-ltd-6051aa441',
  email: 'info@dugarcapital.com',
  year: 2026,
};

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'Contact', path: '/contact' },
];

export interface Service {
  num: string;
  title: string;
  summary: string;
  detail: string;
  points: string[];
  image: string;
}

export const SERVICES: Service[] = [
  {
    num: "01",
    title: "IPO Advisory",
    summary: "Navigate the complexities of going public with our expert IPO advisory services. We provide comprehensive guidance throughout the process, from pre-IPO planning to post-listing support, ensuring a seamless transition and maximizing value for stakeholders.",
    detail: "Guiding your business through a seamless IPO process, from initial planning to post-listing support, ensuring maximum value realization",
    points: ["Comprehensive IPO planning and strategy", "Regulatory compliance and documentation", "Valuation analysis and financial modeling", "Roadshow preparation and investor engagement", "Post-listing support and market stabilization", "Expert guidance for successful IPO execution"],
    image: "images/services/service-ipo-advisory.jpg",
  },
  {
    num: "02",
    title: "SME IPO Advisory",
    summary: "Empower your small or medium enterprise with our specialized SME IPO advisory. We help you access capital markets, meet regulatory requirements, and optimize your growth potential, guiding you every step of the way for a successful listing.",
    detail: "Specialized advisory for SMEs to successfully navigate IPOs, access capital markets, and fuel growth with tailored financial strategies",
    points: ["Market assessment and readiness analysis", "Tailored IPO strategies for SMEs", "Regulatory compliance and filings", "Financial structuring and valuation services", "Investor outreach and engagement support", "Ongoing post-IPO advisory services"],
    image: "images/services/service-sme-ipo-advisory.jpg",
  },
  {
    num: "03",
    title: "Equity Placements",
    summary: "Enhance your capital base through our tailored equity placement services. We connect you with strategic investors, negotiate favorable terms, and ensure that your equity offerings align with your long-term financial goals and growth strategies.",
    detail: "Connecting businesses with strategic investors through effective equity placements, ensuring alignment with long-term financial and growth objectives.",
    points: ["Identification of suitable investors", "Structuring and negotiation of equity deals", "Preparation of investment documentation", "Market analysis and valuation support", "Coordination of investor roadshows", "Post-placement support and advisory"],
    image: "images/about/business-charts-review.jpg",
  },
  {
    num: "04",
    title: "Corporate Structuring",
    summary: "Streamline your operations and maximize efficiency with our corporate structuring services. We assess your current framework, design optimal structures, and implement strategies that align with your business objectives, driving sustainable growth and enhanced market presence.",
    detail: "Optimizing your corporate structure for operational efficiency, tax benefits, and enhanced market positioning to drive sustainable business growth.",
    points: ["Assessment of current corporate structure", "Strategic restructuring planning", "Tax optimization and compliance", "Mergers and acquisitions advisory", "Cross-border structuring solutions", "Implementation of restructuring strategies"],
    image: "images/services/service-corporate-structuring.jpg",
  },
  {
    num: "05",
    title: "Valuation Services",
    summary: "Understand the true worth of your business with our professional valuation services. We provide accurate, reliable valuations for mergers, acquisitions, and strategic planning, helping you make informed decisions and enhance your company’s financial standing.",
    detail: "Delivering precise and reliable business valuations for mergers, acquisitions, investments, and strategic planning to enhance decision-making",
    points: ["Comprehensive business valuation analysis", "Market-based valuation approaches", "Asset and income valuation methods", "Valuation for M&A and transactions", "Strategic planning and growth advisory", "Periodic valuation updates"],
    image: "images/services/service-valuation.jpg",
  },
  {
    num: "06",
    title: "Business Advisory Services",
    summary: "Transform your business with our comprehensive advisory services. From strategic planning to operational improvement, we offer insights and strategies that help you overcome challenges, seize opportunities, and achieve long-term growth and success.",
    detail: "Providing strategic insights and actionable solutions to overcome challenges, seize opportunities, and achieve sustainable business growth.",
    points: ["Market research and competitive analysis", "Strategic planning and development", "Risk management and mitigation strategies", "Operational efficiency enhancement", "Financial forecasting and budgeting", "Growth strategy and expansion planning"],
    image: "images/services/service-business-advisory.jpg",
  },
];

export const WHY_CHOOSE = [
  { title: "Tailored Strategies", text: "We provide customized solutions designed to meet your unique business goals, ensuring maximum growth and sustainable success." },
  { title: "Proven Expertise", text: "Our team of seasoned professionals brings years of industry experience, delivering insightful and reliable financial guidance." },
  { title: "Client-Centric Approach", text: "We prioritize your needs with transparent communication, strategic planning, and dedicated support, fostering long-term partnerships built on trust." },
];

export const HOME_TESTIMONIALS = [
  { name: "Rajesh Mehta", role: "CEO of Pinnacle Industries", quote: "Dugar Capital's SME IPO advisory services were instrumental in our journey to become a publicly listed company. Their expertise and guidance helped us navigate the entire process seamlessly. We raised the capital we needed and gained invaluable market exposure. Highly recommend their services!" },
  { name: "Anjali Patel", role: "MD of Stellar Group", quote: "We approached Dugar Capital for corporate structuring, and the results were outstanding. They simplified our complex organizational framework, leading to significant cost savings and improved operational efficiency. Their strategic insight has been a game-changer for our business." },
  { name: "Vikram Desai", role: "Founder of Orbit Retail, Mumbai", quote: "The team at Dugar Capital provided exceptional business advisory services that transformed our growth strategy. Their insights and recommendations were practical and effective, driving measurable results in a short period. They are truly a trusted partner in our success." },
];

export interface CaseStudy {
  company: string;
  promoter: string;
  deal: string;
  summary: string;
  quote: string;
  logo?: string; // optional: add a file under public/images/clients/ to show a client logo
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    company: "Lead Reclaim & Rubber Products Ltd",
    promoter: "Jayesh Kumar Patel",
    deal: "SME IPO",
    summary: "Dugar Capital successfully guided Lead Reclaim & Rubber Products Ltd through the SME IPO process. With a deep understanding of regulatory frameworks and market positioning, we ensured a smooth listing, securing vital capital for the company's expansion and operational needs. Our personalized advisory helped the company navigate the complexities of the SME capital market, boosting its public presence and long-term growth prospects.",
    quote: "Dugar Capital’s expert guidance made the entire IPO process seamless and efficient. Their personalized approach ensured we raised the capital needed while positioning us for sustainable growth. Truly a trusted partner in our success.",
  },
  {
    company: "Devlabtech Venture Ltd",
    promoter: "Jerambhai Lavjibhai Donda",
    deal: "SME IPO (Raised ₹11 Crore)",
    summary: "Devlabtech Venture Ltd partnered with Dugar Capital for its ₹11 crore SME IPO, gaining invaluable market insights and expert financial guidance. Our team delivered end-to-end advisory, from pre-IPO readiness to market launch, ensuring regulatory compliance and optimized fundraising outcomes. The capital raised through the IPO has significantly accelerated the company’s expansion.",
    quote: "Dugar Capital’s expertise in SME IPOs was critical to our successful fundraising. Their strategic approach and commitment to our goals made a huge difference. We’re excited about our future with Dugar by our side.",
  },
  {
    company: "Sheetal Universal Ltd",
    promoter: "Hiren Vallabhbhai Patel",
    deal: "SME IPO (Raised ₹24 Crore)",
    summary: "With Dugar Capital’s assistance, Sheetal Universal Ltd successfully raised ₹24 crore through its SME IPO. We provided thorough market analysis, IPO planning, and investor engagement, ensuring the company exceeded its fundraising targets. Our advisory approach helped streamline the process, setting the stage for the company's growth and expansion.",
    quote: "Dugar Capital was instrumental in helping us exceed our fundraising goals. Their deep understanding of SME IPOs and hands-on support made a significant impact on our successful listing.",
  },
  {
    company: "Growington Ventures India Ltd",
    promoter: "Vikram Bajaj",
    deal: "Fundraising through Warrants",
    summary: "Growington Ventures India Ltd turned to Dugar Capital for fundraising via warrants. We provided expert valuation, structured financing, and investor outreach strategies, resulting in successful capital raising. Our team’s innovative approach to fundraising helped the company access the necessary funds while minimizing dilution, securing future growth potential.",
    quote: "Dugar Capital’s expertise in structuring and executing our fundraising was exceptional. Their solutions were both innovative and effective, ensuring we accessed the capital needed without overburdening our shareholders.",
  },
  {
    company: "Boss Packaging Solution Ltd",
    promoter: "Manish Brahmbhatt",
    deal: "SME IPO (NSE Emerge)",
    summary: "Boss Packaging Solution Ltd partnered with Dugar Capital to launch their IPO on NSE Emerge. From IPO readiness to post-listing support, we provided comprehensive guidance, helping the company successfully raise capital and enhance its market positioning.",
    quote: "Dugar Capital’s hands-on approach and strategic insights were key to our successful listing on NSE Emerge. Their dedication to our success has been unmatched.",
  },
  {
    company: "SPP Polymers Ltd",
    promoter: "Deepak Goyal",
    deal: "SME IPO (Raised ₹25 Crore)",
    summary: "SPP Polymers Ltd’s IPO raised ₹25 crore with the help of Dugar Capital’s expert advisory services. Our team supported the company from the initial planning stages through to its successful public offering, helping them secure the capital needed for expansion.",
    quote: "Dugar Capital delivered beyond expectations. Their expertise and commitment ensured a successful IPO, raising significant capital for our future growth.",
  },
];

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin: string;
}

export const TEAM: TeamMember[] = [
  {
    name: 'Virendra Dugar',
    role: 'Founder',
    bio: "With 18 years of extensive experience in the capital markets, the founder of Dugar Capital has demonstrated expertise in broking, IPO consulting, and team building. A graduate of St. Xavier's College, Kolkata, he has successfully contributed to over 30 IPOs, with a specialized focus on SME IPOs. His deep understanding of the financial landscape, combined with a hands-on approach to guiding companies through complex IPO processes, has positioned him as a trusted advisor in the industry. His proven track record in delivering results and building strong teams makes him an invaluable asset to businesses seeking to navigate the capital markets with confidence and precision.",
    image: 'images/about/team-virendra-dugar.jpeg',
    linkedin: 'https://www.linkedin.com/in/virendra-dugar-b983a026a',
  },
  {
    name: 'Anju Singh',
    role: 'Team Member',
    bio: "With over 15 years of rich experience in the insurance domain and corporate advisory, she brings unparalleled knowledge and strategic acumen to every client engagement. A graduate of Delhi University with a Bachelor's degree in Arts, her expertise in corporate advisory has been pivotal in driving client acquisition, expanding the firm's portfolio, and cultivating enduring business relationships. Her profound understanding of industry dynamics, coupled with her ability to craft tailored advisory solutions, has consistently empowered the company to secure high-value partnerships and deliver exceptional outcomes for clients. Her leadership and insights remain a cornerstone of the company's continued success and growth.",
    image: 'images/about/team-anju-singh.jpeg',
    linkedin: 'https://www.linkedin.com/in/anju-singh-600b9953',
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content?: string;
}

export const BLOGS: BlogPost[] = [
  {
    slug: 'how-an-ipo-can-transform-your-business',
    title: 'How an IPO Can Transform Your Business',
    date: 'December 19, 2024',
    excerpt: "An IPO is more than just a financial milestone—it's a transformational step that can redefine a company's future.",
    image: 'images/about/business-charts-review.jpg',
  },
  {
    slug: 'top-5-reasons-your-business-should-consider-an-ipo',
    title: 'Top 5 Reasons Your Business Should Consider an IPO',
    date: 'December 19, 2024',
    excerpt: 'Deciding to take your business public is a big step, but it can also be the most rewarding one.',
    image: 'images/about/business-charts-review.jpg',
  },
  {
    slug: 'what-is-an-ipo-and-why-does-your-business-need-one',
    title: 'What is an IPO and Why Does Your Business Need One?',
    date: 'December 19, 2024',
    excerpt: 'When a company decides to go public, it embarks on a transformative journey through an Initial Public Offering.',
    image: 'images/about/business-charts-review.jpg',
  },
];

// URL-friendly id for a service, used for #anchors on the Services page
export const serviceSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
