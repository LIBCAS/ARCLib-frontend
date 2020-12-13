import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import PageWrapper from '../../components/PageWrapper';
import Detail from '../../components/formatDefinition/Detail';
import { getFormatDefinition } from '../../actions/formatActions';
import { formatDateTime } from '../../utils';

const FormatDefinition = ({
  history,
  format,
  formatDefinition,
  getFormatDefinition,
  texts,
  ...props
}) => (
  <PageWrapper
    {...{
      breadcrumb: [
        { label: texts.FORMATS, url: '/formats' },
        {
          label: get(format, 'formatName', texts.FORMAT),
          url: `/formats/${format.formatId}`,
        },
        {
          label: `${texts.FORMAT_DEFINITION}${
            get(formatDefinition, 'formatVersion')
              ? ` - ${get(formatDefinition, 'formatVersion')}`
              : ''
          }`,
        },
      ],
    }}
  >
    {formatDefinition && (
      <Detail
        {...{
          history,
          texts,
          formatDefinition,
          initialValues: {
            ...formatDefinition,
            created: formatDateTime(get(formatDefinition, 'created')),
            updated: formatDateTime(get(formatDefinition, 'updated')),
            releaseDate: formatDateTime(get(formatDefinition, 'releaseDate')),
            withdrawnDate: formatDateTime(get(formatDefinition, 'withdrawnDate')),
            aliases: get(formatDefinition, 'aliases', []).join(', '),
            formatFamilies: get(formatDefinition, 'formatFamilies', []).join(', '),
            formatClassifications: get(formatDefinition, 'formatClassifications', []).join(', '),
          },
          ...props,
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ format: { format, formatDefinition } }) => ({
      format,
      formatDefinition,
    }),
    { getFormatDefinition }
  ),
  lifecycle({
    componentWillMount() {
      const { match, getFormatDefinition } = this.props;

      getFormatDefinition(match.params.id);
    },
  })
)(FormatDefinition);
