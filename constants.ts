import { Role, CharacterInfo } from './types';

export const ROLE_DETAILS: Record<Role, { description: string; goal: string; color: string; border: string; bg: string; icon: string }> = {
  [Role.SHERIFF]: {
    description: 'La ley en el pueblo. Su identidad es pública y recibe +1 bala de vida inicial.',
    goal: 'Eliminar a todos los Forajidos y al Renegado para traer el orden.',
    color: 'text-amber-500',
    border: 'border-amber-500',
    bg: 'bg-amber-950/60',
    icon: '⭐'
  },
  [Role.ALGUACIL]: {
    description: 'La mano derecha del Sheriff. Su identidad es secreta.',
    goal: 'Proteger al Sheriff y ayudarlo a eliminar a Forajidos y Renegados.',
    color: 'text-sky-400',
    border: 'border-sky-500',
    bg: 'bg-sky-950/60',
    icon: '🛡️'
  },
  [Role.FORAJIDO]: {
    description: 'Bandido sin escrúpulos que quiere ver caer al Sheriff.',
    goal: 'Eliminar al Sheriff a cualquier precio.',
    color: 'text-rose-500',
    border: 'border-rose-600',
    bg: 'bg-rose-950/60',
    icon: '💀'
  },
  [Role.RENEGADO]: {
    description: 'Lobo solitario con sed de poder que quiere ser el nuevo Sheriff.',
    goal: 'Ser el último personaje con vida, eliminando al Sheriff en el duelo final.',
    color: 'text-emerald-400',
    border: 'border-emerald-600',
    bg: 'bg-emerald-950/60',
    icon: '🐍'
  }
};

