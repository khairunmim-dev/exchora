// ===== EXCHORA — script.js =====
// Session 2: posts live in a data array, cards render automatically,
//            and the Post form adds a new post.
// Session 3: search + filters really work, and Interested saves a post
//            to My Exchanges (kept in localStorage, survives reload).

// ---------- 1) The data: every post is one object in this array ----------
let posts = [
  { id: 'sample1', name: 'Tanvir H.',  subject: 'CSE471 — Web & Internet Programming', semester: 11, type: 'Notes',         have: 'Complete HTML & CSS handwritten notes',   want: 'JavaScript notes' },
  { id: 'sample2', name: 'Nusrat J.',  subject: 'Data Mining',                          semester: 11, type: 'Question Bank', have: "Previous 3 years' CT + final questions",  want: 'Lab assignment solutions' },
  { id: 'sample3', name: 'Arif R.',    subject: 'Introduction to Algorithms (CLRS)',    semester: 9,  type: 'Book',          have: 'Physical book, good condition',           want: 'Database System Concepts book' },
  { id: 'sample4', name: 'Farhana S.', subject: 'Cloud Computing',                      semester: 11, type: 'Slides',        have: 'Unit 1–4 lecture slides',                 want: 'AWS practice questions' },
  { id: 'sample5', name: 'Mehedi K.',  subject: 'Advanced Algorithm',                   semester: 11, type: 'Notes',         have: 'DP & Greedy lecture notes',               want: 'Graph algorithm notes' },
  { id: 'sample6', name: 'Sadia A.',   subject: 'Computer Networking (Kurose)',         semester: 8,  type: 'Book',          have: 'PDF + printed copy',                      want: 'Operating System notes' },
];

// ---------- 1.5) Firebase (Phase C): real accounts + online database ----------
// This config is safe to show in public code — Firebase web configs are not secret.
const firebaseConfig = {
  apiKey: "AIzaSyDRVsWcSyC0gPBWQWB0GyQm4A0HOc4v0uM",
  authDomain: "exchora-cbb05.firebaseapp.com",
  projectId: "exchora-cbb05",
  storageBucket: "exchora-cbb05.firebasestorage.app",
  messagingSenderId: "907071470326",
  appId: "1:907071470326:web:445c76f1be171c8a2c0ad7"
};
let FB = false, fbAuth = null, fbDb = null;
try {
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    fbAuth = firebase.auth();
    fbDb = firebase.firestore();
    FB = true;
  }
} catch (e) { FB = false; }   // if the SDK cannot load, the site still works in local mode

// Which colour class each type badge uses (classes live in style.css)
const typeClass = { 'Notes': 'type-notes', 'Book': 'type-book', 'Slides': 'type-slides', 'Question Bank': 'type-qb' };

// Small inline SVG icons (stroke style, colour comes from CSS)
function icon(paths) {
  return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
}
const typeIcon = {
  'Notes':         icon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'),
  'Book':          icon('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'),
  'Slides':        icon('<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>'),
  'Question Bank': icon('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
};
const heartIcon = icon('<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>');
const swapIcon  = icon('<line x1="7" y1="19" x2="7" y2="5"/><polyline points="3 9 7 5 11 9"/><line x1="17" y1="5" x2="17" y2="19"/><polyline points="13 15 17 19 21 15"/>');

// ---------- Language (English / বাংলা) ----------
const STR = {
  en: {
    navBrowse: 'Browse', navPost: 'Post an Exchange', navMy: 'My Exchanges',
    heroTitle: 'Swap notes, books & slides<br>with fellow students',
    heroSub: 'Post what you have, find what you need. EXCHORA connects students who want to trade study materials — no money, just learning.',
    heroBrowse: 'Browse Posts',
    statPosts: 'Active posts', statTypes: 'Material types', statFree: 'Free to swap',
    browseTitle: 'Browse Exchange Posts', searchPh: 'Search by subject, course or keyword…',
    chipAll: 'All', allSem: 'All semesters', semWord: 'Semester',
    sem8: 'Semester 8', sem9: 'Semester 9', sem10: 'Semester 10', sem11: 'Semester 11', sem12: 'Semester 12',
    'type_Notes': 'Notes', 'type_Book': 'Book', 'type_Slides': 'Slides', 'type_Question Bank': 'Question Bank',
    postTitle: 'Post an Exchange',
    fName: 'Your name', fNamePh: 'e.g. Khairun Nessa Mim',
    fSubject: 'Subject / Course', fSubjectPh: 'e.g. Data Mining',
    fSemester: 'Semester', fType: 'Material type',
    fHave: 'What I have', fHavePh: 'e.g. Complete lecture notes of Unit 1–3',
    fWant: 'What I want', fWantPh: 'e.g. Previous year question bank',
    postBtn: 'Post My Exchange', formNote: 'Your post will appear at the top of the list above.',
    myTitle: 'My Exchanges',
    emptyTitle: 'No saved exchanges yet.',
    emptySub: 'Tap <strong>Interested</strong> on any post and it will be saved here.',
    noResults: 'No posts match your search. Try a different keyword or filter.',
    footerTag: '<strong>EXCHORA</strong> — Share Knowledge. Exchange Opportunities.',
    have: 'Have', want: 'Want', interested: 'Interested', saved: 'Saved',
    navMatches: 'Matches', loginBtn: 'Log In', signupBtn: 'Sign Up', logout: 'Logout',
    howTitle: 'How EXCHORA Works',
    howSub: 'Why we built it: every semester, students finish a course with notes, books and slides that just sit unused — while juniors struggle for the same materials. EXCHORA turns that waste into exchange. No money, just knowledge.',
    step1T: 'Create your account', step1D: 'Sign up free with your email — it takes less than a minute. Your profile keeps your posts and saved exchanges in one place.',
    step2T: 'Post HAVE ⇄ WANT', step2D: 'Share what you have — notes, a book, slides, a question bank — and write what you need in return. That pair is one exchange post.',
    step3T: 'Find your match', step3D: 'Search and filter by subject, semester or type — or open Matches, where the engine pairs posts whose HAVE and WANT fit each other.',
    step4T: 'Exchange & learn', step4D: 'Tap Interested on a post to save it, connect with the poster, and swap — meet on campus for books, or share files for PDFs. Knowledge passed on.',
    welcomeBack: 'Welcome back', loginHint: 'Login to see your exchanges',
    email: 'Email', password: 'Password', orText: '— or —', googleBtn: 'Continue with Google',
    noAccount: 'New to EXCHORA?', createAccount: 'Create an account', createAccountBtn: 'Create Account',
    signupTitle: 'Create your account', signupHint: 'Join free and start swapping',
    fullName: 'Full name', university: 'University', department: 'Department', bio: 'Short bio',
    haveAccount: 'Already have an account?',
    authNote: 'Secure accounts powered by Firebase.',
    loginError: 'Wrong email or password. Please try again.',
    emailTaken: 'An account with this email already exists. Please log in.',
    accountCreated: 'Account created — welcome to EXCHORA!',
    loggedIn: 'Logged in. Welcome back!',
    loggedOut: 'Logged out. See you soon!',
    googleSoon: 'Google sign-in activates with Firebase in Phase C.',
    memberSince: 'Member since', editProfile: 'Edit Profile', saveChanges: 'Save Changes',
    loginRequired: 'Please log in first to post an exchange.', postAdded: 'Your post is live!', postError: 'Could not post. Please try again.', signupError: 'Could not create the account. Check the email and use a password of 6+ characters.',
    profileSaved: 'Profile saved.',
    profilePhoto: 'Profile photo', uploadPhoto: 'Upload photo', removePhoto: 'Remove',
    googleDomainError: 'Google sign-in is blocked on this address. Open the site with localhost instead of 127.0.0.1.',
    requestBtn: 'Request Exchange', requestSent: 'Request sent! The poster will see it in their requests.',
    requestError: 'Could not send the request. Please try again.',
    sampleRequest: 'This is a sample post — requests work on posts by real users.',
    needContact: 'Add your WhatsApp number in Edit Profile first — it is shared only after a request is accepted.',
    contactLabel: 'WhatsApp number (shared only after a request is accepted)',
    requestsReceived: 'Requests for your posts', requestsSentTitle: 'Requests you sent',
    noRequests: 'No exchange requests yet.',
    status_pending: 'Pending', status_accepted: 'Accepted', status_rejected: 'Rejected',
    status_completed: 'Completed', status_cancelled: 'Cancelled',
    acceptBtn: 'Accept', rejectBtn: 'Reject', cancelBtn: 'Cancel',
    confirmDoneBtn: 'Confirm exchanged', waitingOther: 'Waiting for the other side to confirm',
    contactOf: 'Contact', wantsYour: 'wants to exchange', youRequested: 'You requested this',
    navAdmin: 'Admin', adminTitle: 'Admin Dashboard', statPostsA: 'Posts', statUsers: 'Users', statRequests: 'Requests',
    adminPosts: 'All posts', adminUsers: 'Registered users', adminDelete: 'Delete',
    rateLabel: 'Rate this exchange', youRated: 'You rated', ratedYou: 'rated you', ratingsWord: 'ratings', ratedToast: 'Thanks for the rating!',
    botTag: 'Your rule-based site guide', botPh: 'Ask StudyBot…', botSend: 'Send',
    botChip1: 'How to post', botChip2: 'How exchanges work', botChip3: 'Is it free?', botChip4: 'Find my matches',
    botHello: 'Hi! I am StudyBot, your EXCHORA guide. Ask me how to post, how exchanges work, or type "find" plus a subject (e.g. "find algorithm") and I will look for posts for you.',
    myPostsStat: 'My Posts', savedStat: 'Saved', exchangesStat: 'Exchanges',
    matchesTitle: 'Your Matches', matchesSub: 'Posts whose HAVE and WANT fit each other — found by the matching engine.',
    noMatches: 'No matches yet. Post what you have and want — matches appear when two posts fit.',
    strongMatch: 'Strong match — both sides fit', partialMatch: 'Partial match — one side fits',
    sharedWords: 'Shared keywords', postedBy: 'Posted by',
  },
  bn: {
    navBrowse: 'ব্রাউজ', navPost: 'পোস্ট করো', navMy: 'আমার এক্সচেঞ্জ',
    heroTitle: 'নোট, বই ও স্লাইড বদলাও<br>সহপাঠীদের সাথে',
    heroSub: 'তোমার কাছে যা আছে পোস্ট করো, যা দরকার খুঁজে নাও। EXCHORA শিক্ষার্থীদের যুক্ত করে যারা পড়ার উপকরণ বদলাতে চায় — কোনো টাকা নয়, শুধু শেখা।',
    heroBrowse: 'পোস্ট দেখো',
    statPosts: 'সক্রিয় পোস্ট', statTypes: 'ধরনের উপকরণ', statFree: 'ফ্রি বদল',
    browseTitle: 'এক্সচেঞ্জ পোস্ট দেখো', searchPh: 'বিষয়, কোর্স বা কীওয়ার্ড দিয়ে খোঁজো…',
    chipAll: 'সব', allSem: 'সব সেমিস্টার', semWord: 'সেমিস্টার',
    sem8: 'সেমিস্টার ৮', sem9: 'সেমিস্টার ৯', sem10: 'সেমিস্টার ১০', sem11: 'সেমিস্টার ১১', sem12: 'সেমিস্টার ১২',
    'type_Notes': 'নোটস', 'type_Book': 'বই', 'type_Slides': 'স্লাইড', 'type_Question Bank': 'প্রশ্ন ব্যাংক',
    postTitle: 'এক্সচেঞ্জ পোস্ট করো',
    fName: 'তোমার নাম', fNamePh: 'যেমন: Khairun Nessa Mim',
    fSubject: 'বিষয় / কোর্স', fSubjectPh: 'যেমন: Data Mining',
    fSemester: 'সেমিস্টার', fType: 'উপকরণের ধরন',
    fHave: 'আমার কাছে যা আছে', fHavePh: 'যেমন: Unit 1–3 এর সম্পূর্ণ লেকচার নোট',
    fWant: 'আমি যা চাই', fWantPh: 'যেমন: আগের বছরের প্রশ্ন ব্যাংক',
    postBtn: 'আমার এক্সচেঞ্জ পোস্ট করো', formNote: 'তোমার পোস্টটি উপরের তালিকার একদম উপরে দেখা যাবে।',
    myTitle: 'আমার এক্সচেঞ্জ',
    emptyTitle: 'এখনো কোনো এক্সচেঞ্জ সেভ করা হয়নি।',
    emptySub: 'যেকোনো পোস্টে <strong>আগ্রহী</strong> চাপ দিলেই এখানে সেভ হয়ে যাবে।',
    noResults: 'তোমার খোঁজের সাথে মিলে এমন কোনো পোস্ট নেই। অন্য কীওয়ার্ড বা ফিল্টার চেষ্টা করো।',
    footerTag: '<strong>EXCHORA</strong> — জ্ঞান শেয়ার করো, সুযোগ বদলাও।',
    have: 'আছে', want: 'চাই', interested: 'আগ্রহী', saved: 'সেভ হয়েছে',
    navMatches: 'ম্যাচ', loginBtn: 'লগ ইন', signupBtn: 'সাইন আপ', logout: 'লগ আউট',
    howTitle: 'EXCHORA কীভাবে কাজ করে',
    howSub: 'কেন বানানো হয়েছে: প্রতি semester-এ students-রা course শেষ করে notes, বই, slides ফেলে রাখে — অথচ juniors-রা ঠিক ওই জিনিসগুলোর জন্যই কষ্ট করে। EXCHORA সেই অপচয়কেই exchange-এ বদলে দেয়। কোনো টাকা না, শুধু জ্ঞান।',
    step1T: 'অ্যাকাউন্ট খোলো', step1D: 'ইমেইল দিয়ে ফ্রি sign up করো — এক মিনিটেরও কম লাগবে। তোমার profile-এ তোমার post আর save করা exchange এক জায়গায় থাকবে।',
    step2T: 'HAVE ⇄ WANT পোস্ট করো', step2D: 'তোমার কাছে যা আছে — notes, বই, slides, question bank — শেয়ার করো, আর বদলে যা দরকার সেটা লেখো। এই জোড়াটাই একটা exchange post।',
    step3T: 'তোমার match খুঁজে নাও', step3D: 'Subject, semester বা type দিয়ে search আর filter করো — অথবা Matches-এ যাও, যেখানে engine নিজে এমন post জোড়া দেয় যাদের HAVE আর WANT একে অপরের সাথে মিলে যায়।',
    step4T: 'Exchange করো, শেখো', step4D: 'Post-এ Interested চাপলে save হবে, poster-এর সাথে যোগাযোগ করে বদলে নাও — বই হলে campus-এ দেখা করে, PDF হলে file শেয়ার করে। জ্ঞান এভাবেই এগিয়ে যায়।',
    welcomeBack: 'আবার স্বাগতম', loginHint: 'তোমার এক্সচেঞ্জগুলো দেখতে লগ ইন করো',
    email: 'ইমেইল', password: 'পাসওয়ার্ড', orText: '— অথবা —', googleBtn: 'Google দিয়ে চালিয়ে যাও',
    noAccount: 'EXCHORA তে নতুন?', createAccount: 'অ্যাকাউন্ট খোলো', createAccountBtn: 'অ্যাকাউন্ট তৈরি করো',
    signupTitle: 'তোমার অ্যাকাউন্ট খোলো', signupHint: 'ফ্রি তে যোগ দাও, বদল শুরু করো',
    fullName: 'পুরো নাম', university: 'বিশ্ববিদ্যালয়', department: 'বিভাগ', bio: 'ছোট পরিচিতি',
    haveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
    authNote: 'Firebase দিয়ে সুরক্ষিত আসল অ্যাকাউন্ট।',
    loginError: 'ইমেইল বা পাসওয়ার্ড ভুল। আবার চেষ্টা করো।',
    emailTaken: 'এই ইমেইলে ইতিমধ্যে অ্যাকাউন্ট আছে। লগ ইন করো।',
    accountCreated: 'অ্যাকাউন্ট তৈরি হয়েছে — EXCHORA তে স্বাগতম!',
    loggedIn: 'লগ ইন হয়েছে। আবার স্বাগতম!',
    loggedOut: 'লগ আউট হয়েছে। আবার দেখা হবে!',
    googleSoon: 'Google সাইন-ইন চালু হবে Phase C তে Firebase দিয়ে।',
    memberSince: 'সদস্য হয়েছো', editProfile: 'প্রোফাইল এডিট', saveChanges: 'সেভ করো',
    loginRequired: 'পোস্ট করতে আগে লগ ইন করো।', postAdded: 'তোমার পোস্ট লাইভ হয়েছে!', postError: 'পোস্ট করা যায়নি। আবার চেষ্টা করো।', signupError: 'অ্যাকাউন্ট তৈরি হয়নি। ইমেইল চেক করো, পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে।',
    profileSaved: 'প্রোফাইল সেভ হয়েছে।',
    profilePhoto: 'প্রোফাইল ছবি', uploadPhoto: 'ছবি আপলোড করো', removePhoto: 'মুছে ফেলো',
    googleDomainError: 'এই address-e Google sign-in block আছে। 127.0.0.1-এর বদলে localhost দিয়ে site খোলো।',
    requestBtn: 'এক্সচেঞ্জ রিকোয়েস্ট', requestSent: 'রিকোয়েস্ট পাঠানো হয়েছে! পোস্টদাতা তার রিকোয়েস্টে দেখতে পাবে।',
    requestError: 'রিকোয়েস্ট পাঠানো যায়নি। আবার চেষ্টা করো।',
    sampleRequest: 'এটা একটা নমুনা পোস্ট — রিকোয়েস্ট কাজ করে আসল ব্যবহারকারীদের পোস্টে।',
    needContact: 'আগে Edit Profile-এ তোমার WhatsApp নম্বর দাও — এটা শেয়ার হয় শুধু রিকোয়েস্ট accept হওয়ার পর।',
    contactLabel: 'WhatsApp নম্বর (শেয়ার হয় শুধু রিকোয়েস্ট accept হওয়ার পর)',
    requestsReceived: 'তোমার পোস্টের রিকোয়েস্ট', requestsSentTitle: 'তোমার পাঠানো রিকোয়েস্ট',
    noRequests: 'এখনো কোনো এক্সচেঞ্জ রিকোয়েস্ট নেই।',
    status_pending: 'অপেক্ষমাণ', status_accepted: 'গৃহীত', status_rejected: 'প্রত্যাখ্যাত',
    status_completed: 'সম্পন্ন', status_cancelled: 'বাতিল',
    acceptBtn: 'Accept করো', rejectBtn: 'Reject করো', cancelBtn: 'বাতিল করো',
    confirmDoneBtn: 'এক্সচেঞ্জ হয়েছে নিশ্চিত করো', waitingOther: 'অপর পক্ষের নিশ্চিতকরণের অপেক্ষায়',
    contactOf: 'যোগাযোগ', wantsYour: 'এক্সচেঞ্জ করতে চায়', youRequested: 'তুমি এটা রিকোয়েস্ট করেছো',
    navAdmin: 'অ্যাডমিন', adminTitle: 'অ্যাডমিন ড্যাশবোর্ড', statPostsA: 'পোস্ট', statUsers: 'ব্যবহারকারী', statRequests: 'রিকোয়েস্ট',
    adminPosts: 'সব পোস্ট', adminUsers: 'নিবন্ধিত ব্যবহারকারী', adminDelete: 'মুছে দাও',
    rateLabel: 'এই এক্সচেঞ্জটা রেট করো', youRated: 'তুমি রেট করেছো', ratedYou: 'তোমাকে রেট করেছে', ratingsWord: 'রেটিং', ratedToast: 'রেটিংয়ের জন্য ধন্যবাদ!',
    botTag: 'তোমার নিয়ম-ভিত্তিক সাইট গাইড', botPh: 'StudyBot-কে জিজ্ঞেস করো…', botSend: 'পাঠাও',
    botChip1: 'পোস্ট কীভাবে দেবো', botChip2: 'এক্সচেঞ্জ কীভাবে কাজ করে', botChip3: 'এটা কি ফ্রি?', botChip4: 'আমার ম্যাচ খুঁজে দাও',
    botHello: 'হাই! আমি StudyBot, তোমার EXCHORA গাইড। আমাকে জিজ্ঞেস করো কীভাবে পোস্ট দিতে হয়, এক্সচেঞ্জ কীভাবে কাজ করে — অথবা "find" লিখে বিষয় লেখো (যেমন "find algorithm"), আমি পোস্ট খুঁজে দেবো।',
    myPostsStat: 'আমার পোস্ট', savedStat: 'সেভ করা', exchangesStat: 'এক্সচেঞ্জ',
    matchesTitle: 'তোমার ম্যাচগুলো', matchesSub: 'যেসব পোস্টের HAVE আর WANT একে অপরের সাথে মিলে যায় — ম্যাচিং ইঞ্জিন খুঁজে বের করে।',
    noMatches: 'এখনো কোনো ম্যাচ নেই। তোমার কাছে যা আছে আর যা চাও পোস্ট করো — দুটি পোস্ট মিললেই ম্যাচ দেখা যাবে।',
    strongMatch: 'শক্তিশালী ম্যাচ — দুই দিকই মিলেছে', partialMatch: 'আংশিক ম্যাচ — এক দিক মিলেছে',
    sharedWords: 'মিলে যাওয়া শব্দ', postedBy: 'পোস্ট করেছেন',
  },
};
let lang = localStorage.getItem('sm_lang') || 'en';
function t(key) { return STR[lang][key] || STR.en[key] || key; }
function num(n) {  // Bengali digits when in Bangla mode
  return lang === 'bn' ? String(n).replace(/\d/g, function (d) { return '০১২৩৪৫৬৭৮৯'[d]; }) : String(n);
}
function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(function (el) { el.innerHTML = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.placeholder = t(el.dataset.i18nPh); });
  document.documentElement.lang = lang;
  document.getElementById('langToggle').textContent = lang === 'bn' ? 'EN' : 'বাংলা';
  applyFilters();
  renderMyExchanges();
  renderRequests();
}


