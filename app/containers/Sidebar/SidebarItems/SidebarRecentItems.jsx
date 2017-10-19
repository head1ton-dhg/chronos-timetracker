import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import type { StatelessFunctionalComponent, Node } from 'react';
import { Flex, RecentItemsPlaceholder } from 'components';
import { issuesActions } from 'actions';
import {
  getRecentIssuesFetching,
  getRecentItems,
} from 'selectors';

import TimestampItem from './SidebarTimestampItem';
import SidebarItem from './SidebarItem';

import type { IssuesMap, SelectIssue } from '../../../types';

moment.locale('en', {
  calendar: {
    lastDay: '[Yesterday]',
    sameDay: '[Today]',
    lastWeek: 'L',
    sameElse: 'L',
  },
});

type Props = {
  items: IssuesMap,
  fetching: boolean,
  selectIssue: SelectIssue,
}

const SidebarRecentItems: StatelessFunctionalComponent<Props> = ({
  items,
  fetching,
  selectIssue,
}: Props): Node => (fetching ?
  <RecentItemsPlaceholder /> :
  <div className="RecentItems">
    {Object.keys(items).sort((a, b) => moment(b).isSameOrAfter(moment(a))).map((key) => {
      const item = items[key];

      return (
        <Flex key={key} column className="RecentItems__block">
          <TimestampItem
            date={moment(key)}
            worklogs={item}
          />
          <Flex column className="RecentItems__list">
            {item.map((worklog, i) =>
              <SidebarItem
                key={i}
                issue={worklog.issue}
                active={false}
                selectIssue={selectIssue}
                worklog={worklog}
              />,
            )}
          </Flex>
        </Flex>
      );
    })}
  </div>);

function mapStateToProps(state) {
  return {
    items: getRecentItems(state),
    fetching: getRecentIssuesFetching(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(issuesActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SidebarRecentItems);
