import { types } from 'vortex-api';

export interface IGithubDownload {
  fileName: string;
  url: string;
}

export type PluginRequirements = { [storeId: string]: IPluginRequirement[] }
export interface IPluginRequirement {
  fileName: string;
  modType: string;
  modId?: number;
  userFacingName?: string;
  githubUrl?: string;
  modUrl?: string;
  findMod: (api: types.IExtensionApi) => Promise<types.IMod>;
  findDownloadId: (api: types.IExtensionApi) => string;
  fileFilter?: (file: string) => boolean;
}
