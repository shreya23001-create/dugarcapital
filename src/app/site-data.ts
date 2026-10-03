export const COMPANY = {
  name: 'Dugar Capital Advisors Private Limited',
  tagline: 'Expert financial guidance tailored to drive your business growth.',
  address: '101-102, Lusa Tower, Azadpur Commercial Complex, Azadpur, New Delhi -110033',
  phone: '9412330008',
  phoneIntl: '+91 9412330008',
  email: 'info@dugarcapital.com',
  year: 2026,
};

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Testimonials', path: '/testimonials' },
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
    num: '01',
    title: 'IPO Advisory',
    summary: 'Navigate public market transitions with pre-IPO planning and post-listing support.',
    detail: 'Guiding your business through a seamless IPO process, from initial planning to post-listing support, ensuring maximum value realization',
    points: ['Comprehensive IPO planning and strategy', 'Regulatory compliance and documentation', 'Valuation analysis and financial modeling', 'Roadshow preparation and investor engagement', 'Post-listing support and market stabilization', 'Expert guidance for successful IPO execution'],
    image: 'images/services/service-ipo-advisory.jpg',
  },
  {
    num: '02',
    title: 'SME IPO Advisory',
    summary: 'Capital market access and regulatory compliance for smaller enterprises.',
    detail: 'Specialized advisory for SMEs to successfully navigate IPOs, access capital markets, and fuel growth with tailored financial strategies',
    points: ['Market assessment and readiness analysis', 'Tailored IPO strategies for SMEs', 'Regulatory compliance and filings', 'Financial structuring and valuation services', 'Investor outreach and engagement support', 'Ongoing post-IPO advisory services'],
    image: 'images/services/service-sme-ipo-advisory.jpg',
  },
  {
    num: '03',
    title: 'Equity Placements',
    summary: 'Connect businesses with strategic investors on favorable terms.',
    detail: 'Connecting businesses with strategic investors through effective equity placements, ensuring alignment with long-term financial and growth objectives.',
    points: ['Identification of suitable investors', 'Structuring and negotiation of equity deals', 'Preparation of investment documentation', 'Market analysis and valuation support', 'Coordination of investor roadshows', 'Post-placement support and advisory'],
    image: 'images/about/business-charts-review.jpg',
  },
  {
    num: '04',
    title: 'Corporate Structuring',
    summary: 'Operational optimization and sustainable growth strategies.',
    detail: 'Optimizing company organization for efficiency and tax advantages.',
    points: ['Structural assessment', 'Strategic planning', 'Tax optimization', 'M&A advisory', 'Cross-border solutions', 'Implementation support'],
    image: 'images/services/service-corporate-structuring.jpg',
  },
  {
    num: '05',
    title: 'Valuation Services',
    summary: 'Accurate business valuations for M&A and strategic planning.',
    detail: 'Delivering precise and reliable business valuations for mergers, acquisitions, investments, and strategic planning to enhance decision-making',
    points: ['Comprehensive business valuation analysis', 'Market-based valuation approaches', 'Asset and income valuation methods', 'Valuation for M&A and transactions', 'Strategic planning and growth advisory', 'Periodic valuation updates'],
    image: 'images/services/service-valuation.jpg',
  },
  {
    num: '06',
    title: 'Business Advisory Services',
    summary: 'Strategic planning and operational improvement guidance.',
    detail: 'Providing strategic insights and actionable solutions to overcome challenges, seize opportunities, and achieve sustainable business growth.',
    points: ['Market research and competitive analysis', 'Strategic planning and development', 'Risk management and mitigation strategies', 'Operational efficiency enhancement', 'Financial forecasting and budgeting', 'Growth strategy and expansion planning'],
    image: 'images/services/service-business-advisory.jpg',
  },
];

export const WHY_CHOOSE = [
  { title: 'Tailored Strategies', text: 'Customized solutions built around your business goals.' },
  { title: 'Proven Expertise', text: 'Experienced professionals who have guided businesses through capital markets.' },
  { title: 'Client-Centric Approach', text: 'Partnerships built on transparency and trust.' },
];

