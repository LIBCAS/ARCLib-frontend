import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import PageWrapper from '../../components/PageWrapper';
import Detail from '../../components/validationProfiles/Detail';
import {
  clearValidationProfile,
  getValidationProfile,
} from '../../actions/validationProfileActions';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';

const ValidationProfile = ({ history, validationProfile, texts, ...props }) => {
  const producersEnabled = hasPermission(Permission.SUPER_ADMIN_PRIVILEGE);
  const editEnabled = hasPermission(Permission.VALIDATION_PROFILE_RECORDS_WRITE);

  return (
    <PageWrapper
      {...{
        breadcrumb: [
          { label: texts.VALIDATION_PROFILES, url: '/validation-profiles' },
          { label: get(validationProfile, 'name', '') },
        ],
      }}
    >
      {validationProfile && (
        <Detail
          {...{
            history,
            validationProfile,
            texts,
            initialValues: {
              ...validationProfile,
              ...(producersEnabled && editEnabled
                ? { producer: get(validationProfile, 'producer.id', '') }
                : {}),
            },
            producersEnabled,
            editEnabled,
            ...props,
          }}
        />
      )}
    </PageWrapper>
  );
};

export default compose(
  withRouter,
  connect(({ validationProfile: { validationProfile } }) => ({ validationProfile }), {
    clearValidationProfile,
    getValidationProfile,
  }),
  lifecycle({
    componentWillMount() {
      const { match, clearValidationProfile, getValidationProfile } = this.props;

      clearValidationProfile();
      getValidationProfile(match.params.id);
    },
  })
)(ValidationProfile);
