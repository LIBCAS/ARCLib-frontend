import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { compose, withHandlers, withState, lifecycle } from "recompose";
import { isEmpty, get, find, map, compact } from "lodash";
import classNames from "classnames";
import { ControlLabel } from "react-bootstrap";

import Button from "../Button";
import Sort from "../filter/Sort";
import Order from "../filter/Order";
import TextFilter from "../filter/TextFilter";
import NumberFilter from "../filter/NumberFilter";
import DateTimeFilter from "../filter/DateTimeFilter";
import { setFilter } from "../../actions/appActions";
import { getAipList, setAipList } from "../../actions/aipActions";
import { setQuery } from "../../actions/queryActions";
import { orderTypes, filterTypes, filterOperationsTypes } from "../../enums";
import { hasValue, formatTime } from "../../utils";
import * as storage from "../../utils/storage";

const Form = ({
  handleSubmit,
  className,
  didMount,
  filter,
  getAipList,
  setQuery,
  texts,
  fields,
  sortOptions,
  clearForm,
  saveQuery
}) => (
  <form {...{ onSubmit: handleSubmit, className }}>
    <div {...{ className: "form-row sort" }}>
      <ControlLabel>{texts.SORT}</ControlLabel>
      <div
        {...{
          className: "flex-row flex-top margin-bottom-small"
        }}
      >
        <Sort
          {...{
            options: sortOptions,
            className: "sort"
          }}
        />
        <div {...{ className: "flex-row order" }}>
          <Order />
        </div>
      </div>
    </div>
    <div {...{ className: "flex-col padding-top-small divider-top" }}>
      {map(
        fields,
        ({ title, subtitle, filters }, key) =>
          title ? (
            <h3 {...{ key, className: "title" }}>{title}</h3>
          ) : subtitle ? (
            <h4
              {...{
                key,
                className: classNames("subtitle", {
                  "margin-top-none": get(get(fields, `[${key - 1}]`), "title")
                })
              }}
            >
              {subtitle}
            </h4>
          ) : (
            <div {...{ key, className: "flex-row flex-top" }}>
              {map(
                filters,
                ({ index, ...field }, i) =>
                  field.type === filterTypes.TEXT ? (
                    <div
                      {...{
                        key: `${key}-${i}`,
                        className: "form-row margin-bottom-small"
                      }}
                    >
                      <ControlLabel>{field.label}</ControlLabel>
                      <TextFilter
                        {...{
                          index,
                          className: "flex-row flex-top",
                          selectClassName: "field",
                          textClassName: "field",
                          handleUpdate: () => saveQuery()
                        }}
                      />
                    </div>
                  ) : field.type === filterTypes.NUMBER ? (
                    <div
                      {...{
                        key: `${key}-${i}`,
                        className: "form-row margin-bottom-small"
                      }}
                    >
                      <ControlLabel>{field.label}</ControlLabel>
                      <div
                        {...{
                          className: "flex-row flex-top"
                        }}
                      >
                        <NumberFilter
                          {...{
                            index,
                            number: 0,
                            className: "field width-full",
                            placeholder: texts.GTE,
                            handleUpdate: () => saveQuery()
                          }}
                        />
                        <NumberFilter
                          {...{
                            index,
                            number: 1,
                            className: "field width-full",
                            placeholder: texts.LTE,
                            handleUpdate: () => saveQuery()
                          }}
                        />
                      </div>
                    </div>
                  ) : field.type === filterTypes.DATETIME ? (
                    <div
                      {...{
                        key: `${key}-${i}`,
                        className: "form-row margin-bottom-small"
                      }}
                    >
                      <ControlLabel>{field.label}</ControlLabel>
                      <div
                        {...{
                          className: "flex-row flex-top"
                        }}
                      >
                        <DateTimeFilter
                          {...{
                            key: `index-search-datetimefilter-0-${didMount}`,
                            defaultValue: find(
                              get(filter, "filter"),
                              f => f.index === index && f.number === 0
                            )
                              ? formatTime(
                                  find(
                                    get(filter, "filter"),
                                    f => f.index === index && f.number === 0
                                  ).value
                                )
                              : "",
                            index,
                            number: 0,
                            placeholder: texts.FROM,
                            className: "field width-full",
                            handleUpdate: () => saveQuery()
                          }}
                        />
                        <DateTimeFilter
                          {...{
                            key: `index-search-datetimefilter-1-${didMount}`,
                            defaultValue: find(
                              get(filter, "filter"),
                              f => f.index === index && f.number === 1
                            )
                              ? formatTime(
                                  find(
                                    get(filter, "filter"),
                                    f => f.index === index && f.number === 1
                                  ).value
                                )
                              : "",
                            index,
                            number: 1,
                            placeholder: texts.TO,
                            className: "field width-full",
                            alignRight: true,
                            handleUpdate: () => saveQuery()
                          }}
                        />
                      </div>
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
        className: "flex-row flex-space-between padding-top-small divider-top"
      }}
    >
      <Button
        {...{
          onClick: () => {
            storage.set("query", JSON.stringify({ query: {}, result: [] }));
            clearForm();
          },
          className: "index-search-form-button"
        }}
      >
        {texts.RESET}
      </Button>
      <div {...{ className: "flex-row-normal index-search-form-buttons" }}>
        <Button
          {...{
            onClick: async () => {
              if (await getAipList(true)) {
                setQuery(null);
              }
              saveQuery();
            },
            className: "index-search-form-button margin-left-small"
          }}
        >
          {texts.SAVE}
        </Button>
        <Button
          {...{
            primary: true,
            type: "submit",
            className: "index-search-form-button margin-left-small"
          }}
        >
          {texts.SEND}
        </Button>
      </div>
    </div>
  </form>
);

export default compose(
  connect(
    ({ app: { filter }, aip: { aips } }) => ({
      filter,
      aips
    }),
    {
      getAipList,
      setQuery,
      setFilter,
      setAipList
    }
  ),
  withState("order", "setOrder", orderTypes.ASC),
  withState("didMount", "onDidMount", false),
  withHandlers({
    saveQuery: ({ filter, aips }) => () =>
      storage.set(
        "query",
        JSON.stringify({ query: filter, result: { items: aips } })
      ),
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
                    value: ""
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.NUMBER ||
                field.type === filterTypes.DATETIME
                ? {
                    index,
                    number: 0,
                    field: field.field,
                    operation: filterOperationsTypes.GTE,
                    value: ""
                  }
                : null;
            })
          ),
          ...compact(
            map(filters, (field, index) => {
              return field.type === filterTypes.NUMBER ||
                field.type === filterTypes.DATETIME
                ? {
                    index,
                    number: 1,
                    field: field.field,
                    operation: filterOperationsTypes.LTE,
                    value: ""
                  }
                : null;
            })
          )
        ]
      });
    }
  }),
  withHandlers({
    onSubmit: ({ getAipList, setQuery, saveQuery }) => async () => {
      if (await getAipList()) {
        setQuery(null);
      }
      saveQuery();
    }
  }),
  reduxForm({
    form: "index-search-form",
    enableReinitialize: true
  }),
  lifecycle({
    componentWillMount() {
      const { clearForm, saveQuery } = this.props;

      window.addEventListener("beforeunload", saveQuery);

      clearForm();
    },
    async componentDidMount() {
      const {
        query,
        getAipList,
        setQuery,
        setFilter,
        onDidMount,
        filters,
        sortOptions,
        setAipList,
        saveQuery
      } = this.props;

      const savedQuery = !isEmpty(query)
        ? query
        : JSON.parse(storage.get("query")) || null;

      if (!isEmpty(get(savedQuery, "query"))) {
        setAipList(get(savedQuery, "query.result.items"));

        setFilter({
          sort: hasValue(get(savedQuery, "query.sort"))
            ? get(savedQuery, "query.sort")
            : sortOptions[0].value,
          order: hasValue(get(savedQuery, "query.order"))
            ? get(savedQuery, "query.order")
            : orderTypes.ASC,
          filter: [
            ...compact(
              map(filters, (field, index) => {
                return field.type === filterTypes.TEXT
                  ? {
                      index,
                      field: field.field,
                      operation: get(
                        find(
                          get(savedQuery, "query.filter"),
                          f => f.field === field.field
                        ),
                        "operation",
                        filterOperationsTypes.CONTAINS
                      ),
                      value: get(
                        find(
                          get(savedQuery, "query.filter"),
                          f => f.field === field.field
                        ),
                        "value",
                        ""
                      )
                    }
                  : null;
              })
            ),
            ...compact(
              map(filters, (field, index) => {
                return field.type === filterTypes.NUMBER ||
                  field.type === filterTypes.DATETIME
                  ? {
                      index,
                      number: 0,
                      field: field.field,
                      operation: filterOperationsTypes.GTE,
                      value: get(
                        find(
                          get(savedQuery, "query.filter"),
                          f =>
                            f.field === field.field &&
                            f.operation === filterOperationsTypes.GTE
                        ),
                        "value",
                        ""
                      )
                    }
                  : null;
              })
            ),
            ...compact(
              map(filters, (field, index) => {
                return field.type === filterTypes.NUMBER ||
                  field.type === filterTypes.DATETIME
                  ? {
                      index,
                      number: 1,
                      field: field.field,
                      operation: filterOperationsTypes.LTE,
                      value: get(
                        find(
                          get(savedQuery, "query.filter"),
                          f =>
                            f.field === field.field &&
                            f.operation === filterOperationsTypes.LTE
                        ),
                        "value",
                        ""
                      )
                    }
                  : null;
              })
            )
          ]
        });

        if (await getAipList()) {
          setQuery(null);
        }

        saveQuery();

        onDidMount(true);
      }
    },
    componentWillUnmount() {
      const { setFilter, saveQuery } = this.props;

      window.removeEventListener("beforeunload", saveQuery);

      saveQuery();

      setFilter({ sort: "", order: orderTypes.ASC, filter: [] });
    }
  })
)(Form);