export const HOME_TESTIMONIALS = [
  { name: 'Rajesh Mehta', role: 'CEO of Pinnacle Industries', quote: 'Their SME IPO advisory services facilitated our public listing and capital raising.' },
  { name: 'Anjali Patel', role: 'MD of Stellar Group', quote: 'Their corporate structuring services delivered significant cost savings and improved operational efficiency.' },
  { name: 'Vikram Desai', role: 'Founder of Orbit Retail, Mumbai', quote: 'Their business advisory transformed our growth strategy with practical and effective results.' },
];

export interface CaseStudy {
  company: string;
  promoter: string;
  deal: string;
  summary: string;
  quote: string;
  logo: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    company: 'Lead Reclaim & Rubber Products Ltd',
    promoter: 'Jayesh Kumar Patel',
    deal: 'SME IPO',
    summary: 'Guided through the SME IPO process, helping secure capital for expansion.',
    quote: "Dugar Capital's expert guidance made the entire IPO process seamless and efficient.",
    logo: 'images/clients/lead-reclaim.png',
  },
  {
    company: 'Devlabtech Venture Ltd',
    promoter: 'Jerambhai Lavjibhai Donda',
    deal: 'SME IPO (₹11 Crore raised)',
    summary: 'End-to-end advisory from pre-IPO readiness through market launch.',
    quote: "Dugar Capital's expertise in SME IPOs was critical to our successful fundraising.",
    logo: 'images/clients/devlabtech.png',
  },
  {
    company: 'Sheetal Universal Ltd',
    promoter: 'Hiren Vallabhbhai Patel',
    deal: 'SME IPO (₹24 Crore raised)',
    summary: 'Market analysis and IPO planning, helping exceed fundraising targets.',
    quote: 'Dugar Capital was instrumental in helping us exceed our fundraising goals.',
    logo: 'images/clients/sheetal-universal.png',
  },
  {
    company: 'Growington Ventures India Ltd',
    promoter: 'Vikram Bajaj',
    deal: 'Fundraising through Warrants',
    summary: 'Structured warrant-based financing to minimize shareholder dilution.',
    quote: "Dugar Capital's expertise in structuring and executing our fundraising was exceptional.",
    logo: 'images/clients/growington.png',
  },
  {
    company: 'Boss Packaging Solution Ltd',
    promoter: 'Manish Brahmbhatt',
    deal: 'SME IPO (NSE Emerge)',
    summary: "Comprehensive guidance supporting the company's NSE Emerge listing.",
    quote: "Dugar Capital's hands-on approach and strategic insights were key to our success.",
    logo: 'images/clients/boss-packaging.png',
  },
  {
    company: 'SPP Polymers Ltd',
    promoter: 'Deepak Goyal',
    deal: 'SME IPO (₹25 Crore raised)',
    summary: 'Support from planning through a successful public offering.',
    quote: 'Dugar Capital delivered beyond expectations. Their expertise ensured a successful IPO.',
    logo: 'images/clients/spp-polymers.png',
  },
];

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

export const TEAM: TeamMember[] = [
  {
    name: 'Virendra Dugar',
    role: 'Founder',
    bio: "With 18 years of extensive experience in the capital markets, the founder of Dugar Capital has demonstrated expertise in broking, IPO consulting, and team building. A graduate of St. Xavier's College, Kolkata, he has successfully contributed to over 30 IPOs, with a specialized focus on SME IPOs. His deep understanding of the financial landscape, combined with a hands-on approach to guiding companies through complex IPO processes, has positioned him as a trusted advisor in the industry. His proven track record in delivering results and building strong teams makes him an invaluable asset to businesses seeking to navigate the capital markets with confidence and precision.",
    image: 'images/about/team-virendra-dugar.jpg',
  },
  {
    name: 'Anju Singh',
    role: 'Team Member',
    bio: "With over 15 years of rich experience in the insurance domain and corporate advisory, she brings unparalleled knowledge and strategic acumen to every client engagement. A graduate of Delhi University with a Bachelor's degree in Arts, her expertise in corporate advisory has been pivotal in driving client acquisition, expanding the firm's portfolio, and cultivating enduring business relationships. Her profound understanding of industry dynamics, coupled with her ability to craft tailored advisory solutions, has consistently empowered the company to secure high-value partnerships and deliver exceptional outcomes for clients. Her leadership and insights remain a cornerstone of the company's continued success and growth.",
    image: 'images/about/team-anju-singh.jpg',
  },
];

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
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
