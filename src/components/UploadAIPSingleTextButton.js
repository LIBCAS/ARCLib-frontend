import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import ButtonComponent from './Button';
import DialogButton from './DialogButton';
import DropFiles from './DropFiles';

import { setFilter, openInfoOverlayDialog } from '../actions/appActions';

/* Inspired by UploadTextButton component! */
/* Button in AIP Search Form */
/* Button which set the content of the uploaded file to 'store.app.filter.filter[props.index].value' */

const UploadAIPSingleTextButton = (props) => {

  if (props.appFilter.filter.length === 0) {
    return null;
  }

  const isListOfIdentifiersEmpty = props.appFilter.filter[props.index].value === '';

  const clearIdentifiersButtonOnClick = () => {
    const clearedFilter = props.appFilter.filter.map((filterObj) => {
      if (filterObj.index === props.index) {
        return { ...filterObj, value: ''};
      }
      return { ...filterObj };
    })

    props.setFilter({ filter: clearedFilter });

    if (props.handleUpdate) {
      props.handleUpdate();
    }
  }

  return (
    <React.Fragment>

      {!isListOfIdentifiersEmpty && (
        <ButtonComponent
          onClick={clearIdentifiersButtonOnClick}
          className='field-width-48'
        >
          {props.texts.CLEAR_LIST_OF_IDENTIFIERS}
        </ButtonComponent>
      )}

      {isListOfIdentifiersEmpty && (
        <DialogButton
          rootDivClassName={'field-width-48'}
          labelButtonClassName={'field-width-100'}
          title={props.title || props.texts.UPLOAD_FILE}
          label={props.label || props.texts.UPLOAD_FILE}
          submitButton={false}
          closeButton={true} // default is true, but explicitly
          closeButtonLabel={props.texts.CLOSE}
          content={({ closeDialog }) => (
            <DropFiles
              label={props.texts.DROP_FILE_OR_CLICK_TO_SELECT_FILE}
              onDrop={async (files) => {
                const file = files[0];  // type of File

                // TODO - limit for size will change in the future
                if (file.size > 1 * 1024 * 1024) { // biggen than 1MB
                  console.error('File size limit exceeded!');
                  props.openInfoOverlayDialog({
                    title: <div className='invalid'>{props.texts.FILE_SIZE_LIMIT_EXCEEDED}</div>,
                    content: <div>{props.texts.FILE_SIZE_LIMIT_EXCEEDED_MESSAGE}</div>
                  });
                  return;
                }

                if (file) {
                  const reader = new FileReader();
                  reader.readAsText(file) // takes blob (File is inherited Blob!)
                  reader.onloadend = () => {
                    const fileContentString = reader.result;

                    const newFilter = props.appFilter.filter.map((filterObj) => {
                      if (filterObj.index === props.index) {
                        return { ...filterObj, value: fileContentString };
                      }
                      return { ...filterObj };
                    })
                    props.setFilter({ filter: newFilter });

                    if (props.handleUpdate) {
                      props.handleUpdate();
                    }
                  }
                }

                closeDialog();
              }}
            />
          )}
        />
      )}
    </React.Fragment>
  );
}


const mapStateToProps = (store) => ({
  texts: store.app.texts,
  language: store.app.language,
  appFilter: store.app.filter,
})

const mapDispatchToProps = (dispatch) => ({
  setFilter: (filter) => dispatch(setFilter(filter)),
  openInfoOverlayDialog: (data) => dispatch(openInfoOverlayDialog(data)),
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(UploadAIPSingleTextButton);