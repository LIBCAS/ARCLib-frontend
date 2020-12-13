import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';

import PageWrapper from '../../components/PageWrapper';
import Detail from '../../components/notifications/Detail';
import { getNotification } from '../../actions/notificationActions';

const Notification = ({ history, notification, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        {
          label: texts.PLANNED_NOTIFICATIONS_TO_ADMINISTRATORS_ABOUT_FORMAT_POLITICS_REVISIONS,
          url: '/notifications',
        },
        { label: texts.NOTIFICATION },
      ],
    }}
  >
    {notification && (
      <Detail
        {...{
          history,
          texts,
          notification,
          initialValues: notification,
          ...props,
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ notification: { notification } }) => ({
      notification,
    }),
    { getNotification }
  ),
  lifecycle({
    componentWillMount() {
      const { match, getNotification } = this.props;

      getNotification(match.params.id);
    },
  })
)(Notification);