// ---------- 2) Saved posts (Interested), kept in localStorage ----------
let currentUser = null;   // declared early: the first draw already renders request states
let requests = [];        // Phase D: exchange requests involving the signed-in user
let reqUnsubs = [];       // live listeners for those requests (Firebase mode)
let ratings = [];         // Phase E: all ratings (public reputation)
let ratingUnsub = null;
const ADMIN_EMAILS = ['mimpakhi05@gmail.com'];   // declared early: renderAuthArea checks it on the first draw
let savedIds = JSON.parse(localStorage.getItem('se_saved') || '[]').map(function (x) {
  const s = String(x);
  return /^[1-6]$/.test(s) ? 'sample' + s : s;
});

function saveToStorage() {
  localStorage.setItem('se_saved', JSON.stringify(savedIds));
}

// Escape user text before putting it into HTML (stops HTML/script injection)
function esc(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ---------- 3) Build one card element for a post ----------
const postsGrid  = document.getElementById('postsGrid');
const myGrid     = document.getElementById('myGrid');
const statPosts  = document.getElementById('statPosts');
const savedCount = document.getElementById('savedCount');
const myEmpty    = document.getElementById('myEmpty');
const noResults  = document.getElementById('noResults');

function buildCard(post, index) {
  const isSaved = savedIds.includes(post.id);
  const card = document.createElement('article');
  card.className = 'post-card';
  card.dataset.id = post.id;
  card.style.animationDelay = ((index || 0) % 6) * 70 + 'ms';   // stagger effect
  card.innerHTML =
    '<div class="card-top">' +
      '<span class="type-badge ' + typeClass[post.type] + '">' + typeIcon[post.type] + t('type_' + post.type) + '</span>' +
      '<span class="sem-chip">' + t('semWord') + ' ' + num(post.semester) + '</span>' +
    '</div>' +
    '<h3 class="post-subject">' + esc(post.subject) + '</h3>' +
    '<div class="exchange-box">' +
      '<p><span class="ex-label have">' + t('have') + '</span> ' + esc(post.have) + '</p>' +
      '<div class="ex-arrow">' + swapIcon + '</div>' +
      '<p><span class="ex-label want">' + t('want') + '</span> ' + esc(post.want) + '</p>' +
    '</div>' +
    '<div class="card-bottom">' +
      '<span class="posted-by">' + miniAvatar(post) + esc(post.name) + ' · CSE' + ratingBadge(post.owner) + '</span>' +
      '<span class="card-actions">' +
        '<button class="btn-interested' + (isSaved ? ' saved' : '') + '" data-id="' + post.id + '">' +
          heartIcon + (isSaved ? t('saved') : t('interested')) +
        '</button>' +
        requestBtnHTML(post) +
        ((post.owner || null) !== null && post.owner === myUid()
          ? '<button class="btn-remove btn-del-post" type="button" data-del-post="' + post.id + '">' + t('adminDelete') + '</button>' : '') +
      '</span>' +
    '</div>';
  return card;
}

// ---------- 4) Render the browse grid from a given list ----------
function renderPosts(list) {
  postsGrid.innerHTML = '';
  list.forEach(function (post, i) { postsGrid.appendChild(buildCard(post, i)); });
  noResults.hidden = list.length > 0;             // show message only when empty
  statPosts.textContent = posts.length;
}

// ---------- 5) Render My Exchanges from the saved ids ----------
function renderMyExchanges() {
  myGrid.innerHTML = '';
  const mine = posts.filter(function (p) { return savedIds.includes(p.id); });
  mine.forEach(function (post, i) { myGrid.appendChild(buildCard(post, i)); });
  myEmpty.style.display = mine.length ? 'none' : 'block';
  savedCount.textContent = mine.length;
}

// ---------- 6) Search + filters ----------
const searchInput    = document.getElementById('searchInput');
const semesterFilter = document.getElementById('semesterFilter');
let activeType = 'all';

