import React from 'react'

import { sharingListStyles } from "./SharingDialog.styles";
import { SHARE_TARGET_PUBLIC, SHARE_TARGET_EXTERNAL, SHARE_TARGET_GROUP, SHARE_TARGET_USER } from "./sharingConstants";
import { SharingListItem } from './SharingListItem';
import i18n from '@dhis2/d2-i18n';

export const SharingList = ({ sharingSettings, onChange }) => (
  <div>
    <style jsx>{sharingListStyles}</style>
    <p>{i18n.t('Users and groups that have access')}</p>
    <table>
      <tbody>
        <SharingListItem name="External" target={SHARE_TARGET_EXTERNAL} access={sharingSettings.external} onChange={access => onChange({ ...sharingSettings, external: access })} />
        <SharingListItem name="Public" target={SHARE_TARGET_PUBLIC} access={sharingSettings.public} onChange={access => onChange({ ...sharingSettings, public: access })} />
        {Object.entries(sharingSettings.groups).map(([group, access]) =>
            <SharingListItem name={group} target={SHARE_TARGET_GROUP} access={access} onChange={newAccess => onChange({ ...sharingSettings, groups: { ...sharingSettings.groups, [group]: newAccess } })} />
        )}
        {Object.entries(sharingSettings.users).map(([user, access]) =>
            access && <SharingListItem
                name={user}
                target={SHARE_TARGET_USER}
                access={access}
                onChange={newAccess => onChange({
                    ...sharingSettings,
                    users: {
                        ...sharingSettings.users,
                        [user]: newAccess
                    }
                })}
                onRemove={() => onChange({
                    ...sharingSettings,
                    users: {
                        ...sharingSettings.users,
                        [user]: undefined
                    }
                })}
            />
        )}
      </tbody>
    </table>
  </div>
);