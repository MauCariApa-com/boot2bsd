export type FileType = 'file' | 'directory';

export interface FSNode {
  name: string;
  type: FileType;
  content?: string;
  children?: FSNode[];
  owner: string;
  group: string;
  permissions: string; // e.g., 'drwxr-xr-x'
  modified: string;
}

export interface CommandResponse {
  output: string;
  error?: boolean;
  action?: {
    type: 'edit' | 'exit';
    payload?: {
      path: string[];
      fileName: string;
      content: string;
    };
  };
}

export interface ShellState {
  currentPath: string[];
  user: string;
  hostname: string;
  installedPackages: string[];
}