export const CHARACTERS_DATA: CharacterInfo[] = [
  { name: "Bart Cassidy", lives: 4, ability: "Cada vez que pierde 1 punto de vida, roba inmediatamente 1 carta de la baraja." },
  { name: "Black Jack", lives: 4, ability: "En la fase 1, muestra la 2ª carta robada: si es de Corazones o Diamantes, roba 1 carta adicional." },
  { name: "Calamity Janet", lives: 4, ability: "Puede jugar cartas ¡BANG! como ¡FALLASTE! y viceversa." },
  { name: "El Gringo", lives: 3, ability: "Cada vez que un jugador le hace perder una vida, roba 1 carta al azar de la mano de ese jugador." },
  { name: "Jesse Jones", lives: 4, ability: "En la fase 1, puede robar su primera carta al azar de la mano de cualquier jugador." },
  { name: "Jourdonnais", lives: 4, ability: "Tiene un Barril incorporado: cuando es objetivo de ¡BANG!, puede robar y si sale Corazón, esquiva." },
  { name: "Kit Carlson", lives: 4, ability: "En la fase 1, mira las 3 primeras cartas del mazo: elige 2 para robar y devuelve la otra al mazo." },
  { name: "Lucky Duke", lives: 4, ability: "Cada vez que tiene que descartar para 'desenfundar', saca 2 cartas y elige el resultado que prefiera." },
  { name: "Paul Regret", lives: 3, ability: "Posee un Mustang permanente: todos los demás jugadores lo ven a distancia +1." },
  { name: "Pedro Ramirez", lives: 4, ability: "En la fase 1, puede robar su primera carta de la pila de descartes en lugar del mazo." },
  { name: "Rose Doolan", lives: 4, ability: "Posee una Mira telescópica permanente: ve a todos los demás jugadores a distancia -1." },
  { name: "Sid Ketchum", lives: 4, ability: "Puede descartar 2 cartas en cualquier momento para recuperar 1 punto de vida." },
  { name: "Slab the Killer", lives: 4, ability: "Para esquivar sus cartas ¡BANG!, el objetivo debe jugar 2 cartas ¡FALLASTE! obligatoriamente." },
  { name: "Suzy Lafayette", lives: 4, ability: "En cuanto se queda sin cartas en la mano, roba automáticamente 1 carta de la baraja." },
  { name: "Vulture Sam", lives: 4, ability: "Cada vez que un personaje es eliminado del juego, se queda con todas las cartas de ese jugador." },
  { name: "Willy el Niño", lives: 4, ability: "Puede jugar cualquier cantidad de cartas ¡BANG! durante su turno (como si tuviera un Volcanic)." },
  { name: "Apache Kid", lives: 3, ability: "Las cartas de Diamantes jugadas por otros jugadores no tienen efecto sobre él." },
  { name: "Belle Star", lives: 4, ability: "Durante su turno, las cartas en juego de todos los demás jugadores pierden sus efectos." },
  { name: "Bill Noface", lives: 4, ability: "En la fase 1, roba 1 carta más 1 adicional por cada punto de vida que haya perdido." },
  { name: "Chuck Wengam", lives: 4, ability: "En su turno puede perder 1 punto de vida para robar 2 cartas del mazo." },
  { name: "Doc Holyday", lives: 4, ability: "En su turno puede descartar 2 cartas de su mano para conseguir el efecto de un ¡BANG! adicional." },
  { name: "Elena Fuente", lives: 3, ability: "Puede usar cualquier carta de su mano como un ¡FALLASTE! para esquivar ataques." },
  { name: "Greg Digger", lives: 4, ability: "Cada vez que otro jugador es eliminado, recupera 2 puntos de vida." },
  { name: "Herb Hunter", lives: 4, ability: "Cada vez que otro jugador es eliminado, roba inmediatamente 2 cartas del mazo." },
  { name: "Jose Delgado", lives: 4, ability: "En su turno puede descartar 1 carta de borde azul de su mano para robar 2 cartas del mazo." },
  { name: "Molly Stark", lives: 4, ability: "Cada vez que juega una carta fuera de su turno (como ¡FALLASTE!), roba 1 carta del mazo." },
  { name: "Pat Brennan", lives: 4, ability: "En la fase 1, en lugar de robar 2 cartas, puede robar 1 carta en juego de cualquier jugador." },
  { name: "Pixie Pete", lives: 3, ability: "En la fase 1 de su turno, roba 3 cartas en lugar de las 2 normales." },
  { name: "Sean Mallory", lives: 3, ability: "Al final de su turno puede mantener hasta 10 cartas en su mano." },
  { name: "Tequila Joe", lives: 4, ability: "Cada vez que juega una Cerveza, recupera 2 puntos de vida en lugar de 1." },
  { name: "Vera Custer", lives: 3, ability: "Al inicio de su turno, elige la habilidad de cualquier otro personaje en juego hasta el siguiente turno." }
];

export const VNJ_RESTRICTED_CHARACTERS = [
  "Pat Brennan", "Chuck Wengam", "Uncle Will", "Pedro Ramirez", "Jose Delgado", 
  "Vera Custer", "Jesse Jones", "Doc Holyday", "Sid Ketchum", "Greygory Deck", 
  "Kit Carlson", "Flint Westwood", "Lee Van Kliff"
];

export const ROLE_DISTRIBUTION: Record<number, Role[]> = {
  3: [Role.ALGUACIL, Role.FORAJIDO, Role.RENEGADO],
  4: [Role.SHERIFF, Role.FORAJIDO, Role.FORAJIDO, Role.RENEGADO],
  5: [Role.SHERIFF, Role.ALGUACIL, Role.FORAJIDO, Role.FORAJIDO, Role.RENEGADO],
  6: [Role.SHERIFF, Role.ALGUACIL, Role.FORAJIDO, Role.FORAJIDO, Role.FORAJIDO, Role.RENEGADO],
  7: [Role.SHERIFF, Role.ALGUACIL, Role.ALGUACIL, Role.FORAJIDO, Role.FORAJIDO, Role.FORAJIDO, Role.RENEGADO],
  8: [Role.SHERIFF, Role.ALGUACIL, Role.ALGUACIL, Role.FORAJIDO, Role.FORAJIDO, Role.FORAJIDO, Role.RENEGADO, Role.RENEGADO],
};