function applyFilters() {
  const q = searchInput.value.trim().toLowerCase();
  const sem = semesterFilter.value;
  const result = posts.filter(function (post) {
    const matchesType = activeType === 'all' || post.type === activeType;
    const matchesSem  = sem === 'all' || String(post.semester) === sem;
    const text = (post.subject + ' ' + post.have + ' ' + post.want + ' ' + post.name).toLowerCase();
    const matchesText = q === '' || text.includes(q);
    return matchesType && matchesSem && matchesText;
  });
  renderPosts(result);
}

searchInput.addEventListener('input', applyFilters);
semesterFilter.addEventListener('change', applyFilters);

const filterChips = document.querySelectorAll('#typeFilters .fchip');
filterChips.forEach(function (chip) {
  chip.addEventListener('click', function () {
    filterChips.forEach(function (c) { c.classList.remove('active'); });
    chip.classList.add('active');
    activeType = chip.dataset.type;
    applyFilters();
  });
});

// ---------- 7) Interested buttons (one listener for both grids) ----------
function toggleSave(id) {
  if (savedIds.includes(id)) {
    savedIds = savedIds.filter(function (x) { return x !== id; });  // remove
  } else {
    savedIds.push(id);                                               // add
  }
  saveToStorage();
  applyFilters();        // redraw browse grid (button label changes)
  renderMyExchanges();   // redraw My Exchanges
  if (!detailModal.hidden) openDetails(id);   // keep the modal in sync
}

document.addEventListener('click', function (event) {
  const btn = event.target.closest('.btn-interested');
  if (btn) { toggleSave(btn.dataset.id); return; }
  const reqBtn = event.target.closest('.btn-request');
  if (reqBtn) { sendRequest(reqBtn.dataset.req); return; }
  const actBtn = event.target.closest('[data-act]');
  if (actBtn) { requestAction(actBtn.dataset.act, actBtn.dataset.id); return; }
  const rateBtn = event.target.closest('[data-rate]');
  if (rateBtn) { rateUser(rateBtn.dataset.id, Number(rateBtn.dataset.rate)); return; }
  const botPost = event.target.closest('[data-bot-post]');
  if (botPost) { openDetails(botPost.dataset.botPost); return; }
  const botQ = event.target.closest('#botMsgs [data-bot-q]');
  if (botQ) { botAsk(botQ.dataset.botQ); return; }
  const admDel = event.target.closest('[data-admin-del]');
  if (admDel) { adminDeletePost(admDel.dataset.adminDel); return; }
  const delPost = event.target.closest('[data-del-post]');
  if (delPost) deleteOwnPost(delPost.dataset.delPost);
});

// ---------- 8) The form: submitting adds a new post ----------
const postForm = document.getElementById('postForm');

postForm.addEventListener('submit', function (event) {
  event.preventDefault();                         // stop the page reloading

  if (FB) {                                       // live mode: save to the online database
    if (!currentUser) { showToast(t('loginRequired')); showAuth('login'); return; }
    fbDb.collection('posts').add({
      name: currentUser.name,
      subject: document.getElementById('fSubject').value.trim(),
      semester: Number(document.getElementById('fSemester').value),
      type: document.getElementById('fType').value,
      have: document.getElementById('fHave').value.trim(),
      want: document.getElementById('fWant').value.trim(),
      owner: currentUser.uid,
      photo: currentUser.photo || '',
      ts: Date.now(),
    }).then(function () {
      postForm.reset();
      showToast(t('postAdded'));
      document.getElementById('browse').scrollIntoView({ behavior: 'smooth' });
    }).catch(function () { showToast(t('postError')); });
    return;
  }

  const newPost = {
    id: 'p' + Date.now(),                         // unique id from the clock
    name:     document.getElementById('fName').value.trim(),
    subject:  document.getElementById('fSubject').value.trim(),
    semester: document.getElementById('fSemester').value,
    type:     document.getElementById('fType').value,
    have:     document.getElementById('fHave').value.trim(),
    owner:    currentUser ? currentUser.email : null,
    photo:    currentUser ? (currentUser.photo || '') : '',
    want:     document.getElementById('fWant').value.trim(),
  };

  posts.unshift(newPost);                         // add to the TOP of the array
  applyFilters();                                 // redraw the grid
  postForm.reset();                               // clear the form fields
  document.getElementById('browse').scrollIntoView({ behavior: 'smooth' });
});

// ---------- First draw ----------
applyLang();

// ---------- 9) Effects: header shadow, back-to-top, scroll reveal ----------
const header = document.querySelector('.site-header');
const backTop = document.getElementById('backTop');

window.addEventListener('scroll', function () {
  header.classList.toggle('scrolled', window.scrollY > 10);
  backTop.classList.toggle('show', window.scrollY > 600);
});
document.getElementById('themeToggle').addEventListener('click', function () {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('sm_theme', next);
});
document.getElementById('langToggle').addEventListener('click', function () {
  lang = lang === 'en' ? 'bn' : 'en';
  localStorage.setItem('sm_lang', lang);
  applyLang();
});
backTop.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

// ---------- 10) Toast ----------
const toast = document.getElementById('toast');
let toastTimer = null;
function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.hidden = true; }, 3200);
}

// ---------- 11) Views (single-page routing) ----------
const viewIds = ['view-home', 'view-auth', 'view-profile', 'view-matches', 'view-admin'];
function showView(name) {
  viewIds.forEach(function (id) {
    document.getElementById(id).hidden = id !== 'view-' + name;
  });
  window.scrollTo({ top: 0 });
  if (name === 'profile') renderProfile();
  if (name === 'matches') renderMatches();
  if (name === 'admin') renderAdmin();
}
document.querySelectorAll('.main-nav a[href^="#"], .logo').forEach(function (link) {
  link.addEventListener('click', function () { showView('home'); });
});
document.getElementById('navMatches').addEventListener('click', function (event) {
  event.preventDefault();
  showView('matches');
});
document.getElementById('navAdmin').addEventListener('click', function (event) {
  event.preventDefault();
  if (isAdmin()) showView('admin');
});

// ---------- 12) Demo accounts (front-end only — Firebase replaces this in Phase C) ----------
// NOTE: passwords are never stored in plain text here, but this local demo
// is NOT real security. Phase C moves accounts to Firebase Authentication.
function hashPw(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  return 'h' + h.toString(16);
}
function loadUsers() { return JSON.parse(localStorage.getItem('ex_users') || '[]'); }
function saveUsers(users) { localStorage.setItem('ex_users', JSON.stringify(users)); }
const sessionEmail = localStorage.getItem('ex_session');
if (!FB && sessionEmail) currentUser = loadUsers().find(function (u) { return u.email === sessionEmail; }) || null;
subscribeRequests();

const authActions = document.getElementById('authActions');
const userActions = document.getElementById('userActions');
function initials(name) {
  return name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase();
}
function setAvatar(el, name, photo) {
  if (!el) return;
  if (photo) el.innerHTML = '<img src="' + esc(photo) + '" alt="">';
  else el.textContent = initials(name || '?');
}
function miniAvatar(post) {
  return '<span class="mini-avatar">' + (post.photo ? '<img src="' + esc(post.photo) + '" alt="">' : esc(initials(post.name || '?'))) + '</span>';
}
function renderAuthArea() {
  const loggedIn = !!currentUser;
  authActions.hidden = loggedIn;
  userActions.hidden = !loggedIn;
  if (loggedIn) {
    setAvatar(document.getElementById('userAvatar'), currentUser.name, currentUser.photo);
    document.getElementById('userNameShort').textContent = currentUser.name.split(' ')[0];
    const nameField = document.getElementById('fName');
    if (nameField && !nameField.value) nameField.value = currentUser.name;
  }
  document.getElementById('navAdmin').hidden = !isAdmin();
  applyFilters();      // card buttons (Request / own post) depend on who is signed in
  renderRequests();
}
function setSession(user) {
  currentUser = user;
  if (user) localStorage.setItem('ex_session', user.email);
  else localStorage.removeItem('ex_session');
  renderAuthArea();
  subscribeRequests();
}

const loginCard = document.getElementById('loginCard');
const signupCard = document.getElementById('signupCard');
function showAuth(which) {
  loginCard.hidden = which !== 'login';
  signupCard.hidden = which !== 'signup';
  showView('auth');
}
document.getElementById('btnShowLogin').addEventListener('click', function () { showAuth('login'); });
document.getElementById('btnShowSignup').addEventListener('click', function () { showAuth('signup'); });
document.getElementById('linkToSignup').addEventListener('click', function (e) { e.preventDefault(); showAuth('signup'); });
document.getElementById('linkToLogin').addEventListener('click', function (e) { e.preventDefault(); showAuth('login'); });
document.getElementById('btnGoogle').addEventListener('click', function () {
  if (!FB) { showToast(t('googleSoon')); return; }
  fbAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(function (e) {
    if (e && e.code === 'auth/unauthorized-domain') showToast(t('googleDomainError'));
    else showToast(t('loginError'));
  });
});
document.getElementById('btnLogout').addEventListener('click', function () {
  if (FB) { fbAuth.signOut(); showToast(t('loggedOut')); showView('home'); return; }
  setSession(null);
  showView('home');
  showToast(t('loggedOut'));
});
document.getElementById('btnProfile').addEventListener('click', function () { showView('profile'); });

document.getElementById('signupForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const email = document.getElementById('suEmail').value.trim().toLowerCase();
  if (FB) {
    const err = document.getElementById('signupError');
    fbAuth.createUserWithEmailAndPassword(email, document.getElementById('suPass').value)
      .then(function (cred) {
        return fbDb.collection('users').doc(cred.user.uid).set({
          name: document.getElementById('suName').value.trim(),
          university: document.getElementById('suUni').value.trim(),
          department: document.getElementById('suDept').value.trim(),
          semester: document.getElementById('suSem').value,
          bio: '', contact: '', since: new Date().getFullYear(),
        });
      })
      .then(function () { err.hidden = true; showToast(t('accountCreated')); showView('profile'); })
      .catch(function (e) {
        err.textContent = e && e.code === 'auth/email-already-in-use' ? t('emailTaken') : t('signupError');
        err.hidden = false;
      });
    return;
  }
  const users = loadUsers();
  const err = document.getElementById('signupError');
  if (users.some(function (u) { return u.email === email; })) {
    err.textContent = t('emailTaken');
    err.hidden = false;
    return;
  }
  err.hidden = true;
  const user = {
    name: document.getElementById('suName').value.trim(),
    email: email,
    pass: hashPw(document.getElementById('suPass').value),
    university: document.getElementById('suUni').value.trim(),
    department: document.getElementById('suDept').value.trim(),
    semester: document.getElementById('suSem').value,
    bio: '',
    contact: '',
    since: new Date().getFullYear(),
  };
  users.push(user);
  saveUsers(users);
  setSession(user);
  showToast(t('accountCreated'));
  showView('profile');
});

document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const email = document.getElementById('liEmail').value.trim().toLowerCase();
  if (FB) {
    const err = document.getElementById('loginError');
    fbAuth.signInWithEmailAndPassword(email, document.getElementById('liPass').value)
      .then(function () { err.hidden = true; showToast(t('loggedIn')); showView('home'); })
      .catch(function () { err.textContent = t('loginError'); err.hidden = false; });
    return;
  }
  const user = loadUsers().find(function (u) { return u.email === email; });
  const err = document.getElementById('loginError');
  if (!user || user.pass !== hashPw(document.getElementById('liPass').value)) {
    err.textContent = t('loginError');
    err.hidden = false;
    return;
  }
  err.hidden = true;
  setSession(user);
  showToast(t('loggedIn'));
  showView('home');
});

// ---------- 13) Profile ----------
function renderProfile() {
  if (!currentUser) { showAuth('login'); return; }
  setAvatar(document.getElementById('pfAvatar'), currentUser.name, currentUser.photo);
  document.getElementById('pfName').textContent = currentUser.name;
  document.getElementById('pfMeta').textContent = currentUser.university + ' · ' + currentUser.department;
  document.getElementById('pfSemChip').textContent = t('semWord') + ' ' + num(currentUser.semester);
  document.getElementById('pfSinceChip').textContent = t('memberSince') + ' ' + num(currentUser.since);
  document.getElementById('pfPosts').textContent = num(posts.filter(function (p) { return p.owner === (currentUser.uid || currentUser.email); }).length);
  document.getElementById('pfSaved').textContent = num(savedIds.length);
  document.getElementById('pfExch').textContent = num(requests.filter(function (r) { return r.status === 'completed' && (r.fromUid === myUid() || r.toUid === myUid()); }).length);
  document.getElementById('pfBio').textContent = currentUser.bio || '';
  const myRatings = ratings.filter(function (r) { return r.toUid === myUid(); });
  const chip = document.getElementById('pfRatingChip');
  if (myRatings.length) {
    const avg = myRatings.reduce(function (s, r) { return s + r.stars; }, 0) / myRatings.length;
    chip.textContent = '★ ' + avg.toFixed(1) + ' · ' + num(myRatings.length) + ' ' + t('ratingsWord');
    chip.hidden = false;
  } else chip.hidden = true;
}
document.getElementById('btnEditProfile').addEventListener('click', function () {
  const form = document.getElementById('editProfileForm');
  form.hidden = !form.hidden;
  if (!form.hidden && currentUser) {
    document.getElementById('epName').value = currentUser.name;
    document.getElementById('epUni').value = currentUser.university;
    document.getElementById('epDept').value = currentUser.department;
    document.getElementById('epSem').value = currentUser.semester;
    document.getElementById('epBio').value = currentUser.bio || '';
    document.getElementById('epContact').value = currentUser.contact || '';
    pendingPhoto = null;
    updatePhotoPreview();
  }
});

