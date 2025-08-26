// src/App.jsx
import './index.css';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ConciergeOverlay from './ConciergeOverlay';
import {
  Home,
  Bell,
  MessageSquare,
  User,
  ChevronLeft,
  Utensils,
  Martini,
  Coffee,
  Footprints,
  Sparkles,
  X,
  Calendar,
  Settings,
} from 'lucide-react';

/* =========================
   SVG ICONS (inline, currentColor)
   ========================= */
const DinnerSVG = (props) => (
  <Utensils size={28} strokeWidth={1.6} {...props} />
);
const DrinksSVG = (props) => <Martini size={28} strokeWidth={1.6} {...props} />;
const RunSVG = (props) => <Footprints size={28} strokeWidth={1.6} {...props} />;
const CoffeeSVG = (props) => <Coffee size={28} strokeWidth={1.6} {...props} />;
const StarSVG = (props) => <Sparkles size={28} strokeWidth={1.6} {...props} />;

/* =========================
   THEMES / COPY
   ========================= */
const inviteTheme = {
  'Dinner & Explore': {
    img: 'https://images.unsplash.com/photo-1562050344-f7ad946cee35?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // warm dinner
    Icon: DinnerSVG,
  },
  Drinks: {
    img: 'https://plus.unsplash.com/premium_photo-1723122130796-c789b419cb34?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // nightclub-y
    Icon: DrinksSVG,
  },
  Run: {
    img: 'https://images.unsplash.com/photo-1634921363975-46fa99024422?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // sunrise runner
    Icon: RunSVG,
  },
  Breakfast: {
    img: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNvZmZlZSUyMHNob3B8ZW58MHx8MHx8fDA%3D', // coffee
    Icon: CoffeeSVG,
    body: "We found someone we think you should meet — because you both can't seem to shake the what-ifs of your art.",
  },
  'Social Club': {
    img: 'https://images.unsplash.com/photo-1620680741198-837aae83d9b2?q=80&w=770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // moody venue
    Icon: StarSVG,
    body: 'A 4-week circle with a fixed cohort. Same people, new time/place each week. Build momentum together.',
  },
};

const classicInvites = [
  { day: 'Wednesday', emoji: '🍽️', title: 'Dinner & Explore', time: '7:00 PM' },
  { day: 'Thursday', emoji: '🍹', title: 'Drinks', time: '8:00 PM' },
  { day: 'Friday', emoji: '🍽️', title: 'Dinner & Explore', time: '7:00 PM' },
  { day: 'Saturday', emoji: '🏃', title: 'Run', time: '10:00 AM' },
];

const itineraryCopy = {
  'Dinner & Explore': {
    Wednesday: {
      title: 'Dinner & Game-Night',
      bullets: [
        "Table game: 'What are you building?'",
        'Curated venue for a group game-night',
      ],
    },
    Friday: {
      title: 'Dinner & Rooftop Jazz',
      bullets: [
        'Dinner with 5 others matched on passions',
        'Weekly win + one ask',
        'Rooftop jazz after',
      ],
    },
  },
  Drinks: {
    Thursday: {
      title: 'Conversation-forward cocktails',
      bullets: [
        'Intimate drinks & conversation in a cozy bar',
        'Prompt cards to keep it flowing',
      ],
    },
  },
  Run: {
    Saturday: {
      title: 'Easy group run (all paces)',
      bullets: ['2–4 miles with regroup points', 'Coffee after the run'],
    },
  },
};

const breakfastProfile = {
  gender: 'Female',
  ageRange: '28–31',
  building: 'A non-profit for artists to share works-in-progress',
  proudOf: 'Put on the opening night of the Eras Tour in Glendale, AZ',
};

/* =========================
   HELPERS
   ========================= */
function dateKey(d) {
  const k = new Date(d);
  k.setHours(0, 0, 0, 0);
  return k.toISOString();
}
function weekdayToIndex(day) {
  const map = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  return map[day];
}
function nextTwoDatesForWeekday(weekdayIndex) {
  const results = [];
  const now = new Date();
  for (let i = 0; i < 21; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    if (d.getDay() === weekdayIndex) results.push(new Date(d));
    if (results.length === 2) break;
  }
  return results;
}
function nextTwoDays() {
  const out = [];
  const now = new Date();
  for (let i = 1; i <= 2; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    out.push(d);
  }
  return out;
}

function nextWeekdayDate(weekdayName) {
  const map = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  const target = map[weekdayName];
  const now = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    if (d.getDay() === target) return d;
  }
  return new Date(); // fallback today
}

