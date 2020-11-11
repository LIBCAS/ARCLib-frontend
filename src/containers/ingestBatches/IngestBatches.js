import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, withState } from "recompose";
import { withRouter } from "react-router-dom";
import { get, filter as lodashFilter } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import SortOrder from "../../components/filter/SortOrder";
import Table from "../../components/ingestBatches/Table";
import Pagination from "../../components/Pagination";
import SelectField from "../../components/SelectField";
import { getBatches } from "../../actions/batchActions";
import { getUsersByParams } from "../../actions/usersActions";
import { setFilter } from "../../actions/appActions";
import { filterOperationsTypes } from "../../enums";

const enableUrl = `/ingest-batches`;

const IngestBatches = ({
  history,
  batches,
  getBatches,
  texts,
  language,
  users,
  filter,
  setFilter,
  selectKey,
  setSelectKey,
}) => {
  const refresh = () => getBatches();

  return (
    <PageWrapper {...{ breadcrumb: [{ label: texts.INGEST_BATCHES }] }}>
      {users ? (
        <div>
          <div className="flex-row flex-centered">
            <SortOrder
              {...{
                fullWidth: false,
                className: "margin-bottom-small",
                sortOptions: [
                  { label: texts.UPDATED, value: "updated" },
                  { label: texts.CREATED, value: "created" },
                  { label: texts.PRODUCER, value: "producerName" },
                  { label: texts.STATE, value: "state" },
                ],
                handleUpdate: refresh,
              }}
            />
            <SelectField
              {...{
                key: `${selectKey}`,
                placeholder: texts.FILTER_BY_USER,
                className: "margin-bottom-small margin-left-very-small",
                style: { minWidth: 200 },
                options: users,
                onChange: (value) => {
                  if (!value) {
                    setSelectKey(!selectKey);
                  }
                  setFilter({
                    filter: [
                      ...lodashFilter(
                        filter.filter,
                        (f) => f.field !== "userId"
                      ),
                      ...(value
                        ? [
                            {
                              field: "userId",
                              operation: filterOperationsTypes.EQ,
                              value,
                            },
                          ]
                        : []),
                    ],
                  });
                  setTimeout(refresh);
                },
              }}
            />
          </div>
          <Table
            {...{
              history,
              language,
              texts,
              batches: get(batches, "items"),
              handleUpdate: refresh,
            }}
          />
          <Pagination
            {...{
              handleUpdate: refresh,
              count: get(batches, "items.length", 0),
              countAll: get(batches, "count", 0),
            }}
          />
        </div>
      ) : (
        <div />
      )}
    </PageWrapper>
  );
};

export default compose(
  withRouter,
  withState("timeoutId", "setTimeoutId", null),
  withState("fetching", "setFetching", false),
  withState("users", "setUsers", null),
  withState("selectKey", "setSelectKey", false),
  connect(({ app: { filter }, batch: { batches } }) => ({ filter, batches }), {
    getBatches,
    getUsersByParams,
    setFilter,
  }),
  lifecycle({
    async componentDidMount() {
      const {
        getBatches,
        setTimeoutId,
        getUsersByParams,
        setUsers,
        texts,
      } = this.props;

      this.mounted = true;

      setUsers([
        {
          value: "",
          label: `-- ${texts.RESET} --`,
        },
        ...((await getUsersByParams({ page: 0, pageSize: 9999 })) || []).map(
          ({ id, fullName }) => ({
            value: id,
            label: fullName || "Neznámý",
          })
        ),
      ]);

      const ok = await getBatches(true, enableUrl);

      const updateItems = async () => {
        const ok = await getBatches(false, enableUrl);
        if (ok && this.mounted) {
          setTimeoutId(setTimeout(updateItems, 10000));
        }
      };

      if (ok && this.mounted) {
        setTimeoutId(setTimeout(updateItems, 10000));
      }
    },
    componentWillUnmount() {
      const { timeoutId } = this.props;

      this.mounted = false;

      clearTimeout(timeoutId);
    },
  })
)(IngestBatches);