// Profile photo: picked in the edit form, shrunk in the browser, saved with the profile.
let pendingPhoto = null;   // null = unchanged, '' = remove, data URL = new photo
function updatePhotoPreview() {
  const photo = pendingPhoto !== null ? pendingPhoto : (currentUser ? currentUser.photo : '');
  setAvatar(document.getElementById('epPhotoPreview'), currentUser ? currentUser.name : '?', photo);
}
document.getElementById('epPhotoInput').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    const img = new Image();
    img.onload = function () {
      const size = 192;
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      const side = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      pendingPhoto = canvas.toDataURL('image/jpeg', 0.78);
      updatePhotoPreview();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});
document.getElementById('epPhotoRemove').addEventListener('click', function () {
  pendingPhoto = '';
  document.getElementById('epPhotoInput').value = '';
  updatePhotoPreview();
});
document.getElementById('editProfileForm').addEventListener('submit', function (event) {
  event.preventDefault();
  if (FB && currentUser) {
    const updates = {
      name: document.getElementById('epName').value.trim(),
      university: document.getElementById('epUni').value.trim(),
      department: document.getElementById('epDept').value.trim(),
      semester: document.getElementById('epSem').value,
      bio: document.getElementById('epBio').value.trim(),
      contact: document.getElementById('epContact').value.trim(),
    };
    if (pendingPhoto !== null) updates.photo = pendingPhoto;
    fbDb.collection('users').doc(currentUser.uid).update(updates).then(function () {
      Object.assign(currentUser, updates);
      renderAuthArea(); renderProfile();
      document.getElementById('editProfileForm').hidden = true;
      showToast(t('profileSaved'));
    });
    return;
  }
  const users = loadUsers();
  const idx = users.findIndex(function (u) { return u.email === currentUser.email; });
  if (idx === -1) return;
  users[idx].name = document.getElementById('epName').value.trim();
  users[idx].university = document.getElementById('epUni').value.trim();
  users[idx].department = document.getElementById('epDept').value.trim();
  users[idx].semester = document.getElementById('epSem').value;
  users[idx].bio = document.getElementById('epBio').value.trim();
  users[idx].contact = document.getElementById('epContact').value.trim();
  if (pendingPhoto !== null) users[idx].photo = pendingPhoto;
  saveUsers(users);
  currentUser = users[idx];
  renderAuthArea();
  renderProfile();
  document.getElementById('editProfileForm').hidden = true;
  showToast(t('profileSaved'));
});

// ---------- 14) Smart HAVE/WANT matching (rule-based, transparent) ----------
const STOPWORDS = { the: 1, and: 1, for: 1, with: 1, from: 1, of: 1, a: 1, an: 1, years: 1, year: 1, previous: 1 };
function tokens(text) {
  return String(text).toLowerCase().split(/[^a-z0-9+#]+/)
    .filter(function (w) { return w.length >= 3 && !STOPWORDS[w]; })
    .map(function (w) { return w.length > 3 ? w.replace(/s$/, '') : w; });   // stem, but keep short words like CSS intact
}
function overlap(a, b) {
  const setB = new Set(b);
  return [...new Set(a)].filter(function (w) { return setB.has(w); });
}
const GENERIC = { note: 1, book: 1, slide: 1, question: 1, bank: 1, lecture: 1, material: 1 };
function meaningful(words) { return words.filter(function (w) { return !GENERIC[w]; }); }
function findMatches() {
  const results = [];
  for (let i = 0; i < posts.length; i++) {
    for (let j = i + 1; j < posts.length; j++) {
      const A = posts[i], B = posts[j];
      if (A.owner && B.owner && A.owner === B.owner) continue;   // never match own posts
      const aWantHits = meaningful(overlap(tokens(A.want), tokens(B.have + ' ' + B.subject)));
      const bWantHits = meaningful(overlap(tokens(B.want), tokens(A.have + ' ' + A.subject)));
      const score = aWantHits.length + bWantHits.length;
      if (score === 0) continue;   // generic words alone (notes/book) never make a match
      results.push({
        A: A, B: B, score: score,
        strong: aWantHits.length > 0 && bWantHits.length > 0,
        words: [...new Set([...aWantHits, ...bWantHits])],
      });
    }
  }
  return results.sort(function (x, y) { return y.score - x.score; });
}
function matchSide(post) {
  return '<div class="match-side"><span class="who">' + esc(post.name) + '</span>' +
    '<h4>' + esc(post.subject) + '</h4>' +
    '<p><strong>' + t('have') + ':</strong> ' + esc(post.have) + '</p>' +
    '<p><strong>' + t('want') + ':</strong> ' + esc(post.want) + '</p></div>';
}
function renderMatches() {
  const list = document.getElementById('matchList');
  const matches = findMatches();
  list.innerHTML = '';
  matches.forEach(function (m, i) {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.style.animationDelay = (i % 6) * 70 + 'ms';
    card.innerHTML = matchSide(m.A) +
      '<div class="match-swap">' + swapIcon + '</div>' + matchSide(m.B) +
      '<div class="match-badge ' + (m.strong ? 'strong' : 'partial') + '">' +
        (m.strong ? '✓ ' + t('strongMatch') : '◐ ' + t('partialMatch')) +
        ' · ' + t('sharedWords') + ': ' + esc(m.words.join(', ')) +
      '</div>';
    list.appendChild(card);
  });
  document.getElementById('noMatches').hidden = matches.length > 0;
}

// ---------- 15) Resource details modal ----------
const detailModal = document.getElementById('detailModal');
function openDetails(id) {
  const post = posts.find(function (p) { return p.id === id; });
  if (!post) return;
  const isSaved = savedIds.includes(post.id);
  document.getElementById('modalBody').innerHTML =
    '<span class="type-badge ' + typeClass[post.type] + '">' + typeIcon[post.type] + t('type_' + post.type) + '</span>' +
    ' <span class="sem-chip">' + t('semWord') + ' ' + num(post.semester) + '</span>' +
    '<h3 class="post-subject">' + esc(post.subject) + '</h3>' +
    '<div class="exchange-box">' +
      '<p><span class="ex-label have">' + t('have') + '</span> ' + esc(post.have) + '</p>' +
      '<div class="ex-arrow">' + swapIcon + '</div>' +
      '<p><span class="ex-label want">' + t('want') + '</span> ' + esc(post.want) + '</p>' +
    '</div>' +
    '<p class="posted-by" style="margin-top:14px">' + miniAvatar(post) + t('postedBy') + ': <strong>' + esc(post.name) + '</strong> · CSE</p>' +
    '<div class="modal-actions">' +
      '<button class="btn-interested' + (isSaved ? ' saved' : '') + '" data-id="' + post.id + '">' +
        heartIcon + (isSaved ? t('saved') : t('interested')) + '</button>' +
      requestBtnHTML(post) +
    '</div>';
  detailModal.hidden = false;
}
function closeDetails() { detailModal.hidden = true; }
document.getElementById('modalClose').addEventListener('click', closeDetails);
detailModal.addEventListener('click', function (event) { if (event.target === detailModal) closeDetails(); });
document.addEventListener('keydown', function (event) { if (event.key === 'Escape') closeDetails(); });
document.addEventListener('click', function (event) {
  if (event.target.closest('.btn-interested')) return;      // save button has its own handler
  if (event.target.closest('.btn-request')) return;         // request button has its own handler
  if (event.target.closest('.btn-del-post')) return;        // delete button has its own handler
  const card = event.target.closest('.post-card');
  if (card && card.dataset.id) openDetails(card.dataset.id);
});

// Restore the header for a returning logged-in user
renderAuthArea();

// ---------- 17) Exchange Requests (Phase D) ----------
// Flow: Request -> poster Accepts/Rejects -> contact numbers appear for both
// sides only after Accept -> both sides Confirm -> Completed.
function myUid() { return currentUser ? (currentUser.uid || currentUser.email) : null; }
function loadLocalRequests() { return JSON.parse(localStorage.getItem('ex_requests') || '[]'); }
function saveLocalRequests(list) { localStorage.setItem('ex_requests', JSON.stringify(list)); }
function myRequestFor(postId) {
  return requests.find(function (r) { return r.postId === postId && r.fromUid === myUid() && r.status !== 'cancelled' && r.status !== 'rejected'; });
}
function requestBtnHTML(post) {
  if ((post.owner || null) !== null && (post.owner || null) === myUid()) return '';   // own post
  const r = myRequestFor(post.id);
  if (r) return '<span class="req-status st-' + r.status + '">' + t('status_' + r.status) + '</span>';
  return '<button class="btn-request" type="button" data-req="' + post.id + '">' + t('requestBtn') + '</button>';
}
function subscribeRequests() {
  reqUnsubs.forEach(function (u) { u(); });
  reqUnsubs = [];
  if (!FB) { requests = loadLocalRequests(); renderRequests(); subscribeRatings(); return; }
  if (!currentUser) { requests = []; renderRequests(); subscribeRatings(); return; }
  const uid = currentUser.uid;
  let recv = [], sent = [];
  function merge() {
    requests = recv.concat(sent).sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
    renderRequests();
    applyFilters();
    if (currentUser && !document.getElementById('view-profile').hidden) renderProfile();
  }
  reqUnsubs.push(fbDb.collection('requests').where('toUid', '==', uid)
    .onSnapshot(function (s) { recv = s.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); }); merge(); }, function () {}));
  reqUnsubs.push(fbDb.collection('requests').where('fromUid', '==', uid)
    .onSnapshot(function (s) { sent = s.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); }); merge(); }, function () {}));
  subscribeRatings();
}
function sendRequest(postId) {
  const post = posts.find(function (p) { return p.id === postId; });
  if (!post) return;
  if (!currentUser) { showToast(t('loginRequired')); showAuth('login'); return; }
  if (!post.owner) { showToast(t('sampleRequest')); return; }
  if (post.owner === myUid()) return;
  if (myRequestFor(postId)) return;
  if (!currentUser.contact) { showToast(t('needContact')); showView('profile'); return; }
  const req = {
    postId: post.id, postSubject: post.subject, postHave: post.have, postWant: post.want,
    fromUid: myUid(), fromName: currentUser.name, fromPhoto: currentUser.photo || '', fromContact: currentUser.contact,
    toUid: post.owner, toName: post.name, toPhoto: post.photo || '', toContact: '',
    status: 'pending', fromDone: false, toDone: false, ts: Date.now(),
  };
  if (FB) {
    fbDb.collection('requests').add(req)
      .then(function () { showToast(t('requestSent')); })
      .catch(function () { showToast(t('requestError')); });
    return;
  }
  req.id = 'r' + Date.now();
  const all = loadLocalRequests();
  all.unshift(req);
  saveLocalRequests(all);
  requests = all;
  renderRequests();
  applyFilters();
  if (!detailModal.hidden) openDetails(postId);
  showToast(t('requestSent'));
}
function updateRequest(id, updates) {
  if (FB) {
    fbDb.collection('requests').doc(id).update(updates).catch(function () { showToast(t('requestError')); });
    return;
  }
  const all = loadLocalRequests();
  const r = all.find(function (x) { return x.id === id; });
  if (!r) return;
  Object.assign(r, updates);
  if (r.fromDone && r.toDone && r.status === 'accepted') r.status = 'completed';
  saveLocalRequests(all);
  requests = all;
  renderRequests();
  applyFilters();
}
function requestAction(act, id) {
  const r = requests.find(function (x) { return x.id === id; });
  if (!r || !currentUser) return;
  if (act === 'accept') {
    if (!currentUser.contact) { showToast(t('needContact')); showView('profile'); return; }
    updateRequest(id, { status: 'accepted', toContact: currentUser.contact });
  } else if (act === 'reject') {
    updateRequest(id, { status: 'rejected' });
  } else if (act === 'cancel') {
    updateRequest(id, { status: 'cancelled' });
  } else if (act === 'done') {
    const updates = {};
    if (r.fromUid === myUid()) updates.fromDone = true;
    if (r.toUid === myUid()) updates.toDone = true;
    if (FB && ((updates.fromDone && r.toDone) || (updates.toDone && r.fromDone))) updates.status = 'completed';
    updateRequest(id, updates);
  }
}
function reqItemHTML(r, mine) {
  const otherName = mine ? r.toName : r.fromName;
  const otherPhoto = mine ? r.toPhoto : r.fromPhoto;
  const otherContact = mine ? r.toContact : r.fromContact;
  const myDone = mine ? r.fromDone : r.toDone;
  let actions = '';
  if (!mine && r.status === 'pending') {
    actions = '<button class="btn btn-small btn-primary" type="button" data-act="accept" data-id="' + r.id + '">' + t('acceptBtn') + '</button>' +
              '<button class="btn btn-small btn-remove" type="button" data-act="reject" data-id="' + r.id + '">' + t('rejectBtn') + '</button>';
  } else if (mine && r.status === 'pending') {
    actions = '<button class="btn btn-small btn-remove" type="button" data-act="cancel" data-id="' + r.id + '">' + t('cancelBtn') + '</button>';
  } else if (r.status === 'accepted') {
    actions = myDone
      ? '<span class="req-wait">' + t('waitingOther') + '</span>'
      : '<button class="btn btn-small btn-gold" type="button" data-act="done" data-id="' + r.id + '">' + t('confirmDoneBtn') + '</button>';
  }
  const contactLine = (r.status === 'accepted' || r.status === 'completed') && otherContact
    ? '<p class="req-contact">' + t('contactOf') + ': <strong>' + esc(otherContact) + '</strong></p>' : '';
  let ratingLine = '';
  if (r.status === 'completed') {
    const me = myUid();
    const mine = ratings.find(function (x) { return x.requestId === r.id && x.fromUid === me; });
    const theirs = ratings.find(function (x) { return x.requestId === r.id && x.toUid === me; });
    if (mine) ratingLine += '<p class="req-rate">' + t('youRated') + ': ' + starsText(mine.stars) + '</p>';
    else ratingLine += '<p class="req-rate">' + t('rateLabel') + ': <span class="rate-btns">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" class="rate-btn" data-rate="' + n + '" data-id="' + r.id + '">★</button>'; }).join('') + '</span></p>';
    if (theirs) ratingLine += '<p class="req-rate">' + esc(otherName) + ' ' + t('ratedYou') + ': ' + starsText(theirs.stars) + '</p>';
  }
  return '<div class="req-item">' +
    '<div class="req-head"><span class="mini-avatar">' + (otherPhoto ? '<img src="' + esc(otherPhoto) + '" alt="">' : esc(initials(otherName || '?'))) + '</span>' +
    '<strong>' + esc(otherName) + '</strong> · ' + esc(r.postSubject) +
    '<span class="req-status st-' + r.status + '">' + t('status_' + r.status) + '</span></div>' +
    '<p class="req-detail"><span class="ex-label have">' + t('have') + '</span> ' + esc(r.postHave) + ' &nbsp;⇄&nbsp; <span class="ex-label want">' + t('want') + '</span> ' + esc(r.postWant) + '</p>' +
    contactLine +
    ratingLine +
    (actions ? '<div class="req-actions">' + actions + '</div>' : '') +
  '</div>';
}
function renderRequests() {
  const block = document.getElementById('requestsBlock');
  if (!block) return;
  const me = myUid();
  block.hidden = !currentUser;
  if (!currentUser) return;
  const received = requests.filter(function (r) { return r.toUid === me; });
  const sent = requests.filter(function (r) { return r.fromUid === me; });
  document.getElementById('receivedList').innerHTML = received.map(function (r) { return reqItemHTML(r, false); }).join('');
  document.getElementById('sentList').innerHTML = sent.map(function (r) { return reqItemHTML(r, true); }).join('');
  document.getElementById('noRequests').hidden = (received.length + sent.length) > 0;
  document.getElementById('receivedTitle').hidden = received.length === 0;
  document.getElementById('sentTitle').hidden = sent.length === 0;
}

