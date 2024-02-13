import { types } from 'vortex-api';

export interface IGitHubRelease {
  url: string;
  id: number;
  tag_name: string;
  name: string;
  assets: IGitHubAsset[];
}

export interface IGitHubAsset {
  url: string;
  id: number;
  name: string;
  label: string | null;
  state: string;
  size: number;
  download_count: number;
  created_at: string;
  updated_at: string;
  browser_download_url: string;
  release: IGitHubRelease;
}

export type PluginRequirements = { [storeId: string]: IPluginRequirement[] }
export interface IPluginRequirement {
  archiveFileName: string;
  modType: string;
  assemblyFileName?: string;
  modId?: number;
  userFacingName?: string;
  githubUrl?: string;
  modUrl?: string;
  fileArchivePattern?: RegExp;
  findMod: (api: types.IExtensionApi) => Promise<types.IMod>;
  findDownloadId: (api: types.IExtensionApi) => string;
  resolveVersion?: (api: types.IExtensionApi) => Promise<string>;
  fileFilter?: (file: string) => boolean;
}
