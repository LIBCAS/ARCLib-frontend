import React from 'react';
import { compose, withState } from 'recompose';
import { withRouter } from 'react-router-dom';
import { Icon } from 'antd';
import { dublinCoreValuesToLabelsTranslator, dublinCoreValuesToOrderValuesTranslator } from '../../enums';

const DublinCoreMetadataGroup = (props) => {

  const { metadataGroupID, metadataGroupProps, isMetadataGroupExpanded, setIsMetadataGroupExpanded, language } = props;

  const sortedMetadataGroupPropEntries = Object.entries(metadataGroupProps)
  .sort((item1, item2) => dublinCoreValuesToOrderValuesTranslator[item2[0]] - dublinCoreValuesToOrderValuesTranslator[item1[0]]);

  return (
    <div className='dublin-core-metadata-group'>

      {/* Title expandable bar */}
      <div
        className='title-bar'
        onClick={() => setIsMetadataGroupExpanded((prevValue) => !prevValue)}
      >
        <div>
          {metadataGroupID}
        </div>
        <div>
          <Icon type={isMetadataGroupExpanded ? 'up' : 'down'} />
        </div>
      </div>

      {/* Table */}
      {isMetadataGroupExpanded && (
        <div>
          <table className='dc-table'>
            <tbody>
              {sortedMetadataGroupPropEntries.map(([dublinCoreValue, stringArr], i) => (
                <React.Fragment key={i}>
                  {stringArr.map((stringValue, index) => (
                    <tr key={index}>
                      <td>{index === 0 ? dublinCoreValuesToLabelsTranslator[language][dublinCoreValue] : ''}</td>
                      <td>{stringValue}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default compose(
  withRouter,
  withState('isMetadataGroupExpanded', 'setIsMetadataGroupExpanded', false),
)(DublinCoreMetadataGroup);