export enum Role {
  SHERIFF = 'Sheriff',
  ALGUACIL = 'Alguacil',
  FORAJIDO = 'Forajido',
  RENEGADO = 'Renegado'
}

export interface CharacterInfo {
  name: string;
  lives: number;
  ability: string;
  avatarPrompt?: string;
}

export type PlayerAssignment = {
  id: number;
  name: string;
  isHuman: boolean;
  role: Role | null;
  character: CharacterInfo | null;
  isRevealed?: boolean;
};

export type Screen = 'SELECTION' | 'GAME' | 'RULES';
export type ViewMode = 'TABLE' | 'GRID';
