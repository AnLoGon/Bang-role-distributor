import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Screen, PlayerAssignment, Role, CharacterInfo, ViewMode } from './types';
import { ROLE_DISTRIBUTION, CHARACTERS_DATA, VNJ_RESTRICTED_CHARACTERS, ROLE_DETAILS } from './constants';
import { shuffle } from './utils/gameLogic';
import PlayerCard from './components/PlayerCard';
import { sounds } from './utils/audio';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('SELECTION');
  const [playerCount, setPlayerCount] = useState<number>(5);
  const [humanCount, setHumanCount] = useState<number>(5);
  const [assignments, setAssignments] = useState<PlayerAssignment[]>([]);
  const [isDealing, setIsDealing] = useState(false);
  const [revealAll, setRevealAll] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('GRID');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedModalPlayer, setSelectedModalPlayer] = useState<PlayerAssignment | null>(null);
  const [charSearchQuery, setCharSearchQuery] = useState('');

  // Sincronizar sound enabled
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
  };

  // Ajustar humanCount si excede playerCount
  useEffect(() => {
    if (humanCount > playerCount) {
      setHumanCount(playerCount);
    }
  }, [playerCount, humanCount]);

  const currentDistribution = useMemo(() => {
    return ROLE_DISTRIBUTION[playerCount] || [];
  }, [playerCount]);

  const dealCards = useCallback(() => {
    setIsDealing(true);
    sounds.playGunCock();

    setTimeout(() => {
      // 1. Crear identidades de jugadores
      const identityList: { name: string; isHuman: boolean }[] = [];
      for (let i = 1; i <= humanCount; i++) {
        identityList.push({ name: `Jugador ${i}`, isHuman: true });
      }
      const vnjCount = playerCount - humanCount;
      for (let i = 1; i <= vnjCount; i++) {
        identityList.push({ name: `VNJ ${i}`, isHuman: false });
      }

      // 2. Mezclar identidades
      const shuffledIdentities = shuffle(identityList);

      // 3. Mezclar roles oficiales
      const rolePool = ROLE_DISTRIBUTION[playerCount] || [];
      const shuffledRoles = shuffle(rolePool);

      // 4. Preparar personajes
      const allChars = shuffle(CHARACTERS_DATA);
      const safeCharsForVNJ = shuffle(
        CHARACTERS_DATA.filter(c => !VNJ_RESTRICTED_CHARACTERS.includes(c.name))
      );

      const usedCharacters = new Set<string>();

      // 5. Asignar personaje y rol a cada asiento
      const newAssignments: PlayerAssignment[] = shuffledIdentities.map((identity, index) => {
        let charInfo: CharacterInfo | null = null;

        if (identity.isHuman) {
          charInfo = allChars.find(c => !usedCharacters.has(c.name)) || allChars[0];
        } else {
          charInfo = safeCharsForVNJ.find(c => !usedCharacters.has(c.name)) || allChars.find(c => !usedCharacters.has(c.name)) || allChars[0];
        }

        if (charInfo) {
          usedCharacters.add(charInfo.name);
        }

        return {
          id: index + 1,
          name: identity.name,
          isHuman: identity.isHuman,
          role: shuffledRoles[index] || Role.FORAJIDO,
          character: charInfo,
          isRevealed: false
        };
      });

      setAssignments(newAssignments);
      setIsDealing(false);
      sounds.playBang();
    }, 700);
  }, [playerCount, humanCount]);

  const startSetup = (count?: number) => {
    const finalCount = count || playerCount;
    setPlayerCount(finalCount);
    sounds.playGunCock();
    dealCards();
    setScreen('GAME');
  };

  const roleSummaryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    currentDistribution.forEach(r => {
      counts[r] = (counts[r] || 0) + 1;
    });
    return counts;
  }, [currentDistribution]);

  // FILTRADO DE PERSONAJES PARA LA PANTALLA DE REGLAS
  const filteredCharacters = useMemo(() => {
    if (!charSearchQuery.trim()) return CHARACTERS_DATA;
    const q = charSearchQuery.toLowerCase();
    return CHARACTERS_DATA.filter(
      c => c.name.toLowerCase().includes(q) || c.ability.toLowerCase().includes(q)
    );
  }, [charSearchQuery]);

  return (
    <div className="min-h-screen text-[#f3e5ab] flex flex-col justify-between selection:bg-amber-600 selection:text-white">
      {/* BARRA SUPERIOR DE NAVEGACIÓN */}
      <header className="w-full bg-[#1c1007]/90 border-b-2 border-amber-900/60 backdrop-blur px-4 py-3 sticky top-0 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => setScreen('SELECTION')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="text-2xl filter drop-shadow">⭐</span>
            <span className="font-western text-2xl md:text-3xl text-amber-500 group-hover:text-amber-400 transition-colors">
              BANG!
            </span>
            <span className="text-xs uppercase tracking-widest text-stone-400 hidden sm:inline ml-2 border-l border-amber-900/60 pl-3">
              Distribuidor de Roles
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-stone-800/80 border border-stone-700 hover:border-amber-600 text-stone-300 text-xs md:text-sm flex items-center gap-1.5 transition-colors"
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            >
              <span>{soundEnabled ? '🔊' : '🔇'}</span>
              <span className="hidden md:inline">{soundEnabled ? 'Sonido ON' : 'Silencio'}</span>
            </button>

            <button
              onClick={() => setScreen(screen === 'RULES' ? 'SELECTION' : 'RULES')}
              className={`px-3 py-1.5 rounded-lg border text-xs md:text-sm font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                screen === 'RULES'
                  ? 'bg-amber-600 border-amber-400 text-white shadow-md'
                  : 'bg-stone-800/80 border-stone-700 hover:border-amber-500 text-amber-400'
              }`}
            >
              📖 <span className="hidden sm:inline">Reglas &</span> Personajes
            </button>
          </div>
        </div>
      </header>

      {/* PANTALLA 1: MENÚ PRINCIPAL Y CONFIGURACIÓN */}
      {screen === 'SELECTION' && (
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 max-w-4xl mx-auto w-full">
          {/* Logo y ambientación */}
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-block bg-gradient-to-r from-amber-950/80 via-stone-900/90 to-amber-950/80 p-6 md:p-8 rounded-3xl border-4 border-amber-800/50 shadow-2xl backdrop-blur relative">
              <div className="text-amber-500 text-sm md:text-base font-western tracking-widest uppercase mb-1">
                Saloon de la Ciudad
              </div>
              <h1 className="font-western text-6xl sm:text-7xl md:text-9xl text-amber-500 drop-shadow-[0_5px_15px_rgba(217,119,6,0.5)] tracking-wide">
                BANG!
              </h1>
              <p className="text-base sm:text-lg text-amber-200/90 italic mt-1 font-serif">
                Distribuidor Oficial de Roles y Personajes
              </p>
            </div>
          </div>

          {/* Panel de Configuración */}
          <div className="w-full bg-[#24150c]/90 p-6 md:p-8 rounded-2xl border-2 border-amber-800/60 shadow-2xl backdrop-blur">
            {/* Paso 1: Cantidad de Pistoleros Totales */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="font-western text-xl md:text-2xl text-amber-400 flex items-center gap-2">
                  <span>1.</span> Total de Pistoleros en la Mesa:
                </label>
                <span className="font-western text-2xl text-amber-500 bg-amber-950 px-3 py-1 rounded-lg border border-amber-700">
                  {playerCount} Pistoleros
                </span>
              </div>
              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {[3, 4, 5, 6, 7, 8].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setPlayerCount(num);
                      sounds.playGunCock();
                    }}
                    className={`
                      py-3 md:py-4 rounded-xl border-2 font-western text-xl md:text-2xl transition-all shadow-md
                      ${playerCount === num
                        ? 'bg-amber-600 border-amber-300 text-white scale-105 shadow-[0_0_15px_rgba(217,119,6,0.6)] font-bold'
                        : 'bg-stone-800/90 border-stone-700 text-stone-300 hover:border-amber-600 hover:text-white'}
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Paso 2: Configuración de Humanos vs VNJs (Bots) */}
            <div className="mb-6 bg-stone-900/60 p-4 rounded-xl border border-amber-900/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <label className="font-western text-lg md:text-xl text-amber-400 flex items-center gap-2">
                  <span>2.</span> ¿Cuántos Jugadores Humanos?
                </label>
                <div className="text-sm text-stone-300">
                  <span className="text-amber-400 font-bold">{humanCount}</span> {humanCount === 1 ? 'Humano' : 'Humanos'} + <span className="text-stone-400 font-bold">{playerCount - humanCount}</span> VNJs
                </div>
              </div>

              {/* Atajos Rápidos */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setHumanCount(playerCount)}
                  className={`py-2 px-3 rounded-lg border text-xs md:text-sm font-western transition-all ${
                    humanCount === playerCount
                      ? 'bg-amber-700 border-amber-400 text-white font-bold'
                      : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  👥 Todos Humanos ({playerCount})
                </button>
                <button
                  type="button"
                  onClick={() => setHumanCount(1)}
                  className={`py-2 px-3 rounded-lg border text-xs md:text-sm font-western transition-all ${
                    humanCount === 1
                      ? 'bg-amber-700 border-amber-400 text-white font-bold'
                      : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  🤠 1 Humano (Solitario)
                </button>
                <button
                  type="button"
                  onClick={() => setHumanCount(Math.min(2, playerCount))}
                  className={`py-2 px-3 rounded-lg border text-xs md:text-sm font-western transition-all ${
                    humanCount === 2
                      ? 'bg-amber-700 border-amber-400 text-white font-bold'
                      : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  👥 2 Humanos (Duelo)
                </button>
              </div>

              {/* Selector individual de humanos */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {Array.from({ length: playerCount }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setHumanCount(num)}
                    className={`flex-1 py-1.5 px-2 rounded border text-xs font-bold transition-all ${
                      humanCount === num
                        ? 'bg-amber-600 border-amber-300 text-white'
                        : 'bg-stone-800 border-stone-700 text-stone-400 hover:border-stone-500'
                    }`}
                  >
                    {num} {num === 1 ? 'H' : 'H'}
                  </button>
                ))}
              </div>
            </div>

            {/* Resumen de Roles para esta partida */}
            <div className="mb-6 p-4 rounded-xl bg-black/40 border border-stone-700">
              <div className="text-xs font-western uppercase tracking-wider text-stone-400 mb-2">
                Distribución oficial de roles para {playerCount} pistoleros:
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(roleSummaryCounts).map(([roleName, count]) => {
                  const roleEnum = roleName as Role;
                  const meta = ROLE_DETAILS[roleEnum];
                  return (
                    <div
                      key={roleName}
                      className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 text-xs md:text-sm ${meta?.bg} ${meta?.border}`}
                    >
                      <span>{meta?.icon}</span>
                      <span className="font-western font-bold text-white">{roleName}:</span>
                      <span className="bg-black/50 px-1.5 py-0.5 rounded text-amber-300 font-bold">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Botón Principal para Comenzar */}
            <button
              type="button"
              onClick={() => startSetup(playerCount)}
              className="w-full bg-gradient-to-r from-green-800 via-green-700 to-green-800 hover:from-green-700 hover:to-green-600 text-white font-western text-2xl md:text-3xl py-4 md:py-5 rounded-xl border-b-4 border-green-950 shadow-2xl active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              <span>⭐</span>
              <span>¡ENTRAR A LA CANTINA Y REPARTIR!</span>
              <span>⭐</span>
            </button>
          </div>

          <p className="mt-6 text-stone-400 text-xs md:text-sm italic text-center">
            "En el Oeste de BANG!, el Sheriff no confía ni en su sombra, y los forajidos acechan a la vuelta de la esquina."
          </p>
        </main>
      )}

      {/* PANTALLA 2: JUEGO / MESA DE REPARTO */}
      {screen === 'GAME' && (
        <main className="flex-1 flex flex-col items-center justify-between p-4 max-w-6xl mx-auto w-full">
          {/* Barra de control superior */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-[#24150c]/90 p-4 rounded-xl border border-amber-900/60 shadow-lg mb-4 backdrop-blur">
            <div>
              <h2 className="font-western text-2xl md:text-3xl text-amber-500 flex items-center gap-2">
                <span>🍺</span> Duelo en la Cantina
              </h2>
              <p className="text-xs text-stone-400 font-serif">
                {humanCount} Humano{humanCount > 1 ? 's' : ''} vs {playerCount - humanCount} VNJ{playerCount - humanCount !== 1 ? 's' : ''} • {playerCount} Pistoleros
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Selector de Vista: Mesa vs Rejilla */}
              <div className="bg-stone-900/90 rounded-lg p-1 border border-stone-700 flex items-center">
                <button
                  type="button"
                  onClick={() => setViewMode('GRID')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                    viewMode === 'GRID' ? 'bg-amber-700 text-white' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  🔲 Cuadrícula
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('TABLE')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                    viewMode === 'TABLE' ? 'bg-amber-700 text-white' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  ⭕ Mesa Redonda
                </button>
              </div>

              {/* Botón de Modo Secreto / Revelar Todo */}
              <button
                type="button"
                onClick={() => {
                  sounds.playCardFlip();
                  setRevealAll(prev => !prev);
                }}
                className={`px-3 py-1.5 rounded-lg border text-xs md:text-sm font-western transition-all ${
                  revealAll
                    ? 'bg-rose-900/80 border-rose-500 text-rose-200'
                    : 'bg-stone-800 border-amber-600/70 text-amber-400 hover:bg-stone-700'
                }`}
              >
                {revealAll ? '👁️ Ocultar Roles Secretos' : '🔓 Modo Descubierto (Ver Todos)'}
              </button>
            </div>
          </div>

          {/* MENSAJE GUÍA DEL MODO PASAR Y JUGAR */}
          {!revealAll && (
            <div className="w-full bg-amber-950/40 border border-amber-600/30 text-amber-200/90 rounded-lg py-2 px-4 text-xs md:text-sm mb-4 text-center">
              💡 <strong>Modo Pasar y Jugar:</strong> El Sheriff siempre es público. Para los demás, toca cada carta individualmente para ver en secreto tu rol y personaje, y vuelve a tocar para ocultarlo antes de pasar el dispositivo.
            </div>
          )}

          {/* ÁREA DE CARTAS */}
          {viewMode === 'GRID' ? (
            /* VISTA DE CUADRÍCULA (RESPONSIVA Y CÓMODA) */
            <div className="w-full flex-1 flex items-center justify-center py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 justify-items-center">
                {assignments.map(assign => (
                  <PlayerCard
                    key={assign.id}
                    assignment={assign}
                    isDealing={isDealing}
                    revealAll={revealAll}
                    onSelectCharacter={setSelectedModalPlayer}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* VISTA DE MESA REDONDA CIRCULAR */
            <div className="relative w-full max-w-4xl h-[560px] md:h-[620px] flex items-center justify-center my-4 overflow-visible">
              {/* Centro de la mesa de madera */}
              <div className="absolute w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full bg-[#341d0e] border-8 border-[#542d12] shadow-[inset_0_0_40px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center p-4 text-center pointer-events-none">
                <span className="text-4xl md:text-5xl mb-1">⭐</span>
                <span className="font-western text-2xl md:text-3xl text-amber-500 drop-shadow">
                  BANG!
                </span>
                <span className="text-xs text-stone-400 font-serif uppercase tracking-widest mt-1">
                  Mesa de Cantina
                </span>
                <div className="mt-2 text-[10px] text-amber-200/70 border-t border-amber-900/60 pt-1">
                  {playerCount} Asientos Ocupados
                </div>
              </div>

              {/* Posicionamiento radial de los pistoleros */}
              {assignments.map((assign, index) => {
                const angle = (index * (360 / playerCount)) - 90;
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                const radius = isMobile ? 160 : 250;
                const x = radius * Math.cos((angle * Math.PI) / 180);
                const y = radius * Math.sin((angle * Math.PI) / 180);

                return (
                  <div
                    key={assign.id}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                      position: 'absolute',
                      zIndex: 20
                    }}
                    className="transition-all duration-700 ease-out"
                  >
                    <PlayerCard
                      assignment={assign}
                      isDealing={isDealing}
                      revealAll={revealAll}
                      onSelectCharacter={setSelectedModalPlayer}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* BOTONES DE ACCIÓN INFERIOR */}
          <div className="w-full max-w-xl flex flex-col sm:flex-row gap-3 mt-6 z-10">
            <button
              type="button"
              onClick={dealCards}
              disabled={isDealing}
              className="flex-[2] bg-gradient-to-r from-green-800 to-green-700 hover:from-green-700 hover:to-green-600 disabled:opacity-50 text-white font-western text-xl md:text-2xl py-3.5 px-6 rounded-xl border-b-4 border-green-950 shadow-2xl active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🔄</span>
              <span>{isDealing ? 'BARAJANDO CARTAS...' : 'REPARTIR DE NUEVO'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playCardFlip();
                setScreen('SELECTION');
              }}
              className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 font-western text-lg md:text-xl py-3.5 px-4 rounded-xl border-b-4 border-stone-950 shadow-xl active:translate-y-1 active:border-b-0 transition-all cursor-pointer"
            >
              ⚙️ AJUSTES
            </button>
          </div>
        </main>
      )}

      {/* PANTALLA 3: REGLAS, OBJETIVOS DE ROLES Y GUÍA DE PERSONAJES */}
      {screen === 'RULES' && (
        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
          <div className="bg-[#24150c]/95 p-6 md:p-8 rounded-2xl border-2 border-amber-800/60 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b-2 border-amber-800/60 pb-4 mb-6">
              <div>
                <h2 className="font-western text-3xl md:text-4xl text-amber-500">
                  Reglas y Roles de BANG!
                </h2>
                <p className="text-stone-400 font-serif italic text-sm">
                  Guía de objetivos, vidas y habilidades especiales de los pistoleros
                </p>
              </div>
              <button
                type="button"
                onClick={() => setScreen('SELECTION')}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 font-western text-sm rounded-lg border border-amber-700 transition-colors"
              >
                Volver al Menú
              </button>
            </div>

            {/* Guía de Roles */}
            <div className="mb-8">
              <h3 className="font-western text-2xl text-amber-400 mb-4 flex items-center gap-2">
                <span>⭐</span> Los 4 Roles y sus Objetivos de Victoria
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(Role).map(r => {
                  const meta = ROLE_DETAILS[r];
                  return (
                    <div
                      key={r}
                      className={`p-4 rounded-xl border-2 ${meta.border} ${meta.bg}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{meta.icon}</span>
                        <h4 className={`font-western text-xl uppercase ${meta.color}`}>
                          {r}
                        </h4>
                      </div>
                      <p className="text-xs text-stone-200 mb-2 leading-relaxed">
                        {meta.description}
                      </p>
                      <div className="bg-black/50 p-2.5 rounded-lg border border-stone-700">
                        <span className="text-amber-400 font-bold text-xs uppercase block mb-0.5">
                          🎯 Objetivo de Victoria:
                        </span>
                        <span className="text-xs text-stone-300 font-serif">
                          {meta.goal}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Regla especial de Vidas */}
            <div className="mb-8 p-4 rounded-xl bg-amber-950/40 border border-amber-700/50">
              <h4 className="font-western text-lg text-amber-400 mb-1">
                🟡 Puntos de Vida y Balas
              </h4>
              <p className="text-xs md:text-sm text-stone-300 leading-relaxed font-serif">
                Cada personaje tiene un número base de vidas indicado en balas (generalmente 3 o 4).
                <strong className="text-amber-400"> ¡El Sheriff siempre suma +1 bala extra a su total de vida! </strong>
                El número de balas que te quedan determina también el límite máximo de cartas que puedes conservar en tu mano al final de tu turno.
              </p>
            </div>

            {/* Buscador de Personajes y Habilidades */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="font-western text-2xl text-amber-400 flex items-center gap-2">
                  <span>🤠</span> Personajes y Habilidades ({CHARACTERS_DATA.length})
                </h3>
                <input
                  type="text"
                  placeholder="Buscar personaje o habilidad..."
                  value={charSearchQuery}
                  onChange={(e) => setCharSearchQuery(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 focus:border-amber-500 text-sm text-stone-200 outline-none w-full sm:w-72"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                {filteredCharacters.map(char => (
                  <div
                    key={char.name}
                    className="p-3 rounded-lg bg-stone-900/80 border border-stone-700/80 hover:border-amber-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-western text-sm text-amber-400 font-bold">
                        {char.name}
                      </span>
                      <span className="text-xs text-amber-500 font-bold flex items-center gap-0.5">
                        {Array.from({ length: char.lives }).map((_, i) => (
                          <span key={i}>🟡</span>
                        ))}
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 italic font-serif leading-tight">
                      "{char.ability}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* MODAL DETALLES DEL PERSONAJE */}
      {selectedModalPlayer && selectedModalPlayer.character && (
        <div 
          onClick={() => setSelectedModalPlayer(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#24150c] p-6 rounded-2xl border-4 border-amber-700 shadow-2xl text-stone-100"
          >
            <div className="flex items-center justify-between border-b border-amber-800 pb-3 mb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-stone-400">
                  {selectedModalPlayer.name} ({selectedModalPlayer.isHuman ? 'Humano' : 'VNJ'})
                </span>
                <h3 className="font-western text-2xl text-amber-400">
                  {selectedModalPlayer.character.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModalPlayer(null)}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Rol */}
              {selectedModalPlayer.role && (
                <div className={`p-3 rounded-xl border flex items-center justify-between ${ROLE_DETAILS[selectedModalPlayer.role].bg} ${ROLE_DETAILS[selectedModalPlayer.role].border}`}>
                  <span className="font-western text-sm text-stone-300">Rol asignado:</span>
                  <span className="font-western text-base text-white font-bold flex items-center gap-1.5">
                    <span>{ROLE_DETAILS[selectedModalPlayer.role].icon}</span>
                    <span>{selectedModalPlayer.role}</span>
                  </span>
                </div>
              )}

              {/* Vidas */}
              <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 flex items-center justify-between">
                <span className="text-xs font-western text-stone-400">Puntos de Vida iniciales:</span>
                <div className="flex items-center gap-1">
                  {Array.from({ 
                    length: selectedModalPlayer.character.lives + (selectedModalPlayer.role === Role.SHERIFF ? 1 : 0) 
                  }).map((_, idx) => (
                    <span key={idx} className="text-amber-500">🟡</span>
                  ))}
                  {selectedModalPlayer.role === Role.SHERIFF && (
                    <span className="text-xs bg-amber-600 text-white font-bold px-1.5 py-0.5 rounded ml-1">
                      +1 Sheriff
                    </span>
                  )}
                </div>
              </div>

              {/* Habilidad */}
              <div className="bg-amber-950/40 p-4 rounded-xl border border-amber-800/40">
                <h4 className="font-western text-sm text-amber-400 mb-1">
                  ⚡ Habilidad Especial del Personaje:
                </h4>
                <p className="text-sm text-stone-200 font-serif italic leading-relaxed">
                  "{selectedModalPlayer.character.ability}"
                </p>
              </div>

              {/* Objetivo de Victoria */}
              {selectedModalPlayer.role && (
                <div className="bg-black/40 p-3 rounded-xl border border-stone-800">
                  <h4 className="font-western text-xs text-amber-500 mb-1">
                    🎯 Objetivo de Victoria del Rol:
                  </h4>
                  <p className="text-xs text-stone-300 font-serif">
                    {ROLE_DETAILS[selectedModalPlayer.role].goal}
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedModalPlayer(null)}
              className="w-full mt-6 py-2.5 bg-amber-700 hover:bg-amber-600 text-white font-western text-base rounded-xl border border-amber-500 shadow-md transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* PIE DE PÁGINA */}
      <footer className="w-full border-t border-amber-900/40 bg-[#160c05]/80 py-3 px-4 text-center text-stone-500 text-xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BANG! es un juego de mesa de Emiliano Sciarra publicado por dV Giochi.</span>
          <span className="text-amber-500/80 font-western">Edición Salvaje Oeste • Listo para GitHub Pages</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