function deleteOwnPost(id) {
  const post = posts.find(function (p) { return p.id === id; });
  if (!post || (post.owner || null) === null || post.owner !== myUid()) return;
  const ok = window.confirm(lang === 'bn' ? 'তুমি কি নিশ্চিত এই পোস্টটা মুছে ফেলতে চাও?' : 'Delete this post? This cannot be undone.');
  if (!ok) return;
  if (FB) {
    fbDb.collection('posts').doc(id).delete().catch(function () { showToast(t('requestError')); });
    return;
  }
  posts = posts.filter(function (p) { return p.id !== id; });
  applyFilters();
  renderMyExchanges();
}

// ---------- 18) Ratings & reputation (Phase E) ----------
function loadLocalRatings() { return JSON.parse(localStorage.getItem('ex_ratings') || '[]'); }
function starsText(n) { return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n); }
function ratingBadge(ownerUid) {
  if (!ownerUid) return '';
  const list = ratings.filter(function (r) { return r.toUid === ownerUid; });
  if (!list.length) return '';
  const avg = list.reduce(function (s, r) { return s + r.stars; }, 0) / list.length;
  return ' · <span class="rate-badge">★ ' + avg.toFixed(1) + ' (' + list.length + ')</span>';
}
function subscribeRatings() {
  if (ratingUnsub) { ratingUnsub(); ratingUnsub = null; }
  if (!FB) { ratings = loadLocalRatings(); applyFilters(); return; }
  ratingUnsub = fbDb.collection('ratings').onSnapshot(function (s) {
    ratings = s.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
    applyFilters();
    renderRequests();
    if (currentUser && !document.getElementById('view-profile').hidden) renderProfile();
  }, function () {});
}
function rateUser(requestId, stars) {
  const r = requests.find(function (x) { return x.id === requestId; });
  if (!r || !currentUser || r.status !== 'completed') return;
  const me = myUid();
  const other = r.fromUid === me ? r.toUid : r.fromUid;
  const entry = { requestId: requestId, fromUid: me, toUid: other, stars: stars, ts: Date.now() };
  if (FB) {
    fbDb.collection('ratings').add(entry).then(function () { showToast(t('ratedToast')); })
      .catch(function () { showToast(t('requestError')); });
    return;
  }
  const all = loadLocalRatings();
  all.push(Object.assign({ id: 'rt' + Date.now() }, entry));
  localStorage.setItem('ex_ratings', JSON.stringify(all));
  ratings = all;
  renderRequests();
  applyFilters();
  showToast(t('ratedToast'));
}

// ---------- 19) Admin dashboard (Phase E) ----------
// The dashboard link appears only for the site owner's account; post deletion
// is also enforced by the Firestore security rules (admin email clause).
function isAdmin() { return !!currentUser && ADMIN_EMAILS.indexOf((currentUser.email || '').toLowerCase()) !== -1; }
function renderAdmin() {
  if (!isAdmin()) return;
  document.getElementById('adPosts').textContent = num(posts.length);
  document.getElementById('adRequests').textContent = num(FB ? requests.length : loadLocalRequests().length);
  document.getElementById('adminPostList').innerHTML = posts.map(function (p) {
    return '<div class="req-item"><div class="req-head"><strong>' + esc(p.subject) + '</strong> · ' + esc(p.name) +
      '<span class="req-actions"><button class="btn btn-small btn-remove" type="button" data-admin-del="' + p.id + '">' + t('adminDelete') + '</button></span></div>' +
      '<p class="req-detail"><span class="ex-label have">' + t('have') + '</span> ' + esc(p.have) + ' &nbsp;⇄&nbsp; <span class="ex-label want">' + t('want') + '</span> ' + esc(p.want) + '</p></div>';
  }).join('');
  const userListEl = document.getElementById('adminUserList');
  function drawUsers(list) {
    document.getElementById('adUsers').textContent = num(list.length);
    userListEl.innerHTML = list.map(function (u) {
      return '<div class="req-item"><div class="req-head"><span class="mini-avatar">' + (u.photo ? '<img src="' + esc(u.photo) + '" alt="">' : esc(initials(u.name || '?'))) + '</span><strong>' + esc(u.name || '') + '</strong> · ' + esc(u.department || '') + ' · ' + t('semWord') + ' ' + num(u.semester || '') + '</div></div>';
    }).join('');
  }
  if (FB) {
    fbDb.collection('users').get().then(function (s) { drawUsers(s.docs.map(function (d) { return d.data(); })); }).catch(function () {});
  } else {
    drawUsers(loadUsers());
  }
}
function adminDeletePost(id) {
  if (!isAdmin()) return;
  if (FB) {
    fbDb.collection('posts').doc(id).delete().then(function () { showToast(t('adminDelete') + ' ✓'); }).catch(function () { showToast(t('requestError')); });
    return;
  }
  posts = posts.filter(function (p) { return p.id !== id; });
  applyFilters();
  renderAdmin();
}

