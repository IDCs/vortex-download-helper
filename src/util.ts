/* eslint-disable */
import path from 'path';
import semver from 'semver';
import { fs, selectors, types, util } from 'vortex-api';
import turbowalk, { IWalkOptions, IEntry } from 'turbowalk';

import { IPluginRequirement } from './types';

export function getMods(api: types.IExtensionApi, modType: string): types.IMod[] {
  const state = api.getState();
  const gameId = selectors.activeGameId(state);
  const mods = util.getSafe(state, ['persistent', 'mods', gameId], {});
  return Object.values(mods).filter((mod: types.IMod) => mod.type === modType || mod.type === '') as types.IMod[];
}

export async function findModByFile(api: types.IExtensionApi, modType: string, fileName: string): Promise<types.IMod> {
  const state = api.getState();
  const gameId = selectors.activeGameId(state);
  const mods = getMods(api, modType);
  const installationPath = selectors.installPathForGame(api.getState(), gameId);
  for (const mod of mods) {
    const modPath = path.join(installationPath, mod.installationPath);
    const files = await walkPath(modPath);
    if (files.find(file => file.filePath.endsWith(fileName))) {
      return mod;
    }
  }
  return undefined;
}

export function findDownloadIdByFile(api: types.IExtensionApi, fileName: string): string {
  const state = api.getState();
  state.persistent.downloads.files
  const downloads: { [dlId: string]: types.IDownload } = util.getSafe(state, ['persistent', 'downloads', 'files'], {});
  return Object.entries(downloads).reduce((prev, [dlId, dl]) => {
    if (path.basename(dl.localPath).toLowerCase() === fileName.toLowerCase()) {
      prev = dlId;
    }
    return prev;
  }, '');
}

export async function resolveVersionByPattern(api: types.IExtensionApi, requirement: IPluginRequirement): Promise<string> {
  const state = api.getState();
  const files: types.IDownload[] = util.getSafe(state, ['persistent', 'downloads', 'files'], []);
  const latestVersion = Object.values(files).reduce((prev, file) => {
    const match = requirement.fileArchivePattern.exec(file.localPath);
    if (match?.[1] && semver.gt(match[1], prev)) {
      prev = match[1];
    }
    return prev;
  }, '0.0.0');
  return latestVersion;
}

export async function walkPath(dirPath: string, walkOptions?: IWalkOptions): Promise<IEntry[]> {
  walkOptions = !!walkOptions
    ? { ...walkOptions, skipHidden: true, skipInaccessible: true, skipLinks: true }
    : { skipLinks: true, skipHidden: true, skipInaccessible: true };
  const walkResults: IEntry[] = [];
  return new Promise<IEntry[]>(async (resolve, reject) => {
    await turbowalk(dirPath, (entries: IEntry[]) => {
      walkResults.push(...entries);
      return Promise.resolve() as any;
      // If the directory is missing when we try to walk it; it's most probably down to a collection being
      //  in the process of being installed/removed. We can safely ignore this.
    }, walkOptions).catch(err => err.code === 'ENOENT' ? Promise.resolve() : Promise.reject(err));
    return resolve(walkResults);
  });
}