function formatLongDate(d) {
  return new Date(d).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const DARK_VIEWS = new Set(['club', 'breakfast']);
const isDarkView = (v) => DARK_VIEWS.has(v);

/* =========================
   COMPONENTS
   ========================= */

function Nav({ view, setView, dark }) {
  const items = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'alerts', label: 'Notifications', Icon: Bell },
    { id: 'messages', label: 'Messages', Icon: MessageSquare },
    { id: 'profile', label: 'Profile', Icon: User },
  ];

  const bg = dark
    ? 'bg-black/80 text-white border-white/10'
    : 'bg-[fff7eb]/80 text-black border-black/10';

  const activeColor = dark ? 'text-white' : 'text-black';
  const idleColor = dark ? 'text-white/60' : 'text-black/60';

  return (
    <nav
      className={`fixed z-50 border
           /* bottom bar on mobile */
           bottom-0 left-0 right-0 h-16 px-2 flex items-center justify-around
           /* sidebar on md+ */s
           md:top-0 md:left-0 md:bottom-0 md:h-full md:w-48 md:flex md:flex-col md:items-stretch md:justify-start md:py-2
           backdrop-blur ${bg}`}
    >
      {/* Timeleft Logo*/}
      <button
        onClick={() => setView('home')}
        className="hidden md:block p-2 m-2 rounded-xl flex items-center gap-2 hover:bg-black/5"
        aria-label="Go Home"
      >
        <img
          src={
            dark
              ? 'https://timeleft.com/staging/wp-content/uploads/sites/10/2024/06/timeleft-logo-white.png'
              : 'https://timeleft.com/wp-content/uploads/2023/08/logo_black.svg'
          }
          alt="Timeleft Logo"
          className="w-auto h-8" // keeps consistent size
        />
      </button>

      {/* Other Nav Items (Dynamic) */}
      {items.map(({ id, label, Icon }) => {
        const active = view === id || (id === 'home' && view === 'home');
        const NAV_ICON_SIZE = 22; // try 20–24; 22 tends to look balanced

        return (
          <button
            key={id}
            onClick={() =>
              setView(
                id === 'home' ? 'home' : id === 'profile' ? 'profile' : view
              )
            } // wire others later
            className={`w-full rounded-xl justify-center md:justify-start md:px-4 md:py-2 px-0 py-0 min-h-[44px] flex items-center gap-3 rounded-lg hover:bg-black/5
                 ${active ? activeColor : idleColor}
               `}
            aria-current={active ? 'page' : undefined}
          >
            <Icon
              size={NAV_ICON_SIZE}
              strokeWidth={2}
              className="flex-none w-[22px] h-[22px]"
            />
            {/* label locked to one visual size + line-height */}
            <span className="hidden md:inline text-[15px] leading-5 font-medium">
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function Countdown({ duration, className = '' }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  useEffect(() => {
    const id = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const fmt = (s) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${d}d ${h}h ${m}m ${sec}s`;
  };
  return (
    <span className={`font-bold flex items-center mt-1 mb-1 ${className}`}>
      ⏳ Time left: {fmt(timeLeft)}
    </span>
  );
}

function NewBadge() {
  return (
    <span
      className="top-0 -translate-y-1/2 z-30"
      style={{
        position: 'absolute',
        top: '0px',
        right: '12px',
        backgroundColor: '#ee7766ff',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        padding: '2px 8px',
        borderRadius: '8px', // rounded rectangle
        border: '1px solid black', // darker border like screenshot
        boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
      }}
    >
      Limited Time
    </span>
  );
}

function InviteCard({
  day,
  title,
  time,
  onChoose,
  Icon,
  imageUrl,
  body,
  countdownDuration,
  ctaLabel = 'Choose date',
  cardHeight = 304,
  personalized,
}) {
  const Outer = ({ children }) =>
    personalized ? (
      <div className="animated-border rounded-2xl">{children}</div>
    ) : (
      <div className="rounded-2xl">{children}</div>
    );

  return (
    <div className="shrink-0 snap-start">
      {/* weekday above card (same width as card) */}

      <Outer>
        <div className="relative w-[20rem] h-[25rem] rounded-xl overflow-visible">
          {/* Conditionally render badge */}
          {personalized && <NewBadge />}

          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover rounded-xl z-0"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/45 to-black/70 z-0  rounded-xl" />

          <div className="relative h-full p-4 text-white flex flex-col">
            <div className="mt-6 flex flex-col items-center gap-1">
              {Icon && (
                <Icon className="w-8 h-8 text-white opacity-90" aria-hidden />
              )}
              <div className="text-2xl font-medium">{title}</div>
              <div className="text-white/90">{day}</div>
              <div className="text-white/90">{time}</div>
              {body && (
                <div className="mt-1 text-sm text-white/85 text-center">
                  {body}
                </div>
              )}
            </div>
            <div className="mt-auto mb-4 flex flex-col items-center gap-2">
              {/* Centered red countdown (optional per card) */}
              {typeof countdownDuration === 'number' && (
                <div className="animate-pulse mt-1 mb-1 rounded-full px-4 py-0 bg-red-700/80 backdrop-blur-md border border-white/15 shadow-md">
                  <Countdown
                    className="text-white text-xs tracking-wide"
                    duration={countdownDuration}
                  />
                </div>
              )}
              <button
                onClick={onChoose}
                className="px-4 py-1 rounded-full text-white text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-200"
              >
                {ctaLabel ?? 'Choose date'}
              </button>
            </div>
          </div>
        </div>
      </Outer>
    </div>
  );
}

function DayHeaderCarousel({
  days,
  children,
  showHeaders = true,
  dark = false,
}) {
  const ref = React.useRef(null);
  const [active, setActive] = React.useState(0);
  const [progress, setProgress] = React.useState(0); // 0..1

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      // active index (closest card to left edge)
      const cards = [...el.querySelectorAll('[data-card]')];
      const left0 = el.getBoundingClientRect().left;
      let idx = 0,
        min = Infinity;
      cards.forEach((c, i) => {
        const left = Math.abs(c.getBoundingClientRect().left - left0);
        if (left < min) {
          min = left;
          idx = i;
        }
      });
      setActive(idx);

      // progress
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };

    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToIndex = (i) => {
    const scroller = ref.current;
    if (!scroller) return;
    const card = scroller.querySelector(`[data-card][data-index="${i}"]`);
    if (card) scroller.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    setActive(i);
  };

  const trackColor = dark ? 'bg-white/15' : 'bg-black/10';
  const fillColor = dark ? 'bg-white' : 'bg-[#e8420aff]/100';
  const hdrActive = dark ? 'text-white' : 'text-black';
  const hdrIdle = dark ? 'text-white/60' : 'text-black/60';
  const lineActive = dark ? 'bg-white' : 'bg-black';
  const lineIdle = dark ? 'bg-white/20' : 'bg-black/20';

  return (
    <div className="w-full">
      {showHeaders && (
        <div className="mb-3 w-full">
          <div className="flex w-full">
            {days.map((d, i) => (
              <button
                key={d}
                type="button"
                onClick={() => scrollToIndex(i)}
                className="flex-1 px-2"
              >
                <div
                  className={`text-center uppercase tracking-wide text-xs font-semibold pb-2 transition-colors ${
                    i === active ? hdrActive : hdrIdle
                  }`}
                >
                  {d}
                </div>
                <div
                  className={`h-[2px] rounded transition-colors ${
                    i === active ? lineActive : lineIdle
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Wrapper holds scroller + separate progress bar */}
      <div className="relative">
        {/* SCROLLER */}
        <div
          ref={ref}
          className="overflow-x-auto overflow-y-visible pt-4 pb-4 snap-x snap-mandatory scroll-smooth progress-scroll"
        >
          <div className="flex gap-4 w-max">
            {React.Children.map(children, (child, idx) => (
              <div data-card data-index={idx}>
                {child}
              </div>
            ))}
          </div>
        </div>

        {/* PROGRESS (outside scroller, does not move) */}
        <div className="h-[6px] relative items-center">
          <div className={`h-[2px] rounded ${trackColor}`} />
          <div
            className={`h-[2px] rounded absolute left-0 top-0 ${fillColor} transition-[width] duration-150`}
            style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================
   MAIN APP
   ========================= */
export default function App() {
  const [view, setView] = useState('home'); // home | chooseDate | breakfast | confirm | club | confirmed
  const [selectedDateISO, setSelectedDateISO] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // {day,title,time,emoji,detailedTitle}
  const dark = isDarkView(view);
  const [overlay, setOverlay] = useState({ open: false, mode: 'planner' });

  const handleSubmit = () => {
    alert('Submitted!');
    setOverlay((s) => ({ ...s, open: false }));
  };

  const goChooseDate = (day, title, time, emoji) => {
    setSelectedEvent({ day, title, time, emoji });
    setSelectedDateISO(null);
    setView('chooseDate');
  };

  const goBreakfast = () => {
    setSelectedEvent({ title: 'Breakfast', time: '9:00 AM', emoji: '☕' });
    setSelectedDateISO(null);
    setView('breakfast');
  };

  const club = {
    emoji: '✨',
    title: 'The 4-Week Creative Builders Circle',
    tagline: 'A fixed cohort to build momentum together.',
    startsWeekday: 'Wednesday',
    startsTime: '7:00 PM',
    neighborhood: 'Westside (rotating venues)',
    countdownSeconds: 4 * 7 * 24 * 3600,
    heroImg:
      'https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?auto=format&fit=crop&w=1600&q=80',
    bullets: [
      'Duration: 4 weeks • 90 minutes each',
      'Group size: 12–15 (fixed cohort)',
      'Locations: rotating third spaces across the Westside',
      'Format: weekly wins • critique • accountability pairs',
    ],
  };

  const goConfirm = (override = {}) => {
    setSelectedEvent((prev) => ({ ...prev, ...override }));
    setView('confirm');
  };

  useEffect(() => {
    // Scroll to top when view changes
    window.scrollTo({ top: 0, behavior: 'instant' }); // use 'smooth' if you want animation
  }, [view]);

  // EFFECTS TO CONTROL THE OVERLAY FOR CHAT INTERFACE
  useEffect(() => {
    const url = new URL(window.location.href);
    const force = url.searchParams.get('concierge'); // "planner" | "feedback"
    if (force === 'planner' || force === 'feedback') {
      setOverlay({ open: true, mode: force });
    }
  }, []);

  useEffect(() => {
    let timer;
    if (view === 'confirmed') {
      timer = setTimeout(() => {
        setOverlay({ open: true, mode: 'feedback' });
      }, 5000);
    }
    return () => clearTimeout(timer); // cleanup if you navigate away early
  }, [view]);

  useEffect(() => {
    if (view !== 'home') return;
    if (sessionStorage.getItem('planner_shown')) return; // already shown this session?

    setOverlay({ open: true, mode: 'planner' });
    sessionStorage.setItem('planner_shown', 'true'); // mark as shown
  }, [view]);

  const headerFont = { fontFamily: 'FixelText, Inter, system-ui, sans-serif' };

  /* ---------- Views ---------- */

  const renderHome = () => {
    return (
      <div
        className="flex-1 bg-[#fff7eb] p-6 overflow-x-hidden max-w-5xl mx-auto px-6 page-fade"
        style={headerFont}
      >
        {/* Banner */}
        <div className="relative rounded-xl overflow-hidden mb-6">
          <img
            src="https://images.unsplash.com/photo-1661037177531-646f11829db6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2FudGElMjBtb25pY2F8ZW58MHx8MHx8fDA%3D"
            alt="banner"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white font-bold text-xl">
            <div className="text-sm font-medium">Los Angeles</div>
            <div className="text-3xl">WESTSIDE</div>
            <div className="underline text-sm cursor-pointer">
              Change location
            </div>
          </div>
        </div>

        <hr className="border-[#f7dfc8] mb-4" />

        {/* Classic Invites */}
        <h2
          className="text-2xl md:text-3xl mb-1 font-extrabold italic tracking-wide"
          style={{ fontFamily: '"Alias Union", serif' }}
        >
          Classic Timeleft Invites
        </h2>
        <h3 className="text-lg font-normal text-gray-700 mb-3">
          5 people are waiting for you
        </h3>

        <DayHeaderCarousel
          days={['Wednesday', 'Thursday', 'Friday', 'Saturday']}
        >
          {classicInvites.map(({ day, emoji, title, time }, idx) => {
            const theme = inviteTheme[title] || {};
            return (
              <InviteCard
                key={`${day}-${title}`}
                day={day}
                title={title}
                time={time}
                Icon={theme.Icon}
                imageUrl={theme.img}
                onChoose={() => goChooseDate(day, title, time, emoji)}
              />
            );
          })}
        </DayHeaderCarousel>

        <hr className="border-[#f7dfc8] my-6" />

        {/* Personalized */}
        <div className="flex items-center gap-2">
          <h2
            className="text-2xl md:text-3xl mb-1 font-extrabold italic tracking-wide"
            style={{ fontFamily: '"Alias Union", serif' }}
          >
            Invites Just for Maxime
          </h2>
          <span className="bg-[#00a089ff] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full h-5 flex items-center">
            PERSONALIZED
          </span>
        </div>
        <h3 className="text-lg font-normal text-gray-700 mb-3">
          These invites are personalized to you & only appear when we think
          we've found a great match.
        </h3>

        <DayHeaderCarousel days={['Now', 'Cohorts']} showHeaders={false}>
          {/* Breakfast */}
          <InviteCard
            day="Dissolves this week"
            title="Breakfast"
            Icon={inviteTheme['Breakfast'].Icon}
            imageUrl={inviteTheme['Breakfast'].img}
            body="Meet someone dreaming about the same things as you. Grab coffee this week before it disappears."
            countdownDuration={43200}
            ctaLabel="View & Schedule"
            onChoose={goBreakfast}
            cardHeight={336}
            personalized
          />
          {/* Social Club */}
          <InviteCard
            day="Dissolves in ~4 Weeks"
            title="Social Club"
            Icon={inviteTheme['Social Club'].Icon}
            imageUrl={inviteTheme['Social Club'].img}
            body="A fixed cohort of 12–15 who share your agenda. Same people, rotating third spaces. Build momentum together."
            countdownDuration={2419200}
            ctaLabel="Join"
            onChoose={() => setView('club')}
            cardHeight={336}
            personalized
          />
          {/* Group Pairing
          <InviteCard
            day="Dissolves in ~4 Weeks"
            title="Personalized 4-person Outing"
            Icon={inviteTheme['Social Club'].Icon}
            imageUrl={inviteTheme['Social Club'].img}
            body="A fixed cohort of 12–15 who share your agenda. Same people, rotating third spaces. Build momentum together."
            countdownDuration={2419200}
            ctaLabel="Join"
            onChoose={() => setView('club')}
            cardHeight={336} 
          />*/}
        </DayHeaderCarousel>
      </div>
    );
  };

  const renderChooseDate = () => {
    const { day, title, time } = selectedEvent || {};
    const weekdayIdx = weekdayToIndex(day);
    const nextTwo = nextTwoDatesForWeekday(weekdayIdx);
    const copy = (itineraryCopy[title] && itineraryCopy[title][day]) || {
      title: 'Itinerary',
      bullets: ['Add details here…'],
    };
    const headerLabel = title;

    return (
      <div
        className="flex-1 bg-[#fff7eb] p-6 overflow-x-hidden max-w-3xl mx-auto px-6 page-fade"
        style={headerFont}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setView('home')}
              className="p-2 -ml-2 rounded-full hover:bg-black/5"
              aria-label="Back"
            >
              <svg width="20" height="20">
                <path
                  d="M12 4 6 10l6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold">Your {headerLabel}</h1>
          </div>

          <div className="mb-4">
            <span className="font-bold">What date would you like to book?</span>
            <span className="text-gray-600"> (Required)</span>
          </div>

          <div className="flex flex-col gap-4">
            {nextTwo.map((d) => {
              const longDate = formatLongDate(d);
              const iso = dateKey(d);
              return (
                <label
                  key={iso}
                  onClick={() => setSelectedDateISO(iso)}
                  className={`bg-white rounded-2xl px-5 py-4 flex items-center justify-between cursor-pointer transition-all duration-150
                    ring-2 ring-transparent
                    ${
                      selectedDateISO === iso
                        ? 'shadow-[0_8px_#1f1f1f] border border-black'
                        : 'shadow-sm'
                    }`}
                >
                  <div className="pr-4">
                    <div className="font-bold">{copy.title}</div>
                    <div className="font-bold text-lg">{longDate}</div>
                    <div className="text-sm text-gray-600 mb-2">{time}</div>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {copy.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>
                  <input
                    type="radio"
                    name="dateChoice"
                    className="h-5 w-5"
                    style={{ accentColor: '#e8420aff' }}
                    checked={selectedDateISO === iso}
                    onChange={() => setSelectedDateISO(iso)}
                  />
                </label>
              );
            })}
          </div>

          <div className="mt-8">
            <button
              disabled={!selectedDateISO}
              onClick={() => goConfirm({ detailedTitle: copy.title })}
              className={`w-full rounded-full py-3 text-center font-bold ${
                selectedDateISO
                  ? 'bg-black text-white'
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderBreakfast = () => {
    const options = nextTwoDays();
    const neighborhoods = ['Santa Monica', 'Venice'];
    return (
      // Entire Page

      <div
        className="flex-1 bg-gradient-to-bl from-gray-800 to-black text-white relative overflow-hidden"
        style={headerFont}
      >
        {/* Banner + [a] Match Info Profile + [b] Date Selection + [c] Two Buttons  */}
        <div className="max-w-3xl mx-auto">
          {/* Banner */}
          <div className="relative rounded-xl max-w-3xl h-[35vh] min-h-[20vh] bg-transparent text-white relative overflow-hidden border border-white/10 mt-4">
            {/* Image */}
            <img
              src={inviteTheme['Breakfast'].img}
              alt=""
              className="absolute inset-0 w-full h-full object-cover hero-float opacity-70 z-0"
            />

            {/* Info within Image */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
              <div
                className="reveal d1 text-3xl md:text-4xl font-bold tracking-wide"
                style={{ fontFamily: '"Alias Union", serif' }}
              >
                <button
                  onClick={() => setView('home')}
                  className="p-2 -ml-2 rounded-full border border-white/10 hover:bg-white/5"
                  aria-label="Back"
                >
                  <svg width="20" height="20">
                    <path
                      d="M12 4 6 10l6 6"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </button>
                <span>☕</span>
                <span className="italic">A Breakfast Curated for You</span>
              </div>
              <div className="reveal d2 mt-2 text-white/80 text-sm md:text-base">
                Your passions match. Your timelines align. Can we set up one
                hour this week to swap ideas?
              </div>
              <div className="animate-pulse reveal d3 mt-4 rounded-full px-4 py-1 bg-red-700/90 backdrop-blur-md border border-white/15 shadow-md">
                <Countdown
                  duration={43200}
                  className="text-white text-xs tracking-wide"
                />
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-6 pb-16 -mt-2">
            {/* [a] Match Info Profile */}
            <div className="reveal d3 mt-6 rounded-2xl bg-white/[.04] border border-white/10 p-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <div className="text-white/60 text-xs">Gender</div>
                  <div className="font-bold">{breakfastProfile.gender}</div>
                </div>
                <div>
                  <div className="text-white/60 text-xs">Age</div>
                  <div className="font-bold">{breakfastProfile.ageRange}</div>
                </div>
                <div>
                  <div className="text-white/60 text-xs">Building/Dreaming</div>
                  <div className="font-bold">{breakfastProfile.building}</div>
                </div>
                <div>
                  <div className="text-white/60 text-xs">
                    Something They're Proud of
                  </div>
                  <div className="font-bold">{breakfastProfile.proudOf}</div>
                </div>
              </div>
              <div className="mt-4 text-white/60 text-xs">What to expect</div>
              <ul className="mt-1 list-disc list-inside space-y-1 text-sm">
                <li>Weekly wins</li>
                <li>Critique & feedback</li>
                <li>Accountability pairs</li>
              </ul>
            </div>

            {/* [b] Date Selection */}
            <div className="reveal d4 mt-4 mb-4">
              <span className="font-bold text-white/70">
                Pick a time & neighborhood
              </span>
              <span className="text-gray-600"> (Required)</span>
            </div>

            {/* [b] Date Selection Options */}
            <div className="reveal d4 flex flex-col gap-4">
              {options.map((d, idx) => {
                const longDate = formatLongDate(d);
                const iso = dateKey(d);
                const hood = neighborhoods[idx] || neighborhoods[0];
                return (
                  <label
                    key={iso}
                    onClick={() => setSelectedDateISO(iso)}
                    className={`rounded-2xl p-5 mb-4 bg-white/[.04] border border-white/10 px-5 py-4 flex items-center justify-between cursor-pointer transition-all duration-150
                    ring-2 ring-transparent
                    ${
                      selectedDateISO === iso
                        ? 'shadow-[0_8px_#fff7eb] border border-[#fff7eb]'
                        : 'shadow-sm'
                    }`}
                  >
                    <div className="pr-4">
                      <div className="font-bold text-white/60">
                        1x1 Breakfast / Coffee
                      </div>
                      <div className="font-bold text-lg text-white">
                        {longDate}
                      </div>
                      <div className="text-sm text-white/70 mb-1">9:00 AM</div>
                      <div className="inline-flex items-center text-xs font-semibold bg-white/10 text-white px-2 py-1 rounded-full">
                        {hood}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="dateChoice"
                      className="h-5 w-5"
                      style={{ accentColor: '#e8420aff' }}
                      checked={selectedDateISO === iso}
                      onChange={() => setSelectedDateISO(iso)}
                    />
                  </label>
                );
              })}
            </div>

            {/* [c] Two Buttons / Preferences */}
            <div className="mt-1 mb-2 text-xs italic text-gray-300">
              You added Friday, Saturday as your preferred days for breakfast
            </div>
            <div className="mt-2 mb-6 flex justify-center">
              <button className="px-6 py-3 rounded-full text-white text-sm font-semibold bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-200">
                Edit My Preferences
              </button>
            </div>

            <div className="mt-4 mb-8">
              <button
                disabled={!selectedDateISO}
                onClick={() =>
                  goConfirm({ detailedTitle: 'Breakfast / Coffee' })
                }
                className={`w-full rounded-full py-3 text-center text-white font-bold font-semibold bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-200${
                  selectedDateISO
                    ? 'bg-white/10 text-white'
                    : 'bg-white/30 text-gray-500'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSocialClub = () => {
    return (
      <>
        {/* Whole Body */}
        <div
          className="flex-1 bg-gradient-to-bl from-gray-800 to-black text-white relative overflow-hidden"
          style={headerFont}
        >
          {/* Narrow Container */}
          <div className="max-w-3xl mx-auto">
            {/* Banner*/}
            <div className="relative rounded-xl max-w-3xl h-[35vh] min-h-[20vh] bg-transparent text-white relative overflow-hidden border border-white/10 mt-4">
              {/* Image */}
              <img
                src={inviteTheme['Social Club'].img}
                alt=""
                className="absolute inset-0 w-full h-full object-cover hero-float opacity-70 z-0"
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                {/* Header + Back Button */}
                <div
                  className="reveal d1 text-3xl md:text-4xl font-extrabold italic tracking-wide"
                  style={{ fontFamily: '"Alias Union", serif' }}
                >
                  <button
                    onClick={() => setView('home')}
                    className="p-2 -ml-2 rounded-full border border-white/10 hover:bg-white/5"
                    aria-label="Back"
                  >
                    <svg width="20" height="20">
                      <path
                        d="M12 4 6 10l6 6"
                        stroke="white"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </button>
                  ✨ The 4-Week Creative Builders Circle
                </div>
                <div className="reveal d2 mt-2 text-white/80 text-sm md:text-base">
                  A fixed cohort to build momentum together.
                </div>
                <div className="animate-pulse reveal d3 mt-4 rounded-full px-4 py-1 bg-red-700/90 backdrop-blur-md border border-white/15 shadow-md">
                  <Countdown
                    duration={2419200}
                    className="text-white text-xs tracking-wide"
                  />
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 pb-16 -mt-2">
              <p className="reveal d2 mt-2 text-white/90">
                We matched you based on your maker streak, love of critique, and
                habit of shipping weekly.
              </p>
              <div className="reveal d3 mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm">
                  Makers
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm">
                  Accountability
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm">
                  Feedback culture
                </span>
              </div>

              {/* Club Information Block */}
              <div className="reveal d4 mt-6 rounded-2xl bg-white/[.04] border border-white/10 p-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <div className="text-white/60 text-xs">First session</div>
                    <div className="font-bold">Next Wednesday • 7:00 PM</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs">Neighborhood</div>
                    <div className="font-bold">Westside (rotating venues)</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs">Duration</div>
                    <div className="font-bold">4 weeks</div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs">Group size</div>
                    <div className="font-bold">8–12 (fixed cohort)</div>
                  </div>
                </div>
                <div className="mt-4 text-white/60 text-xs">What to expect</div>
                <ul className="mt-1 list-disc list-inside space-y-1 text-sm">
                  <li>Weekly wins</li>
                  <li>Critique & feedback</li>
                  <li>80% required attendance</li>
                </ul>
              </div>

              <div className="reveal d4 mt-4 text-xs text-white/60">
                Exact locations shared after confirmation. If the cohort fills,
                we’ll offer the next start date.
              </div>

              <div className="mt-8">
                <button
                  onClick={() => {
                    const startDate = nextWeekdayDate(club.startsWeekday);
                    setSelectedEvent({
                      // canonical event fields used by renderConfirm/renderConfirmed
                      title: '4-Week Social Club',
                      detailedTitle: club.title, // what you want shown in Event row
                      emoji: club.emoji,
                      day: club.startsWeekday,
                      time: club.startsTime,
                    });
                    setSelectedDateISO(dateKey(startDate)); // so confirmed page shows the right date
                    setView('confirmed');
                  }}
                  className="w-full rounded-full py-3 font-bold bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-200"
                >
                  Confirm my spot
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderConfirm = () => {
    const { day, title, time, emoji, detailedTitle } = selectedEvent || {};
    const dateStr = selectedDateISO ? formatLongDate(selectedDateISO) : '';

    const finalTitle = detailedTitle || title || '';
    const finalEmoji = emoji || inviteTheme[title]?.emoji || '';

    return (
      <div
        className="flex-1 bg-[#fff7eb] p-6 overflow-x-hidden max-w-3xl mx-auto px-6 page-fade"
        style={headerFont}
      >
        <div className="max-w-3xl mx-auto pb-24">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() =>
                setView(title === 'Breakfast' ? 'breakfast' : 'chooseDate')
              }
              className="p-2 -ml-2 rounded-full hover:bg-black/5"
              aria-label="Back"
            >
              <svg width="20" height="20">
                <path
                  d="M12 4 6 10l6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold">Your {title}</h1>
          </div>

          <div className="bg-white rounded-2xl border border-black p-5 mb-4">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600">Event</div>
                <div className="text-lg font-bold">
                  {finalEmoji} {finalTitle}
                </div>
              </div>
              <div className="border-t border-dashed"></div>
              <div>
                <div className="text-sm text-gray-600">Date</div>
                <div className="text-lg font-bold">{dateStr}</div>
              </div>
              <div className="border-t border-dashed"></div>
              <div>
                <div className="text-sm text-gray-600">Time</div>
                <div className="text-lg font-bold">{time}</div>
              </div>
              <div className="border-t border-dashed"></div>
              <div>
                <div className="text-sm text-gray-600">Cost</div>
                <div className="text-lg font-bold">Included in membership</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black p-5">
            <div className="space-y-5">
              <div>
                <div className="text-sm text-gray-600">Budget</div>
                <div className="text-lg font-bold">$, $$</div>
              </div>
              <div className="border-t border-dashed"></div>
              <div>
                <div className="text-sm text-gray-600">Dietary preferences</div>
                <div className="text-lg font-bold">No restrictions</div>
              </div>
              <div className="border-t border-dashed"></div>
              <div>
                <div className="text-sm text-gray-600">Language</div>
                <div className="text-lg font-bold">English</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button className="px-6 py-3 rounded-full font-bold bg-white border border-black hover:bg-white/70 transition-all duration-200">
              Edit my preferences
            </button>
          </div>

          <div className="mt-8">
            <button
              onClick={() => setView('confirmed')}
              className="w-full rounded-full py-3 text-white font-bold bg-black backdrop-blur-md border border-white/20 shadow-lg hover:gray-700 transition-all duration-200"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderConfirmed = () => {
    const dateStr = selectedDateISO
      ? formatLongDate(new Date(selectedDateISO))
      : '';
    const isBreakfast = (selectedEvent?.title || '')
      .toLowerCase()
      .includes('breakfast');

    const itineraryTitle =
      selectedEvent?.title &&
      selectedEvent?.day &&
      itineraryCopy[selectedEvent.title] &&
      itineraryCopy[selectedEvent.title][selectedEvent.day]
        ? itineraryCopy[selectedEvent.title][selectedEvent.day].title
        : null;

    const detailedTitle = isBreakfast
      ? selectedEvent?.detailTitle || 'Breakfast / Coffee'
      : itineraryTitle || selectedEvent?.title || 'Your Event';

    const displayEmoji =
      selectedEvent?.emoji ||
      (selectedEvent?.title === 'Dinner & Explore'
        ? '🍽️'
        : selectedEvent?.title === 'Drinks'
        ? '🍹'
        : selectedEvent?.title === 'Run'
        ? '🏃'
        : isBreakfast
        ? '☕'
        : '✨');

    return (
      <div className="flex-1 bg-[#fff7eb] p-6 overflow-hidden max-w-3xl mx-auto px-6 page-fade relative">
        {/* simple confetti */}
        <style>{`
          @keyframes fall {
            0% { transform: translateY(-20vh) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
          }
          .confetti {
            position: absolute; top: -10vh;
            width: 8px; height: 14px; border-radius: 2px;
            animation: fall linear forwards;
          }       
        `}</style>

        {[...Array(40)].map((_, i) => (
          <span
            key={i}
            className="confetti"
            style={{
              left: `${(i * 97) % 100}%`,
              background: [
                '#FF6B35',
                '#FFD166',
                '#06D6A0',
                '#118AB2',
                '#EF476F',
              ][i % 5],
              animationDuration: `${5 + (i % 4)}s`,
              animationDelay: `${(i % 10) * 0.12}s`,
            }}
          />
        ))}

        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
          <div
            className="text-4xl mb-4 font-extrabold italic tracking-wide"
            style={{ fontFamily: '"Alias Union", serif' }}
          >
            Making the most of your
          </div>
          <img
            src="https://timeleft.com/wp-content/uploads/2023/08/logo_black.svg"
            alt="Timeleft Logo"
            className="w-32 h-auto mx-auto mb-4"
          />

          <div className="mt-2 text-xl font-bold">
            {displayEmoji} Your spot at {detailedTitle} is confirmed
          </div>
          <div className="mt-1 text-lg text-gray-700">
            for {selectedEvent?.time || '—'} on {dateStr || '—'}
          </div>
        </div>
      </div>
    );
  };

  function renderProfile() {
    return (
      <div className="flex-1 bg-[#fff7eb] text-[#1f1f1f] p-6 overflow-x-hidden">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-extrabold">Profile</h1>
            <button
              className="p-2 rounded-full hover:bg-black/5"
              aria-label="Settings"
              title="Settings"
            >
              <Settings
                strokeWidth={2}
                className="flex-none w-[22px] h-[22px]"
              />
            </button>
          </div>

          {/* Avatar / name / edit */}
          <div className="flex flex-col items-center mb-6">
            <img
              src="https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?q=80&w=200&h=200&fit=crop"
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
            />
            <div className="mt-3 text-xl font-semibold">Brian</div>
            <button className="mt-4 px-6 py-3 rounded-full border border-black bg-white font-bold">
              Edit profile
            </button>
          </div>

          {/* ---- Member card (platinum / dark) ---- */}
          <div className="mb-6">
            <div className="pt-8 pb-8 relative rounded-2xl overflow-hidden border border-black/20 shadow-xl">
              {/* background image + gradient */}
              <img
                src="https://images.unsplash.com/photo-1730544531296-ea17ddc154fd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45),rgba(0,0,0,0.75))]" />
              {/* content */}
              <div className="relative px-5 py-6 text-white">
                <div className="text-[10px] tracking-[0.2em] uppercase opacity-80">
                  Membership
                </div>
                <div className="mt-1 text-2xl font-extrabold">
                  Timeleft Member
                </div>
                <div className="mt-1 text-sm opacity-90">Global Access</div>

                <div className="mt-5 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-sm" />
                  <div className="text-xs opacity-90">
                    Present this card to access exclusive Timeleft spaces in
                    cities around the world.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Your Bookings */}
          <button className="w-full bg-transparent rounded-2xl p-5 text-left flex items-center justify-between border border-black/70 mb-3">
            <div className="flex items-center gap-3">
              <Calendar
                strokeWidth={2}
                className="flex-none w-[22px] h-[22px]"
              />
              <div className="font-extrabold">Your Bookings</div>
            </div>
            <span className="text-2xl leading-none">›</span>
          </button>

          {/* Help Center */}
          <button className="w-full bg-transparent rounded-2xl p-5 text-left flex items-center justify-between border border-black/70 mb-5">
            <div className="flex items-center gap-3">
              <Calendar
                strokeWidth={2}
                className="flex-none w-[22px] h-[22px]"
              />
              <div className="font-extrabold">Help Center</div>
            </div>
            <span className="text-2xl leading-none">›</span>
          </button>

          {/* Guide card */}
          <div className="bg-transparent rounded-2xl p-5 border border-black/70">
            <div className="font-extrabold text-lg mb-2">Guide</div>
            <div className="text-[17px] font-semiboldtext-gray-700 mb-4">
              Discover our 6 steps to talking to strangers and having
              unforgettable dinners.
            </div>
            <div className="flex">
              <button className="ml-auto px-6 py-3 rounded-full border border-black bg-white font-bold">
                Check it out
              </button>
            </div>
          </div>

          {/* Back to Home (optional) */}
          <div className="h-10" />
        </div>
      </div>
    );
  }

  const renderCurrent = () =>
    view === 'home'
      ? renderHome()
      : view === 'chooseDate'
      ? renderChooseDate()
      : view === 'breakfast'
      ? renderBreakfast()
      : view === 'confirm'
      ? renderConfirm()
      : view === 'club'
      ? renderSocialClub()
      : view === 'confirmed'
      ? renderConfirmed()
      : view === 'profile'
      ? renderProfile()
      : null;

  /* ---------- Layout (left nav + view switch) ---------- */
  return (
    <div
      className={`${
        dark ? 'bg-[#0b0c0e] text-white' : 'bg-[#fff7eb] text-[#1f1f1f]'
      } min-h-screen`}
      style={headerFont}
    >
      {/* Nav (left on md+, bottom on mobile) */}
      <Nav view={view} setView={setView} dark={dark} />

      {/* Content wrapper: add space for nav (pb on mobile, ml on desktop) */}
      <div className="pt-0 pb-40 md:pb-0 md:ml-40">
        <div className="items-center">
          {/* <h1>Timeleft Demo</h1>

          🔽 Minimal Wiring section goes here
          <button onClick={() => setOverlay({ open: true, mode: 'postEvent' })}>
            Open Post-Event
          </button>
          <button onClick={() => setOverlay({ open: true, mode: 'planner' })}>
            Open Weekly Planner
          </button> */}

          {/* Attach the overlay */}
          <ConciergeOverlay
            open={overlay.open}
            mode={overlay.mode}
            onClose={() => setOverlay((s) => ({ ...s, open: false }))}
            // onSubmit={handleSubmit}
          />
        </div>

        {/* force re-animate on view change if you’re using page-fade */}
        <div key={view} className="page-fade">
          {view === 'home'
            ? renderHome()
            : view === 'chooseDate'
            ? renderChooseDate()
            : view === 'breakfast'
            ? renderBreakfast()
            : view === 'confirm'
            ? renderConfirm()
            : view === 'club'
            ? renderSocialClub()
            : view === 'confirmed'
            ? renderConfirmed()
            : view === 'profile'
            ? renderProfile()
            : null}
        </div>
      </div>
    </div>
  );
}