// ---------- 20) StudyBot (Phase E): a rule-based guide — honest, not real AI ----------
const botPanel = document.getElementById('botPanel');
const botMsgs = document.getElementById('botMsgs');
let botGreeted = false;
function botAdd(html, who) {
  const div = document.createElement('div');
  div.className = 'bot-msg ' + who;
  div.innerHTML = html;
  botMsgs.appendChild(div);
  botMsgs.scrollTop = botMsgs.scrollHeight;
}
function botText(en, bn) { return lang === 'bn' ? bn : en; }
document.getElementById('botBtn').addEventListener('click', function () {
  botPanel.hidden = !botPanel.hidden;
  if (!botPanel.hidden && !botGreeted) { botGreeted = true; botAdd(esc(t('botHello')), 'bot'); }
  if (!botPanel.hidden) document.getElementById('botInput').focus();
});
document.getElementById('botClose').addEventListener('click', function () { botPanel.hidden = true; });
document.querySelectorAll('[data-bot-q]').forEach(function (chip) {
  chip.addEventListener('click', function () { botAsk(chip.dataset.botQ); });
});
document.getElementById('botForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const input = document.getElementById('botInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  botAsk(text);
});
function botAsk(text) {
  botAdd(esc(text), 'me');
  setTimeout(function () { botAdd(botReply(text.toLowerCase()), 'bot'); }, 250);
}
// ---------- 20b) StudyBot knowledge base — trained with scored topic matching ----------
// Normalises a question (or a key) so English, Bangla and Banglish spellings meet:
// lowercases, drops punctuation, folds common Banglish variants and plural endings.
function botNorm(s) {
  let x = s.toLowerCase().replace(/[^\p{L}\p{N}\s]+/gu, ' ').replace(/\s+/g, ' ').trim();
  const phraseFolds = [['ki vabe', 'kivabe'], ['ki kore', 'kivabe'], ['kemon kore', 'kivabe'], ['sing up', 'sign up'], ['log in', 'login'], ['log out', 'logout']];
  phraseFolds.forEach(function (f) { x = x.split(f[0]).join(f[1]); });
  const wordFolds = { kibhabe: 'kivabe', kemne: 'kivabe', vule: 'bhule', exchnage: 'exchange', exchage: 'exchange', reqest: 'request', rqst: 'request', pasword: 'password', passward: 'password', acount: 'account', profle: 'profile', lagin: 'login', ase: 'ache', dhonnobad: 'thank', shukria: 'thank', thanku: 'thank', hye: 'hoye' };
  const toks = x.split(' ').map(function (w) {
    if (wordFolds[w]) w = wordFolds[w];
    if (w.length > 3 && w.charAt(w.length - 1) === 's' && w.charAt(w.length - 2) !== 's') w = w.slice(0, -1);
    return w;
  });
  return ' ' + toks.join(' ') + ' ';
}
const BOT_TOPICS = [
  { k: ['who are you', 'your name', 'tumi ke', 'তুমি কে', 'তোমার নাম', 'are you ai', 'real ai', 'tumi ki ai', 'tumi ki robot', 'robot', 'chatbot', 'who is this'],
    en: 'I am StudyBot, a rule-based guide built into EXCHORA. I am not a real AI — I answer from topics the site taught me: posting, exchanges, matches, ratings, privacy and more. For anything else, the site owner can help.',
    bn: 'আমি StudyBot, EXCHORA-র ভিতরে বানানো একটা নিয়ম-ভিত্তিক গাইড। আমি আসল AI না — সাইট আমাকে যা শিখিয়েছে (পোস্ট, এক্সচেঞ্জ, ম্যাচ, রেটিং, গোপনীয়তা ইত্যাদি) শুধু সেগুলোর উত্তর দিই। এর বাইরের কিছুতে সাইটের মালিক সাহায্য করতে পারবে।' },
  { k: ['who made', 'who built', 'who created', 'owner ke', 'owner', 'ke banai', 'কে বানিয়েছে', 'কে তৈরি', 'creator', 'developer ke', 'admin ke', 'malik ke', 'কার সাইট', 'ke baniyeche', 'baniyeche', 'ke toiri koreche'],
    en: 'EXCHORA was built by Khairun Nessa Mim, a CSE student at Southeast University, as a learning project to help students share study materials.',
    bn: 'EXCHORA বানিয়েছে Khairun Nessa Mim, Southeast University-এর CSE ছাত্রী — ছাত্রদের পড়ার জিনিস ভাগ করে নিতে সাহায্য করার জন্য একটা শেখার প্রজেক্ট হিসেবে।' },
  { k: ['what is exchora', 'exchora ki', 'exchora কী', 'about exchora', 'ki eta', 'কী এটা', 'eta ki site', 'site ta ki', 'website ta ki', 'exchora mane ki', 'exchora সম্পর্কে'],
    en: 'EXCHORA is a website where students exchange notes, books, slides and question banks. You post what you HAVE and what you WANT, and the site matches you with other students.',
    bn: 'EXCHORA হলো এমন একটা ওয়েবসাইট যেখানে ছাত্রছাত্রীরা নোট, বই, স্লাইড আর প্রশ্নব্যাংক বিনিময় করে। তুমি পোস্ট করো তোমার কাছে যা আছে (HAVE) আর যা চাই (WANT) — সাইট তোমাকে মিলিয়ে দেয় অন্য ছাত্রদের সাথে।' },
  { k: ['how does exchora work', 'how it works', 'how does it work', 'kivabe kaj kore', 'কীভাবে কাজ করে', 'kaj kore kivabe', 'kivabe chole', 'system ta ki'],
    en: 'In short: 1) Students post what they HAVE and WANT. 2) The site matches HAVE⇄WANT pairs. 3) You send an exchange request. 4) After the poster accepts, both sides see each other\'s contact. 5) Exchange, confirm, and rate each other. There is also a "How EXCHORA Works" section on the home page with the full picture.',
    bn: 'সংক্ষেপে: ১) ছাত্ররা পোস্ট করে তাদের HAVE আর WANT। ২) সাইট HAVE⇄WANT জোড়া মিলিয়ে দেয়। ৩) তুমি এক্সচেঞ্জ রিকোয়েস্ট পাঠাও। ৪) পোস্টদাতা Accept করলে দুজনে দুজনের contact দেখতে পাও। ৫) এক্সচেঞ্জ শেষে confirm করে একে অপরকে রেট করো। হোম পেজে "How EXCHORA Works" অংশে পুরো ছবিটা আছে।' },
  { k: ['new user', 'ami notun', 'notun user', 'kotha theke shuru', 'shuru korbo', 'getting started', 'first time', 'কীভাবে শুরু', 'শুরু করব', 'begin'],
    en: 'Welcome! Quick start: 1) Sign Up (top right) with email or Google. 2) Complete your profile and save your WhatsApp number in Edit Profile. 3) Post what you HAVE and WANT from "Post an Exchange". 4) Browse or check Matches, send a request, and exchange after it is accepted.',
    bn: 'স্বাগতম! দ্রুত শুরু: ১) উপরে ডানদিকে Sign Up করো ইমেইল বা Google দিয়ে। ২) Profile ঠিক করে Edit Profile-এ WhatsApp নম্বর সেভ করো। ৩) "Post an Exchange" থেকে তোমার HAVE আর WANT পোস্ট করো। ৪) Browse বা Matches দেখে রিকোয়েস্ট পাঠাও, Accept হলে এক্সচেঞ্জ করো।' },
  { k: ['free', 'taka', 'টাকা', 'cost', 'price', 'fee', 'charge', 'pay', 'khoroch', 'খরচ', 'poisha', 'পয়সা', 'dam koto'],
    en: 'EXCHORA is completely free. Students exchange study materials with each other — knowledge for knowledge, no money involved.',
    bn: 'EXCHORA সম্পূর্ণ ফ্রি। ছাত্রছাত্রীরা নিজেদের মধ্যে পড়ার জিনিস বিনিময় করে — জ্ঞানের বদলে জ্ঞান, কোনো টাকাপয়সা নেই।' },
  { k: ['kinte chai', 'sell', 'বিক্রি', 'বেচতে', 'buy', 'purchase', 'বই কিনব', 'কিনতে চাই', 'sell korte'],
    en: 'EXCHORA is for exchanging, not buying or selling. You swap study materials with other students — your notes for their book, and so on. No money changes hands.',
    bn: 'EXCHORA কেনা-বেচার জন্য না, বিনিময়ের জন্য। তুমি অন্য ছাত্রদের সাথে পড়ার জিনিস বদলাও — তোমার নোটের বদলে ওদের বই, এভাবে। কোনো টাকাপয়সার লেনদেন নেই।' },
  { k: ['sign up', 'signup', 'login', 'account khul', 'account open', 'account তৈরি', 'খুলব', 'খুলতে চাই', 'register', 'account kivabe', 'dhukbo', 'ঢুকব', 'account'],
    en: 'Use the "Sign Up" button (top right) with your email and a password, or continue with Google in one click. After that, complete your profile from the Profile page.',
    bn: '"Sign Up" বাটনে (উপরে ডানদিকে) ইমেইল আর পাসওয়ার্ড দিয়ে অ্যাকাউন্ট খোলো, অথবা Google দিয়ে এক ক্লিকে ঢোকো। তারপর Profile পেজ থেকে তোমার তথ্য ঠিক করে নাও।' },
  { k: ['logout', 'sign out', 'ber hobo', 'বের হব', 'logout kivabe'],
    en: 'Tap the "Log Out" button at the top right (next to your name). Your posts and exchanges stay saved — just log back in any time.',
    bn: 'উপরে ডানদিকে তোমার নামের পাশের "Log Out" বাটন চাপো। তোমার পোস্ট আর এক্সচেঞ্জ সেভ-ই থাকবে — যেকোনো সময় আবার লগ ইন করলেই হবে।' },
  { k: ['forgot', 'password bhule', 'পাসওয়ার্ড ভুলে', 'reset password', 'bhule gechi', 'ভুলে গেছি', 'password mone nai', 'password hariye', 'password reset', 'পাসওয়ার্ড'],
    en: 'If you signed up with Google, just use "Continue with Google" — no password needed. For email accounts, an in-site password reset is not available yet; contact the site owner and she can help you recover access.',
    bn: 'Google দিয়ে সাইন আপ করে থাকলে শুধু "Continue with Google" চাপলেই হবে — পাসওয়ার্ড লাগে না। ইমেইল অ্যাকাউন্টের জন্য সাইটের ভিতরে পাসওয়ার্ড reset এখনো নেই; সাইটের মালিকের সাথে যোগাযোগ করো, সে অ্যাক্সেস ফিরে পেতে সাহায্য করতে পারবে।' },
  { k: ['login hocche na', 'login hoy na', 'login problem', 'login error', 'google login', 'unauthorized', 'login korte parchi na', 'dhukte parchi na', 'লগইন হচ্ছে না', 'সাইন ইন হচ্ছে না'],
    en: 'Login trouble? Try these: 1) Check your internet and try again. 2) Refresh the page (Ctrl+F5). 3) If you are opening the site from your own computer files, use the live link or localhost — Google sign-in is blocked on 127.0.0.1 addresses. 4) Still stuck? Log out of other Google accounts in the browser, or tell the site owner.',
    bn: 'লগইনে সমস্যা? এগুলো দেখো: ১) ইন্টারনেট check করে আবার চেষ্টা করো। ২) Ctrl+F5 দিয়ে পেজ refresh করো। ৩) নিজের কম্পিউটার থেকে খুললে live link বা localhost ব্যবহার করো — 127.0.0.1 ঠিকানায় Google সাইন-ইন বন্ধ থাকে। ৪) তাও হলে browser-এর অন্য Google অ্যাকাউন্ট থেকে log out করে দেখো, বা সাইটের মালিককে বলো।' },
  { k: ['how to post', 'post kivabe', 'post korbo', 'post debo', 'post dite', 'পোস্ট দেবো', 'পোস্ট কীভাবে', 'পোস্ট দিতে', 'post create', 'add post', 'post korar niyom', 'post'],
    en: 'To post: 1) Log in first. 2) Go to "Post an Exchange". 3) Fill in your subject, what you HAVE and what you WANT. 4) Press "Post My Exchange" — your post appears at the top of Browse.',
    bn: 'পোস্ট দিতে: ১) আগে লগ ইন করো। ২) "Post an Exchange"-এ যাও। ৩) বিষয়, তোমার কাছে যা আছে (HAVE) আর যা চাই (WANT) লেখো। ৪) "Post My Exchange" চাপো — তোমার পোস্ট Browse-এর উপরে চলে আসবে।' },
  { k: ['what can i post', 'ki ki post', 'ki post kora jay', 'পোস্ট করা যায়', 'ki ki deya jay', 'ki ki type', 'কী পোস্ট', 'material'],
    en: 'You can post any study material: Notes, Books, Slides, Question Banks, Lab Reports, Tutorials — or anything else study-related under "Other". Post what you HAVE, and write what you WANT in return.',
    bn: 'তুমি যেকোনো পড়ার জিনিস পোস্ট করতে পারো: Notes, Books, Slides, Question Banks, Lab Reports, Tutorials — অথবা পড়া-সংক্রান্ত অন্য কিছু "Other" হিসেবে। তোমার কাছে যা আছে (HAVE) পোস্ট করো, আর বদলে যা চাও (WANT) লিখে দাও।' },
  { k: ['tips', 'tip', 'good post', 'ভালো পোস্ট', 'valovabe post', 'beshi exchange', 'attractive post'],
    en: 'Tips for a post that gets exchanges: 1) Write the exact subject name. 2) Be specific in HAVE ("complete handwritten notes, chapters 1–5") instead of just "notes". 3) Pick the right semester and type. 4) One material per post — separate posts match better.',
    bn: 'বেশি এক্সচেঞ্জ পাওয়া পোস্টের tips: ১) বিষয়ের ঠিক নামটা লেখো। ২) HAVE-তে নির্দিষ্ট করে লেখো ("সম্পূর্ণ হাতে লেখা নোট, অধ্যায় ১–৫") — শুধু "notes" না। ৩) ঠিক semester আর type বেছে নাও। ৪) এক পোস্টে একটা জিনিসই — আলাদা পোস্টে ম্যাচ ভালো হয়।' },
  { k: ['delete', 'edit', 'মুছে', 'ডিলিট', 'এডিট', 'change my post', 'post change', 'post delete', 'post edit', 'vul diyechi', 'ভুল দিয়েছি', 'semester vul', 'semester change', 'post sorabo', 'remove post', 'post remove'],
    en: 'You can delete your own post any time: find it in Browse and press the Delete button on its card. Editing a post is not available yet — if you made a mistake (wrong semester, typo), delete it and post again with the corrected text; it takes a minute.',
    bn: 'নিজের পোস্ট যেকোনো সময় মুছতে পারো: Browse-এ পোস্টটা খুঁজে কার্ডের Delete বাটন চাপো। পোস্ট এডিট করার সুবিধা এখনো নেই — ভুল হলে (ভুল semester, বানান ভুল) মুছে ফেলে ঠিক লেখা দিয়ে আবার পোস্ট করো, এক মিনিটের কাজ।' },
  { k: ['koyta post', 'koyta', 'how many post', 'ekadhik post', 'multiple post', 'duita post', 'duplicate', 'একাধিক পোস্ট', 'কয়টা পোস্ট', 'korte parbo koyta'],
    en: 'There is no limit — you can make as many posts as you have materials. Just keep one material per post, so matching and searching work better.',
    bn: 'কোনো limit নেই — তোমার কাছে যত জিনিস আছে তত পোস্ট করতে পারো। শুধু এক পোস্টে একটা জিনিসই রাখো, তাহলে ম্যাচিং আর সার্চ ভালো কাজ করে।' },
  { k: ['post kew dekhe na', 'no response', 'response pai na', 'amar post dekha jay na', 'post show hoy na', 'কেউ দেখে না', 'রেসপন্স পাই না', 'response kore na'],
    en: 'If your post gets no response yet: 1) Use specific words in HAVE and WANT (exact subject name, chapter numbers) — vague posts match less. 2) Check it appears at the top of Browse after posting. 3) Share the site link with classmates and juniors — new students join through sharing. 4) Give it a little time; exchanges pick up near exams.',
    bn: 'তোমার পোস্টে এখনো response না এলে: ১) HAVE আর WANT-এ নির্দিষ্ট শব্দ ব্যবহার করো (বিষয়ের ঠিক নাম, অধ্যায়ের নম্বর) — অস্পষ্ট পোস্ট কম ম্যাচ পায়। ২) পোস্ট করার পর Browse-এর উপরে আছে কিনা দেখো। ৩) বন্ধু আর জুনিয়রদের সাইটের link পাঠাও — শেয়ারিং থেকেই নতুন ছাত্র আসে। ৪) একটু সময় দাও; পরীক্ষার আগে এক্সচেঞ্জ বাড়ে।' },
  { k: ['search', 'filter', 'খুঁজব', 'খুঁজতে', 'search kivabe', 'filter kivabe', 'semester filter', 'type filter', 'khujbo'],
    en: 'In Browse you can: type in the search box to find by subject or keyword, pick a semester from the dropdown, and tap a type chip (Notes, Books, Slides…) to filter. Everything updates instantly as you type.',
    bn: 'Browse-এ তুমি পারো: সার্চ বক্সে লিখে বিষয় বা শব্দ দিয়ে খুঁজতে, dropdown থেকে semester বেছে নিতে, আর type chip (Notes, Books, Slides…) চেপে filter করতে। লেখার সাথে সাথেই ফলাফল বদলে যায়।' },
  { k: ['interested', 'saved', 'save kore', 'সেভ', 'heart', 'bookmark', 'interested mane ki', 'সেভ করা'],
    en: 'The "Interested" heart button saves a post for later — saved posts collect in My Exchanges so you can find them again quickly. It does not notify the poster; for that, use "Request Exchange".',
    bn: '"Interested" হার্ট বাটন পোস্টটা পরে দেখার জন্য সেভ করে রাখে — সেভ করা পোস্টগুলো My Exchanges-এ জমা হয়, যাতে সহজে আবার খুঁজে পাও। এতে পোস্টদাতা কোনো খবর পায় না; তার জন্য "Request Exchange" ব্যবহার করো।' },
  { k: ['my exchanges', 'amar exchange', 'আমার এক্সচেঞ্জ', 'my exchange ki', 'exchange list', 'saved kothay', 'আমার পোস্টগুলো'],
    en: 'My Exchanges is your personal corner: it shows the posts you saved with Interested, the requests you sent, the requests you received, and your completed exchanges. Open it from the top menu.',
    bn: 'My Exchanges হলো তোমার নিজের জায়গা: এখানে থাকে Interested দিয়ে সেভ করা পোস্ট, তোমার পাঠানো রিকোয়েস্ট, তোমার কাছে আসা রিকোয়েস্ট, আর সম্পন্ন এক্সচেঞ্জ। উপরের মেনু থেকে খোলো।' },
  { k: ['request', 'exchange kivabe', 'how exchange', 'request pathabo', 'request kivabe', 'এক্সচেঞ্জ রিকোয়েস্ট', 'রিকোয়েস্ট', 'exchange korte chai', 'exchange korbo', 'nite chai', 'নিতে চাই'],
    en: 'How exchanges work: 1) Find a post you like and press "Request Exchange" (your WhatsApp number must be saved in Edit Profile). 2) The poster Accepts or Rejects it in My Exchanges. 3) Only after Accept can both of you see each other\'s contact numbers. 4) Meet on campus or share files, then both press "Confirm exchanged" — done!',
    bn: 'এক্সচেঞ্জ যেভাবে কাজ করে: ১) পছন্দের পোস্টে "Request Exchange" চাপো (আগে Edit Profile-এ WhatsApp নম্বর সেভ থাকতে হবে)। ২) পোস্টদাতা My Exchanges থেকে Accept বা Reject করবে। ৩) শুধু Accept-এর পরেই দুজনে দুজনের contact নম্বর দেখতে পাবে। ৪) ক্যাম্পাসে দেখা করে বা ফাইল পাঠিয়ে এক্সচেঞ্জ শেষে দুজনেই "Confirm exchanged" চাপো — হয়ে গেল!' },
  { k: ['accept', 'reject', 'request asche', 'request এসেছে', 'accept kivabe', 'reject kivabe', 'request accept', 'request reject', 'accept korbo'],
    en: 'When someone requests your post, it appears in My Exchanges under "Requests for you". Press Accept to share contact numbers with them, or Reject if you cannot exchange. After Accept, arrange the swap and both press "Confirm exchanged" when done.',
    bn: 'কেউ তোমার পোস্টে রিকোয়েস্ট পাঠালে সেটা My Exchanges-এর "Requests for you"-তে আসে। Accept চাপলে দুজনের contact নম্বর শেয়ার হয়, এক্সচেঞ্জ সম্ভব না হলে Reject করো। Accept-এর পর দেখা/ফাইল ঠিক করে দুজনেই "Confirm exchanged" চাপো।' },
  { k: ['cancel', 'বাতিল', 'batil', 'cancel kivabe', 'request cancel', 'cancel a request', 'cancel request', 'cancel my request', 'batil korbo'],
    en: 'To cancel a request you sent: open My Exchanges, find it under "Requests you sent" and press Cancel (works while it is still Pending). If it was already accepted, talk to the other student through the contact number shown there.',
    bn: 'তোমার পাঠানো রিকোয়েস্ট বাতিল করতে: My Exchanges খোলো, "Requests you sent"-এর নিচে রিকোয়েস্টটা খুঁজে Cancel চাপো (Pending থাকা অবস্থায় কাজ করে)। Accept হয়ে গেলে ওখানে দেখানো contact নম্বরে অন্য ছাত্রের সাথে কথা বলে নাও।' },
  { k: ['reply nai', 'response nai', 'pending', 'request pathaisi', 'accept kore na', 'অপেক্ষা', 'reply ashe na', 'request diyechi', 'request pathiyechi'],
    en: 'A request stays Pending until the poster responds — they may be busy or offline. Make sure your WhatsApp number is saved in Edit Profile so they can reach you after accepting. If it takes too long, you can cancel from My Exchanges and request a similar post instead.',
    bn: 'রিকোয়েস্ট Pending থাকে যতক্ষণ পোস্টদাতা সাড়া না দেয় — সে ব্যস্ত বা offline থাকতে পারে। Edit Profile-এ তোমার WhatsApp নম্বর সেভ আছে কিনা দেখো, যাতে Accept-এর পর সে যোগাযোগ করতে পারে। বেশি দেরি হলে My Exchanges থেকে cancel করে একই ধরনের অন্য পোস্টে রিকোয়েস্ট করতে পারো।' },
  { k: ['confirm', 'completed', 'complete kivabe', 'exchange shesh', 'এক্সচেঞ্জ শেষ', 'confirm exchanged', 'সম্পন্ন', 'done kivabe'],
    en: 'After you actually exchange (meet or share files), both sides open My Exchanges and press "Confirm exchanged" on that request. When both have confirmed, it becomes Completed — and then you can rate each other with stars.',
    bn: 'আসল এক্সচেঞ্জ হয়ে গেলে (দেখা করে বা ফাইল পাঠিয়ে) দুই পক্ষই My Exchanges খুলে ওই রিকোয়েস্টে "Confirm exchanged" চাপো। দুজনে confirm করলে সেটা Completed হয় — তারপর একে অপরকে স্টার রেটিং দেওয়া যায়।' },
  { k: ['number pabo', 'number kivabe pabo', 'or number', 'onar number', 'contact pabo', 'নম্বর পাবো', 'নম্বর কীভাবে পাবো', 'jogajog korbo'],
    en: 'You get the other student\'s number through the exchange flow: send a Request Exchange on their post, and if they Accept, their WhatsApp number appears in My Exchanges on that request. Numbers are never shown publicly.',
    bn: 'অন্য ছাত্রের নম্বর পাবে এক্সচেঞ্জ ধাপে: তার পোস্টে Request Exchange পাঠাও, সে Accept করলে তার WhatsApp নম্বর My Exchanges-এ ওই রিকোয়েস্টে দেখা যাবে। নম্বর কখনোই সবার সামনে দেখায় না।' },
  { k: ['number change', 'number vul', 'whatsapp number vul', 'নম্বর বদল', 'নম্বর ভুল', 'wrong number', 'number update'],
    en: 'To fix or change your WhatsApp number: open Profile → Edit Profile, correct the number in the contact field and press Save. The new number is used for your next exchange requests.',
    bn: 'WhatsApp নম্বর ঠিক করতে বা বদলাতে: Profile → Edit Profile খোলো, contact ঘরে ঠিক নম্বর লিখে Save চাপো। পরের রিকোয়েস্টগুলোতে নতুন নম্বরটাই যাবে।' },
  { k: ['whatsapp number keno', 'number keno lage', 'number lagbe keno', 'কেন নম্বর', 'নম্বর কেন লাগে', 'number keno'],
    en: 'Your WhatsApp number is needed so the other student can contact you after an exchange request is accepted. It stays private — it is shown only to that one student, only after Accept, never publicly.',
    bn: 'WhatsApp নম্বর লাগে যাতে এক্সচেঞ্জ রিকোয়েস্ট Accept হওয়ার পর অন্য ছাত্র তোমার সাথে যোগাযোগ করতে পারে। এটা গোপন থাকে — শুধু ওই একজন ছাত্রই দেখতে পায়, শুধু Accept-এর পর, কখনোই সবার সামনে নয়।' },
  { k: ['contact', 'number', 'নম্বর', 'whatsapp', 'phone', 'mobile', 'number dekhabe', 'number public', 'number safe', 'যোগাযোগের নম্বর'],
    en: 'Contact numbers stay private. Your WhatsApp number (saved in Edit Profile) is shown to the other side ONLY after an exchange request is accepted — never publicly.',
    bn: 'Contact নম্বর গোপন থাকে। তোমার WhatsApp নম্বর (Edit Profile-এ সেভ করা) অপর পক্ষ দেখতে পায় শুধু এক্সচেঞ্জ রিকোয়েস্ট Accept হওয়ার পর — কখনোই সবার সামনে নয়।' },
  { k: ['rating', 'rate', 'রেটিং', 'রেট', 'star', 'স্টার', 'rating kivabe', 'rate korbo', 'star debo'],
    en: 'Ratings build trust: after an exchange is marked Completed, both sides can give each other 1–5 stars from My Exchanges. Your average star shows on your post cards and profile, so others can see you are a reliable exchanger.',
    bn: 'রেটিং আস্থা তৈরি করে: এক্সচেঞ্জ Completed হলে দুই পক্ষই My Exchanges থেকে একে অপরকে ১–৫ স্টার দিতে পারে। তোমার গড় স্টার তোমার পোস্ট কার্ড আর প্রোফাইলে দেখায় — অন্যরা বুঝতে পারে তুমি নির্ভরযোগ্য।' },
  { k: ['edit profile', 'profile edit', 'profile change', 'profile update', 'প্রোফাইল এডিট', 'profile thik', 'bio change', 'name change', 'university change', 'profile সাজাবো'],
    en: 'To edit your profile: open your Profile page (your name/photo at the top right) and press "Edit Profile". There you can change your name, university, department, semester and bio, save your WhatsApp number for exchanges, and upload a profile photo. Press Save when done.',
    bn: 'প্রোফাইল এডিট করতে: Profile পেজ খোলো (উপরে ডানদিকে তোমার নাম/ছবি) আর "Edit Profile" চাপো। ওখানে নাম, বিশ্ববিদ্যালয়, department, semester আর bio বদলাতে পারবে, এক্সচেঞ্জের জন্য WhatsApp নম্বর সেভ করতে পারবে, আর প্রোফাইল ছবি আপলোড করতে পারবে। শেষে Save চাপো।' },
  { k: ['photo', 'picture', 'ছবি', 'image', 'profile photo', 'profile pic', 'ছবি দেবো', 'photo upload', 'photo change'],
    en: 'To add a profile photo: open Profile → Edit Profile → "Upload photo", choose a picture and Save. If you signed in with Google, your Google photo is used automatically.',
    bn: 'প্রোফাইল ছবি দিতে: Profile → Edit Profile → "Upload photo" থেকে ছবি বেছে Save করো। Google দিয়ে লগ ইন করলে তোমার Google-এর ছবিটা নিজে থেকেই বসে যায়।' },
  { k: ['dark', 'light mode', 'ডার্ক', 'language', 'bangla', 'বাংলা', 'english', 'ভাষা', 'lang', 'dark mode', 'theme', 'mode change'],
    en: 'Tap the moon/sun button at the top right to switch between dark and light mode. Tap the "বাংলা / EN" button in the menu to switch the whole site between Bangla and English. Both choices are remembered for your next visit.',
    bn: 'উপরে ডানদিকের চাঁদ/সূর্য বাটনে চাপ দিলে dark আর light mode বদলায়। মেনুর "বাংলা / EN" বাটনে পুরো সাইট বাংলা আর English-এর মধ্যে বদলায়। দুটো পছন্দই মনে থাকে, পরের বারও একই থাকবে।' },
  { k: ['app', 'android', 'ios', 'অ্যাপ', 'play store', 'mobile app', 'app ache', 'download'],
    en: 'There is no separate mobile app — EXCHORA is a website that works fully in your phone\'s browser, and it is free. You can add it to your home screen from the browser menu for app-like access.',
    bn: 'আলাদা মোবাইল অ্যাপ নেই — EXCHORA একটা ওয়েবসাইট, ফোনের browser-এই পুরোপুরি চলে, আর ফ্রি। চাইলে browser menu থেকে home screen-এ যোগ করে অ্যাপের মতো ব্যবহার করতে পারো।' },
  { k: ['safe', 'trust', 'নিরাপদ', 'বিশ্বাস', 'fraud', 'প্রতারণা', 'scam', 'নিরাপত্তা', 'data safe', 'info safe'],
    en: 'EXCHORA is built for safety: your contact number is never public — it is shared only after you accept a request (or yours is accepted). Star ratings show who is reliable, and meeting on campus for physical exchanges is a good idea.',
    bn: 'EXCHORA নিরাপত্তার কথা ভেবেই বানানো: তোমার contact নম্বর কখনোই সবার সামনে যায় না — শুধু রিকোয়েস্ট Accept হওয়ার পর শেয়ার হয়। স্টার রেটিং দেখে নির্ভরযোগ্য মানুষ চেনা যায়, আর সরাসরি জিনিস নিতে ক্যাম্পাসে দেখা করাই ভালো।' },
  { k: ['online exchange', 'pdf pathabo', 'pdf', 'pathabo', 'file pathabo', 'campus', 'dekha', 'delivery', 'online e exchange', 'share file', 'পিডিএফ', 'বাসায়'],
    en: 'Both ways work: for books and printed notes, meet on campus and hand them over. For slides, PDFs and soft copies, after the request is accepted and you have each other\'s number, you can simply share the files online — whatever suits both of you.',
    bn: 'দুটোই চলে: বই আর ছাপানো নোটের জন্য ক্যাম্পাসে দেখা করে হাতে হাতে দাও। স্লাইড, PDF আর soft copy-র জন্য রিকোয়েস্ট Accept হয়ে নম্বর পাওয়ার পর online-এই ফাইল পাঠিয়ে দিতে পারো — যেটা দুজনের সুবিধা হয়।' },
  { k: ['delete account', 'account delete', 'account muchbo', 'account বন্ধ', 'close account', 'অ্যাকাউন্ট ডিলিট', 'account remove'],
    en: 'There is no in-site account delete option yet. You can delete all your own posts any time from their cards. For full account removal, contact the site owner (Khairun Nessa Mim) and she will remove it for you.',
    bn: 'সাইটের ভিতরে অ্যাকাউন্ট delete করার option এখনো নেই। তবে নিজের সব পোস্ট যেকোনো সময় কার্ড থেকে মুছে ফেলতে পারো। পুরো অ্যাকাউন্ট সরাতে সাইটের মালিকের (Khairun Nessa Mim) সাথে যোগাযোগ করো, সে সরিয়ে দেবে।' },
  { k: ['notification', 'নোটিফিকেশন', 'janabo kivabe', 'kivabe janbo', 'খবর পাবো', 'alert'],
    en: 'EXCHORA has no push notifications yet. To see new requests, open My Exchanges — the menu also shows a count badge for your saved items. Checking in once a day keeps you updated.',
    bn: 'EXCHORA-তে এখনো push notification নেই। নতুন রিকোয়েস্ট দেখতে My Exchanges খোলো — মেনুতে সেভ করা আইটেমের count badge-ও দেখায়। দিনে একবার check করলেই update থাকবে।' },
  { k: ['problem', 'report', 'সমস্যা', 'kaj kore na', 'কাজ করে না', 'error', 'bug', 'kaj hocche na', 'problem hocche'],
    en: 'Sorry something is not working. Quick checks: 1) Refresh with Ctrl+F5. 2) If you are testing locally, open the site as localhost (not 127.0.0.1). 3) Try logging out and back in. Still stuck? Tell the site owner (Khairun Nessa Mim) what you clicked and what happened — a screenshot helps a lot.',
    bn: 'কিছু কাজ না করলে দুঃখিত। দ্রুত check করো: ১) Ctrl+F5 দিয়ে refresh। ২) নিজের কম্পিউটারে test করলে localhost দিয়ে খোলো (127.0.0.1 না)। ৩) Log out করে আবার log in করে দেখো। তাও হলে সাইটের মালিককে (Khairun Nessa Mim) বলো কী click করেছিলে আর কী হলো — screenshot দিলে অনেক সুবিধা হয়।' },
  { k: ['contact owner', 'owner er sathe', 'manusher help', 'admin er sathe', 'owner ke bolbo', 'help chai', 'সাহায্য চাই', 'যোগাযোগ'],
    en: 'The site owner is Khairun Nessa Mim (CSE, Southeast University). For anything the bot cannot answer — account problems, a bad experience, suggestions — reach her through the contact options on her portfolio site: khairunmim-dev.github.io.',
    bn: 'সাইটের মালিক Khairun Nessa Mim (CSE, Southeast University)। Bot যেটা পারল না — অ্যাকাউন্টের সমস্যা, খারাপ অভিজ্ঞতা, পরামর্শ — তার portfolio সাইটের contact থেকে যোগাযোগ করো: khairunmim-dev.github.io।' },
  { k: ['kemon acho', 'কেমন আছো', 'how are you', 'joke', 'মজা', 'tumi ki paro', 'ki ki paro', 'ki korte paro', 'help me', 'সাহায্য করো', 'ki help'],
    en: 'I am doing well, thanks! I can help with: posting, exchanges and requests, matches, ratings, profile and photos, privacy, dark mode and language, finding posts ("find" + subject) — and more. What would you like to know?',
    bn: 'ভালো আছি, ধন্যবাদ! আমি সাহায্য করতে পারি: পোস্ট, এক্সচেঞ্জ আর রিকোয়েস্ট, ম্যাচ, রেটিং, প্রোফাইল আর ছবি, গোপনীয়তা, dark mode আর ভাষা, পোস্ট খোঁজা ("find" + বিষয়) — আরও অনেক কিছুতে। কোনটা জানতে চাও?' },
  { k: ['thank', 'ধন্যবাদ', 'thanks'],
    en: 'You are welcome! Anything else about EXCHORA?',
    bn: 'স্বাগতম! EXCHORA নিয়ে আর কিছু জানতে চাও?' },
  { k: ['bye', 'বিদায়', 'allah hafez', 'আল্লাহ হাফেজ', 'goodbye'],
    en: 'Goodbye! Happy studying — come back whenever you need an exchange. 📚',
    bn: 'বিদায়! ভালো পড়াশোনা হোক — এক্সচেঞ্জ লাগলেই আবার এসো। 📚' },
  { k: ['match', 'ম্যাচ', 'matching'], fn: 'matches' }
];
BOT_TOPICS.forEach(function (t) { t.nk = t.k.map(function (key) { return botNorm(key); }); });
function botFindAnswer(q, toks) {
  const stop = ['find', 'search', 'khuj', 'khujo', 'ache', 'post', 'the', 'for', 'and', 'kono', 'ekta', 'mane', 'kivabe', 'আছে', 'খুঁজ', 'খুজ', 'amar', 'kina', 'karo', 'kache', 'আমার', 'কারো', 'kase'];
  const words = toks.filter(function (w) { return w.length >= 3 && stop.indexOf(w) === -1; });
  if (!words.length) return null;
  let key = null, found = [];
  for (let i = 0; i < words.length; i++) {
    const hits = posts.filter(function (p) { return (p.subject + ' ' + p.have + ' ' + p.want).toLowerCase().indexOf(words[i]) !== -1; });
    if (hits.length) { key = words[i]; found = hits.slice(0, 3); break; }
  }
  if (!key) key = words[0];
  if (!found.length) return botText('I could not find any post about "' + esc(key) + '" yet. You could be the first to post a WANT for it!', '"' + esc(key) + '" নিয়ে এখনো কোনো পোস্ট পাইনি। তুমিই প্রথম এটা WANT হিসেবে পোস্ট করতে পারো!');
  return botText('I found these posts — tap one to view it:', 'এই পোস্টগুলো পেয়েছি — দেখতে যেকোনো একটায় চাপ দাও:') + '<br>' +
    found.map(function (p) { return '<button type="button" class="bot-post" data-bot-post="' + p.id + '">' + esc(p.subject) + ' — ' + esc(p.name) + '</button>'; }).join('<br>');
}
function botReply(rawQ) {
  const raw = rawQ.trim();
  if (/^(hi|hello|hey|hola|salam|assalamu alaikum|আসসালাম|আসসালামু আলাইকুম|হ্যালো|হাই|good morning|good afternoon|good evening)\b/.test(raw) || raw === 'hi' || raw === 'hello')
    return botText('Hello! Ask me how to post, how exchanges work, whether EXCHORA is free — or type "find" + a subject, like "find algorithm".',
                   'হ্যালো! আমাকে জিজ্ঞেস করো কীভাবে পোস্ট দিতে হয়, এক্সচেঞ্জ কীভাবে কাজ করে, EXCHORA ফ্রি কিনা — অথবা "find" লিখে বিষয় লেখো, যেমন "find algorithm"।');
  const q = botNorm(rawQ);
  const toks = q.trim().split(' ');
  // Score every topic; the most specific (longest matching keys) wins.
  let best = null, bestScore = 0;
  BOT_TOPICS.forEach(function (t) {
    let s = 0;
    t.nk.forEach(function (nk) { if (q.indexOf(nk) !== -1) s += nk.trim().split(' ').length * 10 + nk.trim().length; });
    if (s > bestScore) { bestScore = s; best = t; }
  });
  // A clear "find X" intent beats weak topic hits.
  const hasFindVerb = [' find ', ' search ', ' khuj ', ' khujo ', ' খুঁজ ', ' খুজ '].some(function (v) { return q.indexOf(v) !== -1; });
  const hasAche = q.indexOf(' ache ') !== -1 || q.indexOf(' আছে ') !== -1;
  if ((hasFindVerb && bestScore < 30) || (hasAche && bestScore < 13)) {
    const ans = botFindAnswer(q, toks);
    if (ans) return ans;
  }
  if (best && bestScore >= 13) {
    if (best.fn === 'matches') {
      const wantsHow = q.indexOf(' kivabe ') !== -1 || q.indexOf(' how ') !== -1 || q.indexOf(' কীভাবে ') !== -1;
      if (!wantsHow) {
        if (!currentUser) return botText('Log in first, then I can check your matches — or open the Matches page from the top menu.', 'আগে লগ ইন করো, তারপর আমি তোমার ম্যাচ দেখতে পারব — অথবা উপরের মেনু থেকে Matches পেজ খোলো।');
        const m = findMatches();
        if (!m.length) return botText('No matches yet for your posts. Matches appear when another student\'s HAVE fits your WANT (or the other way round). Try posting what you have and want!', 'তোমার পোস্টের জন্য এখনো কোনো ম্যাচ নেই। ম্যাচ আসে যখন অন্য কারো HAVE তোমার WANT-এর সাথে মিলে যায় (বা উল্টোটা)। তোমার যা আছে আর যা চাই তা পোস্ট করে দেখো!');
        return botText('Good news — I found ' + m.length + ' match(es) for you! Open the Matches page from the top menu to see them.', 'সুখবর — তোমার জন্য ' + m.length + 'টা ম্যাচ পেয়েছি! উপরের মেনু থেকে Matches পেজ খুলে দেখো।');
      }
      return botText('Matching works like this: the site compares your post\'s HAVE and WANT words with other students\' posts. If your HAVE fits their WANT — or their HAVE fits your WANT — it is a match. Clear, specific words (like "algorithm notes") match better than vague ones.',
                     'ম্যাচ এভাবে হয়: সাইট তোমার পোস্টের HAVE আর WANT-এর শব্দগুলো অন্য ছাত্রদের পোস্টের সাথে মিলিয়ে দেখে। তোমার HAVE যদি ওদের WANT-এর সাথে মিলে — বা ওদের HAVE তোমার WANT-এর সাথে — তাহলেই ম্যাচ। পরিষ্কার, নির্দিষ্ট শব্দ (যেমন "algorithm notes") অস্পষ্ট শব্দের চেয়ে ভালো ম্যাচ পায়।');
    }
    return botText(best.en, best.bn);
  }
  if (hasFindVerb || hasAche) { const ans2 = botFindAnswer(q, toks); if (ans2) return ans2; }
  return botText('I can help with many things — tap a topic below, or ask me in your own words (English, বাংলা or Banglish all work):',
                 'আমি অনেক বিষয়ে সাহায্য করতে পারি — নিচের যেকোনো topic-এ চাপ দাও, বা নিজের ভাষায় জিজ্ঞেস করো (English, বাংলা, Banglish — সবই চলবে):') + '<br>' +
    '<button type="button" class="bot-post" data-bot-q="how to post">How to post</button><br>' +
    '<button type="button" class="bot-post" data-bot-q="how exchange works">How exchanges work</button><br>' +
    '<button type="button" class="bot-post" data-bot-q="find my matches">Find my matches</button><br>' +
    '<button type="button" class="bot-post" data-bot-q="is it free">Is it free?</button>';
}

