declare global {
  var toggleMenu: (() => void) | undefined;
  var saveNote: (() => void) | undefined;
  var clearFolderSelection: (() => void) | undefined;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  characterCount: number;
  createdAt: string;
  updatedAt: string;
  color?: string;
  folderId?: string;
  deletedAt?: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export {};