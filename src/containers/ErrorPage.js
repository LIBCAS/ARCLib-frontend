import React from 'react';
import { compose, lifecycle, withState } from 'recompose';
import { get, map } from 'lodash';
import { withRouter } from 'react-router-dom';

import PageWrapper from '../components/PageWrapper';
import Button from '../components/Button';
import * as storage from '../utils/storage';
import { hasValue } from '../utils';

const ErrorPage = ({ responseStatusWithErrorMessage, texts, history }) => (
  <PageWrapper {...{ noRoleStyle: true }}>
    <div {...{ className: 'error-page' }}>
      {get(responseStatusWithErrorMessage, 'status') && (
        <div>
          <h1 {...{ className: 'error-page-title' }}>
            {get(responseStatusWithErrorMessage, 'status')}{' '}
            {get(responseStatusWithErrorMessage, 'statusText')}
          </h1>
          {hasValue(get(responseStatusWithErrorMessage, 'message')) && (
            <div {...{ className: 'error-page-text' }}>
              {map(get(responseStatusWithErrorMessage, 'message', '').split('\n'), (part, i) => (
                <span {...{ key: i }}>
                  {i > 0 && <br />}
                  {part}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
      <div {...{ className: 'flex-row flex-right' }}>
        <Button
          {...{
            onClick: () => history.replace('/'),
            primary: true,
            className: 'margin-top-small margin-left-small',
          }}
        >
          {texts.HOME_PAGE}
        </Button>
      </div>
    </div>
  </PageWrapper>
);

export default compose(
  withRouter,
  withState('responseStatusWithErrorMessage', 'setResponseStatusWithErrorMessage', {}),
  lifecycle({
    componentWillMount() {
      const { setResponseStatusWithErrorMessage } = this.props;

      try {
        const responseStatusWithErrorMessage = JSON.parse(storage.get('error-page-content'));
        setResponseStatusWithErrorMessage(responseStatusWithErrorMessage);
      } catch (err) {
        setResponseStatusWithErrorMessage({});
      } finally {
        storage.set('error-page-content', JSON.stringify({}));
      }
    },
  })
)(ErrorPage);