// ---------- 16) Firebase wiring: live posts + auth state ----------
if (FB) {
  // Posts: first run seeds the 6 sample posts into the online database (once per browser).
  let seedTried = localStorage.getItem('ex_seeded_v1') === '1';
  fbDb.collection('posts').orderBy('ts', 'desc').onSnapshot(function (snap) {
    if (snap.empty && !seedTried) {
      seedTried = true;
      localStorage.setItem('ex_seeded_v1', '1');
      const batch = fbDb.batch();
      const now = Date.now();
      posts.forEach(function (p, i) {
        batch.set(fbDb.collection('posts').doc(p.id), {
          name: p.name, subject: p.subject, semester: p.semester, type: p.type,
          have: p.have, want: p.want, owner: null, ts: now - i * 60000,
        });
      });
      batch.commit();
      return;
    }
    posts = snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
    applyFilters();
    renderMyExchanges();
    if (currentUser && !document.getElementById('view-profile').hidden) renderProfile();
  }, function () { /* if the database cannot be reached, the local sample posts stay on screen */ });

  // Auth state: Firebase tells us who is logged in; the profile comes from Firestore.
  fbAuth.onAuthStateChanged(function (user) {
    if (!user) { currentUser = null; renderAuthArea(); subscribeRequests(); return; }
    fbDb.collection('users').doc(user.uid).get().then(function (snap) {
      let data;
      if (snap.exists) {
        data = snap.data();
        if (!data.photo && user.photoURL) {   // adopt the Google account photo until she uploads her own
          data.photo = user.photoURL;
          fbDb.collection('users').doc(user.uid).update({ photo: user.photoURL });
        }
      } else {   // first Google sign-in: create a starter profile
        data = { name: user.displayName || 'Student', university: '', department: 'CSE', semester: '11', bio: '', contact: '', since: new Date().getFullYear(), photo: user.photoURL || '' };
        fbDb.collection('users').doc(user.uid).set(data);
      }
      currentUser = Object.assign({ uid: user.uid, email: user.email }, data);
      renderAuthArea();
      subscribeRequests();
      if (!document.getElementById('view-profile').hidden) renderProfile();
    });
  });
}
