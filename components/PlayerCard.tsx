import React, { useState } from 'react';
import { PlayerAssignment, Role } from '../types';
import { ROLE_DETAILS } from '../constants';
import { sounds } from '../utils/audio';

interface PlayerCardProps {
  assignment: PlayerAssignment;
  isDealing: boolean;
  revealAll: boolean;
  onSelectCharacter?: (assignment: PlayerAssignment) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  assignment,
  isDealing,
  revealAll,
  onSelectCharacter
}) => {
  const [localRevealed, setLocalRevealed] = useState(false);

  const roleMeta = assignment.role ? ROLE_DETAILS[assignment.role] : null;
  const isSheriff = assignment.role === Role.SHERIFF;
  
  // Sheriff is ALWAYS revealed to everyone in Bang! rules.
  // Other roles are revealed if revealAll is true or user locally tapped to reveal their card.
  const isFaceUp = isSheriff || revealAll || localRevealed;

  const handleCardClick = () => {
    if (isDealing) return;
    if (isSheriff) {
      if (onSelectCharacter && assignment.character) {
        onSelectCharacter(assignment);
      }
      return;
    }
    sounds.playCardFlip();
    setLocalRevealed(prev => !prev);
  };

  const totalLives = (assignment.character?.lives || 4) + (isSheriff ? 1 : 0);

  return (
    <div className="relative group select-none">
      <div
        onClick={handleCardClick}
        className={`
          relative w-44 md:w-52 h-64 md:h-72 cursor-pointer
          perspective-1000 transition-all duration-300
          ${isDealing ? 'scale-90 blur-sm opacity-60' : 'hover:-translate-y-1 hover:shadow-2xl'}
        `}
      >
        <div
          className={`
            w-full h-full relative transform-style-3d transition-transform duration-700
            ${isFaceUp ? '' : 'rotate-y-180'}
          `}
        >
          {/* CARA ANVERSO (FACE UP) */}
          <div
            className={`
              absolute inset-0 w-full h-full backface-hidden rounded-xl p-3 flex flex-col justify-between
              bg-parchment text-stone-900 border-4 shadow-xl
              ${isSheriff ? 'border-amber-500 ring-2 ring-amber-400/50 shadow-amber-900/40' : 'border-[#613b1e]'}
            `}
          >
            {/* Cabecera: Posición / Jugador */}
            <div className="border-b-2 border-stone-400/60 pb-1 flex items-center justify-between">
              <span className="font-western text-xs text-stone-700 font-bold tracking-wider">
                {assignment.name}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                assignment.isHuman ? 'bg-amber-800 text-amber-100' : 'bg-stone-300 text-stone-700'
              }`}>
                {assignment.isHuman ? 'Humano' : 'VNJ'}
              </span>
            </div>

            {/* Rol */}
            <div className="my-1 text-center">
              {assignment.role ? (
                <div className={`py-1 px-2 rounded-lg border flex items-center justify-center gap-1.5 ${roleMeta?.bg} ${roleMeta?.border}`}>
                  <span className="text-base">{roleMeta?.icon}</span>
                  <span className={`font-western text-sm md:text-base font-bold tracking-wider uppercase ${roleMeta?.color}`}>
                    {assignment.role}
                  </span>
                </div>
              ) : (
                <div className="text-stone-400 italic text-xs">Esperando reparto...</div>
              )}
            </div>

            {/* Personaje y Vidas */}
            <div className="bg-amber-900/10 border border-amber-900/20 rounded-lg p-2 text-center flex-1 flex flex-col justify-center">
              <div className="font-western text-amber-900 text-sm md:text-base font-bold leading-tight">
                {assignment.character?.name || 'Por asignar'}
              </div>

              {/* Vidas en balas */}
              <div className="flex items-center justify-center gap-1 mt-1 text-xs" title={`${totalLives} balas de vida`}>
                {Array.from({ length: totalLives }).map((_, idx) => (
                  <span key={idx} className="text-amber-600 drop-shadow-sm text-sm" role="img" aria-label="Bala">
                    🟡
                  </span>
                ))}
                {isSheriff && (
                  <span className="text-[10px] bg-amber-600 text-white font-bold px-1 rounded-sm ml-0.5">
                    +1★
                  </span>
                )}
              </div>

              {/* Habilidad reducida */}
              {assignment.character && (
                <p className="text-[11px] leading-tight text-stone-700 italic mt-1 line-clamp-3">
                  "{assignment.character.ability}"
                </p>
              )}
            </div>

            {/* Pie de carta: Detalles / Ocultar */}
            <div className="pt-1 flex items-center justify-between text-[10px] text-stone-600 border-t border-stone-300">
              {assignment.character && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectCharacter) onSelectCharacter(assignment);
                  }}
                  className="text-amber-800 hover:text-amber-950 font-bold underline"
                >
                  Ver habilidad
                </button>
              )}
              {!isSheriff && !revealAll && (
                <span className="italic text-stone-500">Toca para ocultar</span>
              )}
              {isSheriff && (
                <span className="text-amber-700 font-bold flex items-center gap-0.5">
                  ⭐ Sheriff Público
                </span>
              )}
            </div>

            {/* Estrella dorada de Sheriff en la esquina */}
            {isSheriff && (
              <div className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-400 to-amber-600 text-stone-900 w-8 h-8 rounded-full border-2 border-amber-800 shadow-lg flex items-center justify-center text-sm font-bold">
                ⭐
              </div>
            )}
          </div>

          {/* CARA REVERSO (FACE DOWN - DORSO OESTE) */}
          <div
            className={`
              absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl p-3 flex flex-col justify-between
              bg-gradient-to-b from-[#3a1d0d] via-[#241208] to-[#170a04] text-amber-200 border-4 border-[#824e23] shadow-2xl
            `}
          >
            {/* Borde ornamental interior */}
            <div className="border border-amber-700/60 rounded-lg p-2 h-full flex flex-col justify-between items-center text-center">
              <div className="flex items-center justify-between w-full text-[11px] font-western text-amber-400/80">
                <span>{assignment.name}</span>
                <span>BANG!</span>
              </div>

              <div className="my-auto py-2">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full border-2 border-amber-500/50 bg-amber-950/70 flex items-center justify-center text-2xl shadow-inner">
                  🤠
                </div>
                <div className="font-western text-2xl tracking-widest text-amber-500 drop-shadow">
                  BANG!
                </div>
                <div className="text-[11px] font-pirate text-amber-300/80 uppercase tracking-wider mt-1">
                  Rol Oculto
                </div>
              </div>

              <div className="w-full bg-amber-900/40 rounded py-1 px-2 text-[10px] text-amber-300 font-serif border border-amber-700/40 animate-pulse">
                🔍 Toca para revelar secreto
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
