Exports a couple of useful functions to use when downloading game extension requirements.

`export { axios, download, findModByFile, findDownloadIdByFile, walkPath };`

Features:
- axios 1.6.7 is bundled with the downloader script, it's exported as part of the script so you can use it in your extension.
- Ability to download requirements from Github and/or NexusMods depending on where the file is hosted.
- Ability to find mods and downloads from Vortex's state.

usage example:

Add the following at the top of your index file (or wherever) in your game extension.
```
const { download, findModByFile, findDownloadIdByFile } = require('./downloader');
```

```
async function prepareForModding(discovery, api) {
    const requirementInstalled = await checkReq(api);
    return requirementInstalled
      ? Promise.resolve()
      : download(api, REQUIREMENTS);
}
```

Requirements are defined using the below interface.


```
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
```

Currently the fileName must match the name of the archive on the Github page.

```
{
    fileName: ARC_NAME,
    modType: '',
    userFacingName: 'Ryu Mod Manager',
    githubUrl: 'https://api.github.com/repos/SRMM-Studio/ShinRyuModManager',
    findMod: (api) => findModByFile(api, '', RMM_EXE),
    findDownloadId: (api) => findDownloadIdByFile(api, ARC_NAME),
},
```

`findModByFile` and `findDownloadIdByFile` are also exported as part of the downloader script - and will attempt to find the mod or download using Vortex's state information. If a different method of detection is required, you can provide your own `findMod` and `findDownloadId` functions when you define your requirements.
