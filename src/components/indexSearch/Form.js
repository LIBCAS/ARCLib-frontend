import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { compose, withHandlers, withState, lifecycle } from 'recompose';
import { isEmpty, get, find, map, compact, forEach, set } from 'lodash';
import classNames from 'classnames';
import { ControlLabel } from 'react-bootstrap';
import { Icon } from 'antd';

import Button from '../Button';
import TextField from '../TextField';
import TextFilter from '../filter/TextFilter';
import TextContainsFilter from '../filter/TextContainsFilter';
import TextEQFilter from '../filter/TextEQFilter';
import EnumFilter from '../filter/EnumFilter';
import NumberFilter from '../filter/NumberFilter';
import DateTimeFilter from '../filter/DateTimeFilter';
import TextFieldWithButton from '../TextFieldWithButton';
import SelectUploadButtonFilter from '../filter/SelectUploadButtonFilter';
import DublinCoreFilter from '../filter/DublinCoreFilter';

import { setFilter, setDialog, openInfoOverlayDialog, setPager } from '../../actions/appActions';
import { getAipList, saveAndgetAipList, setAipList, resetCheckedAipIDs, fetchPileAipIDs, savePileAipIDs, fetchPileAips, resetPileCheckedAipIDs, setPileAipsToEmptyObject } from '../../actions/aipActions';
import { setQuery } from '../../actions/queryActions';
import {
  orderTypes,
  filterTypes,
  filterOperationsTypes,
  filterTypeOperations,
  filterOperationsText,
  filterBoolOptions,
  Permission,
} from '../../enums';
import { hasValue, formatDateTime, formatDate, hasPermission } from '../../utils';
import * as storage from '../../utils/storage';
import { isEqual } from 'lodash';

// NOTE
// - props.filter - from store.app.filter ({ sort, order, filter })
// - props.filters - directly from IndexSearch parent component, fields with filters (without title, subtitle)

