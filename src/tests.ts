/* eslint-disable */
import { types } from 'vortex-api';

import semver from 'semver';

import { getLatestGithubReleaseAsset, download } from './downloader';
import { IPluginRequirement } from './types';

export async function testRequirementVersion(api: types.IExtensionApi, requirement: IPluginRequirement) {
  const t = api.translate;
  if (!requirement?.resolveVersion) {
    return;
  }
  const currentVersion = await requirement.resolveVersion(api);
  const latest = await getLatestGithubReleaseAsset(api, requirement);
  if (!latest) {
    return;
  }
  const coercedVersion = semver.coerce(latest.release.tag_name);
  if (!semver.gt(coercedVersion!.version, currentVersion)) {
    return;
  }

  const more = (dismiss) => {
    api.showDialog('question', 'Update Requirement', {
      bbcode: t('A new "{{reqName}}" update has been released "v{{latestVersion}}" - your modding environment is currently set to "v{{currentVersion}}".[br][/br][br][/br]'
              + 'Would you like to update? (if your modding environment is functioning correctly, there may be no reason to update.)', { replace: { reqName: requirement.userFacingName, currentVersion, latestVersion: coercedVersion!.version } }),
    }, [
      {
        label: 'Download', default: true, action: () => {
          download(api, [requirement]);
          dismiss();
        }
      },
      { label: 'Close', action: () => dismiss() }
    ])
  }

  const notificationId = `${requirement.archiveFileName}-update`;
  api.sendNotification({
    message: `${requirement.userFacingName} update available`,
    type: 'warning',
    allowSuppress: true,
    id: notificationId,
    actions: [
      { title: 'More', action: more },
      {
        title: 'Download', action: (dismiss) => {
          download(api, [requirement]);
          dismiss();
        }
      }
    ]
  });
}