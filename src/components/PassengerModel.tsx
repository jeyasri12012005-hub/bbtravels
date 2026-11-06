import React from 'react';
import { Gender } from '../types/bus';

interface PassengerModelProps {
  gender: Gender;
  className?: string;
  isMini?: boolean;
}

/**
 * High-detail, realistic seated Adult Male passenger model.
 * Realistic proportions, seated posture, navy collared travel shirt, natural skin tones.
 * Rendered to sit naturally inside the seat contours (head on headrest, torso on backrest, lap in seat cushion).
 */
export const MalePassengerModel: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 130"
      className={`w-full h-full select-none pointer-events-none drop-shadow-sm ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Male Skin Gradients */}
        <linearGradient id="maleSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DF9E7B" />
          <stop offset="45%" stopColor="#CE8A63" />
          <stop offset="100%" stopColor="#A46442" />
        </linearGradient>
        <linearGradient id="maleNeckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B6734E" />
          <stop offset="100%" stopColor="#965836" />
        </linearGradient>

        {/* Realistic Hair Gradient */}
        <linearGradient id="maleHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D2825" />
          <stop offset="40%" stopColor="#1E1917" />
          <stop offset="100%" stopColor="#0F0C0B" />
        </linearGradient>

        {/* Navy Blue Travel Shirt */}
        <linearGradient id="maleShirtGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#253556" />
          <stop offset="50%" stopColor="#1E2A44" />
          <stop offset="100%" stopColor="#121B2F" />
        </linearGradient>
        <linearGradient id="maleCollarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2E4068" />
          <stop offset="100%" stopColor="#1B263E" />
        </linearGradient>

        {/* Trousers Gradient */}
        <linearGradient id="malePantsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#30353E" />
          <stop offset="100%" stopColor="#1C2026" />
        </linearGradient>

        {/* Subtle Ambient Occlusion */}
        <radialGradient id="maleSeatShadow" cx="50%" cy="100%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Seat contact shadow at hips */}
      <ellipse cx="50" cy="120" rx="36" ry="7" fill="url(#maleSeatShadow)" />

      {/* Seated Thighs / Lap - positioned firmly in cushion */}
      <path
        d="M24 94 C24 90 28 86 38 86 L62 86 C72 86 76 90 76 94 L79 122 C79 126 73 129 65 129 L35 129 C27 129 21 126 21 122 Z"
        fill="url(#malePantsGrad)"
      />
      {/* Trousers center crease & fold */}
      <path d="M50 92 L50 128" stroke="#16181C" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M35 102 C39 105 45 106 48 106" stroke="#252A33" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      <path d="M65 102 C61 105 55 106 52 106" stroke="#252A33" strokeWidth="1" strokeLinecap="round" opacity="0.5" />

      {/* Torso / Navy Shirt - resting against backrest */}
      <path
        d="M26 50 C26 44 32 40 40 38 L60 38 C68 40 74 44 74 50 L78 88 C78 92 74 95 68 95 L32 95 C26 95 22 92 22 88 Z"
        fill="url(#maleShirtGrad)"
      />

      {/* Shirt fabric wrinkles & natural folds */}
      <path d="M30 62 C38 65 42 66 50 65" stroke="#172238" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <path d="M70 63 C62 66 58 66 50 65" stroke="#172238" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
      <path d="M34 78 C40 80 44 81 50 81" stroke="#172238" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M66 78 C60 80 56 81 50 81" stroke="#172238" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

      {/* Shirt Placket & Buttons */}
      <path d="M50 42 L50 92" stroke="#18233A" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="50" cy="52" r="1.3" fill="#A5B3D0" />
      <circle cx="50" cy="64" r="1.3" fill="#A5B3D0" />
      <circle cx="50" cy="76" r="1.3" fill="#A5B3D0" />

      {/* Arms & Sleeves resting naturally towards armrests */}
      {/* Left Arm */}
      <path
        d="M26 48 L17 68 C15 73 17 80 22 84 L28 88 L33 80 L25 58 Z"
        fill="url(#maleShirtGrad)"
      />
      {/* Right Arm */}
      <path
        d="M74 48 L83 68 C85 73 83 80 78 84 L72 88 L67 80 L75 58 Z"
        fill="url(#maleShirtGrad)"
      />

      {/* Hands resting on thighs/lap */}
      {/* Left Hand */}
      <ellipse cx="32" cy="98" rx="6.5" ry="5" fill="url(#maleSkinGrad)" transform="rotate(-15 32 98)" />
      {/* Right Hand */}
      <ellipse cx="68" cy="98" rx="6.5" ry="5" fill="url(#maleSkinGrad)" transform="rotate(15 68 98)" />

      {/* Smart Shirt Collar */}
      <path
        d="M39 37 L50 48 L44 49 L37 40 Z"
        fill="url(#maleCollarGrad)"
        stroke="#162035"
        strokeWidth="0.8"
      />
      <path
        d="M61 37 L50 48 L56 49 L63 40 Z"
        fill="url(#maleCollarGrad)"
        stroke="#162035"
        strokeWidth="0.8"
      />

      {/* Neck */}
      <path
        d="M44 32 L44 42 C46 44 54 44 56 42 L56 32 Z"
        fill="url(#maleNeckGrad)"
      />
      <path d="M46 39 C49 42 51 42 54 39" stroke="#7A4222" strokeWidth="0.8" opacity="0.6" />

      {/* Head / Face - natural jawline & realistic human profile */}
      <path
        d="M37 17 C37 10 42 7 50 7 C58 7 63 10 63 17 C63 24 61 31 57 34 C54 36 46 36 43 34 C39 31 37 24 37 17 Z"
        fill="url(#maleSkinGrad)"
      />

      {/* Facial Features (Realistic Subtle Profile) */}
      {/* Eyes & Eyebrows */}
      <path d="M42 16 Q45 15 47 16" stroke="#241B15" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M53 16 Q55 15 58 16" stroke="#241B15" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="45" cy="18.5" rx="1.6" ry="1.1" fill="#20150F" />
      <ellipse cx="55" cy="18.5" rx="1.6" ry="1.1" fill="#20150F" />

      {/* Nose bridge and tip */}
      <path d="M50 16 L49 22 L51.5 22.5" stroke="#9A5934" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />

      {/* Well-defined lips */}
      <path d="M46 27 Q50 28.5 54 27" stroke="#894A2D" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M48 29 Q50 30 52 29" stroke="#763920" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />

      {/* Realistic styled dark hair with natural volume */}
      <path
        d="M36 15 C36 8 41 4 50 4 C59 4 64 8 64 15 C64 17 63 19 62 19 C61 17 59 13 56 12 C51 11 44 12 40 16 C39 17 37 17 36 15 Z"
        fill="url(#maleHairGrad)"
      />
      {/* Hair texture strands */}
      <path d="M42 6 C46 5 53 5 57 8" stroke="#453B36" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M38 11 C42 9 48 8 52 10" stroke="#3D342F" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      {/* Sideburns */}
      <path d="M37 16 L37 21 L39 21 L38 16 Z" fill="#1C1715" />
      <path d="M63 16 L63 21 L61 21 L62 16 Z" fill="#1C1715" />

      {/* Ears */}
      <path d="M37 18 C36 18 35 20 35 22 C35 24 36 25 37 25" stroke="#AC6C47" strokeWidth="1.2" fill="#BE7D56" />
      <path d="M63 18 C64 18 65 20 65 22 C65 24 64 25 63 25" stroke="#AC6C47" strokeWidth="1.2" fill="#BE7D56" />
    </svg>
  );
};

/**
 * High-detail, realistic seated Adult Female passenger model.
 * Realistic proportions, seated posture, elegant maroon & teal travel kurti, natural hair bun, authentic skin tones.
 * Rendered to sit naturally inside the seat contours (head on headrest, torso on backrest, lap in seat cushion).
 */
export const FemalePassengerModel: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 100 130"
      className={`w-full h-full select-none pointer-events-none drop-shadow-sm ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Female Skin Gradients */}
        <linearGradient id="femaleSkinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E9AF8C" />
          <stop offset="45%" stopColor="#DCA07D" />
          <stop offset="100%" stopColor="#B67551" />
        </linearGradient>
        <linearGradient id="femaleNeckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C98460" />
          <stop offset="100%" stopColor="#AA6946" />
        </linearGradient>

        {/* Realistic Hair Gradient */}
        <linearGradient id="femaleHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2A201C" />
          <stop offset="50%" stopColor="#181311" />
          <stop offset="100%" stopColor="#0B0807" />
        </linearGradient>

        {/* Elegant Maroon Kurti */}
        <linearGradient id="kurtiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#871A34" />
          <stop offset="50%" stopColor="#6C1227" />
          <stop offset="100%" stopColor="#4A0B1A" />
        </linearGradient>

        {/* Teal Dupatta / Stole drape */}
        <linearGradient id="dupattaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0E7490" />
          <stop offset="60%" stopColor="#155E75" />
          <stop offset="100%" stopColor="#0C4A6E" />
        </linearGradient>

        {/* Kurti Gold Trim */}
        <linearGradient id="goldTrimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EAB308" />
          <stop offset="50%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>

        {/* Leggings / Lower Wear */}
        <linearGradient id="femalePantsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4A0B1A" />
          <stop offset="100%" stopColor="#2A050E" />
        </linearGradient>

        {/* Seat contact shadow at hips */}
        <radialGradient id="femaleSeatShadow" cx="50%" cy="100%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Seat contact shadow */}
      <ellipse cx="50" cy="120" rx="35" ry="7" fill="url(#femaleSeatShadow)" />

      {/* Lower Wear / Lap - resting inside seat cushion */}
      <path
        d="M25 93 C25 89 29 86 38 86 L62 86 C71 86 75 89 75 93 L78 122 C78 126 72 129 64 129 L36 129 C28 129 22 126 22 122 Z"
        fill="url(#femalePantsGrad)"
      />
      <path d="M50 90 L50 128" stroke="#1F040A" strokeWidth="1.3" opacity="0.6" strokeLinecap="round" />

      {/* Torso / Kurti - resting against backrest */}
      <path
        d="M27 49 C27 43 33 40 40 38 L60 38 C67 40 73 43 73 49 L76 94 C76 97 72 100 66 100 L34 100 C28 100 24 97 24 94 Z"
        fill="url(#kurtiGrad)"
      />

      {/* Elegant Kurti Neckline with Gold Border */}
      <path
        d="M42 38 Q50 51 58 38"
        stroke="url(#goldTrimGrad)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Front Gold Button Accents */}
      <circle cx="50" cy="56" r="1.2" fill="#FACC15" />
      <circle cx="50" cy="65" r="1.2" fill="#FACC15" />
      <circle cx="50" cy="74" r="1.2" fill="#FACC15" />

      {/* Teal Dupatta gracefully draped over left shoulder */}
      <path
        d="M32 40 C30 46 27 58 26 72 C25 82 27 94 33 97 C37 99 40 94 40 85 C40 70 38 52 35 41 Z"
        fill="url(#dupattaGrad)"
        opacity="0.95"
      />
      {/* Dupatta folds */}
      <path d="M31 46 C29 55 28 68 28 82" stroke="#083344" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      <path d="M35 52 C34 62 34 74 35 88" stroke="#083344" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />

      {/* Arms & Sleeves */}
      {/* Left Arm */}
      <path
        d="M27 47 L18 67 C16 72 18 78 23 82 L29 86 L33 78 L26 56 Z"
        fill="url(#kurtiGrad)"
      />
      {/* Right Arm */}
      <path
        d="M73 47 L82 67 C84 72 82 78 77 82 L71 86 L67 78 L74 56 Z"
        fill="url(#kurtiGrad)"
      />

      {/* Hands resting gracefully together on lap */}
      {/* Left Hand */}
      <ellipse cx="38" cy="94" rx="6" ry="4.5" fill="url(#femaleSkinGrad)" transform="rotate(-10 38 94)" />
      {/* Right Hand overlapping */}
      <ellipse cx="62" cy="94" rx="6" ry="4.5" fill="url(#femaleSkinGrad)" transform="rotate(10 62 94)" />
      {/* Delicate bangles on right wrist */}
      <path d="M72 82 L69 85" stroke="#FACC15" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M74 80 L71 83" stroke="#FACC15" strokeWidth="1.4" strokeLinecap="round" />

      {/* Neck */}
      <path
        d="M44 32 L44 42 C46 44 54 44 56 42 L56 32 Z"
        fill="url(#femaleNeckGrad)"
      />
      <path d="M46 38 C49 41 51 41 54 38" stroke="#8A4A28" strokeWidth="0.8" opacity="0.5" />

      {/* Head / Face - graceful natural female facial contours */}
      <path
        d="M38 18 C38 11 43 8 50 8 C57 8 62 11 62 18 C62 25 60 31 56 34 C53 36 47 36 44 34 C40 31 38 25 38 18 Z"
        fill="url(#femaleSkinGrad)"
      />

      {/* Facial Features */}
      {/* Eyebrows */}
      <path d="M42 16 Q45 14.5 48 16" stroke="#231915" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M52 16 Q55 14.5 58 16" stroke="#231915" strokeWidth="1.1" strokeLinecap="round" />

      {/* Eyes with subtle natural lash line */}
      <ellipse cx="45" cy="18.5" rx="1.7" ry="1.2" fill="#1C120C" />
      <ellipse cx="55" cy="18.5" rx="1.7" ry="1.2" fill="#1C120C" />
      <circle cx="45.5" cy="18" r="0.4" fill="#FFFFFF" opacity="0.8" />
      <circle cx="55.5" cy="18" r="0.4" fill="#FFFFFF" opacity="0.8" />

      {/* Traditional Small Maroon Bindi */}
      <circle cx="50" cy="15.5" r="0.9" fill="#991B1B" />

      {/* Delicate Nose */}
      <path d="M50 16.5 L49.2 21.5 L51.2 22" stroke="#A86139" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" />

      {/* Lips */}
      <path d="M46.5 26.5 Q50 28 53.5 26.5" stroke="#9F1239" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M48 28 Q50 29 52 28" stroke="#881337" strokeWidth="0.9" strokeLinecap="round" />

      {/* Elegant Hair with side parting and tidy travel bun */}
      {/* Top Hair Bun resting softly against headrest */}
      <ellipse cx="50" cy="6" rx="8" ry="5.5" fill="url(#femaleHairGrad)" />

      {/* Main Hair Volume */}
      <path
        d="M37 16 C37 8 42 5 50 5 C58 5 63 8 63 16 C63 19 62 21 61 21 C60 18 57 13 54 12 C49 11 44 12 40 16 C38 18 37 19 37 16 Z"
        fill="url(#femaleHairGrad)"
      />
      {/* Hair strands shine */}
      <path d="M43 7 C47 6 52 6 56 8" stroke="#483832" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
      <path d="M39 11 C43 9 47 9 52 11" stroke="#3F302A" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />

      {/* Small Jhumka / Earring */}
      <circle cx="36" cy="22" r="1.1" fill="#FACC15" />
      <circle cx="64" cy="22" r="1.1" fill="#FACC15" />
      <path d="M36 23 L36 25" stroke="#FACC15" strokeWidth="0.7" />
      <path d="M64 23 L64 25" stroke="#FACC15" strokeWidth="0.7" />
    </svg>
  );
};

export const PassengerModel: React.FC<PassengerModelProps> = ({ gender, className = '', isMini = false }) => {
  if (gender === 'male') {
    return <MalePassengerModel className={className} />;
  }
  return <FemalePassengerModel className={className} />;
};

export default PassengerModel;