const Form = ({
  className,
  // Props directly passed from the IndexSearch component
  fields,
  texts,
  language,
  numberOfDublinCoreFields,
  setNumberOfDublinCoreFields,
  // Props from redux-connect (store + dispatchers)
  aipIDsChecked,
  pileAipIDs,
  filter,
  saveAndgetAipList,
  setQuery,
  setDialog,
  setPager,
  openInfoOverlayDialog,
  resetCheckedAipIDs,
  fetchPileAipIDs,
  savePileAipIDs,
  fetchPileAips,
  resetPileCheckedAipIDs,
  setPileAipsToEmptyObject,
  // Props from HOC (withState)
  queryName,
  setQueryName,
  collapsed,
  didMount,
  // Props from HOC (withHandlers)
  clearForm,
  saveQuery,
  handleSubmit,
  updateCollapsed,
  collapseAll,
}) => {

  const handlePostponeButtonOnClick = async () => {

    if (pileAipIDs === null) {
      console.error('Failed to fetch current data in Pile!');
      return;
    }

    if (aipIDsChecked.length === 0) {
      return;
    }

    // Add currently checked aips to the pile (if it is not already in)
    let newPileAipIDs = [...pileAipIDs];
    for (const oneCheckedAipID of aipIDsChecked) {
      if (!pileAipIDs.includes(oneCheckedAipID)) {
        newPileAipIDs.push(oneCheckedAipID);
      }
    }

    // POST request returns true if was successful, false otherwise
    const savePileAipIDsResult = await savePileAipIDs(newPileAipIDs);

    if (!savePileAipIDsResult) {
      openInfoOverlayDialog({
        title: <div className='invalid'>{texts.OPERATION_FAILED}</div>,
        content: <div>{texts.FAILED_TO_ADD_RECORD_TO_PILE}</div>
      });
      return;
    }

    const fetchPileAipIDsResult = await fetchPileAipIDs();
    if (!fetchPileAipIDsResult) {
      console.error('Failed to update pileAipIDs locally after successful POST!');
    }

    resetCheckedAipIDs();

    openInfoOverlayDialog({
      title: <div className='success'>{texts.OPERATION_SUCCESS}</div>,
      content: <div>{texts.SUCCESS_TO_ADD_RECORD_TO_PILE}</div>
    });
  }

  const handlePileButtonOnClick = async () => {
    setPager({ page: 0, pageSize: 10 }); // must be first
    resetPileCheckedAipIDs();

    // NOTE: If subscribed pileAipIDs is empty array.. means no pileAips are in Pile
    // In that case, BE will return not empty structure, but 400 error status
    if (pileAipIDs !== null && pileAipIDs.length !== 0) {
      await fetchPileAips();  // result is true or false
    }
    else {
      setPileAipsToEmptyObject();
    }

    setDialog('Pile');
  }

  return (
    <form {...{ onSubmit: handleSubmit, className }}>

      {/* From here, form starts with Producer Name filter input field */}
      <div {...{ className: 'flex-col padding-top-small' }}>
        {map(fields, ({ title, subtitle, filters, id }, key) =>

          // 1. Generate the 'fields' object with title purpose! (header)
          title ? (
            <div key={key}>
              <div
                {...{
                  className: classNames('title-container', {
                    'margin-bottom-none': get(collapsed, id) || id === 'DESCRIPTIVE_METADATA',
                  }),
                  onClick: () => updateCollapsed({ [id]: !get(collapsed, id) }),
                }}
              >
                <h3
                  {...{
                    className: 'title',
                  }}
                >
                  {title}
                </h3>
                <Icon
                  {...{
                    type: !!get(collapsed, id) ? 'down' : 'up',
                    className: 'title-icon',
                  }}
                />
              </div>

              {id === 'DESCRIPTIVE_METADATA' && (
                <div className={classNames('margin-bottom-small', {
                  hidden: !!get(collapsed, id),
                })}>
                  <Button
                    className='margin-right-small'
                    onClick={() => {
                      if (numberOfDublinCoreFields <= 1) {
                        return;
                      }
                      setNumberOfDublinCoreFields(numberOfDublinCoreFields - 1);
                    }}
                  >
                    <Icon type='minus'/>
                  </Button>
                  <Button
                    onClick={() => {
                      if (numberOfDublinCoreFields >= 17) {
                        return;
                      }
                      setNumberOfDublinCoreFields(numberOfDublinCoreFields + 1);
                    }}
                  >
                    <Icon type='plus'/>
                  </Button>
                </div>
              )}
            </div>
          ) :
          // 2. Generate the 'fields' object with subtitle purpose! (header)
          subtitle ? (
            <div {...{ key, className: 'subtitle-container' }}>
              <h4
                {...{
                  key,
                  className: classNames('subtitle', {
                    'margin-top-none': get(get(fields, `[${key - 1}]`), 'title'),
                    hidden: !!get(collapsed, id),
                  }),
                }}
              >
                {subtitle}
              </h4>
            </div>
          ) :
          // 3. If not title or subtitle, generate the 'filters' input fields
          // Each filter input is assigned with index property and then field props
          (
            <div
              {...{
                key,
                className: classNames(
                  {'flex-row': id !== 'DESCRIPTIVE_METADATA'},
                  {'flex-top': id !== 'DESCRIPTIVE_METADATA'},
                  {'flex-col': id === 'DESCRIPTIVE_METADATA'},
                  {hidden: !!get(collapsed, id)}
                )
              }}
            >
              {map(filters, ({ index, ...field }, i) =>

                field.type === filterTypes.SELECT_UPLOAD ? (
                  <div key={`${key}-${i}`} className={'form-row margin-bottom-small'}>
                    <ControlLabel>{field.label}</ControlLabel>
                    <SelectUploadButtonFilter
                      index={index}
                      className={'flex-row flex-top'}
                      selectClassName={'field'}
                      handleUpdate={() => saveQuery()}
                      selectOptions={[
                        {
                          value: 'id',
                          label: 'XML ID'
                        },
                        {
                          value: 'authorial_id',
                          label: texts.AUTHORIAL_ID
                        },
                        {
                          value: 'sip_id',
                          label: 'AIP ID'
                        },
                      ]}
                    />
                  </div>
                ) :

                field.type === filterTypes.DUBLIN_CORE_FILTER ? (
                  <div key={`${key}-${i}`} >
                    <ControlLabel>{field.label}</ControlLabel>
                    <DublinCoreFilter
                      index={index}
                      className={'margin-bottom-small dublin-core-container'}
                      // NOTE: Possibility to set following classes
                      //selectFieldClassName
                      //selectOperationClassName
                      //textFieldClassName
                      handleUpdate={() => saveQuery()}
                    />
                  </div>
                ) :

                field.type === filterTypes.TEXT ? (
                  <div
                    {...{
                      key: `${key}-${i}`,
                      className: 'form-row margin-bottom-small',
                    }}
                  >
                    <ControlLabel>{field.label}</ControlLabel>
                    <TextFilter
                      {...{
                        index,
                        className: 'flex-row flex-top',
                        selectClassName: 'field',
                        textClassName: 'field',
                        handleUpdate: () => saveQuery(),
                      }}
                    />
                  </div>
                ) :

                field.type === filterTypes.TEXT_EQ_NEQ ? (
                  <div
                    {...{
                      key: `${key}-${i}`,
                      className: 'form-row margin-bottom-small',
                    }}
                  >
                    <ControlLabel>{field.label}</ControlLabel>
                    <TextFilter
                      {...{
                        index,
                        className: 'flex-row flex-top',
                        selectClassName: 'field',
                        textClassName: 'field',
                        handleUpdate: () => saveQuery(),
                        options: map(filterTypeOperations[filterTypes.TEXT_EQ_NEQ], (value) => ({
                          value,
                          label: filterOperationsText[language][value],
                        })),
                      }}
                    />
                  </div>
                ) :

                field.type === filterTypes.TEXT_CONTAINS ? (
                  <div
                    {...{
                      key: `${key}-${i}`,
                      className: 'form-row margin-bottom-small',
                    }}
                  >
                    <ControlLabel>{field.label}</ControlLabel>
                    <TextContainsFilter
                      {...{
                        index,
                        className: 'flex-row flex-top',
                        textClassName: 'field-single',
                        handleUpdate: () => saveQuery(),
                      }}
                    />
                  </div>
                ) :

                field.type === filterTypes.TEXT_EQ ? (
                  <div
                    {...{
                      key: `${key}-${i}`,
                      className: 'form-row margin-bottom-small',
                    }}
                  >
                    <ControlLabel>{field.label}</ControlLabel>
                    <TextEQFilter
                      {...{
                        index,
                        className: 'flex-row flex-top',
                        handleUpdate: () => saveQuery(),
                      }}
                    />
                  </div>
                ) :

                field.type === filterTypes.TEXT_CONTAINS_STARTWITH_ENDWITH ? (
                  <div
                    {...{
                      key: `${key}-${i}`,
                      className: 'form-row margin-bottom-small',
                    }}
                  >
                    <ControlLabel>{field.label}</ControlLabel>
                    <TextFilter
                      {...{
                        index,
                        className: 'flex-row flex-top',
                        selectClassName: 'field',
                        textClassName: 'field',
                        handleUpdate: () => saveQuery(),
                        options: map(
                          filterTypeOperations[filterTypes.TEXT_CONTAINS_STARTWITH_ENDWITH],
                          (value) => ({
                            value,
                            label: filterOperationsText[language][value],
                          })
                        ),
                      }}
                    />
                  </div>
                ) :

                field.type === filterTypes.ENUM ? (
                  <div
                    {...{
                      key: `${key}-${i}`,
                      className: 'form-row margin-bottom-small',
                    }}
                  >
                    <ControlLabel>{field.label}</ControlLabel>
                    <EnumFilter
                      {...{
                        index,
                        className: 'flex-row flex-top full-field',
                        handleUpdate: () => saveQuery(),
                        defaultValue: '',
                        ...field, // options are inherited from field
                      }}
                    />
                  </div>
                ) :

                field.type === filterTypes.BOOL ? (
                  <div
                    {...{
                      key: `${key}-${i}`,
                      className: 'form-row margin-bottom-small',
                    }}
                  >
                    <ControlLabel>{field.label}</ControlLabel>
                    <EnumFilter
                      {...{
                        index,
                        className: 'flex-row flex-top full-field',
                        handleUpdate: () => saveQuery(),
                        defaultValue: '',
                        options: filterBoolOptions[language],
                        ...field,
                      }}
                    />
                  </div>
                ) :

                field.type === filterTypes.NUMBER ? (
                  <div
                    {...{
                      key: `${key}-${i}`,
                      className: 'form-row margin-bottom-small',
                    }}
                  >
                    <ControlLabel>{field.label}</ControlLabel>
                    <div
                      {...{
                        className: 'flex-row flex-top',
                      }}
                    >
                      <NumberFilter
                        {...{
                          index,
                          number: 0,
                          className: 'field width-full',
                          placeholder: texts.GTE,
                          handleUpdate: () => saveQuery(),
                        }}
                      />
                      <NumberFilter
                        {...{
                          index,
                          number: 1,
                          className: 'field width-full',
                          placeholder: texts.LTE,
                          handleUpdate: () => saveQuery(),
                        }}
                      />
                    </div>
                  </div>
                ) :

                field.type === filterTypes.DATE || field.type === filterTypes.DATETIME ? (
                  <div
                    {...{
                      key: `${key}-${i}`,
                      className: 'form-row margin-bottom-small',
                    }}
                  >
                    <ControlLabel>{field.label}</ControlLabel>
                    <div
                      {...{
                        className: 'flex-row flex-top',
                      }}
                    >
                      <DateTimeFilter
                        {...{
                          key: `index-search-datetimefilter-0-${didMount}`,
                          value: find(
                            get(filter, 'filter'),
                            (f) => f.index === index && f.number === 0
                          )
                            ? field.type === filterTypes.DATE
                              ? formatDate(
                                  find(
                                    get(filter, 'filter'),
                                    (f) => f.index === index && f.number === 0
                                  ).value
                                )
                              : formatDateTime(
                                  find(
                                    get(filter, 'filter'),
                                    (f) => f.index === index && f.number === 0
                                  ).value
                                )
                            : '',
                          index,
                          number: 0,
                          placeholder: texts.FROM,
                          className: 'field width-full',
                          handleUpdate: () => saveQuery(),
                          timeFormat: field.type === filterTypes.DATE ? false : undefined,
                        }}
                      />
                      <DateTimeFilter
                        {...{
                          key: `index-search-datetimefilter-1-${didMount}`,
                          value: find(
                            get(filter, 'filter'),
                            (f) => f.index === index && f.number === 1
                          )
                            ? field.type === filterTypes.DATE
                              ? formatDate(
                                  find(
                                    get(filter, 'filter'),
                                    (f) => f.index === index && f.number === 1
                                  ).value
                                )
                              : formatDateTime(
                                  find(
                                    get(filter, 'filter'),
                                    (f) => f.index === index && f.number === 1
                                  ).value
                                )
                            : '',
                          index,
                          number: 1,
                          placeholder: texts.TO,
                          className: 'field width-full',
                          alignRight: true,
                          handleUpdate: () => saveQuery(),
                          timeFormat: field.type === filterTypes.DATE ? false : undefined,
                        }}
                      />
                    </div>
                  </div>
                ) :

                field.type === 'TEXT_FIELD' ? (
                  <div
                    {...{
                      key: `${key}-${i}`,
                      className: 'form-row margin-bottom-small',
                    }}
                  >
                    <ControlLabel>{field.label}</ControlLabel>
                    <TextField
                      {...{
                        id: `text-field-${index}`,
                        ...field,
                        onChange: ({ target: { value } }) => {
                          if (field.onChange) field.onChange(value, index);
                          saveQuery();
                        },
                        value: get(
                          find(get(filter, 'filter'), (f) => f.index === index),
                          'value'
                        )
                          ? get(
                              find(get(filter, 'filter'), (f) => f.index === index),
                              'value'
                            )
                          : undefined,
                      }}
                    />
                    <div />
                  </div>
                ) :

                (
                  <div {...{ key: `${key}-${i}` }} />
                )
              )}
            </div>
          )
        )}
      </div>

      {/* Bottom sticked panel, part of the form! */}
      <div
        {...{
          className: 'index-search-form-buttons',
        }}
      >
        <Button
          {...{
            primary: true,
            onClick: () => {
              storage.set('query', JSON.stringify({ query: {}, result: [] }));
              clearForm();
            },
            className: 'index-search-form-button not-primary',
          }}
        >
          {texts.RESET}
        </Button>

        <Button
          {...{
            primary: true,
            onClick: () => {
              collapseAll();
            },
            className: 'index-search-form-button not-primary margin-left-small',
          }}
        >
          {texts.COLLAPSE_ALL}
        </Button>

        {hasPermission(Permission.AIP_QUERY_RECORDS_WRITE) && (
          <div
            {...{
              className: 'index-search-form-button textfield-with-button margin-left-small',
            }}
          >
            <TextFieldWithButton
              {...{
                id: 'index-search-text-field-with-button',
                placeholder: texts.QUERY_NAME,
                label: texts.SAVE,
                onClick: async () => {
                  if (await saveAndgetAipList(queryName)) {
                    setQuery(null);
                  }
                  saveQuery();
                },
                primary: true,
                buttonDisabled: isEmpty(queryName),
                onChange: (value) => setQueryName(value),
              }}
            />
          </div>
        )}

        <Button
          {...{
            primary: true,
            type: 'submit',
            className: 'index-search-form-button margin-left-small',
          }}
        >
          {texts.SEND}
        </Button>

        {hasPermission(Permission.AIP_RECORDS_READ) && (
          <Button
            primary={false}
            className='index-search-form-button not-primary margin-left-small'
            onClick={handlePostponeButtonOnClick}
          >
            {texts.POSTPONE_SELECTED}
          </Button>
        )}

        {hasPermission(Permission.AIP_RECORDS_READ) && (
          <Button
            primary={false}
            className='index-search-form-button not-primary margin-left-small'
            onClick={handlePileButtonOnClick}
          >
            {texts.PILE}
          </Button>
        )}

      </div>
    </form>
  )
}


