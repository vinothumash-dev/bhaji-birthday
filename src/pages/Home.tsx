import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Heart, Lock } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  CONFIG — CHANGE THESE                                              */
/* ------------------------------------------------------------------ */
const PASSCODE = '14-10-1997'; // DD-MM-YYYY

// June 7, 2026 midnight IST — REAL DATE
// const UNLOCK_DATE = new Date('2026-06-07T00:00:00+05:30');
// const EXPIRY_DATE = new Date('2026-06-07T00:01:00+05:30');

// Test mode: June 6, 1:50 PM IST
const UNLOCK_DATE = new Date('2026-06-06T14:40:00+05:30');
const EXPIRY_DATE = new Date('2026-06-06T14:41:00+05:30');

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type Section = 'opening' | 'passcode' | 'gallery' | 'final' | 'ending' | 'expired';

interface MemoryItem {
  photo: string;
  caption: string;
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const easeCustom: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: easeCustom } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.8, delayChildren: 0.3 } },
};

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 1.5, ease: easeCustom } },
  exit: { opacity: 0, transition: { duration: 0.8 } },
};

/* ------------------------------------------------------------------ */
/*  TypingText                                                         */
/* ------------------------------------------------------------------ */
function TypingText({ text, speed = 80, className = '', onComplete }: { text: string; speed?: number; className?: string; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="inline-block w-[2px] h-[1em] bg-neutral-400 ml-1 animate-caret-blink align-middle" />}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Opening Screen                                                     */
/* ------------------------------------------------------------------ */
function OpeningScreen({ onUnlock }: { onUnlock: () => void }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeLeftMs = UNLOCK_DATE.getTime() - now.getTime();
  const isUnlocked = timeLeftMs <= 0;

  const countdown = () => {
    const diff = Math.max(0, timeLeftMs);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } = countdown();

  return (
    <motion.div
      className="h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.02)_0%,_transparent_60%)] pointer-events-none" />

      <motion.div className="text-center max-w-lg" variants={staggerContainer} initial="hidden" animate="visible">
        <motion.p className="text-sm text-neutral-500 mb-4 tracking-widest uppercase" variants={fadeInUp}>
          A small thing for
        </motion.p>
        <motion.h1 className="text-3xl md:text-5xl font-light text-neutral-200 leading-relaxed tracking-wide" variants={fadeInUp}>
          <TypingText text="Bhaji" speed={120} />
        </motion.h1>
        <motion.p className="text-lg md:text-xl text-neutral-500 mt-4" variants={fadeInUp} transition={{ delay: 1.5 }}>
          also known as Nasa
        </motion.p>
      </motion.div>

      {!isUnlocked && (
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 1.5 }}
        >
          <p className="text-xs text-neutral-700 mb-6">June 7th, at 12:00 AM IST</p>
          <div className="flex gap-4 md:gap-8 justify-center font-mono text-3xl md:text-5xl text-neutral-400 tracking-widest">
            <div className="text-center">
              <div className="text-neutral-300">{String(days).padStart(2, '0')}</div>
              <div className="text-xs text-neutral-700 mt-1 uppercase">Days</div>
            </div>
            <div className="text-neutral-700">:</div>
            <div className="text-center">
              <div className="text-neutral-300">{String(hours).padStart(2, '0')}</div>
              <div className="text-xs text-neutral-700 mt-1 uppercase">Hrs</div>
            </div>
            <div className="text-neutral-700">:</div>
            <div className="text-center">
              <div className="text-neutral-300">{String(minutes).padStart(2, '0')}</div>
              <div className="text-xs text-neutral-700 mt-1 uppercase">Min</div>
            </div>
            <div className="text-neutral-700">:</div>
            <div className="text-center">
              <div className="text-neutral-300">{String(seconds).padStart(2, '0')}</div>
              <div className="text-xs text-neutral-700 mt-1 uppercase">Sec</div>
            </div>
          </div>
        </motion.div>
      )}

      {isUnlocked && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          onClick={onUnlock}
          className="mt-16 flex flex-col items-center gap-2 text-neutral-500 hover:text-neutral-300 transition-colors group cursor-pointer"
        >
          <span className="text-sm tracking-widest uppercase">Enter</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </motion.button>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Passcode Gate                                                      */
/* ------------------------------------------------------------------ */
function PasscodeGate({ onSuccess, onExpired }: { onSuccess: () => void; onExpired: () => void }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onExpired]);

  const handleSubmit = () => {
    if (input.trim() === PASSCODE) {
      if (timerRef.current) clearInterval(timerRef.current);
      onSuccess();
    } else {
      setError(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <motion.div
      className="h-screen flex flex-col justify-center items-center px-6 relative"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.02)_0%,_transparent_60%)] pointer-events-none" />

      {/* Timer bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-[3px] bg-neutral-900 w-full">
          <motion.div
            className={`h-full ${timeLeft > 30 ? 'bg-amber-400' : timeLeft > 10 ? 'bg-amber-600' : 'bg-red-500'}`}
            animate={{ width: `${(timeLeft / 60) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="absolute right-4 top-3 text-xs text-neutral-500">
          {timeLeft}s
        </div>
      </div>

      <motion.div className="text-center max-w-md w-full" variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={fadeInUp} className="mb-8">
          <Lock className="w-8 h-8 text-neutral-500 mx-auto" />
        </motion.div>

        <motion.h2 className="text-2xl md:text-3xl font-light text-neutral-200 mb-4" variants={fadeInUp}>
          The vault is open.
        </motion.h2>

        <motion.p className="text-sm text-neutral-500 mb-2" variants={fadeInUp}>
          But only for one minute.
        </motion.p>
        <motion.p className="text-sm text-red-400 mb-2 font-medium" variants={fadeInUp}>
          If you do not enter in time, this vault closes forever.
        </motion.p>
        <motion.p className="text-sm text-neutral-600 mb-12" variants={fadeInUp}>
          Enter our date to unlock.
        </motion.p>

        <motion.div variants={fadeInUp} className="w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            onKeyDown={handleKeyDown}
            placeholder="DD-MM-YYYY"
            className={`w-full bg-transparent border-b text-center text-2xl text-neutral-200 pb-4 focus:outline-none transition-colors placeholder:text-neutral-700 tracking-widest ${
              error ? 'border-red-500' : 'border-neutral-700 focus:border-neutral-500'
            }`}
          />
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-red-400 mt-4"
            >
              That is not our date.
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          variants={fadeInUp}
          onClick={handleSubmit}
          className={`mt-12 px-8 py-3 border rounded-full text-sm transition-all duration-500 cursor-pointer ${
            input.trim()
              ? 'border-neutral-500 text-neutral-300 hover:bg-white hover:text-black'
              : 'border-neutral-800 text-neutral-700 cursor-not-allowed'
          }`}
        >
          Unlock
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Expired Screen                                                     */
/* ------------------------------------------------------------------ */
function ExpiredScreen() {
  return (
    <motion.div
      className="h-screen flex flex-col justify-center items-center px-6 relative"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(100,100,100,0.03)_0%,_transparent_60%)] pointer-events-none" />

      <motion.div className="text-center max-w-sm" variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={fadeInUp} className="mb-8">
          <Lock className="w-10 h-10 text-neutral-600 mx-auto" />
        </motion.div>

        <motion.h2 className="text-3xl md:text-4xl font-light text-neutral-200 mb-8 tracking-wide" variants={fadeInUp}>
          The window has closed.
        </motion.h2>

        <motion.div className="space-y-4 text-sm text-neutral-600 leading-relaxed" variants={fadeInUp}>
          <p>It was only open for one minute.</p>
          <p>That minute is gone.</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-16">
          <Heart className="w-5 h-5 text-neutral-800 mx-auto fill-neutral-800/50" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Memory Data                                                        */
/* ------------------------------------------------------------------ */
const memories: MemoryItem[] = [
  { photo: './image1.jpg', caption: 'The first time I pointed a camera at you. You probably made that face.' },
  { photo: './image2.jpg', caption: 'My love. My bhaji. My permanent headache.' },
  { photo: './image3.jpg', caption: 'Same person. Different lighting. Still annoying.' },
  { photo: './image4.jpg', caption: 'That day you proved you were basically a large child I have to babysit.' },
  { photo: './image5.jpg', caption: 'Almost 2 years of you being around. Some days sunshine. Some days shadow. Mostly just... there.' },
  { photo: './image6.jpg', caption: "First time I bought you flowers. Didn't know you'd actually care. You kept them. Weirdo." },
  { photo: './image7.jpg', caption: '2026 has been rough. But that one New Year day was okay. Because you were there. I guess.' },
  { photo: './image8.jpg', caption: 'A bunch of random moments. Somehow they matter.' },
  { photo: './image9.jpg', caption: "One of those days with people I actually like. You're in it somehow." },
  { photo: './image10.jpg', caption: 'Saying bye to you is annoying. Stop leaving.' },
];

/* ------------------------------------------------------------------ */
/*  Gallery                                                            */
/* ------------------------------------------------------------------ */
function Gallery({ onComplete }: { onComplete: () => void }) {
  const [index, setIndex] = useState(0);
  const [showCaption, setShowCaption] = useState(false);

  const current = memories[index];
  const isLast = index === memories.length - 1;

  useEffect(() => {
    setShowCaption(false);
    const t = setTimeout(() => setShowCaption(true), 1200);
    return () => clearTimeout(t);
  }, [index]);

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center items-center px-6 py-20 relative"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.03)_0%,_transparent_60%)] pointer-events-none" />

      <motion.div className="text-center max-w-md w-full" variants={staggerContainer} initial="hidden" animate="visible">
        <motion.p className="text-xs text-neutral-600 tracking-[0.3em] mb-6 uppercase" variants={fadeInUp}>
          {index + 1} / {memories.length}
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.photo}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1, ease: easeCustom }}
            className="mb-8 golden-glow rounded-lg overflow-hidden inline-block"
          >
            <img src={current.photo} alt="Memory" className="max-w-[300px] md:max-w-[360px] w-full h-auto rounded-lg" />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showCaption && (
            <motion.p
              key={current.caption}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-sm mx-auto"
            >
              {current.caption}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          onClick={handleNext}
          className="mt-12 px-8 py-3 border border-neutral-700 rounded-full text-sm text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-all duration-500 cursor-pointer"
        >
          {isLast ? 'Continue' : 'Next'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Final Message — Happy Birthday                                     */
/* ------------------------------------------------------------------ */
function FinalMessage({ onComplete }: { onComplete: () => void }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const lines = [
    'Nasa.',
    'You are a lot of work.',
    'But you are my work.',
    'Happy Birthday, Bhaji.',
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center items-center px-6 py-20 relative"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.02)_0%,_transparent_60%)] pointer-events-none" />

      <motion.div className="text-center max-w-lg" initial="hidden" animate="visible">
        <motion.h2
          className="text-5xl md:text-6xl font-handwriting text-neutral-300 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          <TypingText text="Okay, fine." speed={120} />
        </motion.h2>

        {lines.map((line, idx) => (
          <motion.p
            key={idx}
            className={`text-lg md:text-xl text-neutral-300 leading-[2.5] ${idx === lines.length - 1 ? 'font-handwriting text-2xl md:text-3xl mt-6' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 + idx * 1.2, duration: 1.5 }}
          >
            {line}
            {idx === lines.length - 1 && <Heart className="inline-block w-5 h-5 text-red-400 ml-2 fill-red-400/30" />}
          </motion.p>
        ))}

        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              onClick={onComplete}
              className="mt-16 px-8 py-3 border border-neutral-700 rounded-full text-sm text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-all duration-500 cursor-pointer"
            >
              Close the vault
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ending                                                             */
/* ------------------------------------------------------------------ */
function Ending() {
  return (
    <motion.div
      className="h-screen flex flex-col justify-center items-center px-6 relative"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.01)_0%,_transparent_60%)] pointer-events-none" />

      <motion.div className="text-center max-w-sm" variants={staggerContainer} initial="hidden" animate="visible">
        <motion.p className="text-xl text-neutral-400 mb-8" variants={fadeInUp}>
          That is all.
        </motion.p>

        <motion.div className="space-y-4 text-sm text-neutral-700 leading-relaxed" variants={fadeInUp}>
          <p>This was meant to happen only once.</p>
          <p>And now it belongs only to memory.</p>
          <p>Go bother someone else now.</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-16">
          <Heart className="w-5 h-5 text-neutral-800 mx-auto fill-neutral-800/50" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Home Component                                                */
/* ------------------------------------------------------------------ */
export default function Home() {
  const [section, setSection] = useState<Section>('opening');

  // Check if expired on mount
  useEffect(() => {
    const now = new Date();
    if (now >= EXPIRY_DATE) {
      setSection('expired');
    }
  }, []);

  const renderSection = () => {
    switch (section) {
      case 'opening':
        return <OpeningScreen onUnlock={() => setSection('passcode')} />;
      case 'passcode':
        return (
          <PasscodeGate
            onSuccess={() => setSection('gallery')}
            onExpired={() => setSection('expired')}
          />
        );
      case 'gallery':
        return <Gallery onComplete={() => setSection('final')} />;
      case 'final':
        return <FinalMessage onComplete={() => setSection('ending')} />;
      case 'ending':
        return <Ending />;
      case 'expired':
        return <ExpiredScreen />;
      default:
        return <OpeningScreen onUnlock={() => setSection('passcode')} />;
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={section}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: easeCustom }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
