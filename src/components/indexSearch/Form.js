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
import Sort from '../filter/Sort';
import Order from '../filter/Order';
import TextFilter from '../filter/TextFilter';
import TextContainsFilter from '../filter/TextContains-Filter';
import TextEQFilter from '../filter/TextEQFilter';
import EnumFilter from '../filter/EnumFilter';
import NumberFilter from '../filter/NumberFilter';
import DateTimeFilter from '../filter/DateTimeFilter';
import TextFieldWithButton from '../TextFieldWithButton';
import { setFilter } from '../../actions/appActions';
import { getAipList, saveAndgetAipList, setAipList } from '../../actions/aipActions';
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

const Form = ({
  handleSubmit,
  className,
  didMount,
  filter,
  saveAndgetAipList,
  setQuery,
  texts,
  fields,
  sortOptions,
  clearForm,
  saveQuery,
  queryName,
  setQueryName,
  collapsed,
  updateCollapsed,
  collapseAll,
  language,
}) => (
  <form {...{ onSubmit: handleSubmit, className }}>
    <div {...{ className: 'form-row sort' }}>
      <ControlLabel>{texts.SORT}</ControlLabel>
      <div
        {...{
          className: 'flex-row flex-top margin-bottom-small',
        }}
      >
        <Sort
          {...{
            options: sortOptions,
            className: 'sort',
          }}
        />
        <div {...{ className: 'flex-row order' }}>
          <Order />
        </div>
      </div>
    </div>
    <div {...{ className: 'flex-col padding-top-small divider-top' }}>
      {map(fields, ({ title, subtitle, filters, id }, key) =>
        title ? (
          <div
            {...{
              key,
              className: classNames('title-container', {
                'margin-bottom-none': get(collapsed, id),
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
        ) : subtitle ? (
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
        ) : (
          <div
            {...{
              key,
              className: classNames('flex-row flex-top', {
                hidden: !!get(collapsed, id),
              }),
            }}
          >
            {map(filters, ({ index, ...field }, i) =>
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
              ) : field.type === filterTypes.TEXT_EQ_NEQ ? (
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
              ) : field.type === filterTypes.TEXT_CONTAINS ? (
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
              ) : field.type === filterTypes.TEXT_EQ ? (
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
              ) : field.type === filterTypes.TEXT_CONTAINS_STARTWITH_ENDWITH ? (
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
              ) : field.type === filterTypes.ENUM ? (
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
                      ...field,
                    }}
                  />
                </div>
              ) : field.type === filterTypes.BOOL ? (
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
              ) : field.type === filterTypes.NUMBER ? (
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
              ) : field.type === filterTypes.DATE || field.type === filterTypes.DATETIME ? (
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
              ) : field.type === 'TEXT_FIELD' ? (
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
              ) : (
                <div {...{ key: `${key}-${i}` }} />
              )
            )}
          </div>
        )
      )}
    </div>
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
    </div>
  </form>
);

export default compose(
  connect(
    ({ app: { filter }, aip: { aips } }) => ({
      filter,
      aips,
    }),
    {
      getAipList,
      setQuery,
      setFilter,
      setAipList,
      saveAndgetAipList,
    }
  ),
  withState('order', 'setOrder', orderTypes.DESC),
  withState('didMount', 'onDidMount', false),
  withState('queryName', 'setQueryName', ''),
  withState('collapsed', 'setCollapsed', {}),
  withHandlers({
    updateCollapsed: ({ collapsed, setCollapsed }) => (newCollapsed) =>
      setCollapsed({ ...collapsed, ...newCollapsed }),
    saveQuery: ({ filter, aips }) => () =>
      storage.set('query', JSON.stringify({ query: filter, result: { items: aips } })),
    clearForm: ({ setFilter, filters, setAipList }) => () => {
      setAipList([]);
      setFilter({
        filter: [
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
        setFilter,
        onDidMount,
        filters,
        setAipList,
        saveQuery,
        clearForm,
      } = this.props;

      const savedQuery = !isEmpty(query) ? query : JSON.parse(storage.get('query')) || null;

      if (!isEmpty(get(savedQuery, 'query'))) {
        const directedFromMenu = storage.get('directedFromMenu') === 'true';

        if (!directedFromMenu) {
          setAipList(get(savedQuery, 'query.result.items', []));
        } else {
          setAipList([]);
        }

        storage.set('directedFromMenu', false);

        const savedQuerySort = get(savedQuery, 'query.sort');
        const savedQueryOrder = get(savedQuery, 'query.order');
        const savedQueryFilters = get(savedQuery, 'query.filter');

        setFilter({
          sort: hasValue(savedQuerySort) ? savedQuerySort : 'updated',
          order: hasValue(savedQueryOrder) ? savedQueryOrder : orderTypes.ASC,
          filter: [
            ...compact(
              map(filters, (field, index) => {
                return field.type === filterTypes.TEXT
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
                return field.type === filterTypes.TEXT_EQ_NEQ
                  ? {
                      index,
                      field: field.field,
                      operation: get(
                        find(savedQueryFilters, (f) => f.field === field.field),
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
      const { setFilter, saveQuery } = this.props;

      window.removeEventListener('beforeunload', saveQuery);

      saveQuery();

      setFilter({ sort: '', order: orderTypes.ASC, filter: [] });
    },
  })
)(Form);