export default compose(
  connect(
    ({ app: { filter }, aip: { aips, aipIDsChecked, pileAipIDs } }) => ({
      filter,
      aips,
      aipIDsChecked,  // register to checked aip item ids
      pileAipIDs,
    }),
    {
      getAipList,
      setQuery,
      setFilter,
      setAipList,
      saveAndgetAipList,
      setDialog,
      setPager,
      openInfoOverlayDialog,
      resetCheckedAipIDs,
      fetchPileAipIDs,
      savePileAipIDs,
      fetchPileAips,
      resetPileCheckedAipIDs,
      setPileAipsToEmptyObject,
    }
  ),
  withState('order', 'setOrder', orderTypes.DESC),
  withState('didMount', 'onDidMount', false),
  withState('queryName', 'setQueryName', ''),
  withState('collapsed', 'setCollapsed', {}),
  withHandlers({
    updateCollapsed: ({ collapsed, setCollapsed }) => (newCollapsed) =>
      setCollapsed({ ...collapsed, ...newCollapsed }),

    // NOTE: actual redux store.app.filter with store.aip.aips (for AIP table) is saved into Local Storage
    // used in DidMount and DidUpdate to persist data between reloads
    saveQuery: ({ filter, aips }) => () => {
      storage.set('query', JSON.stringify({ query: filter, result: { items: aips } }))
    },

    // NOTE: clearForm is handler responsible for clearing filled inputs and AIP search table to default empty state
    // - used in reset button in bottom sticky panel, when Reset button is pressed
    clearForm: ({ setFilter, filters, setAipList }) => () => {
      setAipList([]);
      setFilter({
        filter: [

          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.SELECT_UPLOAD
                ? {
                    index,
                    internalSUIndex: field.internalSUIndex,
                    field: '',
                    operation: filterOperationsTypes.IN,
                    value: ''
                  }
                : null
            })
          ),

          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.DUBLIN_CORE_FILTER
              ? {
                  index,
                  internalDCIndex: field.internalDCIndex,
                  field: '',
                  operation: filterOperationsTypes.EQ,
                  value: ''
                }
              : null
            })
          ),

          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.TEXT
                ? {
                    index,
                    field: field.field,
                    operation: filterOperationsTypes.CONTAINS,
                    value: '',
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.ENUM
                ? {
                    index,
                    field: field.field,
                    operation: filterOperationsTypes.EQ,
                    value: '',
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.BOOL
                ? {
                    index,
                    field: field.field,
                    operation: filterOperationsTypes.EQ,
                    value: '',
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.TEXT_EQ_NEQ
                ? {
                    index,
                    field: field.field,
                    operation: filterOperationsTypes.EQ,
                    value: '',
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.TEXT_CONTAINS
                ? {
                    index,
                    field: field.field,
                    operation: filterOperationsTypes.CONTAINS,
                    value: '',
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.TEXT_EQ
                ? {
                    index,
                    field: field.field,
                    operation: filterOperationsTypes.EQ,
                    value: '',
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.TEXT_CONTAINS_STARTWITH_ENDWITH
                ? {
                    index,
                    field: field.field,
                    operation: filterOperationsTypes.CONTAINS,
                    value: '',
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.NUMBER ||
                field.type === filterTypes.DATE ||
                field.type === filterTypes.DATETIME
                ? {
                    index,
                    number: 0,
                    field: field.field,
                    operation: filterOperationsTypes.GTE,
                    value: '',
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.NUMBER ||
                field.type === filterTypes.DATE ||
                field.type === filterTypes.DATETIME
                ? {
                    index,
                    number: 1,
                    field: field.field,
                    operation: filterOperationsTypes.LTE,
                    value: '',
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === 'TEXT_FIELD'
                ? {
                    index,
                    field: field.field,
                    operation: field.operation,
                    value: '',
                  }
                : null;
            })
          ),
        ],
      });
    },
  }),
  withHandlers({
    collapseAll: ({ fields, updateCollapsed }) => () => {
      const collapsed = {};

      forEach(fields, ({ title, id }) => {
        if (title && id) {
          set(collapsed, id, true);
        }
      });

      updateCollapsed(collapsed);
    },
    onSubmit: ({ getAipList, setQuery, saveQuery }) => async () => {
      if (await getAipList()) {
        setQuery(null);
      }
      saveQuery();
    },
    // NOTE: called in lifecycle functions DidMount and DidUpdate
    // - iterate through dynamic props.filters, reflect them into redux store.app.filter
    // and then reflected new redux filter save into Local Storage
    setFilterOnMountOnUpdate: ({ setFilter, filters }) => (savedQuery) => {
      const savedQuerySort = get(savedQuery, 'query.sort');
      const savedQueryOrder = get(savedQuery, 'query.order');
      const savedQueryFilters = get(savedQuery, 'query.filter');

      setFilter({
        sort: hasValue(savedQuerySort) ? savedQuerySort : 'updated',
        order: hasValue(savedQueryOrder) ? savedQueryOrder : orderTypes.ASC,
        filter: [

          ...compact(map(filters, (field, index) => {
            return field.type === filterTypes.SELECT_UPLOAD  ?
            {
              index: index,
              internalSUIndex: field.internalSUIndex,
              field: get(
                find(savedQueryFilters, (f) => f.internalSUIndex === field.internalSUIndex),
                'field',
                ''
               ),
               operation: get(
                find(savedQueryFilters, (f) => f.internalSUIndex === field.internalSUIndex),
                'operation',
                filterOperationsTypes.IN
              ),
              value: get(
                find(savedQueryFilters, (f) => f.internalSUIndex === field.internalSUIndex),
                'value',
                ''
              )
            } : null
          })),

          ...compact(map(filters, (field, index) => {
            return field.type === filterTypes.DUBLIN_CORE_FILTER ?
            {
              index: index,
              internalDCIndex: field.internalDCIndex,
              field: get(
                find(savedQueryFilters, (f) => f.internalDCIndex === field.internalDCIndex),
                'field',
                ''
              ),
              operation: get(
                find(savedQueryFilters, (f) => f.internalDCIndex === field.internalDCIndex),
                'operation',
                filterOperationsTypes.EQ
              ),
              value: get(
                find(savedQueryFilters, (f) => f.internalDCIndex === field.internalDCIndex),
                'value',
                ''
              )
            } : null
          })),

          // NOTE: extra check on internalSUIndex is needed
          // - possibility to have two authorial_id fields
          // - if check omitted, the first authorial_id from SELECT_UPLOAD Filter will be used
          // - first would be found in savedQueryFilters from Local Storage and set to redux filter
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.TEXT
                ? {
                    index,
                    field: field.field,
                    operation: get(
                      find(savedQueryFilters, (f) => f.field === field.field && f.internalSUIndex === undefined),
                      'operation',
                      filterOperationsTypes.CONTAINS
                    ),
                    value: get(
                      find(savedQueryFilters, (f) => f.field === field.field),
                      'value',
                      ''
                    ),
                  }
                : null;
            })
          ),

          // NOTE: extra check on internalSUIndex is needed
          // - possibility to have two 'sip_id' or 'id' fields
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.TEXT_EQ_NEQ
                ? {
                    index,
                    field: field.field,
                    operation: get(
                      find(savedQueryFilters, (f) => f.field === field.field && f.internalSUIndex === undefined),
                      'operation',
                      filterOperationsTypes.EQ
                    ),
                    value: get(
                      find(savedQueryFilters, (f) => f.field === field.field),
                      'value',
                      ''
                    ),
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.TEXT_CONTAINS
                ? {
                    index,
                    field: field.field,
                    operation: filterOperationsTypes.CONTAINS,
                    value: get(
                      find(savedQueryFilters, (f) => f.field === field.field),
                      'value',
                      ''
                    ),
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.TEXT_EQ
                ? {
                    index,
                    field: field.field,
                    operation: filterOperationsTypes.EQ,
                    value: get(
                      find(savedQueryFilters, (f) => f.field === field.field),
                      'value',
                      ''
                    ),
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.TEXT_CONTAINS_STARTWITH_ENDWITH
                ? {
                    index,
                    field: field.field,
                    operation: get(
                      find(savedQueryFilters, (f) => f.field === field.field),
                      'operation',
                      filterOperationsTypes.CONTAINS
                    ),
                    value: get(
                      find(savedQueryFilters, (f) => f.field === field.field),
                      'value',
                      ''
                    ),
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.ENUM
                ? {
                    index,
                    field: field.field,
                    operation: filterOperationsTypes.EQ,
                    value:
                      get(
                        find(savedQueryFilters, (f) => f.field === field.field),
                        'operation'
                      ) === filterOperationsTypes.EQ
                        ? get(
                            find(savedQueryFilters, (f) => f.field === field.field),
                            'value',
                            ''
                          )
                        : '',
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.BOOL
                ? {
                    index,
                    field: field.field,
                    operation: filterOperationsTypes.EQ,
                    value: get(
                      find(savedQueryFilters, (f) => f.field === field.field),
                      'value',
                      ''
                    ),
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.NUMBER ||
                field.type === filterTypes.DATE ||
                field.type === filterTypes.DATETIME
                ? {
                    index,
                    number: 0,
                    field: field.field,
                    operation: filterOperationsTypes.GTE,
                    value: get(
                      find(
                        savedQueryFilters,
                        (f) =>
                          f.field === field.field && f.operation === filterOperationsTypes.GTE
                      ),
                      'value',
                      ''
                    ),
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.NUMBER ||
                field.type === filterTypes.DATE ||
                field.type === filterTypes.DATETIME
                ? {
                    index,
                    number: 1,
                    field: field.field,
                    operation: filterOperationsTypes.LTE,
                    value: get(
                      find(
                        savedQueryFilters,
                        (f) =>
                          f.field === field.field && f.operation === filterOperationsTypes.LTE
                      ),
                      'value',
                      ''
                    ),
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === 'TEXT_FIELD'
                ? {
                    index,
                    field: field.field,
                    operation: field.operation,
                    value: get(
                      find(
                        savedQueryFilters,
                        (f) => f.field === field.field && f.operation === field.operation
                      ),
                      'value',
                      ''
                    ),
                  }
                : null;
            })
          ),
        ],
      });
    },
  }),
  reduxForm({
    form: 'index-search-form',
    enableReinitialize: true,
  }),
  lifecycle({
    componentWillMount() {
      const { saveQuery, fields, updateCollapsed } = this.props;

      window.addEventListener('beforeunload', saveQuery);

      const collapsed = {};

      forEach(fields, ({ title, id, defaultCollapsed }) => {
        if (title && id && defaultCollapsed) {
          set(collapsed, id, true);
        }
      });

      updateCollapsed(collapsed);
    },
    async componentDidMount() {
      const {
        query,
        getAipList,
        setQuery,
        onDidMount,
        setAipList,
        saveQuery,
        clearForm,
        fetchPileAipIDs,
        setFilterOnMountOnUpdate,
      } = this.props;

      fetchPileAipIDs();

      const savedQuery = !isEmpty(query) ? query : JSON.parse(storage.get('query')) || null;

      if (!isEmpty(get(savedQuery, 'query'))) {
        const directedFromMenu = storage.get('directedFromMenu') === 'true';

        if (!directedFromMenu) {
          // NOTE: Prefill the AIP Search table with data, if data available
          setAipList(get(savedQuery, 'query.result.items', []));
        } else {
          setAipList([]);
        }

        storage.set('directedFromMenu', false);

        setFilterOnMountOnUpdate(savedQuery);

        if (!directedFromMenu) {
          if (await getAipList()) {
            setQuery(null);
          }
        }

        saveQuery();

        onDidMount(true);
      } else {
        clearForm();
      }
    },
    componentWillUnmount() {
      const { saveQuery } = this.props;

      window.removeEventListener('beforeunload', saveQuery);

      saveQuery();
    },
    async componentDidUpdate(prevProps, _prevState) {
      const { query, saveQuery, setFilterOnMountOnUpdate } = this.props;

      const prevNumberOfDublinCoreFields = prevProps.numberOfDublinCoreFields;
      const actualNumberOfDublinCoreFields = this.props.numberOfDublinCoreFields;

      if (prevNumberOfDublinCoreFields !== actualNumberOfDublinCoreFields) {
        // 1.) Save the new number of DC fields to the local storage
        storage.set('numberOfDublinCoreFields', actualNumberOfDublinCoreFields)

        // 2.) New number of DC fields will change the props.fields and props.filters
        // props received from IndexSearch.js component
        // New props.filters are iterated and reflected to the store.app.filter
        // (for new fields to get their own index in store)
        // Updated store.app.filter is then immediately saved into Local Storage
        const savedQuery = !isEmpty(query) ? query : JSON.parse(storage.get('query')) || null;
        await setFilterOnMountOnUpdate(savedQuery);
        saveQuery();
      }

      // If object filter changed, save the new version immediately to the local storage
      if (!isEqual(prevProps.filter, this.props.filter)) {
        saveQuery();
      }
    }
  })
)(Form);
